declare interface Service<T extends ValidDataType> {
    create: (data: T) => T;
}

declare interface Repository<T extends ValidDataType> {
    addData: (data: T) => Promise<void>;
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