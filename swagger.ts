import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
export const initSwagger = () => {
  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Anime API',
        version: '0.0.0',
        description: 'API for creating and fetching anime and adding to anime list',
        servers: [{ url: 'http://localhost:3000' }]
      }
    },
    components: {
      schemas: {
        User: {
          $username: 'BetusTestus',
          $password: 'supersecretturbopassword',
          $email: 'betaTester@testing.com'
        },
        Error: {
          $message: 'The error message given',
          $status: 'The status code of the error'
        }
      }
    },
    apis: ['./src/routes/**/*.ts']
  };
  return swaggerJSDoc(options);
};

/* import swaggerAutoGen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Anime API',
    description: 'API for creating and fetching anime and adding to anime list'
  },
  host: 'localhost:3000',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    },
    schemas: {
      User: {
        $username: 'BetusTestus',
        $password: 'supersecretturbopassword',
        $email: 'betaTester@testing.com'
      },
      UserLogin: {
        $email: 'betaTester@testing.com',
        $password: 'supersecretturbopassword'
      },
      Tokens: {
        $accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        $refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      },
      Error: {
        $message: 'The error message given',
        $status: 'The status code of the error'
      },
      Token: {
        $refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      },
      Anime: {
        $title: 'Oshi no Ko',
        $type: 'TV',
        $episodes: 11,
        $status: 'FINISHED',
        $animeSeason: {
          $season: 'SPRING',
          $year: 2023
        },
        $synonyms: ['Oshi no Ko', 'My Idol\'s Child', 'My Star'],
        $relatedAnime: ['https://anidb.net/anime/14111', 'https://anidb.net/anime/18022', 'https://anilist.co/anime/166531'],
        $tags: ['Drama', 'Romance', 'Slice of Life', 'acting', 'idol', 'female protagonist'],
        $animeId: 19,
        broadcast: {
          $day: 'Saturday',
          $time: '23:00',
          $timezone: 'JST',
          $string: 'Saturdays at 23:00 (JST)'
        }
      }
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/router.ts'];

swaggerAutoGen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
*/
