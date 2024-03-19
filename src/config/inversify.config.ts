import 'reflect-metadata';
import { AuthController } from 'controller/AuthController.ts';
import { Container } from 'inversify';
import { AuthService } from 'service/AuthService.ts';
import { TYPES } from './types.ts';
import { AuthRepository } from 'repositories/AuthRepository.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { JWTCrafter } from '../../Utils/JWTCrafter.ts';
import { AnimeController } from 'controller/AnimeController.ts';

const container = new Container();
// Bind concretes to themselves
container.bind(TYPES.AuthController).to(AuthController);
container.bind(TYPES.BcryptWrapper).to(BcryptWrapper);
container.bind(TYPES.AnimeController).to(AnimeController);
// Bind abstractions to concrete implementations
container.bind<JWTFactory>(TYPES.JWTFactory).to(JWTCrafter).inSingletonScope();
container.bind<Repository<User>>(TYPES.Repository).to(AuthRepository).inSingletonScope();
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService).inSingletonScope();

export { container };
