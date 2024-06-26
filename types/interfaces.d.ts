declare interface IAuthService {
    login: (requestUser: { email: string, password: string}) => Promise<{ accessToken: string; refreshToken: string, userId: number }>;
    refreshToken: (refreshToken: string) => RefreshResponseSchema;
}

declare interface Repository<T extends ValidDataType, U = T> {
    createDocument: (data: U) => Promise<T>;
    getOneMatching: (filter: { [key: string]: string | number }) => Promise<T>;
    updateOneValue?: (field: string, value: string, identifier: string | number) => Promise<void>;
    getPaginatedResult?: (page: number, limit?: number, filter?: { [key: string]: string | number }) => Promise<T[]>;
    getMany?: (filter: { [key: string]: string | number }) => Promise<T[]>;
    deleteOneValue?(field: string, value: string, filter: { [key: string]: string | number }): Promise<void>;
    getTotalPages: (limit?: number) => Promise<number>;
    getTotalCount: () => Promise<number>;
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
    userId: number;
    username: string;
    list: MinimizedAnime[];
}

declare interface TokenPayload {
    userId: number;
    username: string;
    email: string;
    iat: number;
    exp: number;
}

declare interface RequestBody {
    [key: string]: string | number | boolean | TokenPayload;
}

declare interface IUserService {
    register: (userData: RequestBody) => Promise<UserResponseSchema>;
    updateField: (info: RequestBody, field: string) => Promise<void>;
}

declare interface IWebhookStore {
    userId: number,
    webhooks: WebhookData[]
}

declare interface IWebhookService<T, Resource = T> {
    addWebhook: (userId: string, webhookData: WebhookData, service: T) => Promise<Resource>;
    removeWebhook: (userId: string, ownerId: string, resource: string) => Promise<void>;
    getWebhooks: (subscribptionId: string, userId: string) => Promise<WebhookSubscribeSchema>;
}
