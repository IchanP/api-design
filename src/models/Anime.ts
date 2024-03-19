import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './baseSchema.ts';
import { Counter } from './Counter.ts';

const animeSeasonSchema = new Schema({
  season: { type: String, required: true, enum: ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'UNDEFINED'] },
  year: { type: Number }
});

const broadcastSchema = new Schema({
  day: { type: String },
  time: { type: String },
  timezone: { type: String },
  string: { type: String }
}, { _id: false });

const animeSchema = new Schema<IAnime>({
  animeId: { type: Number },
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'UNKNOWN'] },
  episodes: { type: Number, required: true },
  status: { type: String, required: true, enum: ['FINISHED', 'ONGOING', 'NOT_YET_AIRED', 'CANCELLED', 'UPCOMING', 'UNKNOWN'] },
  animeSeason: { type: animeSeasonSchema, required: true },
  synonyms: [{ type: String }],
  relatedAnime: [{ type: String }],
  tags: [{ type: String }],
  broadcast: { type: broadcastSchema }
});

// Pre-save hook to auto-increment animeId
animeSchema.pre('save', async function (next) {
  if (this.isNew) { // Check if the document is new
    const count = await Counter.findByIdAndUpdate(
      { _id: 'animeId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.animeId = count.seq;
  }
  next();
});

animeSchema.add(BASE_SCHEMA);
export const AnimeModel = model<IAnime>('Anime', animeSchema);
