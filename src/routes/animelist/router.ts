import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import express, { Request, Response, NextFunction } from 'express';
import { AnimeListController } from 'controller/AnimeListController.ts';

export const router = express.Router();
const controller = container.get<AnimeListController>(TYPES.AnimeListController);

/**
 * @swagger
 * /anime-list:
 *   get:
 *     tags:
 *       - animelist
 *     summary: Get anime lists
 *     description: Retrieves anime lists containing links to individual anime lists along with the owner's username.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *     responses:
 *       200:
 *         description: An array of links to different anime lists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       link:
 *                         type: string
 *                         format: uri
 *                         description: Link to the anime list for the owner
 *                         example: "http://localhost:3000/anime-list/1234"
 *                       ownerUsername:
 *                         type: string
 *                         description: Username of the owner of the anime list
 *                         example: "animefan123"
 *                 next:
 *                   type: string
 *                   format: uri
 *                   description: Link to the next page of anime lists
 *                   example: "http://localhost:3000/anime-list?page=2"
 *                 previous:
 *                   type: string
 *                   format: uri
 *                   description: Link to the previous page of anime lists
 *                   example: "http://localhost:3000/anime-list?page=1"
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
router.get('/', (req, res, next) => controller.listAnimeLists(req, res, next));

/**
 * @swagger
 * /anime-list/{user-id}:
 *   get:
 *     tags:
 *       - animelist
 *     summary: Get an anime list by owner ID
 *     description: Retrieves an anime list belonging to the owner specified by ID.
 *     parameters:
 *       - in: path
 *         name: user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the owner of the anime list
 *     responses:
 *       200:
 *         description: An anime list object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimeList'
 *       404:
 *         description: Anime list not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
 *                 $ref: '#/components/schemas/Error/examples/NotFoundError'
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
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.displayAnimeList(req, res, next));
