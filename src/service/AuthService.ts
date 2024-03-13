import { inject, injectable } from 'inversify';
import { isValidUser } from '../../types/User.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
import { TYPES } from 'config/types.ts';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fs from 'fs';
@injectable()
export class AuthService implements IAuthService {
  #privateKey: Buffer = fs.readFileSync(process.env.PRIVATE_KEY_PATH);
  #bcrypt: BcryptWrapper;
  constructor (@inject(TYPES.BcryptWrapper) bcrypt: BcryptWrapper) {
    this.#bcrypt = bcrypt;
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
    const accessToken = this.#issueToken(user.email, 'RS256', process.env.JWT_EXPIRATION_TIME, this.#privateKey);
    const refreshToken = this.#issueToken(user.username, 'HS256', process.env.REFRESH_TOKEN_LIFE, process.env.REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };
  }

  #issueToken (payloadField: string, algorithmType: string, expirationTime: string, key: string | Buffer) {
    const payload = {
      [payloadField]: payloadField
    };
    const accessToken = jwt.sign(payload, key, {
      algorithm: algorithmType as jwt.Algorithm,
      expiresIn: expirationTime
    });
    return accessToken;
  }
}
