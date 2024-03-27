import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { animeExists } from '../../Utils/ValidatorUtil.ts';
import { stripAnime } from './serviceUtility.ts';
import { constructNextAndPreviousPageLink, generateAnimeIdLink } from '../../Utils/linkgeneration.ts';
@injectable()
export class AnimeService {
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;

    async getListOfAnime (page: number): Promise<ListOfAnimeResponseSchema> {
      const animeList = await this.animeRepo.getPaginatedResult(page);
      const totalPages = await this.animeRepo.getTotalPages();
      const totalAnime = await this.animeRepo.getTotalCount();
      const strippedAnime = animeList.map((anime) => stripAnime(anime));

      const nextAndPrevious = constructNextAndPreviousPageLink('anime', page, totalPages);
      this.#addLinksToStrippedAnime(strippedAnime);
      const links = [...nextAndPrevious];

      return { currentPage: page, totalPages, totalAnime, data: strippedAnime, links };
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

    #addLinksToStrippedAnime (strippedAnime: MinimizedAnime[]): void {
      strippedAnime.forEach((anime) => anime.links.push(generateAnimeIdLink(anime.animeId, 'self')));
    }
}
