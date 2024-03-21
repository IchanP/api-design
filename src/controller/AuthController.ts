import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import createError from 'http-errors';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
@injectable()
export class AuthController {
        @inject(TYPES.IAuthService) private service: IAuthService;
        @inject(TYPES.Repository) private repository: Repository<User>;

        async login (req: Request, res: Response, next: NextFunction) {
          try {
            const matchingUser = await this.repository.getOneMatching(req.body?.email);
            const { accessToken, refreshToken } = await this.service.login(matchingUser, req.body?.password);
            return res.status(200).json({ accessToken, refreshToken, userId: matchingUser.userId });
          } catch (e: unknown) {
            let err = e;
            if (e instanceof BadCredentialsError) {
              err = createError(401, e.message);
            }
            next(err);
          }
        }

        async refresh (req: Request, res: Response, next: NextFunction) {
          try {
            const newRefresh = this.service.refreshToken(req.body.token);
            return res.status(200).json({ accessToken: newRefresh });
          } catch (e: unknown) {
            let err = e;
            // For some weird reason it says jsonwebtokens doesn't export these types eventhough it does...
            if (e.constructor.name === 'TokenExpiredError' || e.constructor.name === 'JsonWebTokenError') {
              err = createError(401, 'Bad token');
            }
            next(err);
          }
        }
}
