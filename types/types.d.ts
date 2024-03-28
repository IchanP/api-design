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

declare type IAnimeListWithLinks = IAnimeList & {
    links: LinkStructure[];
}

type ValidDataType = User | IAnimeList | IAnime | IWebhookStore

declare type RefreshRequestSchema = {
    refreshToken: string;
}

declare type MinimizedAnime = {
    animeId: number;
    title: string;
    type: string;
    links: LinkStructure[];
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
    data: MinimizedAnime[];
    totalAnime: number;
    links: LinkStructure[];
}

declare type AnimeQueryResultSchema = {
    data: MinimizedAnime[];
    totalPages: number;
    currentPage: number;
    links: LinkStructure[];
}

declare type LoginResponseScheme = {
    accessToken: string;
    refreshToken: string;
    userId: number;
    links: LinkStructure[];
}

declare type RefreshResponseSchema = {
    accessToken: string;
    links: LinkStructure[];
}

declare type OneAnimeListResponseSchema = {
    animeList: IAnimeListWithLinks;
    links: LinkStructure[];
}

declare type WebhookData = {
    URL: URLstring;
    secret: string;
    ownerId: number;
}

declare type OneAnimeByIdSchema = IAnime & {
    links: LinkStructure[];
}

declare type WebhookMessage = {
    message: string;
    data: MinimizedAnime;
}
declare type WebhookSubscribeSchema = {
    subscribed: boolean;
    data: URLstring[];
    links: LinkStructure[];
}
