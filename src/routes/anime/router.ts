import express from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { AnimeController } from 'controller/AnimeController.ts';
import { validateId } from '../../../Utils/ValidatorUtil.ts';
import { checkLoginStatus } from '../../../Utils/index.ts';
import { generateCommonLinks } from '../../../Utils/linkgeneration.ts';

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
 *         description: A list of anime along with navigation links
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
 *                 totalAnime:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/MinimizedAnime'
 *                       - type: object
 *                         properties:
 *                           links:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 rel:
 *                                   type: string
 *                                   example: self
 *                                 href:
 *                                   type: string
 *                                   format: uri
 *                                   example: '/anime/1'
 *                                 method:
 *                                   type: string
 *                                   example: GET
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
 *               example:
 *                 currentPage: 1
 *                 totalPages: 1675
 *                 totalAnime: 33485
 *                 data:
 *                   - animeId: 101
 *                     title: 'Naruto'
 *                     type: 'TV'
 *                     links:
 *                       - rel: 'self'
 *                         href: '/anime/101'
 *                         method: 'GET'
 *                       - rel: "add-to-list"
 *                         href: "/anime-list/3/anime/101"
 *                         method: "POST"
 *                 links:
 *                   - rel: "self"
 *                     href: "/anime?page=1"
 *                     method: "GET"
 *                   - rel: "next"
 *                     href: "/anime?page=2"
 *                     method: "GET"
 *                   - rel: "prev"
 *                     href: "/anime?page=1"
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
 *                   - rel: "refresh-login"
 *                     href: "/auth/refresh"
 *                     method: "POST"
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
router.get('/',
  (req, res, next) => checkLoginStatus(req, res, next),
  (req, res, next) => controller.displayAnime(req, res, next),
  (req, res) => generateCommonLinks(req, res));

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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page of the search results.
 *       - in: header
 *         name: Authorization
 *         required: false
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       200:
 *         description: A list of matching anime along with navigation links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/MinimizedAnime'
 *                       - type: object
 *                         properties:
 *                           links:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 rel:
 *                                   type: string
 *                                 href:
 *                                   type: string
 *                                 method:
 *                                   type: string
 *                             example:
 *                               - rel: "self"
 *                                 href: "/anime/101"
 *                                 method: "GET"
 *                               - rel: "add-to-list"
 *                                 href: "/anime-list/3/anime/101"
 *                                 method: "POST"
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
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
 *                   example:
 *                     - rel: "self"
 *                       href: "/anime/search?page=1"
 *                       method: "GET"
 *                     - rel: "next"
 *                       href: "/anime/search?page=2"
 *                       method: "GET"
 *                     - rel: "prev"
 *                       href: "/anime/search?page=1"
 *                       method: "GET"
 *                     - rel: "animelists"
 *                       href: "/anime-list{?page}"
 *                       method: "GET"
 *                     - rel: "anime"
 *                       href: "/anime{?page}"
 *                       method: "GET"
 *                     - rel: "profile"
 *                       href: "/anime-list/3"
 *                       method: "GET"
 *                     - rel: "update-username"
 *                       href: "/user/username"
 *                       method: "PUT"
 *                     - rel: "refresh-login"
 *                       href: "/auth/refresh"
 *                       method: "POST"
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
router.get('/search',
  (req, res, next) => checkLoginStatus(req, res, next),
  (req, res, next) => controller.searchAnime(req, res, next),
  (req, res) => generateCommonLinks(req, res));

/**
 * @swagger
 * /anime/{anime-id}:
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
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Bearer token for authorization. Prefix with 'Bearer ' followed by the token.
 *     responses:
 *       200:
 *         description: A single anime object with navigation links
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Anime'
 *                 - type: object
 *                   properties:
 *                     links:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rel:
 *                             type: string
 *                           href:
 *                             type: string
 *                           method:
 *                             type: string
 *               example:
 *                 title: 'Attack on Titan'
 *                 type: 'TV'
 *                 episodes: 59
 *                 status: 'FINISHED'
 *                 animeSeason:
 *                   season: 'SPRING'
 *                   year: 2013
 *                 synonyms: ['Shingeki no Kyojin', 'AoT']
 *                 relatedAnime: ['https://anidb.net/anime/10234', 'https://anidb.net/anime/20482']
 *                 tags: ['Action', 'Fantasy', 'Military', 'Survival', 'Titans']
 *                 animeId: 1869
 *                 broadcast:
 *                   day: 'Sunday'
 *                   time: '23:00'
 *                   timezone: 'JST'
 *                   string: 'Sundays at 23:00 (JST)'
 *                 links:
 *                   - rel: "self"
 *                     href: "/anime/1869"
 *                     method: "GET"
 *                   - rel: "add-to-list"
 *                     href: "/anime-list/3/anime/1869"
 *                     method: "POST"
 *                   - rel: "delete-from-list"
 *                     href: "/anime-list/3/anime/1869"
 *                     method: "DEL"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list{?page}"
 *                     method: "GET"
 *                   - rel: "anime"
 *                     href: "/anime{?page}"
 *                     method: "GET"
 *                   - rel: "animelist-profile"
 *                     href: "/anime-list/3"
 *                     method: "GET"
 *                   - rel: "update-username"
 *                     href: "/user/username"
 *                     method: "PUT"
 *                   - rel: "refresh-login"
 *                     href: "/auth/refresh"
 *                     method: "POST"
 *       400:
 *         description: Bad Request - The ID parameter must be a number.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missingTitle:
 *                 value:
 *                   code: 400
 *                   message: "The ID parameter must be a number."
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
router.get('/:id',
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => checkLoginStatus(req, res, next),
  (req, res, next) => controller.displayAnimeById(req, res, next),
  (req, res) => generateCommonLinks(req, res));
