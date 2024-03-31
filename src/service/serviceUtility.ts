import { generateAnimeIdLink } from '../../Utils/linkgeneration.ts';

export function stripAnime (anime: IAnime): MinimizedAnime {
  return {
    animeId: anime.animeId,
    title: anime.title,
    type: anime.type,
    links: [generateAnimeIdLink(anime.animeId, 'self')
    ]
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

export async function attachMinimizedAnimeLinks (animeList: Array<MinimizedAnime>, userId: number | undefined, listRepo?: Repository<IAnimeList, IUser>) {
  for (const anime of animeList) {
    anime.links = [generateAnimeIdLink(anime.animeId, 'self')];
    if (userId) {
      const inUserList = await isInAnimeList(userId, anime.animeId, listRepo);
      anime.links.push(...generateAddOrRemoveAnimeLink(userId, anime.animeId, inUserList));
    }
  }
}
