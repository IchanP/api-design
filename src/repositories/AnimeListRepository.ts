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
    return animeList;
  }

  getOneMatching: (filter: { [key: string]: string | number }) => Promise<IAnimeList>;
  getMany (page: number, limit: number = this.defaultPageLimit): Promise<IAnimeList[]> {
    const pagesToSkip = (page - 1) * limit;
    return AnimeListModel.find().skip(pagesToSkip).limit(limit);
  }
}
