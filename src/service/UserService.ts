import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types.ts';
import { isValidType } from '../../Utils/validateutil.ts';
import { BadDataError } from '../../Utils/BadDataError.ts';
import { WebhookRepository } from 'repositories/WebhookRepository.ts';
import { generateAlwaysAccessibleLinks, generateUserAnimeListLink } from '../../Utils/linkgeneration.ts';

@injectable()
export class UserService implements IUserService {
    @inject(TYPES.UserRepository) private userRepo: Repository<User>;
    @inject(TYPES.AnimeListRepository) private animeListRepo: Repository<IAnimeList, IUser>;
    @inject(TYPES.WebhookRepository) private webhookRepo: WebhookRepository;

    async register (userInfo: RequestBody): Promise<UserResponseSchema> {
      const validUserInfo = this.#validateUserInfo(userInfo);
      const userData = await this.userRepo.createDocument(validUserInfo);
      await this.animeListRepo.createDocument(userData);
      await this.webhookRepo.createDocument(userData.userId);

      const alwaysAccessible = generateAlwaysAccessibleLinks();
      const profileLink = generateUserAnimeListLink(userData.userId, 'profile');

      const links = [profileLink, ...alwaysAccessible];
      return { userData, links };
    }

    async updateField (info: RequestBody, field: string) {
      const payload = info.token as TokenPayload;
      if (!isValidType(info, [`${field}`, 'token'])) {
        throw new BadDataError();
      }
      // TODO make sure something is returned in the future ?
      await this.userRepo.updateOneValue(field, info[field].toString(), payload.userId);
      await this.animeListRepo.updateOneValue(field, info[field].toString(), payload.userId);
    }

    #validateUserInfo (userInfo: RequestBody): User {
      if (!isValidType<User>(userInfo as User, ['email', 'password', 'username'])) {
        throw new BadDataError();
      }
      return userInfo as User;
    }
}
