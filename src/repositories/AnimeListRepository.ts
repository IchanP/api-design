import { injectable } from 'inversify';
import { AnimeListModel } from 'models/AnimeList.ts';
import { BaseRepository } from './BaseRepository.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';

@injectable()
export class AnimeListRepository extends BaseRepository<IAnimeList> implements Repository<IAnimeList, IUser> {
  constructor () {
    super(AnimeListModel);
  }

  async createDocument (data: IUser): Promise<IAnimeList> {
    const animeList = new AnimeListModel({
      userId: data.userId,
      username: data.username,
      animeList: []
    });
    await animeList.save();
    return animeList?.toObject();
  }

  async getOneMatching (filter: { [key: string]: string | number }): Promise<IAnimeList> {
    // TODO add sanitazation to filter?
    const list = await AnimeListModel.findOne(filter);
    return list?.toObject();
  }

  async getPaginatedResult (page: number, limit: number = this.defaultPageLimit): Promise<IAnimeList[]> {
    const pagesToSkip = (page - 1) * limit;
    const docsToStrip = await AnimeListModel.find().skip(pagesToSkip).limit(limit);
    return docsToStrip.map((doc) => doc?.toObject());
  }

  async updateOneValue (field: string, value: string, identifier: string | number) {
    if (field === 'list') {
      this.#addNewAnimeToList(identifier as number, JSON.parse(value));
      return;
    }
    await AnimeListModel.findOneAndUpdate({ userId: identifier }, { [field]: value });
  }

  async deleteOneValue (field: string, value: string, filter: { [key: string]: string | number }) {
    const animeToRemove = JSON.parse(value) as MinimizedAnime;
    const animeList = await AnimeListModel.findOne(filter);
    const updatedList = animeList.list.filter((anime) => {
      return anime.animeId !== animeToRemove.animeId;
    });
    animeList.list = updatedList;
    await animeList.save();
  }

  async #addNewAnimeToList (ownerId: number, anime: IAnime): Promise<IAnimeList> {
    try {
      await AnimeListModel.updateOne({ userId: ownerId }, { $push: { list: anime } });
    } catch (e: unknown) {
      // If the user attempts to add a duplicate anime we just silently ignore it.
      if (e instanceof DuplicateError) {
        return;
      }
      throw e;
    }
  }
}
