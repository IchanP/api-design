export class MissingFieldsError extends Error {
  constructor (message?: string) {
    super(message || 'Misisng required fields in the provided request.');
    this.name = 'MissingFieldsError';
  }
}
