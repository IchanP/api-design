import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { isValidType, verifyAnimeListExists } from '../../Utils/ValidatorUtil.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';

@injectable()
export class WebhookService implements IWebhookService {
    @inject(TYPES.WebhookRepository) private webhookRepo: Repository<IWebhookStore, number>;

    async addWebhook (subscriptionId: string, webhookData: WebhookData): Promise<void> {
      await verifyAnimeListExists(subscriptionId);
      if (!isValidType(webhookData, ['URL', 'secret', 'ownerId'])) {
        throw new BadDataError();
      }
      await this.webhookRepo.updateOneValue('webhooks', JSON.stringify(webhookData), subscriptionId);
    }

    async removeWebhook (userId: string, ownerId: string, resource: string): Promise<void> {
      await verifyAnimeListExists(ownerId);
      await this.webhookRepo.deleteOneValue('url', resource, { userId: Number(userId), 'webhooks.ownerId': Number(ownerId), 'webhooks.URL': resource });
    }

    async getWebhooks (subcsriptionId: string, userId: string): Promise<WebhookSubscribeSchema> {
      await verifyAnimeListExists(subcsriptionId);
      const webhook = await this.webhookRepo.getMany({ userId: Number(userId), 'webhooks.ownerId': Number(subcsriptionId) });
      if (this.#notValidWebhookData(webhook)) {
        return { subscribed: false, data: [] };
      }
      const URLArray = this.#getUrlArray(webhook[0].webhooks);
      return { subscribed: true, data: URLArray };
    }

    #getUrlArray (hookArray: WebhookData[]): string[] {
      return hookArray.map((element) => element.URL);
    }

    #notValidWebhookData (webhookData: IWebhookStore[]): boolean {
      return !webhookData || webhookData.length === 0 || !webhookData[0].webhooks || webhookData[0].webhooks.length === 0;
    }
}
