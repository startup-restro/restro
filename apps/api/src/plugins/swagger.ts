import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export default fp(async function swaggerPlugin(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'RestroVerse API',
        description: 'Offline-first Restaurant POS API for Nepal/South Asia',
        version: '0.1.0',
      },
      servers: [{ url: 'http://localhost:3001' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication & authorization' },
        { name: 'Restaurants', description: 'Restaurant management' },
        { name: 'Menu', description: 'Menu categories, items, variants & modifiers' },
        { name: 'Orders', description: 'Order lifecycle' },
        { name: 'Tables', description: 'Table & space management' },
        { name: 'Kitchen', description: 'Kitchen display & ticket management' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
});
