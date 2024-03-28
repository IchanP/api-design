import { inject, injectable } from 'inversify';
import { BcryptWrapper } from '../../Utils/BcryptWrapper.ts';
import { BadCredentialsError } from '../../Utils/Errors/BadCredentialsError.ts';
import { TYPES } from 'config/types.ts';
import { JwtPayload } from 'jsonwebtoken';
import 'dotenv/config';

@injectable()
export class AuthService implements IAuthService {
  @inject(TYPES.BcryptWrapper) private bcrypt: BcryptWrapper;
  @inject(TYPES.JWTFactory) private jwtCrafter: JWTFactory;
  @inject(TYPES.UserRepository) private repository: Repository<User>;

  async login (requestUser: { email: string, password: string}): Promise<LoginResponseScheme> {
    const matchingUser = await this.repository.getOneMatching({ email: requestUser.email });
    if (!matchingUser) {
      throw new BadCredentialsError();
    }
    if (!(await this.bcrypt.matchPassword(matchingUser, requestUser.password))) {
      throw new BadCredentialsError();
    }

    const accessToken = this.jwtCrafter.createAccessToken({ email: matchingUser.email, username: matchingUser.username, userId: matchingUser.userId });
    const refreshToken = this.jwtCrafter.createRefreshToken({ email: matchingUser.email, username: matchingUser.username });

    const links: Array<LinkStructure> = [];
    return { accessToken, refreshToken, userId: matchingUser.userId, links };
  }

  refreshToken (refreshToken: string): RefreshResponseSchema {
    const decoded = this.jwtCrafter.verifyRefresh(refreshToken) as JwtPayload;
    if (!decoded.email) {
      throw new Error();
    }
    const accessToken = this.jwtCrafter.createAccessToken({ email: decoded.email });
    const links: Array<LinkStructure> = [];
    return { accessToken, links };
  }
}
