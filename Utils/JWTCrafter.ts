import jwt, { JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import 'dotenv/config';
import { injectable } from 'inversify';

@injectable()
export class JWTCrafter implements JWTFactory {
  #issueToken (options: { payload: object, algorithm: string, expiresIn: string, secretOrPrivateKey: string | Buffer }) {
    const accessToken = jwt.sign(options.payload, options.secretOrPrivateKey, {
      algorithm: options.algorithm as jwt.Algorithm,
      expiresIn: options.expiresIn
    });
    return accessToken;
  }

  verifyRefresh (token: string): JwtPayload | string {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  }

  createAccessToken (payload: object): string {
    return this.#issueToken({
      payload,
      algorithm: 'RS256',
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secretOrPrivateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH)
    });
  }

  createRefreshToken (payload: object): string {
    return this.#issueToken({
      payload,
      algorithm: 'HS256',
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
      secretOrPrivateKey: process.env.REFRESH_TOKEN_SECRET
    });
  }
}
