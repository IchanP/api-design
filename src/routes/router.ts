import express from 'express';
import createError from 'http-errors';
import { router as authRouter } from './auth/router.ts';
import { router as animeRouter } from './anime/router.ts';
export const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The user's unique username
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password
 *       example:   # This is where you add the default example
 *         username: janeDoe123
 *         email: janedoe@example.com
 *         password: secret1234
 *     Error:
 *       type: object
 *       required:
 *         - code
 *         - message
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *           description: Error status code
 *         message:
 *           type: string
 *           description: Error message explaining the cause of the error
 *       examples:   # Adding examples for different error codes
 *         badRequest:
 *           value:
 *             code: 400
 *             message: 'Bad data was sent in the request.'
 *         unauthorized:
 *           value:
 *             code: 401
 *             message: 'The token or authorization scheme is invalid or expired.'
 *         NotFoundError:
 *           value:
 *             code: 404
 *             message: 'The requested resource could not be found.'
 *         conflict:
 *           value:
 *             code: 409
 *             message: 'The email or username is already in use.'
 *         serverError:
 *           value:
 *             code: 500
 *             message: 'Something went wrong on the server.'
 *     Anime:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - episodes
 *         - status
 *         - animeSeason
 *         - synonyms
 *         - relatedAnime
 *         - tags
 *         - animeId
 *       properties:
 *         title:
 *           type: string
 *           example: 'Oshi no Ko'
 *         type:
 *           type: string
 *           example: 'TV'
 *         episodes:
 *           type: integer
 *           example: 11
 *         status:
 *           type: string
 *           example: 'FINISHED'
 *         animeSeason:
 *           type: object
 *           properties:
 *             season:
 *               type: string
 *               example: 'SPRING'
 *             year:
 *               type: integer
 *               example: 2023
 *         synonyms:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Oshi no Ko', "My Idol's Child", 'My Star']
 *         relatedAnime:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example: ['https://anidb.net/anime/14111', 'https://anidb.net/anime/18022', 'https://anilist.co/anime/166531']
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Drama', 'Romance', 'Slice of Life', 'acting', 'idol', 'female protagonist']
 *         animeId:
 *           type: integer
 *           example: 19
 *         broadcast:
 *           type: object
 *           properties:
 *             day:
 *               type: string
 *               example: 'Saturday'
 *             time:
 *               type: string
 *               example: '23:00'
 *             timezone:
 *               type: string
 *               example: 'JST'
 *             string:
 *               type: string
 *               example: 'Saturdays at 23:00 (JST)'
 */

/**
 * @swagger
 * tags:
 *  name: auth
 */
router.use('/auth', authRouter);

/**
 * @swagger
 * tags:
 *  name: anime
 */
router.use('/anime', animeRouter);

// TODO
router.use('*', (req, res, next) => next(createError(404)));
