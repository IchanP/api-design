declare interface IAuthService {
    castToUser: (data: User) => User;
    login: (User: User, password: string) => Promise<{ accessToken: string; refreshToken: string }>;
}

declare interface Repository<T extends ValidDataType> {
    addData: (data: T) => Promise<string>;
    getOneMatching: (matcher: string) => Promise<T>;
}

declare interface IUser {
    email: string;
    password: string;
    username: string;
}

declare interface ExtendedError extends Error {
    status: number;
    code: number;
    cause: {
        status: number;
        message: string;
        stack: string;
    }
}
