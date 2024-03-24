declare interface IAuthService {
    login: (requestUser: { email: string, password: string}) => Promise<{ accessToken: string; refreshToken: string, userId: number }>;
    refreshToken: (refreshToken: string) => string;
}

declare interface IAnimeService {

}

declare interface Repository<T extends ValidDataType, U = T> {
    createDocument: (data: U) => Promise<T>;
    getOneMatching: (matcher: string) => Promise<T>;
}

declare interface IUser {
    email: string;
    password?: string;
    username: string;
    userId: number;
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

declare interface IAnime {
    animeId: number;
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

declare interface IAnimeList {
    ownerId: number;
    ownerUsername: string;
    list: MinimizedAnime[];
}

declare interface RequestBody {
    [key: string]: string | number | boolean;
}

declare interface IUserService {
    register: (userData: RequestBody) => Promise<User>;
}
