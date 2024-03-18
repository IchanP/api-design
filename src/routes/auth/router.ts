import { AuthController } from 'controller/AuthController.ts';
import express, { Request, Response, NextFunction } from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

router.post('/register', (req, res, next) => {
  /* #swagger.responses[201] = {
    description: 'Returns the user data after registration',
    schema: {
        username: 'BetusTestus',
        email: 'betaTester@testing.com',
        id: '1234'
     }
    } */
  /* #swagger.responses[400] = {
    description: 'Bad data was sent in the request',
    schema: { $ref: '#/components/schemas/Error' }
    } */
  /* #swagger.responses[409] = {
    description: 'The email or username is already in use',
    schema: { $ref: '#/components/schemas/Error' }
  } */
  /* #swagger.responses[500] = {
    description: 'Something went wrong on the server',
    schema: { $ref: '#/components/schemas/Error' }
   } */
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: "#/components/schemas/User" }
        }
      }
  } */
  controller.register(req, res, next);
});

router.post('/login', (req, res, next) => {
  /* #swagger.responses[200] = {
    description: 'Logs in the user and returns an access and refresh tokens',
    schema: {
       accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
       refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
     }
    } */
  /* #swagger.responses[401] = {
    description: 'The credentials provided are invalid',
    schema: { $ref: '#/components/schemas/Error' }
   } */
  /* #swagger.responses[500] = {
    description: 'Something went wrong on the server',
    schema: { $ref: '#/components/schemas/Error' }
   } */
  /* #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: "#/components/schemas/UserLogin" }
        }
      }
  } */
  controller.login(req, res, next);
});

router.post('/refresh', (req: Request, res: Response, next: NextFunction) =>
/* #swagger.security = [{
    "bearerAuth": []
}] */
/* #swagger.parameters['authorization'] = {
  in: 'header',
  description: 'Bearer token for authorization',
  required: true,
  type: 'string'
} */
  validateAuthScheme(req, res, next),
/* #swagger.responses[200] = {
    description: 'Something went wrong on the server',
    schema: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    }
   } */
/* #swagger.responses[401] = {
  description: 'The token or authorization scheme is invalid or expired.',
  schema: { $ref: '#/components/schemas/Error' }
  } */
/* #swagger.responses[500] = {
  description: 'Something went wrong on the server',
  schema: { $ref: '#/components/schemas/Error' }
} */
/* #swagger.requestBody = {
      required: false
  } */
(req: Request, res: Response, next: NextFunction) => controller.refresh(req, res, next)
);
