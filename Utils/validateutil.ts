export function isValidType<Type> (typeToValidate: Type, expectedKeys: string[]): typeToValidate is Type {
  const actualKeys = Object.keys(typeToValidate);

  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }

  // Check for the same keys (ignoring type)
  return expectedKeys.length === actualKeys.length &&
             expectedKeys.every(key => actualKeys.includes(key));
}
