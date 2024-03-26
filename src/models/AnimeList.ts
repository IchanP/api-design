import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './baseSchema.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';

const minimizedAnimeSchema = new Schema<MinimizedAnime>({
  animeId: { type: Number, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true }
});

minimizedAnimeSchema.add(BASE_SCHEMA);

const animeListSchema = new Schema<IAnimeList>({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  list: { type: [minimizedAnimeSchema], required: true }
});

animeListSchema.add(BASE_SCHEMA);

animeListSchema.pre('updateOne', async function (next) {
  const filter = this.getFilter();
  const docBeingUpdated = await AnimeListModel.findOne(filter);
  const updateQuery = this.getUpdate();
  const animeId = extractAnimeIdFromList(updateQuery);
  if (animeId) {
    verifyUniqueId(docBeingUpdated, animeId);
    next();
  }
  next();
});

function verifyUniqueId (animeList: IAnimeList, animeIdToAdd: number) {
  const animeIds = animeList.list.map(item => item.animeId);

  for (const id of animeIds) {
    if (id === animeIdToAdd) {
      throw new DuplicateError('Anime is already in list.');
    }
  }
}

// Poor practice but mongoose is being obtuse about fetching the animeId.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAnimeIdFromList (updateQuery: { [key: string]: any }): number | undefined {
  try {
    for (const operator of Object.keys(updateQuery)) {
      const fields = updateQuery[operator];
      if (typeof fields === 'object' && 'list' in fields) {
        const listUpdate = fields.list;
        if (typeof listUpdate === 'object' && !Array.isArray(listUpdate)) {
          return listUpdate.animeId;
        }
      }
    }
  } catch (e: unknown) {
    return undefined;
  }
  return undefined;
}

export const AnimeListModel = model<IAnimeList>('AnimeList', animeListSchema);
