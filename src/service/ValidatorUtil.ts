// A utility module more specific to the project

import { NextFunction } from 'express-serve-static-core';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';
import createError from 'http-errors';

export function validateId (id: string): void {
  if (isNaN(Number(id))) {
    throw new BadDataError('The id parameter must be a number.');
  }
}

export function animeExists (anime: IAnime | undefined): void {
  if (!anime) {
    throw new NotFoundError('Anime could not be found with that ID.');
  }
}

export function animeListExists (animeList: IAnimeList | undefined): void {
  if (!animeList) {
    throw new NotFoundError('Anime list could not be found with that ID.');
  }
}

export function tokenIdMatchesPathId (token: TokenPayload, id: string, next: NextFunction): void {
  if (token.userId.toString() !== id) {
    const error = new BadCredentialsError('You are not authorized to modify this resource.');
    const err = createError(401, error.message);
    next(err);
  }
  next();
}
