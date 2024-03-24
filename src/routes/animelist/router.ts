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
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination. Must be greater than 0.
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
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
 *       400:
 *         description: Bad Request - Incorrect page value provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 value:
 *                   code: 400
 *                   message: "Incorrect page value. Page must be greater than 0."
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
 *       - in: header
 *         name: Bearer
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
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

/**
 * @swagger
 * anime-list/{user-id}/anime/{anime-id}:
 *   post:
 *     tags:
 *       - animelist
 *     summary: Add an anime to the specified anime list
 *     description: Adds an anime by its ID to the anime list of the user specified by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list owner
 *       - in: path
 *         name: anime-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime to add to the list
 *       - in: header
 *         name: Bearer
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
 *     responses:
 *       201:
 *         description: Anime successfully added to the anime list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimeList'
 *       401:
 *         description: Unauthorized - No valid Bearer JWT provided or the requester is not the owner of the anime list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/unauthorized'
 *       404:
 *         description: Anime list or anime not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFoundError:
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
router.post('/:id/add-anime/:anime-id', (req: Request, res: Response, next: NextFunction) => controller.addAnime(req, res, next));

/**
 * @swagger
 * anime-list/{user-id}/anime/{anime-id}:
 *   delete:
 *     tags:
 *       - animelist
 *     summary: Delete an anime from the specified anime list
 *     description: Deletes an anime by its ID from the anime list of the user specified by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list owner
 *       - in: path
 *         name: anime-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime to be deleted from the list
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       204:
 *         description: Anime successfully deleted from the anime list.
 *       401:
 *         description: Unauthorized - No valid Bearer JWT provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/unauthorized'
 *       404:
 *         description: Anime list or anime not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
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
router.delete('/:id/anime/:anime-id', (req: Request, res: Response, next: NextFunction) => controller.deleteAnime(req, res, next));
