import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'wajbakit_proto API',
      version: '1.0.0',
      description: 'wajbakit_proto — A production-ready MERN stack REST API',
    },
    servers: [{ url: '/api/v1', description: 'API v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
