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
      const page = Number(req.query.page) || 1; // TODO Default to 1
      const response = await this.service.getListOfAnime(page);
      return res.status(200).json(response);
    } catch (e: unknown) {
      let err = e;
      if (e instanceof BadDataError) {
        err = createError(400, e.message);
      }
      next(err);
    }
  }

  displayAnimeById (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  searchAnime (req, res, next) {
    // TODO implement
    return res.status(200).json({ message: 'yo' });
  }
}
