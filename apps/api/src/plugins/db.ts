import fp from 'fastify-plugin';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@restroverse/db/schema';
import { env } from '../config/env.js';

export default fp(
  async (fastify) => {
    const sql = postgres(env.DATABASE_URL, {
      max: 20,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    const db = drizzle(sql, { schema });

    // Verify connection
    await sql`SELECT 1`;
    fastify.log.info('Database connected');

    fastify.decorate('db', db);
    fastify.decorate('sql', sql);

    fastify.addHook('onClose', async () => {
      fastify.log.info('Closing database connection');
      await sql.end();
    });
  },
  { name: 'db' },
);
