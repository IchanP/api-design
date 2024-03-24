import { injectable } from 'inversify';
import { UserModel } from 'models/User.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { Error } from 'mongoose';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';
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
      console.log(id);
      await UserModel.findOneAndUpdate({ userId: id }, { [field]: value });
    } catch (e: unknown) {
      this.#handleError(e);
    }
  }

  async getOneMatching (email: string): Promise<IUser> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadCredentialsError();
    }
    return user;
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
