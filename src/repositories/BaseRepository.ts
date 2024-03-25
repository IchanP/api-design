import { injectable, unmanaged } from 'inversify';
import { Model } from 'mongoose';

@injectable()
export abstract class BaseRepository<T> {
  defaultPageLimit: number = 20;
  protected model: Model<T>;

  constructor (@unmanaged() model: Model<T>) {
    this.model = model;
  }

  async getTotalPages (limit: number = this.defaultPageLimit): Promise<number> {
    const total = await this.model.countDocuments();
    return Math.ceil(total / limit);
  }

  async getTotalCount (): Promise<number> {
    return this.model.countDocuments();
  }
}
