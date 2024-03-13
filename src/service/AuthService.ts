import { inject, injectable } from 'inversify';
import { isValidUser } from '../../types/User.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
import { TYPES } from 'config/types.ts';
import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';
import { JWTCrafter } from '../../Utils/JWTCrafter.ts';

@injectable()
export class AuthService implements IAuthService {
  #bcrypt: BcryptWrapper;
  #jwtCrafter: JWTCrafter;
  constructor (@inject(TYPES.BcryptWrapper) bcrypt: BcryptWrapper,
  @inject(TYPES.JWTCrafter) jwtCrafter: JWTCrafter) {
    this.#bcrypt = bcrypt;
    this.#jwtCrafter = jwtCrafter;
  }

  castToUser (userData: User) {
    if (!isValidUser(userData)) {
      throw new BadDataError();
    }
    return userData as User;
  }

  async login (user: User, givenPassword: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!(await this.#bcrypt.matchPassword(user, givenPassword))) {
      throw new BadCredentialsError();
    }
    const accessToken = this.#jwtCrafter.createAccessToken({ email: user.email });
    const refreshToken = this.#jwtCrafter.createRefreshToken({ email: user.email });
    return { accessToken, refreshToken };
  }

  refreshToken (refreshToken: string): string {
    const decoded = this.#jwtCrafter.verifyRefresh(refreshToken) as JwtPayload;
    if (!decoded.email) {
      throw new Error();
    }
    const newAccessToken = this.#jwtCrafter.createAccessToken({ email: decoded.email });
    return newAccessToken;
  }
}
