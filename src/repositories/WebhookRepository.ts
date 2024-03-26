import { injectable } from 'inversify';
import { WebhookModel } from 'models/Webhook.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { Error } from 'mongoose';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { BaseRepository } from './BaseRepository.ts';
import { NotFoundError } from '../../Utils/NotFoudnError.ts';

@injectable()
export class WebhookRepository extends BaseRepository<IWebhookStore> implements Repository<IWebhookStore, number> {
  constructor () {
    super(WebhookModel);
  }

  async createDocument (userId: number): Promise<IWebhookStore> {
    try {
      const webhookStore = new WebhookModel({ userId, webhooks: [] });
      await webhookStore.save();
      return webhookStore.toObject();
    } catch (e: unknown) {
      if (e instanceof Error.ValidationError) {
        throw new BadDataError();
      }
    }
  }

  async getOneMatching (filter: { [key: string]: string | number }): Promise<IWebhookStore> {
    const webhookList = await WebhookModel.findOne(filter);
    return webhookList?.toObject();
  }

  async getMany (filter: { [key: string]: string | number }): Promise<IWebhookStore[]> {
    const webhookLists = await WebhookModel.find(filter);
    return webhookLists.map((webhookList) => webhookList.toObject());
  }

  async deleteOneValue (field: string, value: string, filter: { [key: string]: string | number }): Promise<void> {
    const webhook = await WebhookModel.findOne(filter);
    if (!webhook) {
      throw new NotFoundError();
    }
    webhook.webhooks = webhook.webhooks.filter((webhook) => {
      return (webhook.URL !== value || webhook.ownerId !== filter['webhooks.ownerId']);
    });
    await webhook.save();
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
