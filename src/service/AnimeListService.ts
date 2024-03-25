import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';

@injectable()
export class AnimeListService {
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;

    async getAnimeLists (page: number): Promise<AnimeListsResponseSchema> {
      const animeList = await this.animeListRepo.getMany(page);
      console.log(animeList);
      const data = this.#constructAnimeListUrl(animeList);
      const totalPages = await this.animeListRepo.getTotalPages();
      const { next, previous } = this.#constructNextAndPreviousPageUrl(page, totalPages);
      return { data, next, previous, totalPages, currentPage: page };
    }

    async getOneById (id: string): Promise<IAnimeList> {
      const animeList = await this.animeListRepo.getOneMatching({ ownerId: Number(id) });
      if (!animeList) {
        throw new NotFoundError();
      }
      return animeList;
    }

    #constructAnimeListUrl (animeList: Array<IAnimeList>): Array<{link: string, ownerUsername: string}> {
      return animeList.map((list) => {
        return {
          link: `${process.env.BASE_URL}/anime-list/${list.ownerId}`,
          ownerUsername: list.ownerUsername
        };
      });
    }

    #constructNextAndPreviousPageUrl (page: number, totalPages: number): {next: string, previous: string} {
      return {
        next: page !== totalPages ? `${process.env.BASE_URL}/anime-list?page=${page + 1}` : `${process.env.BASE_URL}/anime-list?page=${page}`,
        previous: page !== 1 ? `${process.env.BASE_URL}/anime-list?page=${page - 1}` : `${process.env.BASE_URL}/anime-list?page=${page}`
      };
    }
}