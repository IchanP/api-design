import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
export function validateAuthScheme (req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      const err = createError(401);
      err.message = 'No authorization header present.';
      return next(err);
    }
    const [authenticationScheme, token] = req.headers.authorization.split(' ');
    if (authenticationScheme.toLowerCase() !== 'bearer') {
      const err = createError(401);
      err.message = 'Invalid authentication scheme';
      return next(err);
    }

    setPayloadToRequest(req, token);
    return next();
  } catch (e: unknown) {
    next(e);
  }
}

function setPayloadToRequest (req: Request, token: string) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  payload.token = token;
  req.body.token = payload;
}

export function isValidType<Type> (typeToValidate: Type, expectedKeys: string[]): typeToValidate is Type {
  const actualKeys = Object.keys(typeToValidate);

  if (actualKeys.length !== expectedKeys.length) {
    return false;
  }

  // Check for the same keys (ignoring type)
  return expectedKeys.length === actualKeys.length &&
           expectedKeys.every(key => actualKeys.includes(key));
}
