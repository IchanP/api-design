import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
import { isValidType } from '../../Utils/index.ts';
@injectable()
export class AuthController {
        @inject(TYPES.IAuthService) private service: IAuthService;
        @inject(TYPES.Repository) private repository: Repository<User>;

        async login (req: Request, res: Response, next: NextFunction) {
          try {
            const matchingUser = await this.repository.getOneMatching(req.body?.email);
            const { accessToken, refreshToken } = await this.service.login(matchingUser, req.body?.password);
            return res.status(200).json({ accessToken, refreshToken });
          } catch (e: unknown) {
            let err = e;
            if (e instanceof BadCredentialsError) {
              err = createError(401, e.message);
            }
            next(err);
          }
        }

        async register (req: Request, res: Response, next: NextFunction) {
          try {
            if (!isValidType<User>(req.body, ['email', 'password', 'username'])) {
              throw new BadDataError();
            }
            const userInfo = req.body as User;
            const userData = await this.repository.addData(userInfo);
            return res.status(201).json({ userData });
          } catch (e: unknown) {
            let err = e;
            if (e instanceof BadDataError) {
              err = createError(400, e.message);
            } else if (e instanceof DuplicateError) {
              err = createError(409, e.message);
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
