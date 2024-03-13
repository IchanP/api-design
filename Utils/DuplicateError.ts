export class DuplicateError extends Error {
    constructor(message?: string) {
        super(message || 'Duplicate data found, this data already exists.');
    }
}