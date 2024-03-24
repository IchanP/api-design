import { injectable } from 'inversify';
import { AnimeListModel } from 'models/AnimeList.ts';

@injectable()
export class AnimeListRepository implements Repository<IAnimeList, IUser> {
  async createDocument (data: IUser): Promise<IAnimeList> {
    const animeList = new AnimeListModel({
      ownerId: data.userId,
      ownerUsername: data.username,
      animeList: []
    });
    await animeList.save();
    return animeList;
  }

  getOneMatching: (id: string) => Promise<IAnimeList>;
}