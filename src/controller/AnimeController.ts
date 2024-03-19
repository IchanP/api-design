import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class AnimeController {
  // TODO inject anime service, essentially do constructor

  displayAnime (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  displayAnimeById (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }
}
