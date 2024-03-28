import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import express, { Request, Response, NextFunction } from 'express';
import { AnimeListController } from 'controller/AnimeListController.ts';
import { checkLoginStatus, validateAuthScheme } from '../../../Utils/index.ts';
import { tokenIdMatchesPathId, validateId } from '../../../Utils/ValidatorUtil.ts';
import { generateAlwaysAccessibleLinks, generateAuthLinks, generateSelfLink } from '../../../Utils/linkgeneration.ts';

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
 *         description: An array of links to different anime lists along with general navigation links, customized based on user authentication.
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
 *                             href:
 *                               type: string
 *                               format: uri
 *                             method:
 *                               type: string
 *                         example:
 *                           - rel: "owner"
 *                             href: "/anime-list/21"
 *                             method: "GET"
 *                           - rel: "subscribe"
 *                             href: "/webhook/anime-list/3/subscribe"
 *                             method: "POST"
 *                           - rel: "unsubscribe"
 *                             href: "/webhook/anime-list/3/subscribe"
 *                             method: "DELETE"
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
 *                       href: "/anime{?page}"
 *                       method: "GET"
 *                     - rel: "search-anime"
 *                       href: "/anime/search{?title,page}"
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
  (req, res, next) => checkLoginStatus(req, res, next),
  (req, res, next) => controller.displayAnimeLists(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res)
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
 *         description: An anime list object along with navigation and interaction links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 animeList:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MinimizedAnime'
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
 *                 animeList:
 *                   username: "Justen79"
 *                   list:
 *                     - animeId: 101
 *                       title: 'Naruto'
 *                       type: 'TV'
 *                       links:
 *                         - rel: 'self'
 *                           href: '/anime/101'
 *                           method: 'GET'
 *                         - rel: 'add-to-list'
 *                           href: '/anime-list/34/anime/101'
 *                           method: 'POST'
 *                   links:
 *                     - rel: "owner"
 *                       href: "/anime-list/34"
 *                       method: "GET"
 *                     - rel: "unsubscribe"
 *                       href: "/webhook/anime-list/34/subscribe"
 *                       method: "DELETE"
 *                 links:
 *                   - rel: "self"
 *                     href: "/anime-list/34"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list{?page}"
 *                     method: "GET"
 *                   - rel: "anime"
 *                     href: "/anime{?page}"
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
 *                   - rel: "subscribe"
 *                     href: "/webhook/anime-list/{user-id}/subscribe"
 *                     method: "POST"
 *       400:
 *         description: Bad Request - The user-id is not a number.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               badRequest:
 *                 value:
 *                   code: 400
 *                   message: "The user-id parameter must be a number."
 *       404:
 *         description: Anime list not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               NotFoundError:
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
router.get('/:id',
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => checkLoginStatus(req, res, next),
  (req, res, next) => controller.displayAnimeList(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res)
);

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
 *               type: object
 *               properties:
 *                 animeList:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     list:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MinimizedAnime'
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
 *                 animeList:
 *                   username: "Justen79"
 *                   list:
 *                     - animeId: 101
 *                       title: 'Naruto'
 *                       type: 'TV'
 *                       links:
 *                         - rel: 'self'
 *                           href: '/anime/101'
 *                           method: 'GET'
 *                         - rel: 'add-to-list'
 *                           href: '/anime-list/34/anime/101'
 *                           method: 'POST'
 *                     - animeId: 2212
 *                       title: 'Bakemonogatari'
 *                       type: 'TV'
 *                       links:
 *                         - rel: 'self'
 *                           href: '/anime/2212'
 *                           method: 'GET'
 *                         - rel: 'delete-from-list'
 *                           href: '/anime-list/34/anime/2212'
 *                           method: 'DELETE'
 *                   links:
 *                     - rel: "profile"
 *                       href: "/anime-list/34"
 *                       method: "GET"
 *                     - rel: "unsubscribe"
 *                       href: "/webhook/anime-list/34/subscribe"
 *                       method: "DELETE"
 *                 links:
 *                   - rel: "self"
 *                     href: "/anime-list/34"
 *                     method: "GET"
 *                   - rel: "search-anime"
 *                     href: "/anime/search{?title,page}"
 *                     method: "GET"
 *                   - rel: "animelists"
 *                     href: "/anime-list{?page}"
 *                     method: "GET"
 *                   - rel: "anime"
 *                     href: "/anime{?page}"
 *                     method: "GET"
 *                   - rel: "profile"
 *                     href: "/anime-list/34"
 *                     method: "GET"
 *                   - rel: "update-username"
 *                     href: "/user/username"
 *                     method: "PUT"
 *                   - rel: "refresh-login"
 *                     href: "/auth/refresh"
 *                     method: "POST"
 *                   - rel: "subscribe"
 *                     href: "/webhook/anime-list/{user-id}/subscribe"
 *                     method: "POST"
 *       400:
 *         description: Bad Request - The request had invalid parameters or the anime is already in the list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: The anime is already in the list.
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
(req, res, next) => controller.addAnime(req, res, next),
(req, res, next) => generateSelfLink(req, next),
(req, res, next) => generateAlwaysAccessibleLinks(req, next),
(req, res) => generateAuthLinks(req, res)
);

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
 *         name: user-id  # Correcting parameter name for clarity
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
 *       200:  # Updated response code
 *         description: Anime successfully deleted from the anime list. Response includes useful navigation links.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Anime successfully deleted from the list."
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
 *             example:
 *               message: "Anime successfully deleted from the list."
 *               links:
 *                 - rel: "self"
 *                   href: "/anime-list/34/anime/101"
 *                   method: "DELETE"
 *                 - rel: "search-anime"
 *                   href: "/anime/search{?title,page}"
 *                   method: "GET"
 *                 - rel: "animelists"
 *                   href: "/anime-list{?page}"
 *                   method: "GET"
 *                 - rel: "anime"
 *                   href: "/anime{?page}"
 *                   method: "GET"
 *                 - rel: "profile"
 *                   href: "/anime-list/34"
 *                   method: "GET"
 *                 - rel: "update-username"
 *                   href: "/user/username"
 *                   method: "PUT"
 *                 - rel: "refresh-login"
 *                   href: "/auth/refresh"
 *                   method: "POST"
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
  (req, res, next) => controller.deleteAnime(req, res, next),
  (req, res, next) => generateSelfLink(req, next),
  (req, res, next) => generateAlwaysAccessibleLinks(req, next),
  (req, res) => generateAuthLinks(req, res)
);
