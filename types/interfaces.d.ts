declare interface IAuthService {
    castToUser: (data: User) => User;
    login: (User: User, password: string) => Promise<{ accessToken: string; refreshToken: string }>;
    refreshToken: (refreshToken: string) => string;
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

declare interface JWTFactory {
    createRefreshToken: (payload: object) => string;
    createAccessToken: (payload: object) => string;
}

declare interface IAnime {
    title: string;
    type: string;
    episodes?: number;
    status: string;
    animeSeason: {
        season: string;
        year?: number;
    };
    synonyms: string[];
    relatedAnime: string[];
    tags: string[];
    broadcast?: {
        day: string;
        time: string;
        timezone: string;
        string: string;
    };
}
