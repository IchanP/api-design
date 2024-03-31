import { inject, injectable } from 'inversify';
import { TYPES } from 'config/types.ts';
import { NotFoundError } from '../../Utils/Errors/NotFoudnError.ts';
import { animeExists, verifyAnimeListExists } from '../../Utils/ValidatorUtil.ts';
import { createHash, createUUID } from '../../Utils/index.ts';
import fetch from 'node-fetch';
import { constructNextAndPreviousPageLink, generateSubscribeToWebhookLink, generateUnsubscribeToWebhookLink, generateUserAnimeListLink } from '../../Utils/linkgeneration.ts';
import { attachMinimizedAnimeLinks, generateAddOrRemoveAnimeLink, isInAnimeList, stripAnime } from './serviceUtility.ts';
import { DuplicateError } from '../../Utils/Errors/DuplicateError.ts';

@injectable()
export class AnimeListService {
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;
    @inject(TYPES.AnimeRepository) private animeRepo: Repository<IAnime>;
    @inject(TYPES.WebhookRepository) private webhookRepo: Repository<IWebhookStore, number>;

    async getAnimeLists (page: number, userId?: string): Promise<AnimeListsResponseSchema> {
      const animeList = await this.animeListRepo.getPaginatedResult(page);
      const totalPages = await this.animeListRepo.getTotalPages();

      const subscriptionsIds = await this.#getSubscriptionIds(userId);

      const data = this.#constructAnimeListUrl(animeList, subscriptionsIds, Number(userId));
      const nextAndPrevious = constructNextAndPreviousPageLink('anime-list', page, totalPages);
      const links = [...nextAndPrevious];
      return { data, links, totalPages, currentPage: page };
    }

    async getOneById (id: string, userId?: string): Promise<OneAnimeListResponseSchema> {
      const animeList = await this.animeListRepo.getOneMatching({ userId: Number(id) });
      if (!animeList) {
        throw new NotFoundError();
      }
      const subscriptionsIds = await this.#getSubscriptionIds(userId);

      const userNameAndLink = this.#constructAnimeListUrl([animeList], subscriptionsIds, Number(userId))[0];
      await attachMinimizedAnimeLinks(animeList.list, Number(userId), this.animeListRepo);
      delete animeList.userId;
      const animeListWithLinks: IAnimeListWithLinks = { ...animeList, ...userNameAndLink };
      return { animeList: animeListWithLinks, links: [] };
    }

    async addAnime (animeListId: string, animeId: string): Promise<OneAnimeListResponseSchema> {
      const fieldToAddTo = 'list';

      await verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);

      const minimzedAnime = stripAnime(animeToAdd);
      const inList = await isInAnimeList(Number(animeListId), animeToAdd.animeId, this.animeListRepo);
      if (inList) {
        throw new DuplicateError();
      }
      await this.animeListRepo.updateOneValue(fieldToAddTo, JSON.stringify(minimzedAnime), animeListId);
      const updatedList = await this.getOneById(animeListId);
      // UpdatedList has its userId stripped for the response already.
      const subscriptionsIds = await this.#getSubscriptionIds(animeListId);
      const userNameAndLink = this.#constructAnimeListUrl([updatedList.animeList], subscriptionsIds, Number(animeListId))[0];
      updatedList.animeList.links = userNameAndLink.links;
      await this.#postAnimeWebhooks(minimzedAnime, animeListId, updatedList.animeList, 'anime-added');
      updatedList.animeList.list.forEach(anime => anime.links.push(...generateAddOrRemoveAnimeLink(Number(animeListId), anime.animeId, true)));
      return updatedList;
    }

    async removeAnime (animeListId: string, animeId: string) {
      await verifyAnimeListExists(animeListId);
      const animeToAdd = await this.#verifyAnimeExists(animeId);
      const minimzedAnime = stripAnime(animeToAdd);
      await this.animeListRepo.deleteOneValue('list', JSON.stringify(minimzedAnime), { userId: Number(animeListId) });
    }

    async #postAnimeWebhooks (anime: MinimizedAnime, userId: string, userData: IAnimeList, event: string) {
      const webhooks = await this.webhookRepo.getOneMatching({ userId });
      webhooks?.webhooks.forEach((webhook) => {
        const payload = this.#createWebhookPayload(userId, userData, anime, event);
        const hash = createHash(webhook.secret, JSON.stringify(payload));
        // Don't bother doing it async, we don't care about the response.
        fetch(webhook.URL, {
          method: 'post',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
            'X-AniApiiList-Signature': hash
          }
        }).catch(() => {}); // Just continue executing if it fails.
      });
    }

    async #verifyAnimeExists (animeId: string): Promise<IAnime> {
      const anime = await this.animeRepo.getOneMatching({ animeId: Number(animeId) });
      animeExists(anime);
      return anime;
    }

    #constructAnimeListUrl (animeList: Array<IAnimeList>, subscriptionsIds: number[], userId: number | undefined): Array<{username: string, links: Array<LinkStructure>}> {
      return animeList.map((list) => {
        let subscriptionLink;
        if (userId && !isNaN(userId)) {
          subscriptionsIds.includes(list.userId) ? subscriptionLink = generateUnsubscribeToWebhookLink(list.userId) : subscriptionLink = generateSubscribeToWebhookLink(list.userId); // Self subscription is intentional
        }

        return {
          username: list.username,
          links: [
            list.userId === userId ? generateUserAnimeListLink(list.userId, 'profile') : generateUserAnimeListLink(list.userId, 'owner'),
            subscriptionLink
          ].filter(Boolean)
        };
      });
    }

    async #getSubscriptionIds (userId: string | undefined): Promise<Array<number>> {
      if (userId) {
        const subscriptions = await this.webhookRepo.getMany({ 'webhooks.ownerId': Number(userId) });
        return subscriptions.map((sub) => sub.userId);
      }
      return [];
    }

    #createWebhookPayload (userId: string, userData: IAnimeList, anime: MinimizedAnime, event: string): WebhookMessage {
      const message = `New anime added to ${userData.username}'s list: ${anime.title} - ${anime.type}`;
      const animeListLink = generateUserAnimeListLink(Number(userId)).href;
      const eventId = createUUID();
      return { message, userProfile: animeListLink, data: anime, eventType: event, eventId };
    }
}
