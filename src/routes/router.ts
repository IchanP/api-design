import express from 'express';
import createError from 'http-errors';
import { router as authRouter } from './auth/router.ts';
import { router as animeRouter } from './anime/router.ts';
import { router as animeListRouter } from './animelist/router.ts';
import { router as userRouter } from './user/router.ts';
import { router as webHookRouter } from './webhook/router.ts';
import { generateEntryPointLinks } from '../../Utils/linkgeneration.ts';
export const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: auth
 */
router.use('/auth', authRouter);

/**
 * @swagger
 * tags:
 *  name: user
 */
router.use('/user', userRouter);

/**
 * @swagger
 * tags:
 *  name: anime
 */
router.use('/anime', animeRouter);

/**
 * @swagger
 * tags:
 *  name: animelist
 */
router.use('/anime-list', animeListRouter);

/**
 * @swagger
 * tags:
 *  name: webhook
 */
router.use('/webhook', webHookRouter);

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Entry Point
 *     summary: Get API root with links to other resources
 *     description: Provides a list of available API endpoints and actions.
 *     responses:
 *       200:
 *         description: A list of available API links and actions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 links:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rel:
 *                         type: string
 *                         example: "anime"
 *                       href:
 *                         type: string
 *                         format: uri
 *                         example: "/anime{?page}"
 *                       method:
 *                         type: string
 *                         example: "GET"
 *               example:
 *                 links:
 *                   - rel: "anime"
 *                     href: "/anime{?page}"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list{?page}"
 *                     method: "GET"
 *                   - rel: "self"
 *                     href: "/"
 *                     method: "GET"
 *                   - rel: "register"
 *                     href: "/auth/register"
 *                     method: "POST"
 *                   - rel: "login"
 *                     href: "/auth/login"
 *                     method: "POST"
 *                   - rel: "documentation"
 *                     href: "/api-docs"
 *                     method: "GET"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 value:
 *                   code: 500
 *                   message: "Something went wrong on the server."
 */
router.use('/', (req, res) => generateEntryPointLinks(req, res));

router.use('*', (req, res, next) => next(createError(404)));
