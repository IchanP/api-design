import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { isValidType, verifyAnimeListExists } from '../../Utils/ValidatorUtil.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import { AnimeListService } from './AnimeListService.ts';

@injectable()
export class WebhookService implements IWebhookService<AnimeListService, OneAnimeListResponseSchema> {
    @inject(TYPES.WebhookRepository) private webhookRepo: Repository<IWebhookStore, number>;

    async addWebhook (subscriptionId: string, webhookData: WebhookData, listService: AnimeListService): Promise<OneAnimeListResponseSchema> {
      await verifyAnimeListExists(subscriptionId);
      if (!isValidType(webhookData, ['URL', 'secret', 'ownerId'])) {
        throw new BadDataError();
      }
      console.log(webhookData);
      await this.webhookRepo.updateOneValue('webhooks', JSON.stringify(webhookData), subscriptionId);
      return listService.getOneById(subscriptionId, webhookData.ownerId.toString());
    }

    async removeWebhook (userId: string, ownerId: string, resource: string): Promise<void> {
      await verifyAnimeListExists(ownerId);
      await this.webhookRepo.deleteOneValue('url', resource, { userId: Number(userId), 'webhooks.ownerId': Number(ownerId), 'webhooks.URL': resource });
    }

    async getWebhooks (subcsriptionId: string, userId: string): Promise<WebhookSubscribeSchema> {
      await verifyAnimeListExists(subcsriptionId);
      const webhook = await this.webhookRepo.getMany({ userId: Number(subcsriptionId), 'webhooks.ownerId': Number(userId) });
      if (this.#notValidWebhookData(webhook)) {
        return { subscribed: false, data: [], links: [] };
      }
      const URLArray = this.#getUrlArray(webhook[0].webhooks, Number(userId));
      return { subscribed: true, data: URLArray, links: [] };
    }

    #getUrlArray (hookArray: WebhookData[], requester: number): string[] {
      return hookArray.filter((webhook) => webhook.ownerId === requester).map((element) => element.URL);
    }

    #notValidWebhookData (webhookData: IWebhookStore[]): boolean {
      return !webhookData || webhookData.length === 0 || !webhookData[0].webhooks || webhookData[0].webhooks.length === 0;
    }
}
