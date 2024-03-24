import { injectable, inject } from 'inversify';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { TYPES } from 'config/types.ts';

@injectable()
export class AnimeService {
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;

    async getListOfAnime (page: number): Promise<ListOfAnimeResponseSchema> {
      if (page < 1) {
        throw new BadDataError('Bad data was sent in the request.');
      }
      const animeList = await this.animeRepo.getMany(page);
      const totalPages = await this.animeRepo.getTotalPages();
      const totalAnime = await this.animeRepo.getTotalCount();
      return { currentPage: page, totalPages, totalAnime, data: animeList };
    }
}
