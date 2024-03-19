import { AuthController } from 'controller/AuthController.ts';
import express, { Request, Response, NextFunction } from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

/**
 * @swagger
 * auth/register:
 *   post:
 *     tags:
 *       - auth
 *     summary: Registers a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Returns the user data after registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: BetusTestus
 *                 email:
 *                   type: string
 *                   example: betaTester@testing.com
 *                 id:
 *                   type: string
 *                   example: 1234
 *       400:
 *         description: Bad data was sent in the request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:    # Use this to reference specific examples
 *               badRequest:
 *                 $ref: '#/components/schemas/Error/examples/badRequest'
 *       409:
 *         description: The email or username is already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               conflict:
 *                 $ref: '#/components/schemas/Error/examples/conflict'
 *       500:
 *         description: Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.post('/register', (req, res, next) => {
  controller.register(req, res, next);
});

/**
 * @swagger
 * auth/login:
 *   post:
 *     tags:
 *       - auth
 *     summary: Logs in the user and returns access and refresh tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: betaTester@testing.com
 *               password:
 *                 type: string
 *                 example: supersecretturbopassword
 *     responses:
 *       200:
 *         description: Logs in the user and returns an access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 userId:
 *                  type: number
 *                  example: 1234
 *       401:
 *         description: The credentials provided are invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 $ref: '#/components/schemas/Error/examples/badRequest'
 *       500:
 *         description: Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.post('/login', (req, res, next) => {
  controller.login(req, res, next);
});

/**
 * @swagger
 * auth/refresh:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - auth
 *     summary: Refreshes the access token
 *     parameters:
 *       - in: header
 *         name: Bearer
 *         description: Bearer token for authorization
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       401:
 *         description: The token or authorization scheme is invalid or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/unauthorized'
 *       500:
 *         description: Something went wrong on the server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *              serverError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.post('/refresh', (req: Request, res: Response, next: NextFunction) =>
  validateAuthScheme(req, res, next),
(req: Request, res: Response, next: NextFunction) => controller.refresh(req, res, next)
);
