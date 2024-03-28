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
    const anime = await AnimeModel.findOne(filter);
    return anime?.toObject();
  }

  async getPaginatedResult (page: number, limit: number = this.defaultPageLimit, filter: { [key: string]: string | number } = null): Promise<IAnime[]> {
    const pagesToSkip = (page - 1) * limit;
    if (filter) {
      AnimeModel.validateFilterKeys(filter);
    }
    if (filter?.title) {
      return this.#handleTitleSearchQuery(filter.title as string);
    }
    const listOfAnime = await AnimeModel.find(filter || {}).skip(pagesToSkip).limit(limit);
    return listOfAnime.map((anime) => anime?.toObject());
  }

  async #handleTitleSearchQuery (query: string): Promise<IAnime[]> {
    const listOfAnime = await AnimeModel.find({ title: { $regex: query, $options: 'i' } });
    return listOfAnime.map((anime) => anime?.toObject());
  }
}
