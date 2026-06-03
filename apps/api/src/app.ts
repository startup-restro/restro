import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env.js';
import dbPlugin from './plugins/db.js';
import redisPlugin from './plugins/redis.js';
import jwtPlugin from './plugins/jwt.js';
import authRoutes from './routes/auth.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
    },
  });

  // ── Core plugins ───────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Database & Redis
  await app.register(dbPlugin);
  await app.register(redisPlugin);

  // JWT (depends on db)
  await app.register(jwtPlugin);

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis: app.redis,
  });

  // ── Routes ─────────────────────────────────────────────────────────────────

  // Health check
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

  // Auth routes
  await app.register(authRoutes, { prefix: '/auth' });

  return app;
}
