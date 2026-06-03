import type { FastifyInstance } from 'fastify';
import { eq, and, sql, desc, asc, ne, gte, lte, count, inArray } from 'drizzle-orm';
import { kitchenTickets, orders, orderItems, tables } from '@restroverse/db';
import { requirePermission } from '../middleware/rbac.js';

// ---------------------------------------------------------------------------
// Status transition map for KOT tickets
// ---------------------------------------------------------------------------
const NEXT_STATUS: Record<string, string> = {
  pending: 'cooking',
  cooking: 'ready',
  ready: 'served',
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['cooking', 'cancelled'],
  cooking: ['ready', 'cancelled'],
  ready: ['served', 'cancelled'],
};

// ---------------------------------------------------------------------------
// Shared JSON-Schema fragments
// ---------------------------------------------------------------------------

const ticketResponse = {
  type: 'object' as const,
  properties: {
    id: { type: 'string' },
    orderId: { type: 'string' },
    restaurantId: { type: 'string' },
    ticketNumber: { type: 'number' },
    station: { type: 'string' },
    items: { type: 'array' },
    status: { type: 'string' },
    priority: { type: 'string' },
    createdAt: { type: 'string' },
    startedAt: { type: 'string', nullable: true },
    completedAt: { type: 'string', nullable: true },
    prepTimeSecs: { type: 'number', nullable: true },
    createdBy: { type: 'string', nullable: true },
    completedBy: { type: 'string', nullable: true },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Kitchen Routes Plugin
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Kitchen Display System (KDS) API routes.
 *
 * Manages kitchen tickets (KOT), status transitions, bump workflow,
 * and kitchen performance analytics.
 */
async function kitchenRoutes(fastify: FastifyInstance) {
  // All kitchen routes require authentication
  fastify.addHook('preHandler', fastify.authenticate);

  // ── GET /kitchen/tickets ──────────────────────────────────────────────────
  /**
   * List kitchen tickets for the restaurant.
   *
   * Supports filtering by station, status, and date range.
   * Results are ordered by priority (rush first), then oldest first
   * so kitchen staff work on the most urgent/oldest orders.
   */
  fastify.get<{
    Querystring: {
      station?: string;
      status?: string;
      from?: string;
      limit?: string;
    };
  }>(
    '/tickets',
    {
      preHandler: [requirePermission('kitchen:view')],
      schema: {
        tags: ['Kitchen'],
        summary: 'List kitchen tickets',
        description:
          'Fetch kitchen tickets filtered by station, status, and date. Sorted by priority (rush first) then oldest first.',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            station: {
              type: 'string',
              description: 'Filter by kitchen station (e.g., main, bar, grill)',
            },
            status: {
              type: 'string',
              enum: ['pending', 'cooking', 'ready', 'served', 'cancelled'],
              description: 'Filter by ticket status',
            },
            from: {
              type: 'string',
              format: 'date',
              description: 'Only tickets created on or after this date (ISO)',
            },
            limit: {
              type: 'string',
              default: '50',
              description: 'Max tickets to return',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              tickets: { type: 'array', items: ticketResponse },
            },
          },
        },
      },
    },
    async (request) => {
      const { station, status, from, limit = '50' } = request.query;
      const restaurantId = request.user!.restaurantId;

      // Set RLS context
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      const conditions: ReturnType<typeof eq>[] = [
        eq(kitchenTickets.restaurantId, restaurantId),
      ];

      if (station) {
        conditions.push(eq(kitchenTickets.station, station));
      }
      if (status) {
        conditions.push(
          eq(kitchenTickets.status, status as 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled'),
        );
      }
      if (from) {
        conditions.push(gte(kitchenTickets.createdAt, new Date(from)));
      }

      const tickets = await fastify.db
        .select({
          id: kitchenTickets.id,
          orderId: kitchenTickets.orderId,
          restaurantId: kitchenTickets.restaurantId,
          ticketNumber: kitchenTickets.ticketNumber,
          station: kitchenTickets.station,
          items: kitchenTickets.items,
          status: kitchenTickets.status,
          priority: kitchenTickets.priority,
          createdAt: kitchenTickets.createdAt,
          startedAt: kitchenTickets.startedAt,
          completedAt: kitchenTickets.completedAt,
          prepTimeSecs: kitchenTickets.prepTimeSecs,
          createdBy: kitchenTickets.createdBy,
          completedBy: kitchenTickets.completedBy,
          // Join order info
          orderNumber: orders.orderNumber,
          orderType: orders.type,
          tableId: orders.tableId,
          orderNotes: orders.notes,
        })
        .from(kitchenTickets)
        .innerJoin(orders, eq(orders.id, kitchenTickets.orderId))
        .where(and(...conditions))
        .orderBy(
          // Rush priority first
          sql`CASE WHEN ${kitchenTickets.priority} = 'rush' THEN 0 WHEN ${kitchenTickets.priority} = 'vip' THEN 1 ELSE 2 END`,
          asc(kitchenTickets.createdAt),
        )
        .limit(parseInt(limit, 10));

      return { tickets };
    },
  );

  // ── GET /kitchen/tickets/active ───────────────────────────────────────────
  /**
   * Active tickets grouped by station for the KDS display.
   *
   * Returns only pending/cooking/ready tickets, grouped by station.
   * This is the primary data source for the Kitchen Display Screen.
   */
  fastify.get(
    '/tickets/active',
    {
      preHandler: [requirePermission('kitchen:view')],
      schema: {
        tags: ['Kitchen'],
        summary: 'Active tickets grouped by station',
        description:
          'Returns pending/cooking/ready tickets grouped by kitchen station. Primary data source for KDS screen.',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              stations: {
                type: 'object',
                additionalProperties: {
                  type: 'array',
                  items: ticketResponse,
                },
              },
              totalActive: { type: 'number' },
            },
          },
        },
      },
    },
    async (request) => {
      const restaurantId = request.user!.restaurantId;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      const activeStatuses = ['pending', 'cooking', 'ready'] as const;

      const tickets = await fastify.db
        .select({
          id: kitchenTickets.id,
          orderId: kitchenTickets.orderId,
          restaurantId: kitchenTickets.restaurantId,
          ticketNumber: kitchenTickets.ticketNumber,
          station: kitchenTickets.station,
          items: kitchenTickets.items,
          status: kitchenTickets.status,
          priority: kitchenTickets.priority,
          createdAt: kitchenTickets.createdAt,
          startedAt: kitchenTickets.startedAt,
          completedAt: kitchenTickets.completedAt,
          prepTimeSecs: kitchenTickets.prepTimeSecs,
          // Order info
          orderNumber: orders.orderNumber,
          orderType: orders.type,
          tableId: orders.tableId,
          orderNotes: orders.notes,
        })
        .from(kitchenTickets)
        .innerJoin(orders, eq(orders.id, kitchenTickets.orderId))
        .where(
          and(
            eq(kitchenTickets.restaurantId, restaurantId),
            sql`${kitchenTickets.status} IN ('pending', 'cooking', 'ready')`,
          ),
        )
        .orderBy(
          sql`CASE WHEN ${kitchenTickets.priority} = 'rush' THEN 0 WHEN ${kitchenTickets.priority} = 'vip' THEN 1 ELSE 2 END`,
          asc(kitchenTickets.createdAt),
        );

      // Group by station
      const stations: Record<string, typeof tickets> = {};
      for (const ticket of tickets) {
        const station = ticket.station;
        if (!stations[station]) stations[station] = [];
        stations[station]!.push(ticket);
      }

      return { stations, totalActive: tickets.length };
    },
  );

  // ── GET /kitchen/tickets/:id ──────────────────────────────────────────────
  /**
   * Get a single kitchen ticket with full order and table details.
   */
  fastify.get<{ Params: { id: string } }>(
    '/tickets/:id',
    {
      preHandler: [requirePermission('kitchen:view')],
      schema: {
        tags: ['Kitchen'],
        summary: 'Get ticket detail',
        description: 'Fetch a single kitchen ticket with order and table info.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const restaurantId = request.user!.restaurantId;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      const [ticket] = await fastify.db
        .select({
          id: kitchenTickets.id,
          orderId: kitchenTickets.orderId,
          restaurantId: kitchenTickets.restaurantId,
          ticketNumber: kitchenTickets.ticketNumber,
          station: kitchenTickets.station,
          items: kitchenTickets.items,
          status: kitchenTickets.status,
          priority: kitchenTickets.priority,
          createdAt: kitchenTickets.createdAt,
          startedAt: kitchenTickets.startedAt,
          completedAt: kitchenTickets.completedAt,
          prepTimeSecs: kitchenTickets.prepTimeSecs,
          createdBy: kitchenTickets.createdBy,
          completedBy: kitchenTickets.completedBy,
          // Order
          orderNumber: orders.orderNumber,
          orderType: orders.type,
          tableId: orders.tableId,
          orderStatus: orders.status,
          orderNotes: orders.notes,
          guestCount: orders.guestCount,
        })
        .from(kitchenTickets)
        .innerJoin(orders, eq(orders.id, kitchenTickets.orderId))
        .where(
          and(
            eq(kitchenTickets.id, id),
            eq(kitchenTickets.restaurantId, restaurantId),
          ),
        )
        .limit(1);

      if (!ticket) {
        return reply.code(404).send({ error: 'Not Found', message: 'Kitchen ticket not found' });
      }

      // Fetch table info if dine-in
      let table = null;
      if (ticket.tableId) {
        const [t] = await fastify.db
          .select({ id: tables.id, name: tables.name, capacity: tables.capacity })
          .from(tables)
          .where(eq(tables.id, ticket.tableId))
          .limit(1);
        table = t ?? null;
      }

      return { ticket, table };
    },
  );

  // ── PUT /kitchen/tickets/:id/status ───────────────────────────────────────
  /**
   * Update kitchen ticket status with validation.
   *
   * Enforces valid state transitions:
   *   pending -> cooking -> ready -> served
   *   any -> cancelled
   *
   * Side effects:
   *   - cooking: sets startedAt
   *   - ready: sets completedAt, calculates prepTimeSecs, sets completedBy
   *   - served/ready: updates matching order_items status
   */
  fastify.put<{ Params: { id: string }; Body: { status: string } }>(
    '/tickets/:id/status',
    {
      preHandler: [requirePermission('kitchen:update')],
      schema: {
        tags: ['Kitchen'],
        summary: 'Update ticket status',
        description:
          'Transition a kitchen ticket to a new status. Validates transitions. Auto-sets timestamps and calculates prep time.',
        security: [{ bearerAuth: [] }],
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
              enum: ['cooking', 'ready', 'served', 'cancelled'],
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              ticket: ticketResponse,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status: newStatus } = request.body;
      const restaurantId = request.user!.restaurantId;
      const userId = request.user!.userId;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      // Fetch current ticket
      const [ticket] = await fastify.db
        .select()
        .from(kitchenTickets)
        .where(
          and(
            eq(kitchenTickets.id, id),
            eq(kitchenTickets.restaurantId, restaurantId),
          ),
        )
        .limit(1);

      if (!ticket) {
        return reply.code(404).send({ error: 'Not Found', message: 'Kitchen ticket not found' });
      }

      // Validate transition
      const allowed = VALID_TRANSITIONS[ticket.status];
      if (!allowed || !allowed.includes(newStatus)) {
        return reply.code(422).send({
          error: 'Unprocessable Entity',
          message: `Cannot transition from '${ticket.status}' to '${newStatus}'`,
          allowedTransitions: allowed ?? [],
        });
      }

      // Build update payload
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === 'cooking') {
        updateData.startedAt = new Date();
      }

      if (newStatus === 'ready') {
        const now = new Date();
        updateData.completedAt = now;
        updateData.completedBy = userId;
        // Calculate prep time from startedAt or createdAt
        const startTime = ticket.startedAt ?? ticket.createdAt;
        updateData.prepTimeSecs = Math.round((now.getTime() - startTime.getTime()) / 1000);
      }

      // Update the ticket
      const [updated] = await fastify.db
        .update(kitchenTickets)
        .set(updateData)
        .where(eq(kitchenTickets.id, id))
        .returning();

      // Sync order_items status to match the ticket
      // Parse the ticket items JSONB to get item IDs
      const ticketItems = ticket.items as Array<{ orderItemId?: string; id?: string }>;
      const orderItemIds = ticketItems
        .map((i) => i.orderItemId ?? i.id)
        .filter(Boolean) as string[];

      if (orderItemIds.length > 0) {
        const itemUpdate: Record<string, unknown> = { status: newStatus };
        if (newStatus === 'ready') {
          itemUpdate.preparedAt = new Date();
        }
        await fastify.db
          .update(orderItems)
          .set(itemUpdate as any)
          .where(inArray(orderItems.id, orderItemIds));
      }

      return { ticket: updated };
    },
  );

  // ── PUT /kitchen/tickets/:id/bump ─────────────────────────────────────────
  /**
   * Bump a ticket to the next status in the workflow.
   *
   * One-tap advancement for kitchen staff:
   *   pending -> cooking -> ready -> served
   *
   * Uses the same logic as PUT /status but auto-determines the next state.
   */
  fastify.put<{ Params: { id: string } }>(
    '/tickets/:id/bump',
    {
      preHandler: [requirePermission('kitchen:update')],
      schema: {
        tags: ['Kitchen'],
        summary: 'Bump ticket to next status',
        description:
          'One-tap advancement: pending -> cooking -> ready -> served. Auto-sets timestamps and prep time.',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              ticket: ticketResponse,
              previousStatus: { type: 'string' },
              newStatus: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const restaurantId = request.user!.restaurantId;
      const userId = request.user!.userId;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      // Fetch current ticket
      const [ticket] = await fastify.db
        .select()
        .from(kitchenTickets)
        .where(
          and(
            eq(kitchenTickets.id, id),
            eq(kitchenTickets.restaurantId, restaurantId),
          ),
        )
        .limit(1);

      if (!ticket) {
        return reply.code(404).send({ error: 'Not Found', message: 'Kitchen ticket not found' });
      }

      const nextStatus = NEXT_STATUS[ticket.status];
      if (!nextStatus) {
        return reply.code(422).send({
          error: 'Unprocessable Entity',
          message: `Ticket is '${ticket.status}' - no further advancement possible`,
        });
      }

      // Build update payload
      const updateData: Record<string, unknown> = { status: nextStatus };
      const previousStatus = ticket.status;

      if (nextStatus === 'cooking') {
        updateData.startedAt = new Date();
      }

      if (nextStatus === 'ready') {
        const now = new Date();
        updateData.completedAt = now;
        updateData.completedBy = userId;
        const startTime = ticket.startedAt ?? ticket.createdAt;
        updateData.prepTimeSecs = Math.round((now.getTime() - startTime.getTime()) / 1000);
      }

      const [updated] = await fastify.db
        .update(kitchenTickets)
        .set(updateData)
        .where(eq(kitchenTickets.id, id))
        .returning();

      // Sync order_items status
      const ticketItems = ticket.items as Array<{ orderItemId?: string; id?: string }>;
      const orderItemIds = ticketItems
        .map((i) => i.orderItemId ?? i.id)
        .filter(Boolean) as string[];

      if (orderItemIds.length > 0) {
        const itemUpdate: Record<string, unknown> = { status: nextStatus };
        if (nextStatus === 'ready') {
          itemUpdate.preparedAt = new Date();
        }
        await fastify.db
          .update(orderItems)
          .set(itemUpdate as any)
          .where(inArray(orderItems.id, orderItemIds));
      }

      return { ticket: updated, previousStatus, newStatus: nextStatus };
    },
  );

  // ── GET /kitchen/stats ────────────────────────────────────────────────────
  /**
   * Kitchen performance analytics.
   *
   * Returns aggregated stats for a date range:
   *   - Active ticket count
   *   - Average prep time (seconds)
   *   - On-time percentage (completed within 15 min target)
   *   - Breakdown by station and by status
   */
  fastify.get<{
    Querystring: { from?: string; to?: string };
  }>(
    '/stats',
    {
      preHandler: [requirePermission('kitchen:view')],
      schema: {
        tags: ['Kitchen'],
        summary: 'Kitchen performance stats',
        description:
          'Aggregated kitchen analytics: avg prep time, on-time percentage, breakdown by station and status.',
        security: [{ bearerAuth: [] }],
        querystring: {
          type: 'object',
          properties: {
            from: {
              type: 'string',
              format: 'date',
              description: 'Start date (default: today)',
            },
            to: {
              type: 'string',
              format: 'date',
              description: 'End date (default: today)',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              activeTickets: { type: 'number' },
              avgPrepTimeSecs: { type: 'number', nullable: true },
              onTimePct: { type: 'number', nullable: true },
              totalCompleted: { type: 'number' },
              byStation: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    station: { type: 'string' },
                    active: { type: 'number' },
                    completed: { type: 'number' },
                    avgPrepTimeSecs: { type: 'number', nullable: true },
                  },
                },
              },
              byStatus: {
                type: 'object',
                additionalProperties: { type: 'number' },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const restaurantId = request.user!.restaurantId;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${restaurantId}, true)`,
      );

      // Default date range: today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const fromDate = request.query.from ? new Date(request.query.from) : today;
      const toDate = request.query.to
        ? new Date(new Date(request.query.to).getTime() + 86400000) // end of to-date
        : tomorrow;

      // Active tickets (pending/cooking/ready)
      const [activeResult] = await fastify.db
        .select({ count: count() })
        .from(kitchenTickets)
        .where(
          and(
            eq(kitchenTickets.restaurantId, restaurantId),
            sql`${kitchenTickets.status} IN ('pending', 'cooking', 'ready')`,
          ),
        );
      const activeTickets = activeResult?.count ?? 0;

      // Completed tickets in date range (for avg prep time and on-time %)
      const completedTickets = await fastify.db
        .select({
          station: kitchenTickets.station,
          prepTimeSecs: kitchenTickets.prepTimeSecs,
          status: kitchenTickets.status,
        })
        .from(kitchenTickets)
        .where(
          and(
            eq(kitchenTickets.restaurantId, restaurantId),
            gte(kitchenTickets.createdAt, fromDate),
            lte(kitchenTickets.createdAt, toDate),
            sql`${kitchenTickets.status} IN ('ready', 'served')`,
          ),
        );

      // Calculate averages
      const prepTimes = completedTickets
        .map((t) => t.prepTimeSecs)
        .filter((t): t is number => t !== null);

      const avgPrepTimeSecs =
        prepTimes.length > 0
          ? Math.round(prepTimes.reduce((a, b) => a + b, 0) / prepTimes.length)
          : null;

      // On-time: completed within 15 min (900 seconds)
      const ON_TIME_TARGET = 900;
      const onTimeCount = prepTimes.filter((t) => t <= ON_TIME_TARGET).length;
      const onTimePct =
        prepTimes.length > 0 ? Math.round((onTimeCount / prepTimes.length) * 100) : null;

      // All tickets in range for status breakdown
      const allTickets = await fastify.db
        .select({
          station: kitchenTickets.station,
          status: kitchenTickets.status,
          prepTimeSecs: kitchenTickets.prepTimeSecs,
        })
        .from(kitchenTickets)
        .where(
          and(
            eq(kitchenTickets.restaurantId, restaurantId),
            gte(kitchenTickets.createdAt, fromDate),
            lte(kitchenTickets.createdAt, toDate),
          ),
        );

      // By status
      const byStatus: Record<string, number> = {};
      for (const t of allTickets) {
        byStatus[t.status] = (byStatus[t.status] ?? 0) + 1;
      }

      // By station
      const stationMap = new Map<
        string,
        { active: number; completed: number; prepTimes: number[] }
      >();

      for (const t of allTickets) {
        const s = stationMap.get(t.station) ?? { active: 0, completed: 0, prepTimes: [] };
        if (['pending', 'cooking', 'ready'].includes(t.status)) {
          s.active++;
        }
        if (['ready', 'served'].includes(t.status)) {
          s.completed++;
          if (t.prepTimeSecs !== null) s.prepTimes.push(t.prepTimeSecs);
        }
        stationMap.set(t.station, s);
      }

      const byStation = Array.from(stationMap.entries()).map(([station, data]) => ({
        station,
        active: data.active,
        completed: data.completed,
        avgPrepTimeSecs:
          data.prepTimes.length > 0
            ? Math.round(data.prepTimes.reduce((a, b) => a + b, 0) / data.prepTimes.length)
            : null,
      }));

      return {
        activeTickets,
        avgPrepTimeSecs,
        onTimePct,
        totalCompleted: completedTickets.length,
        byStation,
        byStatus,
      };
    },
  );
}

export default kitchenRoutes;
