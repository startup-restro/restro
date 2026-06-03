import type { FastifyInstance } from 'fastify';
import { eq, and, asc, sql, inArray } from 'drizzle-orm';
import { spaces, tables } from '@restroverse/db';
import { requirePermission } from '../middleware/rbac.js';

// ---------------------------------------------------------------------------
// Shared JSON-Schema fragments
// ---------------------------------------------------------------------------

const spaceSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'string', format: 'uuid' },
    restaurantId: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    sortOrder: { type: 'integer' },
    isActive: { type: 'boolean' },
  },
} as const;

const tableSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'string', format: 'uuid' },
    restaurantId: { type: 'string', format: 'uuid' },
    spaceId: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    capacity: { type: 'integer' },
    shape: { type: 'string' },
    xPos: { type: 'integer' },
    yPos: { type: 'integer' },
    width: { type: 'integer' },
    height: { type: 'integer' },
    status: { type: 'string', enum: ['available', 'occupied', 'reserved', 'cleaning', 'blocked'] },
    currentOrderId: { type: 'string', format: 'uuid', nullable: true },
    occupiedAt: { type: 'string', format: 'date-time', nullable: true },
    serverId: { type: 'string', format: 'uuid', nullable: true },
    qrCode: { type: 'string', nullable: true },
    sortOrder: { type: 'integer' },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

const errorResponse = {
  type: 'object' as const,
  properties: {
    statusCode: { type: 'integer' },
    error: { type: 'string' },
    message: { type: 'string' },
  },
} as const;

// ---------------------------------------------------------------------------
// Valid status transitions for tables
// ---------------------------------------------------------------------------

const STATUS_TRANSITIONS: Record<string, string[]> = {
  available: ['occupied', 'reserved', 'cleaning', 'blocked'],
  occupied: ['available', 'cleaning', 'blocked'],
  reserved: ['available', 'occupied', 'blocked'],
  cleaning: ['available', 'blocked'],
  blocked: ['available'],
};

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * Fastify plugin that registers all table and space management routes.
 *
 * **Spaces** provide a logical grouping (e.g. "Patio", "Main Hall") while
 * **Tables** represent physical seating positions with floor-plan coordinates,
 * real-time status tracking, and support for merge / split / transfer
 * operations common in restaurant POS systems.
 *
 * Every route is protected by `fastify.authenticate` (JWT) and fine-grained
 * RBAC via `requirePermission`.
 */
