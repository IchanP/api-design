export class BadCredentialsError extends Error {
  constructor (message?: string) {
    super(message || 'The credentials provided are invalid');
  }
}
