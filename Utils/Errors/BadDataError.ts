export class BadDataError extends Error {
  constructor (message?: string) {
    super(message || 'Invalid data provided');
  }
}
