import swaggerAutoGen from 'swagger-autogen';

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
      }
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/router.ts'];

swaggerAutoGen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
