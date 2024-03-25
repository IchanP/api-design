import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { defaultToOne } from '../../Utils/index.ts';
import { TYPES } from 'config/types.ts';
import { AnimeListService } from 'service/AnimeListService.ts';
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

  displayAnimeList (req: Request, res: Response, next: NextFunction) {
    // TODO implement
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
