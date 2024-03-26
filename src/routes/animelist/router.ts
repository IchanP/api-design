import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import express, { Request, Response, NextFunction } from 'express';
import { AnimeListController } from 'controller/AnimeListController.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';
import { tokenIdMatchesPathId, validateId } from '../../../Utils/ValidatorUtil.ts';
import { generateAuthLinks } from '../../../Utils/linkgeneration.ts';

export const router = express.Router();
const controller = container.get<AnimeListController>(TYPES.AnimeListController);

/**
 * @swagger
 * /anime-list:
 *   get:
 *     tags:
 *       - animelist
 *     summary: Get anime lists
 *     description: Retrieves a paginated array containing links to individual anime lists along with the owner's username.
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
 *         description: An array of links to different anime lists along with general navigation links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         description: Username of the owner of the anime list
 *                         example: "animefan123"
 *                       links:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             rel:
 *                               type: string
 *                               example: "animelist-profile"
 *                             href:
 *                               type: string
 *                               format: uri
 *                               description: Link to the anime list for the owner
 *                               example: "/anime-list/1234"
 *                             method:
 *                               type: string
 *                               example: "GET"
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
 *                       href: "/anime-lists?page=1"
 *                       method: "GET"
 *                     - rel: "next"
 *                       href: "/anime-list?page=2"
 *                       method: "GET"
 *                     - rel: "prev"
 *                       href: "/anime-list?page=1"
 *                       method: "GET"
 *                     - rel: "anime"
 *                       href: "/anime"
 *                       method: "GET"
 *                     - rel: "search-anime"
 *                       href: "/anime/search{?title}"
 *                       method: "GET"
 *                 totalPages:
 *                   type: number
 *                   description: The total number of pages of anime lists
 *                   example: 100
 *                 currentPage:
 *                   type: number
 *                   description: The current page number
 *                   example: 1
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
router.get('/',
  (req, res, next) => validateAuthScheme(req, res, next),
  (req, res, next) => controller.displayAnimeLists(req, res, next),
  (req, res, next) => generateAuthLinks(req, res, next)
);

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
 *         description: The ID of the owner of the anime list. Must be a number.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       200:
 *         description: An anime list object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimeList'
 *       400:
 *         description: Bad Request - The user-id is not a number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 value:
 *                   code: 400
 *                   message: "The id parameter must be a number."
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

router.get('/:id', (req: Request, res: Response, next: NextFunction) =>
  validateId(req.params.id, res, next),
(req, res, next) => controller.displayAnimeList(req, res, next));

/**
 * @swagger
 * /anime-list/{user-id}/anime/{anime-id}:
 *   post:
 *     tags:
 *       - animelist
 *     summary: Add an anime to the specified anime list
 *     description: Adds an anime by its ID to the anime list of the user specified by user ID. If the anime is already in the list a 201 status code will be returned but no changes will be made to the list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list owner.
 *       - in: path
 *         name: anime-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime to add to the list.
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       201:
 *         description: Anime successfully added to the anime list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnimeList'
 *       400:
 *         description: Bad Request - Either of the IDs is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 $ref: '#/components/schemas/Error/examples/badRequest'
 *       401:
 *         description: Unauthorized - No valid Bearer JWT provided or the requester is not the owner of the anime list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 $ref: '#/components/schemas/Error/examples/unauthorized'
 *       404:
 *         description: Anime list or anime not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFoundError:
 *                 $ref: '#/components/schemas/Error/examples/NotFoundError'
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               serverError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.post('/:id/anime/:animeId', (req: Request, res: Response, next: NextFunction) =>
  validateAuthScheme(req, res, next),
(req, res, next) => validateId(req.params.id, res, next),
(req, res, next) => validateId(req.params.animeId, res, next),
(req, res, next) => tokenIdMatchesPathId(req.body.token, req.params.id, next),
(req, res, next) => controller.addAnime(req, res, next));

/**
 * @swagger
 * anime-list/{user-id}/anime/{anime-id}:
 *   delete:
 *     tags:
 *       - animelist
 *     summary: Delete an anime from the specified anime list
 *     description: Deletes an anime by its ID from the anime list of the user specified by user ID. Will silently ignore and return a 204 status code if the anime is not in the list.
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
router.delete('/:id/anime/:animeId', (req: Request, res: Response, next: NextFunction) => validateAuthScheme(req, res, next),
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => validateId(req.params.animeId, res, next),
  (req, res, next) => tokenIdMatchesPathId(req.body.token, req.params.id, next),
  (req, res, next) => controller.deleteAnime(req, res, next));
