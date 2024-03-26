import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';
import { animeExists, verifyAnimeListExists } from '../../Utils/ValidatorUtil.ts';
import { WebhookRepository } from 'repositories/WebhookRepository.ts';
import { createHash } from '../../Utils/index.ts';
import fetch from 'node-fetch';
import { constructNextAndPreviousPageLink, findAndTransformToSelf, generateAlwaysAccessibleLinks, generateUserAnimeListLink } from '../../Utils/linkgeneration.ts';

@injectable()
export class AnimeListService {
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;
    @inject(TYPES.WebhookRepository) private webhookRepo: WebhookRepository;

    async getAnimeLists (page: number): Promise<AnimeListsResponseSchema> {
      const animeList = await this.animeListRepo.getPaginatedResult(page);
      const totalPages = await this.animeListRepo.getTotalPages();

      const data = this.#constructAnimeListUrl(animeList);
      const nextAndPrevious = constructNextAndPreviousPageLink('anime-list', page, totalPages);
      const alwaysAccessible = generateAlwaysAccessibleLinks();
      findAndTransformToSelf(alwaysAccessible, 'animelists');
      const links = [...alwaysAccessible, ...nextAndPrevious];
      return { data, links, totalPages, currentPage: page };
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

      await verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);

      const minimzedAnime = this.#stripAnime(animeToAdd);
      await this.animeListRepo.updateOneValue(fieldToAddTo, JSON.stringify(minimzedAnime), animeListId);
      const updatedList = await this.getOneById(animeListId);
      await this.#postAnimeWebhooks(minimzedAnime, updatedList.username, updatedList.userId);
      return updatedList;
    }

    async removeAnime (animeListId: string, animeId: string) {
      await verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);
      const minimzedAnime = this.#stripAnime(animeToAdd);
      await this.animeListRepo.deleteOneValue('list', JSON.stringify(minimzedAnime), { userId: Number(animeListId) });
    }

    async #postAnimeWebhooks (anime: MinimizedAnime, username: string, userId: number) {
      const webhooks = await this.webhookRepo.getOneMatching({ userId });

      webhooks.webhooks.forEach((webhook) => {
        const message = `New anime added to ${username}'s list: ${anime.title} - ${anime.type}`;
        const payload: WebhookMessage = { message, data: anime };
        const hash = createHash(webhook.secret, JSON.stringify(payload));

        // Don't bother doing it async, we don't care about the response.
        fetch(webhook.URL, {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'X-AniApiiList-Signature': hash
          }
        }).catch(); // Just continue executing if it fails.
      });
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

    #constructAnimeListUrl (animeList: Array<IAnimeList>): Array<{username: string, links: Array<LinkStructure>}> {
      return animeList.map((list) => {
        return {
          username: list.username,
          links: [generateUserAnimeListLink(list.userId, 'owner')] // Made into an array for consistency
        };
      });
    }
}
