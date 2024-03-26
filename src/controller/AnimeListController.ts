import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { defaultToOne } from '../../Utils/index.ts';
import { TYPES } from 'config/types.ts';
import { AnimeListService } from 'service/AnimeListService.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import createError from 'http-errors';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
@injectable()
export class AnimeListController {
  @inject(TYPES.AnimeListService) private service: AnimeListService;
  @inject(TYPES.IWebhookService) private webhookService: IWebhookService;
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

  async addAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const animelistId = req.params.id;
      const animeId = req.params.animeId;
      const response = await this.service.addAnime(animelistId, animeId);
      return res.status(201).json(response);
    } catch (e: unknown) {
      this.#handleError(e, next);
    }
  }

  async deleteAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const animelistId = req.params.id;
      const animeId = req.params.animeId;
      await this.service.removeAnime(animelistId, animeId);
      // TODO should return links
      return res.status(204).send();
    } catch (e: unknown) {
      this.#handleError(e, next);
    }
  }

  async subcribeToList (req: Request, res: Response, next: NextFunction) {
    try {
      const toSubscribeTo = req.params.id;
      if (!req.body.url || !req.body.secret) {
        throw new BadDataError();
      }
      const payloadData: WebhookData = { URL: req.body?.url, secret: req.body?.secret, ownerId: req.body?.token?.userId };
      await this.webhookService.addWebhook(toSubscribeTo, payloadData);
      // TODO add response body
      return res.status(201).send();
    } catch (e: unknown) {
      if (e instanceof BadDataError) {
        e.message = 'Invalid \'url\', or \'secret\'. All fields are required and must be valid.';
      } if (e instanceof DuplicateError) {
        e.message = 'URL already exists for this resource.';
      }
      this.#handleError(e, next);
    }
  }

  unSubscribeFromList (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  showSubscription (req: Request, res: Response, next: NextFunction) {
    // TODO implement
  }

  #handleError (e: unknown, next: NextFunction) {
    let err = e;
    if (e instanceof BadDataError || e instanceof DuplicateError) {
      err = createError(400, e.message);
    } else if (e instanceof NotFoundError) {
      err = createError(404, e.message);
    }
    next(err);
  }
}
