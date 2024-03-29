import swaggerJSDoc from 'swagger-jsdoc';

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
