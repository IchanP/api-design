import { injectable } from "inversify";
import { UserModel } from "models/User.ts";
import {DuplicateError} from '../../Utils/DuplicateError.ts';
import { Error } from "mongoose";
import { BadDataError } from "../../Utils/BadDataError.ts";

@injectable()
export class AuthRepository implements Repository<User>{

   async addData(userData: User): Promise<string> {
    try {
        const user = new UserModel({
            email: userData.email,
            password: userData.password,
            username: userData.username
        });
        console.log(user.password)
        await user.save();
        return user.id;
    } catch (e: unknown) {
        const error = e as ExtendedError;
        if(error.code === 11000) {
            throw new DuplicateError();
        } else if (error instanceof Error.ValidationError) {
            throw new BadDataError(error.message);
        }
        throw error;
    }
    }
}