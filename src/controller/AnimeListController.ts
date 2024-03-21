import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
@injectable()
export class AnimeListController {
  listAnimeLists (req: Request, res: Response, next: NextFunction) {
    // TODO implement
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
