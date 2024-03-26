import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';
import validator from 'validator';

const webhookSchema = new Schema<IWebhookStore>({
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

webhookSchema.add(BASE_SCHEMA);

export const WebhookModel = model<IWebhookStore>('Webhook', webhookSchema);
