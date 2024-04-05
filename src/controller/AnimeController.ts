import { TYPES } from 'config/types.ts';
import { NextFunction, Request } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { AnimeService } from 'service/AnimeService.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import createError from 'http-errors';
import { NotFoundError } from '../../Utils/Errors/NotFoudnError.ts';
import { defaultToOne } from '../../Utils/index.ts';
@injectable()
export class AnimeController {
  @inject(TYPES.AnimeService) private service: AnimeService;

  async displayAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const page = defaultToOne(req.query.page as string);
      console.log(req.body.token);
      const response = await this.service.getListOfAnime(page, req.body?.token?.userId);
      req.body.responseData = response;
      req.body.status = 200;
      next();
    } catch (e: unknown) {
      next(e);
    }
  }

  async displayAnimeById (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const response = await this.service.getOneById(id, req.body?.token?.userId);
      req.body.responseData = response;
      req.body.status = 200;
      next();
    } catch (e: unknown) {
      this.#handleError(e, next);
    }
  }

  async searchAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.title as string;

      if (!query) {
        throw new BadDataError('The title query parameter is missing.');
      }

      const page = defaultToOne(req.query.page as string);
      const response = await this.service.getListWithQuery({ title: query }, page, req.body?.token?.userId);
      req.body.responseData = response;
      req.body.status = 200;
      next();
    } catch (e: unknown) {
      this.#handleError(e, next);
    }
  }

  async addAnime (req: Request, res: Response, next: NextFunction) {
    try {
      console.log('yop');
      await this.service.addAnime(req.body);
      return res.json({ status: 201 });
    } catch (e: unknown) {
      this.#handleError(e, next);
    }
  }

  #handleError (e: unknown, next: NextFunction): void {
    let err = e;
    if (e instanceof BadDataError) {
      err = createError(400, e.message);
    }
    if (e instanceof NotFoundError) {
      err = createError(404, e.message);
    }
    next(err);
  }
}
