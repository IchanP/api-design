import { isValidType } from '../../Utils/index.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import createError from 'http-errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';

@injectable()
export class UserController {
    @inject(TYPES.Repository) private repository: Repository<User>;

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

    async updateUsername (req: Request, res: Response, next: NextFunction) {
      // TODO implement
    }
}
