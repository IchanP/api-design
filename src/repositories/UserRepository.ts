import { injectable } from 'inversify';
import { UserModel } from 'models/User.ts';
import { DuplicateError } from '../../Utils/Errors/DuplicateError.ts';
import { Error } from 'mongoose';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import { BaseRepository } from './BaseRepository.ts';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements Repository<IUser> {
  constructor () {
    super(UserModel);
  }

  async createDocument (userData: User): Promise<IUser> {
    try {
      const user = new UserModel({
        email: userData.email,
        password: userData.password,
        username: userData.username
      });
      await user.save();
      return { userId: user.userId, email: user.email, username: user.username };
    } catch (e: unknown) {
      const error = e as ExtendedError;
      if (error.code === 11000) {
        throw new DuplicateError();
      } else if (error instanceof Error.ValidationError) {
        throw new BadDataError(error.message);
      }
      throw error;
    }
  }

  async updateOneValue (field: string, value: string, id: number): Promise<void> {
    try {
      await UserModel.findOneAndUpdate({ userId: id }, { [field]: value });
    } catch (e: unknown) {
      this.#handleError(e);
    }
  }

  async getOneMatching (filter: { [key: string]: string | number }): Promise<IUser> {
    const user = await UserModel.findOne(filter);
    return user?.toObject();
  }

  #handleError (e: unknown): void {
    const error = e as ExtendedError;
    if (error.code === 11000) {
      throw new DuplicateError();
    } else if (error instanceof Error.ValidationError) {
      throw new BadDataError(error.message);
    }
    throw error;
  }
}
