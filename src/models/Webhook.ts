import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './baseSchema.ts';
import validator from 'validator';

const webhookSubSchema = new Schema <WebhookData>({
  URL: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return validator.isURL(v, { require_protocol: true });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  secret: { type: String, required: true },
  ownerId: { type: Number, required: true }
});

webhookSubSchema.add(BASE_SCHEMA);

const webhookSchema = new Schema<IWebhookStore>({
  userId: { type: Number, required: true },
  webhooks: {
    type: [webhookSubSchema],
    required: true,
    validate: {
      validator: function (webhooks: WebhookData[]) {
        const urls = webhooks.map(webhook => webhook.URL);
        const uniqueUrls = new Set(urls);
        return urls.length === uniqueUrls.size; // This ensures all URLs are unique
      }
    }
  }
});

webhookSchema.add(BASE_SCHEMA);

export const WebhookModel = model<IWebhookStore>('Webhook', webhookSchema);
