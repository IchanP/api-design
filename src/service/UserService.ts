import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types.ts';
import { isValidType } from '../../Utils/index.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';

@injectable()
export class UserService implements IUserService {
    @inject(TYPES.UserRepository) private userRepo: Repository<User>;
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;

    async register (userInfo: RequestBody): Promise<User> {
      const validUserInfo = this.#validateUserInfo(userInfo);
      const userData = await this.userRepo.createDocument(validUserInfo);
      await this.animeListRepo.createDocument(userData);
      return userData;
    }

    #validateUserInfo (userInfo: RequestBody): User {
      if (!isValidType<User>(userInfo as User, ['email', 'password', 'username'])) {
        throw new BadDataError();
      }
      return userInfo as User;
    }
}
