import { NextFunction, Request } from 'express';
import { Response } from 'express-serve-static-core';
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

  searchAnime (req, res, next) {
    // TODO implement
    return res.status(200).json({ message: 'yo' });
  }
}
