import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';
import { animeExists, animeListExists } from './ValidatorUtil.ts';

@injectable()
export class AnimeListService {
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;

    async getAnimeLists (page: number): Promise<AnimeListsResponseSchema> {
      const animeList = await this.animeListRepo.getMany(page);
      const data = this.#constructAnimeListUrl(animeList);
      const totalPages = await this.animeListRepo.getTotalPages();
      const { next, previous } = this.#constructNextAndPreviousPageUrl(page, totalPages);
      return { data, next, previous, totalPages, currentPage: page };
    }

    async getOneById (id: string): Promise<IAnimeList> {
      const animeList = await this.animeListRepo.getOneMatching({ userId: Number(id) });
      if (!animeList) {
        throw new NotFoundError();
      }
      return animeList;
    }

    async addAnime (animeListId: string, animeId: string): Promise<IAnimeList> {
      const fieldToAddTo = 'list';

      await this.#verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);

      const minimzedAnime = this.#stripAnime(animeToAdd);
      await this.animeListRepo.updateOneValue(fieldToAddTo, JSON.stringify(minimzedAnime), animeListId);
      return this.getOneById(animeListId);
    }

    async removeAnime (animeListId: string, animeId: string) {
      await this.#verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);
      const minimzedAnime = this.#stripAnime(animeToAdd);
      await this.animeListRepo.deleteOneValue('list', JSON.stringify(minimzedAnime), animeListId);
    }

    async #verifyAnimeListExists (animeListId: string): Promise<void> {
      const animeList = await this.getOneById(animeListId);
      animeListExists(animeList);
    }

    async #verifyAnimeExists (animeId: string): Promise<IAnime> {
      const anime = await this.animeRepo.getOneMatching({ animeId: Number(animeId) });
      animeExists(anime);
      return anime;
    }

    #stripAnime (anime: IAnime): MinimizedAnime {
      return {
        animeId: anime.animeId,
        title: anime.title,
        type: anime.type
      };
    }

    #constructAnimeListUrl (animeList: Array<IAnimeList>): Array<{link: string, username: string}> {
      return animeList.map((list) => {
        return {
          link: `${process.env.BASE_URL}/anime-list/${list.userId}`,
          username: list.username
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
