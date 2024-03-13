import { injectable } from "inversify";
import { isValidUser } from "../../types/User.ts";
import { BadDataError } from "../../Utils/BadDataError.ts";
@injectable()
export class AuthService implements Service<User> {

    create(userData: User) {
        if(!isValidUser(userData)) {
            throw new BadDataError('Invalid user data');
        }
        return userData as User;
    }
}