import { injectable } from 'inversify';
import { AnimeListModel } from 'models/AnimeList.ts';
import { BaseRepository } from './BaseRepository.ts';

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
    return await AnimeListModel.findOne(filter);
  }

  async getMany (page: number, limit: number = this.defaultPageLimit): Promise<IAnimeList[]> {
    const pagesToSkip = (page - 1) * limit;
    const docsToStrip = await AnimeListModel.find().skip(pagesToSkip).limit(limit);
    return docsToStrip.map((doc) => {
      const newDoc = doc.toObject();
      console.log(newDoc);
      return newDoc;
    });
  }
}
