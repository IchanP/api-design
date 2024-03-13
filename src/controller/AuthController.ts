import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';

import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
import { DuplicateError } from '../../Utils/DuplicateError.ts';

@injectable()
export class AuthController {
  #service: Service<User>;
  #repository: Repository<User>;

  constructor (
        @inject(TYPES.AuthService) service: Service<User>,
        @inject(TYPES.AuthRepository) repository: Repository<User>
  ) {
    this.#repository = repository;
    this.#service = service;
  }

  async register (req: Request, res: Response, next: NextFunction) {
    try {
      const userInfo = this.#service.create(req.body);
     const userId = await this.#repository.addData(userInfo);
      return res.status(201).json({ id: userId });
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
}
