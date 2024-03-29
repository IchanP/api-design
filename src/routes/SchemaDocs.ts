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
 *         - links
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
 *         links:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - rel
 *               - href
 *               - method
 *             properties:
 *               rel:
 *                 type: string
 *                 description: The relationship of the link to the current resource.
 *                 example: 'add-to-list'
 *               href:
 *                 type: string
 *                 description: The relative link to the resource.
 *                 example: '/anime-list/1/anime/101'
 *               method:
 *                 type: string
 *                 description: The HTTP method used to access the resource.
 *                 example: 'POST'
 *     MinimizedAnime:
 *       type: object
 *       required:
 *         - animeId
 *         - title
 *         - type
 *         - links
 *       properties:
 *         animeId:
 *           type: integer
 *           description: The unique identifier for the anime
 *           example: 101
 *         title:
 *           type: string
 *           description: The title of the anime
 *           example: 'Naruto'
 *         type:
 *           type: string
 *           description: The type of the anime (e.g., TV, Movie, OVA)
 *           example: 'TV'
 *         links:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - rel
 *               - href
 *               - method
 *             properties:
 *               rel:
 *                 type: string
 *                 description: The relationship of the link to the current resource.
 *                 example: 'add-to-list'
 *               href:
 *                 type: string
 *                 description: The relative link to the resource.
 *                 example: '/anime-list/1/anime/101'
 *               method:
 *                 type: string
 *                 description: The HTTP method used to access the resource.
 *                 example: 'POST'
 *     AnimeList:
 *       type: object
 *       required:
 *         - userId
 *         - username
 *         - list
 *         - links
 *       properties:
 *         userId:
 *           type: integer
 *           description: The unique identifier for the owner of the anime list.
 *           example: 1
 *         username:
 *           type: string
 *           description: The username of the owner of the anime list.
 *           example: 'AnimeFan123'
 *         list:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MinimizedAnime'
 *           description: A list of minimized anime objects.
 *         links:
 *           $ref: '#/components/schemas/Links'
 *     Links:
 *       type: array
 *       items:
 *         type: object
 *         required:
 *           - rel
 *           - href
 *           - method
 *         properties:
 *           rel:
 *             type: string
 *             description: The relationship of the link to the current resource.
 *             example: 'subscribe'
 *           href:
 *             type: string
 *             description: The relative link to the resource.
 *             example: '/webhook/anime-list/1/subscribe'
 *           method:
 *             type: string
 *             description: The HTTP method used to access the resource.
 *             example: 'POST'
 *     WebhookPayload:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *           description: Unique identifier for the event.
 *         eventType:
 *           type: string
 *           description: The type of event that triggered the webhook.
 *         data:
 *           type: object
 *           properties:
 *             itemId:
 *               type: string
 *               description: Unique identifier for the new item.
 *             itemName:
 *               type: string
 *               description: Name of the new item added.
 *             itemDescription:
 *               type: string
 *               description: Description of the new item.
 *           description: Details about the item that was added.
 *       description: Payload sent to the callback URL when a new item is added.
 */