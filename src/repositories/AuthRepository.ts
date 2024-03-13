import { injectable } from 'inversify';
import { UserModel } from 'models/User.ts';
import { DuplicateError } from '../../Utils/DuplicateError.ts';
import { Error } from 'mongoose';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { BadCredentialsError } from '../../Utils/BadCredentialsError.ts';

@injectable()
export class AuthRepository implements Repository<User> {
  async addData (userData: User): Promise<string> {
    try {
      const user = new UserModel({
        email: userData.email,
        password: userData.password,
        username: userData.username
      });
      await user.save();
      return user.id;
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

  async getOneMatching (email: string): Promise<User> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new BadCredentialsError();
      }
      return user;
    } catch (e: unknown) {
      console.error(e);
      throw e;
    }
  }
}
