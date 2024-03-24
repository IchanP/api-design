import express, { Request, Response, NextFunction } from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { AnimeController } from 'controller/AnimeController.ts';

export const router = express.Router();
const controller = container.get<AnimeController>(TYPES.AnimeController);

/**
 * @swagger
 * /anime:
 *   get:
 *     tags:
 *       - anime
 *     summary: Retrieve a list of anime
 *     description: Returns a paginated list of anime, with 20 anime per page.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve. Must be greater than 0.
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       200:
 *         description: A list of anime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Anime'
 *                   description: An array of anime objects, up to 20 per page.
 *                 totalAnime:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               internalServerError:
 *                 $ref: '#/components/schemas/Error/examples/serverError'
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => controller.displayAnime(req, res, next));

/**
 * @swagger
 * /anime/search:
 *   get:
 *     tags:
 *       - anime
 *     summary: Search for anime by title
 *     description: Returns a list of up to 20 matching anime per page based on the provided title query.
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: The title of the anime to search for.
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       200:
 *         description: A list of matching anime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Anime'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *               example:
 *                 results:
 *                   - title: 'Oshi no Ko'
 *                     type: 'TV'
 *                     episodes: 11
 *                     status: 'FINISHED'
 *                     animeSeason:
 *                       season: 'SPRING'
 *                       year: 2023
 *                     synonyms: ['Oshi no Ko', "My Idol's Child", 'My Star']
 *                     relatedAnime: ['https://anidb.net/anime/14111', 'https://anidb.net/anime/18022', 'https://anilist.co/anime/166531']
 *                     tags: ['Drama', 'Romance', 'Slice of Life', 'acting', 'idol', 'female protagonist']
 *                     animeId: 19
 *                     broadcast:
 *                       day: 'Saturday'
 *                       time: '23:00'
 *                       timezone: 'JST'
 *                       string: 'Saturdays at 23:00 (JST)'
 *                   - title: 'Attack on Titan'
 *                     type: 'TV'
 *                     episodes: 59
 *                     status: 'FINISHED'
 *                     animeSeason:
 *                       season: 'SPRING'
 *                       year: 2013
 *                     synonyms: ['Shingeki no Kyojin', 'AoT']
 *                     relatedAnime: ['https://anidb.net/anime/10234', 'https://anidb.net/anime/20482', 'https://anilist.co/anime/21459']
 *                     tags: ['Action', 'Fantasy', 'Military', 'Survival', 'Titans']
 *                     animeId: 101
 *                 currentPage: 1
 *                 totalPages: 5
 *       400:
 *         description: Bad Request - The title query is missing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingTitle:
 *                 value:
 *                   code: 400
 *                   message: "The title query parameter is missing."
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
 *                   message: "Something else went wrong."
 */

router.get('/search', (req, res, next) => {
  controller.searchAnime(req, res, next);
});

/**
 * @swagger
 * anime/{anime-id}:
 *   get:
 *     tags:
 *       - anime
 *     summary: Get an anime by its ID
 *     description: Returns a single anime object based on its ID.
 *     parameters:
 *       - in: path
 *         name: anime-id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The anime's ID
 *       - in: header
 *         name: Bearer
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: A single anime object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Anime'
 *       404:
 *         description: Anime not found
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
router.get('/:id', (req: Request, res: Response, next: NextFunction) => controller.displayAnimeById(req, res, next));
