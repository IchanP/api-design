import { Request, NextFunction } from 'express';
import { Response } from 'express-serve-static-core';

import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { match } from 'assert';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';

@injectable()
export class AuthController {
  #service: IAuthService;
  #repository: Repository<User>;

  constructor (
        @inject(TYPES.AuthService) service: IAuthService,
        @inject(TYPES.AuthRepository) repository: Repository<User>
  ) {
    this.#repository = repository;
    this.#service = service;
  }

  async login (req: Request, res: Response, next: NextFunction) {
    try {
      const matchingUser = await this.#repository.getOneMatching(req.body?.email);
      const { accessToken, refreshToken } = await this.#service.login(matchingUser, req.body?.password);
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
      const userInfo = this.#service.castToUser(req.body);
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
