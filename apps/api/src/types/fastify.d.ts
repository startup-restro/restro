import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type * as schema from '@restroverse/db/schema';
import type Redis from 'ioredis';
import type { Sql } from 'postgres';

declare module 'fastify' {
  interface FastifyInstance {
    db: PostgresJsDatabase<typeof schema>;
    sql: Sql;
    redis: Redis;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
  interface FastifyRequest {
    user?: {
      userId: string;
      restaurantId: string;
      role: string;
      deviceId?: string;
    };
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      restaurantId: string;
      role: string;
      deviceId?: string;
    };
  }
}
