import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { animeExists } from '../../Utils/ValidatorUtil.ts';
import { attachMinimizedAnimeLinks, generateAddOrRemoveAnimeLink, isInAnimeList, stripAnime } from './serviceUtility.ts';
import { constructNextAndPreviousPageLink } from '../../Utils/linkgeneration.ts';
@injectable()
export class AnimeService {
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;

    async getListOfAnime (page: number, userId?: number): Promise<ListOfAnimeResponseSchema> {
      const animeList = await this.animeRepo.getPaginatedResult(page);
      const totalPages = await this.animeRepo.getTotalPages();
      const totalAnime = await this.animeRepo.getTotalCount();
      const strippedAnime = animeList.map((anime) => stripAnime(anime));
      if (userId) {
        await attachMinimizedAnimeLinks(strippedAnime, userId, this.animeListRepo);
      }
      console.log(userId);
      const nextAndPrevious = constructNextAndPreviousPageLink('anime', page, totalPages);
      const links = [...nextAndPrevious];

      return { currentPage: page, totalPages, totalAnime, data: strippedAnime, links };
    }

    async getListWithQuery (query: { [key: string]: string | number }, page: number, userId?: number): Promise<AnimeQueryResultSchema> {
      const searchResults = await this.animeRepo.getPaginatedResult(page, 20, query);
      const totalPages = await this.animeRepo.getTotalPages();
      const strippedAnime = searchResults.map((anime) => stripAnime(anime));
      if (userId) {
        await attachMinimizedAnimeLinks(strippedAnime, userId, this.animeListRepo);
      }
      const nextAndPrevious = constructNextAndPreviousPageLink('anime', page, totalPages);
      const links = [...nextAndPrevious];
      return { data: strippedAnime, totalPages, currentPage: page, links };
    }

    async getOneById (id: string, userId?: number): Promise<OneAnimeByIdSchema> {
      const anime = await this.animeRepo.getOneMatching({ animeId: Number(id) });
      animeExists(anime);
      const links: Array<LinkStructure> = [];
      if (userId) {
        const inUserList = await isInAnimeList(userId, anime.animeId, this.animeListRepo);
        links.push(...generateAddOrRemoveAnimeLink(userId, anime.animeId, inUserList));
      }
      const response = anime as OneAnimeByIdSchema;
      response.links = links;
      return response;
    }
}
