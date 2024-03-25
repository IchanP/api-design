// A utility module more specific to the project

import { BadDataError } from '../../Utils/BadDataError.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';

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
