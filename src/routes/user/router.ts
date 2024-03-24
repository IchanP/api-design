import express from 'express';
import { container } from '../../config/inversify.config.ts';
import { TYPES } from '../../config/types.ts';
import { UserController } from '../../controller/UserController.ts';

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
 *         description: Returns the user data after registration
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
 *       204:
 *         description: Username successfully updated. No content in the response body.
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

router.put('/username', (req, res, next) => {
  controller.updateUsername(req, res, next);
});
