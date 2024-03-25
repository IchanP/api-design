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

  async getOneMatching (filter: { [key: string]: string | number }): Promise<IAnime> {
    AnimeModel.validateFilterKeys(filter);
    return AnimeModel.findOne(filter);
  }

  async getMany (page: number, limit: number = this.defaultPageLimit, filter: { [key: string]: string | number } = null): Promise<IAnime[]> {
    const pagesToSkip = (page - 1) * limit;
    if (filter) {
      AnimeModel.validateFilterKeys(filter);
    }
    const listOfAnime = await AnimeModel.find(filter || {}).skip(pagesToSkip).limit(limit);
    return listOfAnime;
  }
}
