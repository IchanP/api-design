import { injectable } from 'inversify';
import { AnimeModel } from 'models/Anime.ts';
import { BaseRepository } from './BaseRepository.ts';

@injectable()
export class AnimeRepository extends BaseRepository<IAnime> implements Repository<IAnime> {
  constructor () {
    super(AnimeModel);
  }

  // Not implemented due to only admins being able to add anime (not users)
  async createDocument (anime: IAnime): Promise<IAnime> {
    const newAnime = new AnimeModel({
      title: anime.title,
      type: anime.type,
      episodes: anime.episodes,
      status: anime.status,
      animeSeason: anime.animeSeason,
      synonyms: anime.synonyms,
      relatedAnime: anime.relatedAnime,
      tags: anime.tags,
      broadcast: anime.broadcast
    });
    await newAnime.save();
    return newAnime.toObject();
  }

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
