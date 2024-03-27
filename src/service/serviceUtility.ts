import { generateAddToListLink, generateAnimeIdLink } from '../../Utils/linkgeneration.ts';

export function stripAnime (anime: IAnime, userId?: number): MinimizedAnime {
  return {
    animeId: anime.animeId,
    title: anime.title,
    type: anime.type,
    links: [generateAnimeIdLink(anime.animeId, 'self'),
      userId ? generateAddToListLink(anime.animeId, userId) : null
    ].filter(Boolean)
  };
}

export function attachUserSpecificDataToAnime (anime: IAnime, userId: number, inList?: boolean = false) {
  console.log('yeppers');
}
