import { Model, model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';
import { Counter } from './Counter.ts';

interface ExtendedAnimeModel extends Model<IAnime> {
validateFilterKeys: (filter: { [key: string]: string | number }) => void;
}

const animeSeasonSchema = new Schema({
  season: { type: String, required: true, enum: ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'UNDEFINED'] },
  year: { type: Number }
});

animeSeasonSchema.add(BASE_SCHEMA);

const broadcastSchema = new Schema({
  day: { type: String },
  time: { type: String },
  timezone: { type: String },
  string: { type: String }
}, { _id: false });

broadcastSchema.add(BASE_SCHEMA);

const animeSchema = new Schema<IAnime, ExtendedAnimeModel>({
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

const allowedFilterKeys = new Set([
  'animeId', 'title', 'type', 'episodes', 'status', 'animeSeason.season',
  'animeSeason.year', 'synonyms', 'relatedAnime', 'tags', 'broadcast.day',
  'broadcast.time', 'broadcast.timezone', 'broadcast.string'
]);

animeSchema.static('validateFilterKeys', (filter: { [key: string]: string | number }) => {
  const keys = Object.keys(filter);
  keys.forEach(key => {
    if (key.includes('.')) {
      const nestedKeys = key.split('.');
      const rootKey = nestedKeys[0];
      const subKey = nestedKeys[1];
      const constructedKey = `${rootKey}.${subKey}`;

      if (!allowedFilterKeys.has(constructedKey)) {
        throw new Error(`Invalid filter key: ${constructedKey}`);
      }
    } else {
      if (!allowedFilterKeys.has(key)) {
        throw new Error(`Invalid filter key: ${key}`);
      }
    }
  });
});

animeSchema.add(BASE_SCHEMA);
export const AnimeModel = model<IAnime, ExtendedAnimeModel>('Anime', animeSchema);
