export function isValidUser (user: User): user is User {
  const expectedKeys = ['username', 'email', 'password'];
  const actualKeys = Object.keys(user);

  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }

  // Check for the same keys (ignoring type)
  return expectedKeys.length === actualKeys.length &&
           expectedKeys.every(key => actualKeys.includes(key));
}
