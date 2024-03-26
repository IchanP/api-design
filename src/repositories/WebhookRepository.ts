import { injectable } from 'inversify';
import { WebhookModel } from 'models/Webhook.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { Error } from 'mongoose';
import { DuplicateError } from '../../Utils/DuplicateError.ts';

@injectable()
export class WebhookRepository {
  async createDocument (userId: number): Promise<void> {
    try {
      const webhookStore = new WebhookModel({ userId, webhooks: [] });
      await webhookStore.save();
    } catch (e: unknown) {
      if (e instanceof Error.ValidationError) {
        throw new BadDataError();
      }
    }
  }

  async getOneMatching (id: number): Promise<IWebhookStore> {
    const webhookList = await WebhookModel.findOne({ userId: id });
    return webhookList?.toObject();
  }

  async updateOneValue (field: string, value: string, identifier: string | number) {
    try {
      const webhookList = await WebhookModel.findOne({ userId: identifier });
      if (field === 'webhooks') {
        webhookList.webhooks.push(JSON.parse(value));
      }
      await webhookList.save();
    } catch (e: unknown) {
      if (e instanceof Error.ValidationError && e.message.includes('is not a valid URL!')) {
        throw new BadDataError();
      } else if (e instanceof Error.ValidationError) {
        throw new DuplicateError();
      }
      throw e;
    }
  }
}
