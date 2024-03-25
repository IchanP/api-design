import { TYPES } from 'config/types.ts';
import { NextFunction, Request } from 'express';
import { Response } from 'express-serve-static-core';
import { inject, injectable } from 'inversify';
import { AnimeService } from 'service/AnimeService.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
@injectable()
export class AnimeController {
  @inject(TYPES.AnimeService) private service: AnimeService;

  async displayAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const page = this.#defaultToPageOne(req.query.page as string);
      const response = await this.service.getListOfAnime(page);
      return res.status(200).json(response);
    } catch (e: unknown) {
      next(e);
    }
  }

  displayAnimeById (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  async searchAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.title as string;

      if (!query) {
        throw new BadDataError('The title query parameter is missing.');
      }

      const page = this.#defaultToPageOne(req.query.page as string);
      const response = await this.service.getListWithQuery({ title: query }, page);
      console.log(response);
      return res.status(200).json(response);
    } catch (e: unknown) {
      let err = e;
      if (e instanceof BadDataError) {
        err = createError(400, e.message);
      }
      next(err);
    }
  }

  #defaultToPageOne (requestedPage: string): number {
    let page;
    Number(requestedPage) > 0 ? page = Number(requestedPage) : page = 1;
    return page;
  }
}
