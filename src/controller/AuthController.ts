import { Request } from "express";
import { Response } from "express-serve-static-core";

export class AuthController {

    register(req: Request, res: Response) {
        console.log(req.body);

    }
}