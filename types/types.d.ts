declare type User = {
    email: string;
    password?: string;
    username: string;
    userId: number;
}

declare type LoginCredentials = {
    email: string;
    password: string;
}

type URLstring = string;

declare type ValidMethods = 'GET' | 'POST' | 'PUT' | 'DELETE';

declare type LinkStructure = {
    rel: string;
    href: URLstring;
    method: ValidMethods;
}

type ValidDataType = User | IAnimeList | IAnime | IWebhookStore

declare type RefreshRequestSchema = {
    refreshToken: string;
}

declare type MinimizedAnime = {
    animeId: number;
    title: string;
    type: string;
}

declare type AnimeListsResponseSchema = {
    data: Array<{
        username: string;
        links: Array<LinkStructure>;
    }>;
    links: Array<LinkStructure>;
    totalPages: number;
    currentPage: number;
}

declare type UserResponseSchema = {
    userData: User;
    links: LinkStructure[];
}

declare type ListOfAnimeResponseSchema = {
    currentPage: number;
    totalPages: number;
    data: IAnime[];
    totalAnime: number;
}

declare type AnimeQueryResultSchema = {
    data: IAnime[];
    totalPages: number;
    currentPage: number;
}

declare type WebhookData = {
    URL: URLstring;
    secret: string;
    ownerId: number;
}

declare type WebhookMessage = {
    message: string;
    data: MinimizedAnime;
}
declare type WebhookSubscribeSchema = {
    subscribed: boolean;
    data: URLstring[];
}
