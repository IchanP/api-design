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
}
