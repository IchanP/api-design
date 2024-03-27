import express from 'express';
import { container } from '../../config/inversify.config.ts';
import { TYPES } from '../../config/types.ts';
import { UserController } from '../../controller/UserController.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';
import { generateAlwaysAccessibleLinks, generateAuthLinks, generateSelfLink } from '../../../Utils/linkgeneration.ts';

const controller = container.get<UserController>(TYPES.UserController);
export const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - user
 *     summary: Registers a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Returns the user data after registration along with relevant links for further actions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 8
 *                     email:
 *                       type: string
 *                       example: mallie.lang@hotmail.com
 *                     username:
 *                       type: string
 *                       example: Loma.Lubowitz
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
 *                 userData:
 *                   userId: 8
 *                   email: "mallie.lang@hotmail.com"
 *                   username: "Loma.Lubowitz"
 *                 links:
 *                   - rel: "self"
 *                     href: "/user/register"
 *                     method: "POST"
 *                   - rel: "login"
 *                     href: "/auth/login"
 *                     method: "POST"
 *                   - rel: "profile"
 *                     href: "/anime-list/8"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "anime"
 *                     href: "/anime"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list"
 *                     method: "GET"
 *       400:
 *         description: Bad data was sent in the request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
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
router.post('/register', (req, res, next) => controller.register(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res));

/**
 * @swagger
 * /user/username:
 *   put:
 *     tags:
 *       - user
 *     summary: Update the user's username
 *     description: Allows the user to update their username.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username to be updated to.
 *                 example: 'newUsername123'
 *     responses:
 *       200:
 *         description: Username successfully updated along with navigational links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username successfully updated.
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
 *                 message: Username successfully updated.
 *                 links:
 *                   - rel: "self"
 *                     href: "/user/username"
 *                     method: "PUT"
 *                   - rel: "anime"
 *                     href: "/anime"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "animelist-profile"
 *                     href: "/anime-list/3"
 *                     method: "GET"
 *                   - rel: "refresh-login"
 *                     href: "/auth/refresh"
 *                     method: "POST"
 *       400:
 *         description: Bad Request - Request body does not match the expected format.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 $ref: '#/components/schemas/Error/examples/badRequest'
 *       401:
 *         description: Unauthorized - No valid Bearer JWT provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/unauthorized'
 *       409:
 *         description: Conflict - The username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               conflict:
 *                 $ref: '#/components/schemas/Error/examples/conflict'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.put('/username',
  (req, res, next) => validateAuthScheme(req, res, next),
  (req, res, next) => controller.updateUsername(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res));
