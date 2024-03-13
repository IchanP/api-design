import 'reflect-metadata';
import { AuthController } from 'controller/AuthController.ts';
import { Container } from 'inversify';
import { AuthService } from 'service/AuthService.ts';
import { TYPES } from './types.ts';
import { AuthRepository } from 'repositories/AuthRepository.ts';
export const container = new Container();

container.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
