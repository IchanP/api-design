import { inject, injectable } from 'inversify';
import { TYPES } from '../config/types.ts';
import { isValidType } from '../../Utils/ValidatorUtil.ts';
import { BadDataError } from '../../Utils/Errors/BadDataError.ts';
import { WebhookRepository } from 'repositories/WebhookRepository.ts';
import { generateUserAnimeListLink } from '../../Utils/linkgeneration.ts';

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
      const profileLink = generateUserAnimeListLink(userData.userId, 'profile');

      const links = [profileLink];
      return { userData, links };
    }

    async updateField (info: RequestBody, field: string) {
      const payload = info.token as TokenPayload;
      if (!isValidType(info, [`${field}`, 'token'])) {
        throw new BadDataError();
      }
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
