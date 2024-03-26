import { injectable, inject } from 'inversify';
import { TYPES } from 'config/types.ts';
import { WebhookRepository } from 'repositories/WebhookRepository.ts';
import { isValidType } from '../../Utils/validateutil.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { verifyAnimeListExists } from './ValidatorUtil.ts';

@injectable()
export class WebhookService implements IWebhookService {
    @inject(TYPES.WebhookRepository) private webhookRepo: WebhookRepository;

    async addWebhook (subscriptionId: string, webhookData: WebhookData): Promise<void> {
      await verifyAnimeListExists(subscriptionId);
      if (!isValidType(webhookData, ['URL', 'secret', 'ownerId'])) {
        throw new BadDataError();
      }
      await this.webhookRepo.updateOneValue('webhooks', JSON.stringify(webhookData), subscriptionId);
    }

    removeWebhook: (userId: number, webhookData: WebhookData) => Promise<void>;
    getWebhooks: (userId: number) => Promise<IWebhookStore>;
}
