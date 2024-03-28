export class NotFoundError extends Error {
  constructor (message?: string) {
    super(message || 'The requested resource was not found.');
    this.name = 'NotFoundError';
  }
}
