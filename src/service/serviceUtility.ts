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

export async function isInAnimeList (userId: number, idToFind: number, animeListRepo: Repository<IAnimeList, IUser>) {
  const found = await animeListRepo.getOneMatching({ userId });
  const foundAnime = found.list.find((listAnime) => listAnime.animeId === idToFind);
  return Boolean(foundAnime);
}

export function generateAddOrRemoveAnimeLink (userId: number, animeId: number, inList: boolean): Array<LinkStructure> {
  return [
    inList === true ? { rel: 'delete-from-list', href: `/anime-list/${userId}/anime/${animeId}`, method: 'DELETE' as ValidMethods } : { rel: 'add-to-list', href: `/anime-list/${userId}/anime/${animeId}`, method: 'POST' as ValidMethods }
  ];
}
