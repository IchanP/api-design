import { Request } from "express";
import { Response } from "express-serve-static-core";
import { NextFunction } from "express";
export class AuthController {

    register(req: Request, res: Response, next: NextFunction) {
        console.log(req.body);
    }
}