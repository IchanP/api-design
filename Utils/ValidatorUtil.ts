// A utility module more specific to the project

import { NextFunction } from 'express-serve-static-core';
import { BadCredentialsError } from './Errors/BadCredentialsError.ts';
import { BadDataError } from './Errors/BadDataError.ts';
import { NotFoundError } from './Errors/NotFoudnError.ts';
import createError from 'http-errors';
import { Response } from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { AnimeListService } from '../src/service/AnimeListService.ts';

export function validateId (id: string, res: Response, next: NextFunction): void {
  if (isNaN(Number(id))) {
    const error = new BadDataError('The id parameter must be a number.');
    const err = createError(400, error.message);
    next(err);
  }
  next();
}

export async function verifyAnimeListExists (animeListId: string): Promise<void> {
  const service = container.get<AnimeListService>(TYPES.AnimeListService);
  const animeList = await service.getOneById(animeListId);
  animeListExists(animeList.animeList);
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
  if (token.userId !== Number(id)) {
    const error = new BadCredentialsError('You are not authorized to modify this resource.');
    const err = createError(401, error.message);
    next(err);
  }
  next();
}
export function isValidType<Type> (typeToValidate: Type, expectedKeys: string[]): typeToValidate is Type {
  const actualKeys = Object.keys(typeToValidate);

  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }

  // Check for the same keys (ignoring type)
  return expectedKeys.length === actualKeys.length &&
             expectedKeys.every(key => actualKeys.includes(key));
}
