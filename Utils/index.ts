import { createHmac } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';

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

    verifyToken(token, next);
    setPayloadToRequest(req, token);
    return next();
  } catch (e: unknown) {
    next(e);
  }
}

export function checkLoginStatus (req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next();
    return;
  }
  const [authenticationScheme, token] = req.headers.authorization.split(' ');
  if (authenticationScheme.toLowerCase() !== 'bearer') {
    next();
    return;
  }
  setPayloadToRequest(req, token);
  next();
}

function setPayloadToRequest (req: Request, token: string) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  payload.token = token;
  req.body.token = payload;
}

export function defaultToOne (providedValue: string): number {
  let result;
  Number(providedValue) > 0 ? result = Number(providedValue) : result = 1;
  return result;
}

export function createHash (secret: string, payload: string) {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  return hmac.digest('hex');
}

export function createUUID (): string {
  return crypto.randomUUID().toString();
}

function verifyToken (token: string, next : NextFunction) {
  const jwtCrafter = container.get<JWTFactory>(TYPES.JWTFactory);

  let accessError: unknown = null;
  let refreshError: unknown = null;
  try {
    jwtCrafter.verifyAccess(token);
  } catch (e) {
    accessError = e;
  }

  try {
    jwtCrafter.verifyRefresh(token);
  } catch (e) {
    refreshError = e;
  }

  if (accessError && refreshError) {
    const err = createError(401);
    err.message = 'Invalid token';
    return next(err);
  }
}
