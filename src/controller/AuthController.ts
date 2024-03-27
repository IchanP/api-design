import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import createError from 'http-errors';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
@injectable()
export class AuthController {
        @inject(TYPES.IAuthService) private service: IAuthService;

        async login (req: Request, res: Response, next: NextFunction) {
          try {
            const response = await this.service.login(req.body);
            req.body.responseData = response;
            req.body.status = 200;
            req.body.token = { userId: response.userId }; // Simulate login for middleware
            next();
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
            // Looks silly but refer to how we set the payload to the request in Utils/index.ts
            const newRefresh = this.service.refreshToken(req.body.token.token);
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
