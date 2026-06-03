import fp from 'fastify-plugin';
import Redis from 'ioredis';
import { env } from '../config/env.js';

export default fp(
  async (fastify) => {
    const redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    await new Promise<void>((resolve, reject) => {
      redis.on('connect', () => {
        fastify.log.info('Redis connected');
        resolve();
      });
      redis.on('error', (err) => {
        fastify.log.error({ err }, 'Redis connection error');
        reject(err);
      });
    });

    fastify.decorate('redis', redis);

    fastify.addHook('onClose', async () => {
      fastify.log.info('Closing Redis connection');
      await redis.quit();
    });
  },
  { name: 'redis' },
);
