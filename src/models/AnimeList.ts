import { model, Schema } from 'mongoose';
import { BASE_SCHEMA } from './BaseSchema.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';

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

animeListSchema.pre('updateOne', async function (next) {
  const filter = this.getFilter();
  const docBeingUpdated = await AnimeListModel.findOne(filter);
  const updateQuery = this.getUpdate();

  if (isUpdatingList(updateQuery as { [key: string]: unknown })) { // Typescript doesn't know that it's indexed using strings so we're casting and throwing inside the function if we're wrong.
    verifyUniqueId(docBeingUpdated);
    next();
  }
  // TODO for ownerUsername update!
  next();
});

function verifyUniqueId (animeList: IAnimeList) {
  const animeIds = animeList.list.map(item => item.animeId);
  const uniqueAnimeIds = new Set(animeIds);

  if (animeIds.length !== uniqueAnimeIds.size) {
    throw new DuplicateError('Anime is already in list.');
  }
}

function isUpdatingList (updateQuery: { [key: string]: unknown }): boolean {
  try {
    return Object.keys(updateQuery).some(operator => {
      const fields = updateQuery[operator];
      return typeof fields === 'object' && 'list' in fields;
    });
  } catch (e: unknown) {
    return false;
  }
}

export const AnimeListModel = model<IAnimeList>('AnimeList', animeListSchema);
