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
