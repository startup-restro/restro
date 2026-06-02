import Fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  // Register plugins
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Health check route
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  });

  // API root
  app.get('/', async () => {
    return {
      name: 'RestroVerse API',
      version: '0.1.0',
    };
  });

  return app;
}
