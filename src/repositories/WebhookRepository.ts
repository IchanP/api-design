import { injectable } from 'inversify';
import { WebhookModel } from 'models/Webhook.ts';

@injectable()
export class WebhookRepository {
  async createDocument (userId: number): Promise<void> {
    const webhookStore = new WebhookModel({ userId, webhooks: [] });
    await webhookStore.save();
  }

  async getOneMatching (id: number): Promise<IWebhookStore> {
    const webhookList = await WebhookModel.findOne({ userId: id });
    return webhookList?.toObject();
  }
}