async function tableRoutes(fastify: FastifyInstance) {
  const db = fastify.db;

  // =========================================================================
  //  SPACE ROUTES
  // =========================================================================

  // ─── 1. GET /spaces ─────────────────────────────────────────────────────

  /**
   * Lists all spaces belonging to the authenticated user's restaurant,
   * ordered by `sortOrder` ascending.
   */
  fastify.get(
    '/spaces',
    {
      preHandler: [fastify.authenticate, requirePermission('table:view')],
      schema: {
        tags: ['Tables'],
        summary: 'List all spaces',
        description:
          'Returns all spaces (e.g. "Main Hall", "Patio") for the current restaurant, sorted by sortOrder.',
        response: {
          200: { type: 'array', items: spaceSchema },
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;

      const rows = await db
        .select()
        .from(spaces)
        .where(eq(spaces.restaurantId, restaurantId))
        .orderBy(asc(spaces.sortOrder));

      return reply.send(rows);
    },
  );

  // ─── 2. POST /spaces ───────────────────────────────────────────────────

  /**
   * Creates a new space within the restaurant. If `sortOrder` is omitted it
   * defaults to 0.
   */
  fastify.post(
    '/spaces',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Create a space',
        description:
          'Creates a new logical space (floor / area) for the restaurant. Tables can then be assigned to it.',
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            sortOrder: { type: 'integer', minimum: 0, default: 0 },
          },
        },
        response: {
          201: spaceSchema,
          400: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const body = request.body as { name: string; sortOrder?: number };

      const [space] = await db
        .insert(spaces)
        .values({
          restaurantId,
          name: body.name,
          sortOrder: body.sortOrder ?? 0,
        })
        .returning();

      return reply.status(201).send(space);
    },
  );

  // ─── 3. PUT /spaces/:id ────────────────────────────────────────────────

  /**
   * Partially updates a space. Only the fields provided in the request body
   * are changed; the rest remain untouched.
   */
  fastify.put(
    '/spaces/:id',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Update a space',
        description: 'Partially updates a space name, sortOrder, or isActive flag.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            sortOrder: { type: 'integer', minimum: 0 },
            isActive: { type: 'boolean' },
          },
        },
        response: {
          200: spaceSchema,
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id } = request.params as { id: string };
      const body = request.body as { name?: string; sortOrder?: number; isActive?: boolean };

      // Verify ownership
      const [existing] = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.id, id), eq(spaces.restaurantId, restaurantId)));

      if (!existing) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Space not found' });
      }

      const updates: Record<string, unknown> = {};
      if (body.name !== undefined) updates.name = body.name;
      if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
      if (body.isActive !== undefined) updates.isActive = body.isActive;

      if (Object.keys(updates).length === 0) {
        return reply.send(existing);
      }

      const [updated] = await db
        .update(spaces)
        .set(updates)
        .where(eq(spaces.id, id))
        .returning();

      return reply.send(updated);
    },
  );

  // ─── 4. DELETE /spaces/:id ─────────────────────────────────────────────

  /**
   * Deletes a space only if it contains no tables. This prevents orphaned
   * table records and accidental data loss.
   */
  fastify.delete(
    '/spaces/:id',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Delete a space',
        description:
          'Permanently deletes a space. Fails with 409 if any tables still belong to it.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          200: {
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          404: errorResponse,
          409: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id } = request.params as { id: string };

      // Verify ownership
      const [existing] = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.id, id), eq(spaces.restaurantId, restaurantId)));

      if (!existing) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Space not found' });
      }

      // Ensure no tables reference this space
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(tables)
        .where(eq(tables.spaceId, id));

      if (Number(count) > 0) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: `Cannot delete space: ${count} table(s) still belong to it. Move or delete them first.`,
        });
      }

      await db.delete(spaces).where(eq(spaces.id, id));

      return reply.send({ message: 'Space deleted' });
    },
  );

  // =========================================================================
  //  TABLE ROUTES
  // =========================================================================

  // ─── 5. GET /tables ─────────────────────────────────────────────────────

  /**
   * Lists all tables for the restaurant, optionally filtered by spaceId.
   * Results are sorted by spaceId then sortOrder for a natural floor-plan
   * grouping.
   */
  fastify.get(
    '/tables',
    {
      preHandler: [fastify.authenticate, requirePermission('table:view')],
      schema: {
        tags: ['Tables'],
        summary: 'List all tables',
        description:
          'Returns all tables for the restaurant. Optionally filter by spaceId via query parameter. ' +
          'Occupied tables include their current order ID.',
        querystring: {
          type: 'object',
          properties: {
            spaceId: { type: 'string', format: 'uuid', description: 'Filter by space' },
          },
        },
        response: {
          200: { type: 'array', items: tableSchema },
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const query = request.query as { spaceId?: string };

      const conditions = [eq(tables.restaurantId, restaurantId)];
      if (query.spaceId) {
        conditions.push(eq(tables.spaceId, query.spaceId));
      }

      const rows = await db
        .select()
        .from(tables)
        .where(and(...conditions))
        .orderBy(asc(tables.spaceId), asc(tables.sortOrder));

      return reply.send(rows);
    },
  );

  // ─── 6. POST /tables ───────────────────────────────────────────────────

  /**
   * Creates a new table in a given space. Sensible defaults are applied for
   * optional fields (capacity=4, shape="square", position at origin, etc.).
   */
  fastify.post(
    '/tables',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Create a table',
        description:
          'Creates a new table within a space. Provide floor-plan coordinates and sizing for the visual layout editor.',
        body: {
          type: 'object',
          required: ['name', 'spaceId'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 50 },
            spaceId: { type: 'string', format: 'uuid' },
            capacity: { type: 'integer', minimum: 1, default: 4 },
            shape: { type: 'string', enum: ['square', 'round', 'rectangle'], default: 'square' },
            xPos: { type: 'integer', minimum: 0, default: 0 },
            yPos: { type: 'integer', minimum: 0, default: 0 },
            width: { type: 'integer', minimum: 1, default: 1 },
            height: { type: 'integer', minimum: 1, default: 1 },
          },
        },
        response: {
          201: tableSchema,
          400: errorResponse,
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const body = request.body as {
        name: string;
        spaceId: string;
        capacity?: number;
        shape?: string;
        xPos?: number;
        yPos?: number;
        width?: number;
        height?: number;
      };

      // Verify the space exists and belongs to this restaurant
      const [space] = await db
        .select()
        .from(spaces)
        .where(and(eq(spaces.id, body.spaceId), eq(spaces.restaurantId, restaurantId)));

      if (!space) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Space not found' });
      }

      const [table] = await db
        .insert(tables)
        .values({
          restaurantId,
          spaceId: body.spaceId,
          name: body.name,
          capacity: body.capacity ?? 4,
          shape: body.shape ?? 'square',
          xPos: body.xPos ?? 0,
          yPos: body.yPos ?? 0,
          width: body.width ?? 1,
          height: body.height ?? 1,
        })
        .returning();

      return reply.status(201).send(table);
    },
  );

  // ─── 7. PUT /tables/:id ────────────────────────────────────────────────

  /**
   * Partially updates table metadata such as name, capacity, visual layout
   * properties, sortOrder, or the isActive flag. Does NOT update status;
   * use PUT /tables/:id/status for status transitions.
   */
  fastify.put(
    '/tables/:id',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Update a table',
        description:
          'Partially updates table metadata (name, capacity, layout, sortOrder, isActive). ' +
          'Use PUT /tables/:id/status for status changes.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 50 },
            capacity: { type: 'integer', minimum: 1 },
            shape: { type: 'string', enum: ['square', 'round', 'rectangle'] },
            xPos: { type: 'integer', minimum: 0 },
            yPos: { type: 'integer', minimum: 0 },
            width: { type: 'integer', minimum: 1 },
            height: { type: 'integer', minimum: 1 },
            sortOrder: { type: 'integer', minimum: 0 },
            isActive: { type: 'boolean' },
          },
        },
        response: {
          200: tableSchema,
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id } = request.params as { id: string };
      const body = request.body as {
        name?: string;
        capacity?: number;
        shape?: string;
        xPos?: number;
        yPos?: number;
        width?: number;
        height?: number;
        sortOrder?: number;
        isActive?: boolean;
      };

      // Verify ownership
      const [existing] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.id, id), eq(tables.restaurantId, restaurantId)));

      if (!existing) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Table not found' });
      }

      const updates: Record<string, unknown> = {};
      if (body.name !== undefined) updates.name = body.name;
      if (body.capacity !== undefined) updates.capacity = body.capacity;
      if (body.shape !== undefined) updates.shape = body.shape;
      if (body.xPos !== undefined) updates.xPos = body.xPos;
      if (body.yPos !== undefined) updates.yPos = body.yPos;
      if (body.width !== undefined) updates.width = body.width;
      if (body.height !== undefined) updates.height = body.height;
      if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
      if (body.isActive !== undefined) updates.isActive = body.isActive;

      if (Object.keys(updates).length === 0) {
        return reply.send(existing);
      }

      updates.updatedAt = new Date();

      const [updated] = await db
        .update(tables)
        .set(updates)
        .where(eq(tables.id, id))
        .returning();

      return reply.send(updated);
    },
  );

  // ─── 8. DELETE /tables/:id ─────────────────────────────────────────────

  /**
   * Permanently deletes a table. Only allowed when the table is 'available'
   * and has no active order, preventing accidental deletion of in-use tables.
   */
  fastify.delete(
    '/tables/:id',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Delete a table',
        description:
          'Permanently deletes a table. Only succeeds if the table status is "available" and it has no current order.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          200: {
            type: 'object',
            properties: { message: { type: 'string' } },
          },
          404: errorResponse,
          409: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id } = request.params as { id: string };

      const [existing] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.id, id), eq(tables.restaurantId, restaurantId)));

      if (!existing) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Table not found' });
      }

      if (existing.status !== 'available') {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: `Cannot delete table in "${existing.status}" status. Set it to "available" first.`,
        });
      }

      if (existing.currentOrderId) {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: 'Cannot delete table with an active order. Complete or cancel the order first.',
        });
      }

      await db.delete(tables).where(eq(tables.id, id));

      return reply.send({ message: 'Table deleted' });
    },
  );

  // ─── 9. PUT /tables/:id/status ─────────────────────────────────────────

  /**
   * Transitions a table between statuses. Valid transitions are enforced
   * according to `STATUS_TRANSITIONS`. For example, a 'blocked' table can
   * only go back to 'available'.
   *
   * When transitioning to 'occupied', `occupiedAt` is auto-set. When
   * transitioning to 'available', order and server references are cleared.
   */
  fastify.put(
    '/tables/:id/status',
    {
      preHandler: [fastify.authenticate, requirePermission('table:view')],
      schema: {
        tags: ['Tables'],
        summary: 'Update table status',
        description:
          'Transitions a table to a new status. Status transitions are validated against ' +
          'an allowed transition map. Automatically manages occupiedAt, currentOrderId, and serverId fields.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: ['available', 'occupied', 'reserved', 'cleaning', 'blocked'],
            },
          },
        },
        response: {
          200: tableSchema,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id } = request.params as { id: string };
      const { status: newStatus } = request.body as { status: string };

      const [table] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.id, id), eq(tables.restaurantId, restaurantId)));

      if (!table) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Table not found' });
      }

      // Validate transition
      const allowed = STATUS_TRANSITIONS[table.status] ?? [];
      if (!allowed.includes(newStatus)) {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: `Cannot transition table from "${table.status}" to "${newStatus}"`,
        });
      }

      const updates: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date(),
      };

      // Auto-manage associated fields
      if (newStatus === 'occupied') {
        updates.occupiedAt = new Date();
      }
      if (newStatus === 'available') {
        updates.currentOrderId = null;
        updates.occupiedAt = null;
        updates.serverId = null;
      }

      const [updated] = await db
        .update(tables)
        .set(updates)
        .where(eq(tables.id, id))
        .returning();

      return reply.send(updated);
    },
  );

  // ─── 10. POST /tables/merge ─────────────────────────────────────────────

  /**
   * Merges multiple tables into a logical group. The `primaryId` table
   * becomes the host (set to 'occupied') and all secondary tables are marked
   * as 'blocked'. Their `currentOrderId` is linked to the primary table's
   * order so they can be split back later.
   *
   * Requirements:
   *  - All tables must belong to the same restaurant.
   *  - Secondary tables must be in 'available' status.
   *  - `primaryId` must be one of the `tableIds`.
   */
  fastify.post(
    '/tables/merge',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Merge tables',
        description:
          'Merges multiple tables into a group. The primary table is set to "occupied" and all ' +
          'secondary tables are marked "blocked". Secondary tables reference the primary table\'s ' +
          'order so they can be unmerged later via POST /tables/split.',
        body: {
          type: 'object',
          required: ['tableIds', 'primaryId'],
          properties: {
            tableIds: {
              type: 'array',
              minItems: 2,
              items: { type: 'string', format: 'uuid' },
              description: 'All table IDs to merge (must include primaryId)',
            },
            primaryId: {
              type: 'string',
              format: 'uuid',
              description: 'The table that becomes the host of the merged group',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              primary: tableSchema,
              blocked: { type: 'array', items: tableSchema },
            },
          },
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { tableIds, primaryId } = request.body as {
        tableIds: string[];
        primaryId: string;
      };

      // Validate primaryId is in the list
      if (!tableIds.includes(primaryId)) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'primaryId must be included in tableIds',
        });
      }

      // Fetch all referenced tables
      const allTables = await db
        .select()
        .from(tables)
        .where(
          and(
            inArray(tables.id, tableIds),
            eq(tables.restaurantId, restaurantId),
          ),
        );

      if (allTables.length !== tableIds.length) {
        return reply.status(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: 'One or more tables not found or do not belong to this restaurant',
        });
      }

      // Secondary tables must be available
      const secondaryIds = tableIds.filter((id) => id !== primaryId);
      const secondaryTables = allTables.filter((t: any) => t.id !== primaryId);

      for (const t of secondaryTables) {
        if ((t as any).status !== 'available') {
          return reply.status(422).send({
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: `Table "${(t as any).name}" must be "available" to merge (current: "${(t as any).status}")`,
          });
        }
      }

      const primaryTable = allTables.find((t: any) => t.id === primaryId)!;
      const now = new Date();

      const result = await db.transaction(async (tx: any) => {
        // Mark primary as occupied
        const [updatedPrimary] = await tx
          .update(tables)
          .set({
            status: 'occupied',
            occupiedAt: (primaryTable as any).occupiedAt ?? now,
            updatedAt: now,
          })
          .where(eq(tables.id, primaryId))
          .returning();

        // Block secondary tables and link them to the primary's order
        const blockedRows = await tx
          .update(tables)
          .set({
            status: 'blocked',
            currentOrderId: (primaryTable as any).currentOrderId ?? null,
            updatedAt: now,
          })
          .where(inArray(tables.id, secondaryIds))
          .returning();

        return { primary: updatedPrimary, blocked: blockedRows };
      });

      return reply.send(result);
    },
  );

  // ─── 11. POST /tables/split ─────────────────────────────────────────────

  /**
   * Reverses a merge operation. All 'blocked' tables that share the same
   * `currentOrderId` as the given table are released back to 'available'.
   * The source table remains in its current state.
   */
  fastify.post(
    '/tables/split',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Split merged tables',
        description:
          'Reverses a table merge. All "blocked" tables linked to the same order as the given ' +
          'table are set back to "available" with cleared order and server references.',
        body: {
          type: 'object',
          required: ['tableId'],
          properties: {
            tableId: {
              type: 'string',
              format: 'uuid',
              description: 'The primary table ID that was used during merge',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              released: { type: 'array', items: tableSchema },
            },
          },
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { tableId } = request.body as { tableId: string };

      const [primaryTable] = await db
        .select()
        .from(tables)
        .where(and(eq(tables.id, tableId), eq(tables.restaurantId, restaurantId)));

      if (!primaryTable) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Table not found' });
      }

      // Find blocked tables linked to the same order, or simply all blocked
      // tables that reference this table's order
      const conditions = [
        eq(tables.restaurantId, restaurantId),
        eq(tables.status, 'blocked' as any),
      ];

      // If the primary has an order, match by order; otherwise there's
      // nothing to split
      if (!(primaryTable as any).currentOrderId) {
        // Fallback: no order link, nothing blocked to release
        return reply.send({ released: [] });
      }

      conditions.push(eq(tables.currentOrderId, (primaryTable as any).currentOrderId));

      const now = new Date();

      const released = await db
        .update(tables)
        .set({
          status: 'available',
          currentOrderId: null,
          occupiedAt: null,
          serverId: null,
          updatedAt: now,
        })
        .where(and(...conditions))
        .returning();

      return reply.send({ released });
    },
  );

  // ─── 12. POST /tables/:id/transfer ─────────────────────────────────────

  /**
   * Transfers the current order and occupancy from one table to another.
   * The source table is set to 'available' and the destination table becomes
   * 'occupied' with the transferred order. The destination must be in
   * 'available' status.
   */
  fastify.post(
    '/tables/:id/transfer',
    {
      preHandler: [fastify.authenticate, requirePermission('table:manage')],
      schema: {
        tags: ['Tables'],
        summary: 'Transfer to another table',
        description:
          'Moves the current order, server, and occupancy from the source table to a destination table. ' +
          'The source table is reset to "available" and the destination is marked "occupied".',
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Source table ID (the table to transfer FROM)',
            },
          },
        },
        body: {
          type: 'object',
          required: ['toTableId'],
          properties: {
            toTableId: {
              type: 'string',
              format: 'uuid',
              description: 'Destination table ID (the table to transfer TO)',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              from: tableSchema,
              to: tableSchema,
            },
          },
          404: errorResponse,
          400: errorResponse,
          409: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { restaurantId } = request.user;
      const { id: fromId } = request.params as { id: string };
      const { toTableId } = request.body as { toTableId: string };

      if (fromId === toTableId) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Source and destination table cannot be the same',
        });
      }

      // Fetch both tables in parallel
      const [sourceRows, destRows] = await Promise.all([
        db
          .select()
          .from(tables)
          .where(and(eq(tables.id, fromId), eq(tables.restaurantId, restaurantId))),
        db
          .select()
          .from(tables)
          .where(and(eq(tables.id, toTableId), eq(tables.restaurantId, restaurantId))),
      ]);

      const source = sourceRows[0] as any;
      const dest = destRows[0] as any;

      if (!source) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Source table not found' });
      }
      if (!dest) {
        return reply
          .status(404)
          .send({ statusCode: 404, error: 'Not Found', message: 'Destination table not found' });
      }

      if (source.status !== 'occupied') {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: `Source table must be "occupied" to transfer (current: "${source.status}")`,
        });
      }

      if (dest.status !== 'available') {
        return reply.status(409).send({
          statusCode: 409,
          error: 'Conflict',
          message: `Destination table must be "available" to receive a transfer (current: "${dest.status}")`,
        });
      }

      const now = new Date();

      const result = await db.transaction(async (tx: any) => {
        // Move order + server to destination
        const [updatedDest] = await tx
          .update(tables)
          .set({
            status: 'occupied',
            currentOrderId: source.currentOrderId,
            occupiedAt: source.occupiedAt ?? now,
            serverId: source.serverId,
            updatedAt: now,
          })
          .where(eq(tables.id, toTableId))
          .returning();

        // Clear source table
        const [updatedSource] = await tx
          .update(tables)
          .set({
            status: 'available',
            currentOrderId: null,
            occupiedAt: null,
            serverId: null,
            updatedAt: now,
          })
          .where(eq(tables.id, fromId))
          .returning();

        return { from: updatedSource, to: updatedDest };
      });

      return reply.send(result);
    },
  );
}

export default tableRoutes;
