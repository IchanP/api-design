import { Request } from "express";
import { Response } from "express-serve-static-core";
import { NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "config/types.ts";
import { BadDataError } from "../../Utils/BadDataError.ts";
import createError from "http-errors";

@injectable()
export class AuthController {

    #service: Service<User>;
    #repository: Repository<User>;

    constructor(
        @inject(TYPES.AuthService) service: Service<User>,
        @inject(TYPES.AuthRepository) repository: Repository<User>
        ) {
        this.#repository = repository;
        this.#service = service;
    }

   async register(req: Request, res: Response, next: NextFunction) {
        try {
        const userInfo = this.#service.create(req.body);
         await this.#repository.addData(userInfo);
        } catch(e: unknown) {
            if(e instanceof BadDataError) {
                const err = createError(400);
                next(err);
            }
        }
    }
}