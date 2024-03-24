import { injectable } from 'inversify';
import { AnimeModel } from 'models/Anime.ts';
import { BaseRepository } from './BaseRepository.ts';

@injectable()
export class AnimeRepository extends BaseRepository<IAnime> implements Repository<IAnime> {
  constructor () {
    super(AnimeModel);
  }

  // TODO - implement createDocument
  // Currently not implemented due to only admins being able to add anime (not users)
  createDocument: (data: IAnime) => Promise<IAnime>;

  // TODO - implement getOneMatching
  getOneMatching: (matcher: string) => Promise<IAnime>;

  async getMany (page: number, limit: number = this.defaultPageLimit): Promise<IAnime[]> {
    try {
      const pagesToSkip = (page - 1) * limit;
      const listOfAnime = await AnimeModel.find().skip(pagesToSkip).limit(limit);
      return listOfAnime;
    } catch (e: unknown) {
      // TODO - handle error
    }
  }
}
