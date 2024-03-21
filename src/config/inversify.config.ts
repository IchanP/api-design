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

const container = new Container();
// Bind concretes to themselves
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.BcryptWrapper).to(BcryptWrapper);
container.bind(TYPES.AnimeController).to(AnimeController);
container.bind(TYPES.AnimeListController).to(AnimeListController);
container.bind(TYPES.UserController).to(UserController);
// Bind abstractions to concrete implementations
container.bind<JWTFactory>(TYPES.JWTFactory).to(JWTCrafter).inSingletonScope();
container.bind<Repository<User>>(TYPES.Repository).to(UserRepository).inSingletonScope();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();

export { container };
