import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';

const animeSeasonSchema = new Schema({
  season: { type: String, required: true, enum: ['SPRING', 'SUMMER', 'FALL', 'WINTER'] },
  year: { type: Number }
});

const broadcastSchema = new Schema({
  day: { type: String },
  time: { type: String },
  timezone: { type: String },
  string: { type: String }
}, { _id: false });

const animeSchema = new Schema<IAnime>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL'] },
  episodes: { type: Number, required: true },
  status: { type: String, required: true, enum: ['FINISHED', 'ONGOING', 'NOT_YET_AIRED', 'CANCELLED'] },
  animeSeason: { type: animeSeasonSchema, required: true },
  synonyms: [{ type: String }],
  relatedAnime: [{ type: String }],
  tags: [{ type: String }],
  broadcast: { type: broadcastSchema }
});

animeSchema.add(BASE_SCHEMA);
export const AnimeModel = model<IAnime>('Anime', animeSchema);
