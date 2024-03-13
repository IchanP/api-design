import 'reflect-metadata';
import { AuthController } from 'controller/AuthController.ts';
import { Container } from 'inversify';
import { AuthService } from 'service/AuthService.ts';
import { TYPES } from './types.ts';
import { AuthRepository } from 'repositories/AuthRepository.ts';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { JWTCrafter } from '../../Utils/JWTCrafter.ts';

const container = new Container();

container.bind<JWTFactory>(TYPES.JWTCrafter).to(JWTCrafter).inSingletonScope();
container.bind<BcryptWrapper>(TYPES.BcryptWrapper).to(BcryptWrapper).inSingletonScope();
container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

export { container };
