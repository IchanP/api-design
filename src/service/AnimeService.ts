import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { animeExists } from '../../Utils/ValidatorUtil.ts';
import { attachUserSpecificDataToAnime, stripAnime } from './serviceUtility.ts';
import { constructNextAndPreviousPageLink } from '../../Utils/linkgeneration.ts';
import { response } from 'express';
@injectable()
export class AnimeService {
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;

    async getListOfAnime (page: number, userId?: number): Promise<ListOfAnimeResponseSchema> {
      const animeList = await this.animeRepo.getPaginatedResult(page);
      const totalPages = await this.animeRepo.getTotalPages();
      const totalAnime = await this.animeRepo.getTotalCount();
      const strippedAnime = animeList.map((anime) => stripAnime(anime, userId));

      const nextAndPrevious = constructNextAndPreviousPageLink('anime', page, totalPages);
      const links = [...nextAndPrevious];

      return { currentPage: page, totalPages, totalAnime, data: strippedAnime, links };
    }

    async getListWithQuery (query: { [key: string]: string | number }, page: number, userId?: number): Promise<AnimeQueryResultSchema> {
      console.log(query);
      const searchResults = await this.animeRepo.getPaginatedResult(page, 20, query);
      const totalPages = await this.animeRepo.getTotalPages();
      const strippedAnime = searchResults.map((anime) => stripAnime(anime, userId));
      const nextAndPrevious = constructNextAndPreviousPageLink('anime', page, totalPages);
      const links = [...nextAndPrevious];
      return { data: strippedAnime, totalPages, currentPage: page, links };
    }

    async getOneById (id: string, userId?: number): Promise<OneAnimeByIdSchema> {
      const anime = await this.animeRepo.getOneMatching({ animeId: Number(id) });
      animeExists(anime);
      const links: Array<LinkStructure> = [];
      if (userId) {
        const inUserList = await this.#isInAnimeList(userId, anime.animeId);
        links.push(...this.#attachUserSpecificLinks(userId, anime.animeId, inUserList));
      }
      const response = anime as OneAnimeByIdSchema;
      response.links = links;
      return response;
    }

    async #isInAnimeList (userId: number, idToFind: number) {
      const found = await this.animeListRepo.getOneMatching({ userId });
      const foundAnime = found.list.find((listAnime) => listAnime.animeId === idToFind);
      return Boolean(foundAnime);
    }

    #attachUserSpecificLinks (userId: number, animeId: number, inList: boolean): Array<LinkStructure> {
      return [
        { rel: 'add-to-list', href: `/users/${userId}/anime-list/${animeId}`, method: 'POST' as ValidMethods },
        inList === true ? { rel: 'delete-from-list', href: `/users/${userId}/anime-list/${animeId}`, method: 'DELETE' as ValidMethods } : null
      ].filter(Boolean);
    }
}
