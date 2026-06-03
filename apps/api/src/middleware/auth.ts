import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';
import { sql } from 'drizzle-orm';

/**
 * Authentication preHandler that:
 * 1. Verifies JWT (via fastify.authenticate)
 * 2. Sets RLS context on the database connection
 */
export function authenticate(): preHandlerHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Verify JWT and populate request.user
    await request.server.authenticate(request, reply);

    // If authenticate already sent a response (401), don't proceed
    if (reply.sent) return;

    const user = request.user;
    if (!user?.restaurantId) return;

    // Set RLS context for this request
    await setRlsContext(request, user.restaurantId);
  };
}

/**
 * Sets the RLS context variables on the current DB connection.
 * This enables row-level security policies to filter by restaurant.
 */
export async function setRlsContext(
  request: FastifyRequest,
  restaurantId: string,
  bypassRls = false,
): Promise<void> {
  const db = request.server.db;

  await db.execute(sql`SET LOCAL app.restaurant_id = ${restaurantId}`);

  if (bypassRls) {
    await db.execute(sql`SET LOCAL app.bypass_rls = 'true'`);
  }
}
