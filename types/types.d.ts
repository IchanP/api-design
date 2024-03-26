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

type ValidDataType = User | IAnimeList | IAnime

declare type RefreshRequestSchema = {
    refreshToken: string;
}

declare type MinimizedAnime = {
    animeId: number;
    title: string;
    type: string;
}

type URLstring = string;

declare type AnimeListsResponseSchema = {
    data: Array<{
        link: URLstring;
        username: string;}>;

    next: URLstring;
    previous: URLstring;
    totalPages: number;
    currentPage: number;
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
}

declare type WebhookMessage = {
    message: string;
    data: MinimizedAnime;
}
