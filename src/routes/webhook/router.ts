import express from 'express';
import { container } from '../../config/inversify.config.ts';
import { TYPES } from '../../config/types.ts';
import { AnimeListController } from 'controller/AnimeListController.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';
import { validateId } from 'service/ValidatorUtil.ts';

const controller = container.get<AnimeListController>(TYPES.AnimeListController);
export const router = express.Router();

/**
 * @swagger
 * webhook/anime-list/{user-id}:
 *   get:
 *     tags:
 *       - webhook
 *     summary: Check subscription status for an Anime List
 *     description: Returns the subscription status and callback URL for the specified anime list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list.
 *       - in: header
 *         name: Bearer
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subscribed:
 *                   type: boolean
 *                   description: Indicates whether the user is subscribed to the anime list.
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: The callback URL for the subscription.
 *             examples:
 *               subscriptionStatus:
 *                 value:
 *                   subscribed: true
 *                   url: "http://localhost:3000/callback-url"
 *       400:
 *         description: Bad Request - The provided ID is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidId:
 *                 value:
 *                   code: 400
 *                   message: "Invalid ID provided."
 *       401:
 *         description: Unauthorized - JWT is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   code: 401
 *                   message: "Unauthorized - JWT is invalid."
 *       404:
 *         description: Anime list not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   code: 404
 *                   message: "Anime list not found."
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
router.get('/anime-list/:id',
  (req, res, next) => validateAuthScheme(req, res, next),
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => controller.showSubscription(req, res, next));

/**
 * @swagger
 * webhook/anime-list/{user-id}/subscribe:
 *   post:
 *     tags:
 *       - webhook
 *     summary: Subscribe to an Anime List
 *     description: Allows a user to subscribe to an anime list by its ID. User will be notified whenever an anime is added to the list.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list to subscribe to.
 *       - in: header
 *         name: Bearer
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - secret
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The callback URL for the subscription.
 *               secret:
 *                 type: string
 *                 description: A secret key for verifying the subscription.
 *     responses:
 *       201:
 *         description: Successfully subscribed to the anime list.
 *       400:
 *         description: Bad Request - Missing or invalid 'url', 'id' or 'secret'.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidRequest:
 *                 value:
 *                   code: 400
 *                   message: "Invalid 'url' or 'secret'. All fields are required and must be valid."
 *       401:
 *         description: Unauthorized - JWT is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   code: 401
 *                   message: "Unauthorized - JWT is invalid."
 *       404:
 *         description: Anime list not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   code: 404
 *                   message: "Anime list not found."
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
router.post('/anime-list/:id/subscribe',
  (req, res, next) => validateAuthScheme(req, res, next),
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => controller.subcribeToList(req, res, next));

/**
 * @swagger
 * /anime-list/{user-id}/subscribe:
 *   delete:
 *     tags:
 *       - webhook
 *     summary: Unsubscribe from an Anime List
 *     description: Removes the subscription from an anime list by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the anime list to unsubscribe from.
 *       - in: header
 *         name: Bearer
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token for authorization.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The callback URL that will be removed from the subscription.
 *     responses:
 *       204:
 *         description: Successfully unsubscribed from the anime list. No content returned.
 *       400:
 *         description: Bad Request - The provided ID or URL is faulty.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalidInput:
 *                 value:
 *                   code: 400
 *                   message: "Invalid 'url' or 'secret'. All fields are required and must be valid."
 *       401:
 *         description: Unauthorized - JWT Bearer token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               unauthorized:
 *                 value:
 *                   code: 401
 *                   message: "Unauthorized - JWT Bearer token is invalid."
 *       404:
 *         description: Not Found - The ID or URL cannot be found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               notFound:
 *                 value:
 *                   code: 404
 *                   message: "The ID or URL cannot be found."
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
router.delete('/anime-list/:id/subscribe',
  (req, res, next) => validateAuthScheme(req, res, next),
  (req, res, next) => validateId(req.params.id, res, next),
  (req, res, next) => controller.unSubscribeFromList(req, res, next));
