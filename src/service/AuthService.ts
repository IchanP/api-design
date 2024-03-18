import { inject, injectable } from 'inversify';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
import { TYPES } from 'config/types.ts';
import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

@injectable()
export class AuthService implements IAuthService {
  @inject(TYPES.BcryptWrapper) private bcrypt: BcryptWrapper;
  @inject(TYPES.JWTFactory) private jwtCrafter: JWTFactory;

  async login (user: User, givenPassword: string): Promise<{ accessToken: string; refreshToken: string }> {
    if (!(await this.bcrypt.matchPassword(user, givenPassword))) {
      throw new BadCredentialsError();
    }
    const accessToken = this.jwtCrafter.createAccessToken({ email: user.email, username: user.username });
    const refreshToken = this.jwtCrafter.createRefreshToken({ email: user.email, username: user.username });
    return { accessToken, refreshToken };
  }

  refreshToken (refreshToken: string): string {
    const decoded = this.jwtCrafter.verifyRefresh(refreshToken) as JwtPayload;
    if (!decoded.email) {
      throw new Error();
    }
    const newAccessToken = this.jwtCrafter.createAccessToken({ email: decoded.email });
    return newAccessToken;
  }
}
