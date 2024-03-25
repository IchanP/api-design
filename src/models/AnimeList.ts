import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';

const minimizedAnimeSchema = new Schema<MinimizedAnime>({
  animeId: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }
});

minimizedAnimeSchema.add(BASE_SCHEMA);

const animeListSchema = new Schema<IAnimeList>({
  ownerId: { type: Number, required: true, unique: true },
  ownerUsername: { type: String, required: true },
  list: { type: [minimizedAnimeSchema], required: true }
});

animeListSchema.add(BASE_SCHEMA);

export const AnimeListModel = model<IAnimeList>('AnimeList', animeListSchema);
