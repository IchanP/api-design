import { AuthController } from 'controller/AuthController.ts';
import express from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';
import { generateAlwaysAccessibleLinks, generateAuthLinks, generateSelfLink } from '../../../Utils/linkgeneration.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

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
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                       href:
 *                         type: string
 *                         format: uri
 *                       method:
 *                         type: string
 *                   example:
 *                     - rel: "self"
 *                       href: "/login"
 *                       method: "POST"
 *                     - rel: "anime"
 *                       href: "/anime{?page}"
 *                       method: "GET"
 *                     - rel: "search-anime"
 *                       href: "/anime/search{?title,page}"
 *                       method: "GET"
 *                     - rel: "animelists{?page}"
 *                       href: "/anime-list"
 *                       method: "GET"
 *                     - rel: "profile"
 *                       href: "/anime-list/3"
 *                       method: "GET"
 *                     - rel: "refresh-login"
 *                       href: "/auth/refresh"
 *                       method: "POST"
 *                     - rel: "update-username"
 *                       href: "/user/username"
 *                       method: "PUT"
 *       401:
 *         description: The credentials provided are invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   code: 401
 *                   message: "Invalid credentials provided."
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
router.post('/login',
  (req, res, next) => controller.login(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res));

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
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                       href:
 *                         type: string
 *                       method:
 *                         type: string
 *               example:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                 links:
 *                   - rel: "self"
 *                     href: "/auth/refresh"
 *                     method: "POST"
 *                   - rel: "anime"
 *                     href: "/anime{?page}"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list{?page}"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "profile"
 *                     href: "/anime-list/3"
 *                     method: "GET"
 *                   - rel: "update-username"
 *                     href: "/user/username"
 *                     method: "PUT"
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
router.post('/refresh', (req, res, next) =>
  validateAuthScheme(req, res, next),
(req, res, next) => controller.refresh(req, res, next),
(req, res, next) => generateSelfLink(req, next),
(req, res, next) => generateAlwaysAccessibleLinks(req, next),
(req, res) => generateAuthLinks(req, res));
