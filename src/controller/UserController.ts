import { DuplicateError } from '../../Utils/Errors/DuplicateError.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';
import createError from 'http-errors';
import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';

@injectable()
export class UserController {
    @inject(TYPES.IUserService) private service: IUserService;

    async register (req: Request, res: Response, next: NextFunction) {
      try {
        const userData = await this.service.register(req.body);
        req.body.status = 201;
        req.body.responseData = userData;
        next();
      } catch (e: unknown) {
        this.#handleError(e, next);
      }
    }

    async updateUsername (req: Request, res: Response, next: NextFunction) {
      try {
        await this.service.updateField(req.body, 'username');
        req.body.responseData = { links: [], message: 'Username successfully updated.' };
        req.body.status = 200;
        next();
      } catch (e: unknown) {
        this.#handleError(e, next);
      }
    }

    #handleError (e: unknown, next: NextFunction): void {
      let err = e;
      if (e instanceof BadDataError) {
        err = createError(400, e.message);
      } else if (e instanceof DuplicateError) {
        err = createError(409, e.message);
      }
      next(err);
    }
}
