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
      ownerId: data.userId,
      ownerUsername: data.username,
      animeList: []
    });
    await animeList.save();
    return animeList.toObject();
  }

  async getOneMatching (filter: { [key: string]: string | number }): Promise<IAnimeList> {
    // TODO add sanitazation to filter?
    const list = await AnimeListModel.findOne(filter);
    return list.toObject();
  }

  async getMany (page: number, limit: number = this.defaultPageLimit): Promise<IAnimeList[]> {
    const pagesToSkip = (page - 1) * limit;
    const docsToStrip = await AnimeListModel.find().skip(pagesToSkip).limit(limit);
    return docsToStrip.map((doc) => doc.toObject());
  }

  async updateOneValue (field: string, value: string, identifier: string | number) {
    if (field === 'list') {
      this.#addNewAnimeToList(identifier as number, JSON.parse(value));
    }
  //  const updatedValue = await AnimeListModel.findOneAndUpdate({ ownerId: identifier }, { [field]: x });
  //  console.log(updatedValue);
  }

  async #addNewAnimeToList (ownerId: number, anime: IAnime): Promise<IAnimeList> {
    try {
      const updatedDoc = await AnimeListModel.updateOne({ ownerId }, { $push: { list: anime } });
    } catch (e: unknown) {
      // If the user attempts to add a duplicate anime to their list, we'll just return the list as it is.
      if (e instanceof DuplicateError) {
        const foundDoc = await AnimeListModel.findOne({ ownerId });
        return foundDoc.toObject();
      }
      throw e;
    }
  }
}
