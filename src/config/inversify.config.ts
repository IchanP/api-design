import 'reflect-metadata';
import { AuthController } from 'controller/AuthController.ts';
import { Container } from 'inversify';
import { AuthService } from 'service/AuthService.ts';
import { TYPES } from './types.ts';
import { UserRepository } from 'repositories/UserRepository.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { JWTCrafter } from '../../Utils/JWTCrafter.ts';
import { AnimeController } from 'controller/AnimeController.ts';
import { AnimeListController } from 'controller/AnimeListController.ts';
import { UserController } from 'controller/UserController.ts';
import { UserService } from 'service/UserService.ts';
import { AnimeListRepository } from 'repositories/AnimeListRepository.ts';
import { AnimeService } from 'service/AnimeService.ts';
import { AnimeRepository } from 'repositories/AnimeRepository.ts';
import { AnimeListService } from 'service/AnimeListService.ts';
import { WebhookRepository } from 'repositories/WebhookRepository.ts';
import { WebhookService } from 'service/WebhookService.ts';

const container = new Container();
// Bind concretes to themselves
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.BcryptWrapper).to(BcryptWrapper);
container.bind(TYPES.AnimeController).to(AnimeController);
container.bind(TYPES.AnimeListController).to(AnimeListController);
container.bind(TYPES.UserController).to(UserController);
container.bind(TYPES.AnimeService).to(AnimeService);
container.bind(TYPES.AnimeListService).to(AnimeListService).inSingletonScope();
// Bind abstractions to concrete implementations
container.bind<JWTFactory>(TYPES.JWTFactory).to(JWTCrafter).inSingletonScope();
container.bind<Repository<User>>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<Repository<IAnimeList, IUser>>(TYPES.AnimeListRepository).to(AnimeListRepository).inSingletonScope();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();
container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
container.bind<Repository<IAnime>>(TYPES.AnimeRepository).to(AnimeRepository).inSingletonScope();
container.bind<IWebhookService<AnimeListService, OneAnimeListResponseSchema>>(TYPES.IWebhookService).to(WebhookService).inSingletonScope();
container.bind<Repository<IWebhookStore, number>>(TYPES.WebhookRepository).to(WebhookRepository).inSingletonScope();
export { container };
