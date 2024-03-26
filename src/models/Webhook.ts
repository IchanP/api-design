import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';
import validator from 'validator';

const webhookSubSchema = new Schema <WebhookData>({
  URL: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        validator.isURL(v, { require_protocol: true });
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  secret: { type: String, required: true }
});

webhookSubSchema.add(BASE_SCHEMA);

const webhookSchema = new Schema<IWebhookStore>({
  userId: { type: Number, required: true },
  webhooks: { type: [webhookSubSchema], required: true }
});

webhookSchema.add(BASE_SCHEMA);

export const WebhookModel = model<IWebhookStore>('Webhook', webhookSchema);
