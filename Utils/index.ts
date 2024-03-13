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
    req.body.token = token;
    return next();
  } catch (e: unknown) {
    next(e);
  }
}
