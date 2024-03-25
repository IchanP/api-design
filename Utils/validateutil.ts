import { BadDataError } from './BadDataError.ts';

export function isValidType<Type> (typeToValidate: Type, expectedKeys: string[]): typeToValidate is Type {
  const actualKeys = Object.keys(typeToValidate);

  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }

  // Check for the same keys (ignoring type)
  return expectedKeys.length === actualKeys.length &&
             expectedKeys.every(key => actualKeys.includes(key));
}

export function validateId (id: string): void {
  if (isNaN(Number(id))) {
    throw new BadDataError('The id parameter must be a number.');
  }
}
