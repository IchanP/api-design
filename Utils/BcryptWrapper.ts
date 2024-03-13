import bcrypt from 'bcrypt';
import { injectable } from 'inversify';

@injectable()
export class BcryptWrapper {
  async hashPassword (password: string, rounds: number = 12) {
    return bcrypt.hash(password, rounds);
  }

  async matchPassword (user:User, passwordTwo: string) {
    return await bcrypt.compare(passwordTwo, user.password);
  }
}
