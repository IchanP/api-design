import { JwtPayload } from 'jsonwebtoken';
declare global {
  interface JWTFactory {
    verifyRefresh: (refreshToken: string) => JwtPayload | string;
    createRefreshToken: (payload: object) => string;
    createAccessToken: (payload: object) => string;
}
}
