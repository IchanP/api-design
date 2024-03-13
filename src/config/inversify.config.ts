import { AuthController } from "controller/AuthController.ts";
import { Container, decorate, inject, injectable } from 'inversify';


export const TYPES = {
    AuthController: Symbol.for('AuthController')
};
export const container = new Container();

container.bind(TYPES.AuthController).to(AuthController).inSingletonScope();
