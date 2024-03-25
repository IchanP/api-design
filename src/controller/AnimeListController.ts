import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { defaultToOne } from '../../Utils/index.ts';
import { TYPES } from 'config/types.ts';
import { AnimeListService } from 'service/AnimeListService.ts';
import { validateId } from '../../Utils/validateutil.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';
@injectable()
export class AnimeListController {
  @inject(TYPES.AnimeListService) private service: AnimeListService;

  async displayAnimeLists (req: Request, res: Response, next: NextFunction) {
    try {
      const page = defaultToOne(req.query.page as string);
      const repsonse = await this.service.getAnimeLists(page);
      return res.status(200).json(repsonse);
    } catch (e: unknown) {
      next(e);
    }
  }

  async displayAnimeList (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      validateId(id);
      const response = await this.service.getOneById(id);
      return res.status(200).json(response);
    } catch (e: unknown) {
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

  addAnime (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  deleteAnime (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  subcribeToList (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  unSubscribeFromList (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  showSubscription (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }
}
