import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { defaultToOne } from '../../Utils/index.ts';
import { TYPES } from 'config/types.ts';
import { AnimeListService } from 'service/AnimeListService.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import createError from 'http-errors';
import { NotFoundError } from '../../Utils/Errors/NotFoudnError.ts';
import { DuplicateError } from '../../Utils/Errors/DuplicateError.ts';
@injectable()
export class AnimeListController {
  @inject(TYPES.AnimeListService) private animeListService: AnimeListService;
  @inject(TYPES.IWebhookService) private webhookService: IWebhookService<AnimeListService, OneAnimeListResponseSchema>;

  async displayAnimeLists (req: Request, res: Response, next: NextFunction) {
    try {
      const page = defaultToOne(req.query.page as string);
      const response = await this.animeListService.getAnimeLists(page, req.body?.token?.userId);
      req.body.responseData = response;
      req.body.status = 200;
      next();
    } catch (e: unknown) {
      next(e);
    }
  }

  async displayAnimeList (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const response = await this.animeListService.getOneById(id, req.body?.token?.userId);
      req.body.responseData = response;
      req.body.status = 200;
      next();
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
      const response = await this.animeListService.addAnime(animelistId, animeId);
      req.body.responseData = response;
      req.body.status = 201;
      next();
    } catch (e: unknown) {
      if (e instanceof DuplicateError) {
        e.message = 'The anime is already in the list.';
      }
      this.#handleError(e, next);
    }
  }

  async deleteAnime (req: Request, res: Response, next: NextFunction) {
    try {
      const animelistId = req.params.id;
      const animeId = req.params.animeId;
      await this.animeListService.removeAnime(animelistId, animeId);
      req.body.responseData = { message: 'Anime successfully deleted from the list.', links: [] };
      req.body.status = 200;
      next();
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
      const response = await this.webhookService.addWebhook(toSubscribeTo, payloadData, this.animeListService);
      req.body.responseData = response;
      req.body.status = 201;
      next();
    } catch (e: unknown) {
      if (e instanceof BadDataError) {
        console.log(e);
        e.message = 'Invalid \'url\', or \'secret\'. All fields are required and must be valid.';
      } if (e instanceof DuplicateError) {
        e.message = 'URL already exists for this resource.';
      }
      this.#handleError(e, next);
    }
  }

  async unSubscribeFromList (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.url) {
        throw new BadDataError('URL is required to unsubscribe.');
      }
      const subscriptionId = req.params.id;
      const userId = req.body.token.userId;
      const url = req.body.url;
      await this.webhookService.removeWebhook(subscriptionId, userId, url);
      req.body.responseData = { message: 'Successfully unsubscribed from the anime list.', links: [] };
      req.body.status = 200;
      next();
    } catch (e: unknown) {
      if (e instanceof NotFoundError) {
        e.message = 'The requested resource could not be found.';
      }
      this.#handleError(e, next);
    }
  }

  async showSubscription (req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const webhooks = await this.webhookService.getWebhooks(id, req.body.token.userId);
      req.body.responseData = webhooks;
      req.body.status = 200;
      next();
    } catch (e:unknown) {
      this.#handleError(e, next);
    }
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
