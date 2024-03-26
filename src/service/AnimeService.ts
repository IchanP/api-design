import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { animeExists } from './ValidatorUtil.ts';
@injectable()
export class AnimeService {
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;

    async getListOfAnime (page: number): Promise<ListOfAnimeResponseSchema> {
      const animeList = await this.animeRepo.getPaginatedResult(page);
      const totalPages = await this.animeRepo.getTotalPages();
      const totalAnime = await this.animeRepo.getTotalCount();
      return { currentPage: page, totalPages, totalAnime, data: animeList };
    }

    async getListWithQuery (query: { [key: string]: string | number }, page: number): Promise<AnimeQueryResultSchema> {
      const searchResults = await this.animeRepo.getPaginatedResult(page, 20, query);
      const totalPages = await this.animeRepo.getTotalPages();
      return { data: searchResults, totalPages, currentPage: page };
    }

    async getOneById (id: string): Promise<IAnime> {
      const anime = await this.animeRepo.getOneMatching({ animeId: Number(id) });
      animeExists(anime);
      return anime;
    }
}
