import type { FastifyInstance } from 'fastify';
import { eq, and, inArray, desc, asc, sql, gte, lte, or } from 'drizzle-orm';
import {
  orders,
  orderItems,
  kitchenTickets,
  tables,
  menuItems,
  menuVariants,
} from '@restroverse/db';
import { requirePermission } from '../middleware/rbac.js';

// ---------------------------------------------------------------------------
// Shared JSON-Schema fragments
// ---------------------------------------------------------------------------

const orderItemInput = {
  type: 'object' as const,
  required: ['menuItemId', 'quantity'],
  properties: {
    menuItemId: { type: 'string', format: 'uuid' },
    variantId: { type: 'string', format: 'uuid', nullable: true },
    quantity: { type: 'integer', minimum: 1 },
    modifiers: {
      type: 'object',
      additionalProperties: true,
      nullable: true,
      description: 'Free-form modifier map, e.g. {"extra_cheese": true}',
    },
    notes: { type: 'string', nullable: true },
  },
} as const;

const paginationMeta = {
  type: 'object' as const,
  properties: {
    total: { type: 'integer' },
    page: { type: 'integer' },
    limit: { type: 'integer' },
    hasMore: { type: 'boolean' },
  },
} as const;

const orderItemSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'string', format: 'uuid' },
    orderId: { type: 'string', format: 'uuid' },
    menuItemId: { type: 'string', format: 'uuid' },
    variantId: { type: 'string', format: 'uuid', nullable: true },
    quantity: { type: 'integer' },
    unitPrice: { type: 'string', description: 'Decimal as string' },
    modifiers: { type: 'object', additionalProperties: true, nullable: true },
    notes: { type: 'string', nullable: true },
    status: { type: 'string' },
    sentToKitchenAt: { type: 'string', format: 'date-time', nullable: true },
    preparedAt: { type: 'string', format: 'date-time', nullable: true },
    isVoid: { type: 'boolean' },
    voidReason: { type: 'string', nullable: true },
    voidBy: { type: 'string', format: 'uuid', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
} as const;

const orderSchema = {
  type: 'object' as const,
  properties: {
    id: { type: 'string', format: 'uuid' },
    restaurantId: { type: 'string', format: 'uuid' },
    orderNumber: { type: 'integer' },
    tableId: { type: 'string', format: 'uuid', nullable: true },
    customerId: { type: 'string', format: 'uuid', nullable: true },
    type: { type: 'string' },
    status: { type: 'string' },
    channel: { type: 'string', nullable: true },
    aggregator: { type: 'string', nullable: true },
    guestCount: { type: 'integer', nullable: true },
    notes: { type: 'string', nullable: true },
    priority: { type: 'integer' },
    createdBy: { type: 'string', format: 'uuid' },
    cancelledReason: { type: 'string', nullable: true },
    completedAt: { type: 'string', format: 'date-time', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    items: { type: 'array', items: orderItemSchema },
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
// Valid state transitions for order status
// ---------------------------------------------------------------------------

const STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['confirmed', 'preparing', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'served', 'cancelled'],
  ready: ['served', 'cancelled'],
  served: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const ACTIVE_STATUSES = ['draft', 'confirmed', 'preparing', 'ready', 'served'] as const;
const MODIFIABLE_ORDER_STATUSES = ['draft', 'confirmed', 'preparing'] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Snapshot the unit price for a menu item, preferring the variant price when
 * a variantId is supplied. Throws if the item (or variant) doesn't exist or
 * is unavailable.
 */
async function resolvePrice(
  db: any,
  menuItemId: string,
  variantId: string | null | undefined,
): Promise<string> {
  // Always fetch the base item price
  const [item] = await db
    .select({ price: menuItems.basePrice, isAvailable: menuItems.isAvailable })
    .from(menuItems)
    .where(eq(menuItems.id, menuItemId));
  if (!item) throw { statusCode: 404, message: `Menu item ${menuItemId} not found` };
  if (item.isAvailable === false) throw { statusCode: 422, message: `Menu item ${menuItemId} is currently unavailable` };

  if (variantId) {
    const [variant] = await db
      .select({ priceAdjustment: menuVariants.priceAdjustment, isAvailable: menuVariants.isAvailable })
      .from(menuVariants)
      .where(and(eq(menuVariants.id, variantId), eq(menuVariants.menuItemId, menuItemId)));
    if (!variant) throw { statusCode: 404, message: `Variant ${variantId} not found for item ${menuItemId}` };
    if (variant.isAvailable === false) throw { statusCode: 422, message: `Variant ${variantId} is currently unavailable` };
    // Variant price = base price + adjustment
    const total = parseFloat(item.price) + parseFloat(variant.priceAdjustment);
    return total.toFixed(2);
  }

  return item.price;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

/**
 * Fastify plugin that registers all order-related CRUD routes under `/orders`.
 *
 * Every route is protected by `fastify.authenticate` (JWT) and fine-grained
 * RBAC via `requirePermission`. Row-level security is enforced at the DB
 * layer through `app.restaurant_id` set by the auth middleware.
 */
async function orderRoutes(fastify: FastifyInstance) {
  const db = fastify.db; // Drizzle instance attached by DB plugin

  // =========================================================================
  // 1. POST /orders - Create a new order
  // =========================================================================

  /**
   * Creates a new order with line items. Prices are snapshotted from the
   * current menu_items / menu_variants rows so the order is immune to future
   * price changes. When the order is dine-in with a tableId the referenced
   * table is marked as 'occupied'.
   */
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate, requirePermission('order:create')],
      schema: {
        tags: ['Orders'],
        summary: 'Create a new order',
        description:
          'Creates an order with line items. Unit prices are snapshotted from the menu at creation time. ' +
          'Dine-in orders with a tableId will automatically mark the table as occupied.',
        body: {
          type: 'object',
          required: ['type', 'items'],
          properties: {
            type: {
              type: 'string',
              enum: ['dine_in', 'takeaway', 'delivery', 'online', 'reservation'],
            },
            tableId: { type: 'string', format: 'uuid', nullable: true },
            customerId: { type: 'string', format: 'uuid', nullable: true },
            channel: { type: 'string', nullable: true },
            guestCount: { type: 'integer', minimum: 1, nullable: true },
            notes: { type: 'string', nullable: true },
            priority: { type: 'integer', minimum: 0, default: 0 },
            items: { type: 'array', minItems: 1, items: orderItemInput },
          },
        },
        response: {
          201: orderSchema,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { userId, restaurantId } = request.user;
      const body = request.body as {
        type: string;
        tableId?: string;
        customerId?: string;
        channel?: string;
        guestCount?: number;
        notes?: string;
        priority?: number;
        items: Array<{
          menuItemId: string;
          variantId?: string;
          quantity: number;
          modifiers?: Record<string, unknown>;
          notes?: string;
        }>;
      };

      // Resolve prices for every item before touching the DB
      const pricedItems = await Promise.all(
        body.items.map(async (item) => ({
          ...item,
          unitPrice: await resolvePrice(db, item.menuItemId, item.variantId),
        })),
      );

      const result = await db.transaction(async (tx: any) => {
        // Insert order
        const [order] = await tx
          .insert(orders)
          .values({
            restaurantId,
            type: body.type,
            status: 'draft' as const,
            tableId: body.tableId ?? null,
            customerId: body.customerId ?? null,
            channel: body.channel ?? 'pos',
            guestCount: body.guestCount ?? null,
            notes: body.notes ?? null,
            priority: body.priority ?? 'normal',
            createdBy: userId,
          })
          .returning();

        // Insert items
        const insertedItems = await tx
          .insert(orderItems)
          .values(
            pricedItems.map((item) => ({
              orderId: order.id,
              menuItemId: item.menuItemId,
              variantId: item.variantId ?? null,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              modifiers: item.modifiers ?? null,
              notes: item.notes ?? null,
              status: 'pending' as const,
              isVoid: false,
            })),
          )
          .returning();

        // Mark table as occupied for dine-in orders
        if (body.type === 'dine_in' && body.tableId) {
          await tx
            .update(tables)
            .set({ status: 'occupied' as const, currentOrderId: order.id })
            .where(eq(tables.id, body.tableId));
        }

        return { ...order, items: insertedItems };
      });

      return reply.status(201).send(result);
    },
  );

  // =========================================================================
  // 2. GET /orders - List orders with filters & pagination
  // =========================================================================

  /**
   * Returns a paginated list of orders for the current restaurant. Supports
   * filtering by status, type, and date range. Results are sorted by
   * createdAt descending (newest first).
   */
  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate, requirePermission('order:view')],
      schema: {
        tags: ['Orders'],
        summary: 'List orders with filters',
        description:
          'Paginated order listing. Filter by status, type, and date range.',
        querystring: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['draft', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
            },
            type: {
              type: 'string',
              enum: ['dine_in', 'takeaway', 'delivery', 'online', 'reservation'],
            },
            from: { type: 'string', format: 'date', description: 'Inclusive start date (YYYY-MM-DD)' },
            to: { type: 'string', format: 'date', description: 'Inclusive end date (YYYY-MM-DD)' },
            page: { type: 'integer', minimum: 1, default: 1 },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              data: { type: 'array', items: orderSchema },
              meta: paginationMeta,
            },
          },
        },
      },
    },
    async (request, reply) => {
      const query = request.query as {
        status?: string;
        type?: string;
        from?: string;
        to?: string;
        page?: number;
        limit?: number;
      };

      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const offset = (page - 1) * limit;

      // Build dynamic WHERE clauses
      const conditions: any[] = [];
      if (query.status) conditions.push(eq(orders.status, query.status as any));
      if (query.type) conditions.push(eq(orders.type, query.type as any));
      if (query.from) conditions.push(gte(orders.createdAt, new Date(query.from)));
      if (query.to) {
        // End of day for inclusive "to" date
        const endOfDay = new Date(query.to);
        endOfDay.setHours(23, 59, 59, 999);
        conditions.push(lte(orders.createdAt, endOfDay));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      // Count + fetch in parallel
      const [countResult, rows] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(orders).where(where),
        db
          .select()
          .from(orders)
          .where(where)
          .orderBy(desc(orders.createdAt))
          .limit(limit)
          .offset(offset),
      ]);

      const total = Number(countResult[0].count);

      return reply.send({
        data: rows,
        meta: { total, page, limit, hasMore: offset + rows.length < total },
      });
    },
  );

  // =========================================================================
  // 3. GET /orders/running - All active (non-terminal) orders
  // =========================================================================

  /**
   * Returns every order that has not yet reached a terminal state (completed
   * or cancelled). Each order includes its line items and, for dine-in
   * orders, the associated table information.
   */
  fastify.get(
    '/running',
    {
      preHandler: [fastify.authenticate, requirePermission('order:view')],
      schema: {
        tags: ['Orders'],
        summary: 'List all active / running orders',
        description:
          'Returns orders whose status is not "completed" or "cancelled". ' +
          'Includes items and table info for dine-in orders.',
        response: {
          200: {
            type: 'array',
            items: {
              ...orderSchema,
              properties: {
                ...orderSchema.properties,
                table: {
                  type: 'object',
                  nullable: true,
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    status: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const activeOrders = await db
        .select()
        .from(orders)
        .where(inArray(orders.status, [...ACTIVE_STATUSES]))
        .orderBy(asc(orders.priority), asc(orders.createdAt));

      if (activeOrders.length === 0) return reply.send([]);

      const orderIds = activeOrders.map((o: any) => o.id);

      // Fetch items and table info in parallel
      const [items, tableRows] = await Promise.all([
        db.select().from(orderItems).where(inArray(orderItems.orderId, orderIds)),
        db
          .select({ id: tables.id, name: tables.name, status: tables.status })
          .from(tables)
          .where(
            inArray(
              tables.id,
              activeOrders.filter((o: any) => o.tableId).map((o: any) => o.tableId),
            ),
          ),
      ]);

      // Index helpers
      const itemsByOrder = new Map<string, any[]>();
      for (const item of items) {
        const list = itemsByOrder.get(item.orderId) ?? [];
        list.push(item);
        itemsByOrder.set(item.orderId, list);
      }

      const tableById = new Map(tableRows.map((t: any) => [t.id, t]));

      const enriched = activeOrders.map((order: any) => ({
        ...order,
        items: itemsByOrder.get(order.id) ?? [],
        table: order.tableId ? tableById.get(order.tableId) ?? null : null,
      }));

      return reply.send(enriched);
    },
  );

  // =========================================================================
  // 4. GET /orders/:id - Full order detail
  // =========================================================================

  /**
   * Returns a single order with all of its line items enriched with menu item
   * names and variant names, plus table information when applicable.
   */
  fastify.get(
    '/:id',
    {
      preHandler: [fastify.authenticate, requirePermission('order:view')],
      schema: {
        tags: ['Orders'],
        summary: 'Get full order detail',
        description:
          'Returns a single order with items (including menu item & variant names) and table info.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        response: {
          200: {
            ...orderSchema,
            properties: {
              ...orderSchema.properties,
              items: {
                type: 'array',
                items: {
                  ...orderItemSchema,
                  properties: {
                    ...orderItemSchema.properties,
                    menuItemName: { type: 'string', nullable: true },
                    variantName: { type: 'string', nullable: true },
                  },
                },
              },
              table: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  name: { type: 'string' },
                  status: { type: 'string' },
                },
              },
            },
          },
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });

      // Fetch items with left-joined menu item & variant names
      const items = await db
        .select({
          item: orderItems,
          menuItemName: menuItems.name,
          variantName: menuVariants.name,
        })
        .from(orderItems)
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .leftJoin(
          menuVariants,
          and(eq(orderItems.variantId, menuVariants.id), eq(orderItems.menuItemId, menuVariants.menuItemId)),
        )
        .where(eq(orderItems.orderId, id));

      const enrichedItems = items.map((row: any) => ({
        ...row.item,
        menuItemName: row.menuItemName,
        variantName: row.variantName,
      }));

      // Table info (if applicable)
      let table = null;
      if (order.tableId) {
        const [t] = await db
          .select({ id: tables.id, name: tables.name, status: tables.status })
          .from(tables)
          .where(eq(tables.id, order.tableId));
        table = t ?? null;
      }

      return reply.send({ ...order, items: enrichedItems, table });
    },
  );

  // =========================================================================
  // 5. POST /orders/:id/items - Add items to an existing order
  // =========================================================================

  /**
   * Appends new line items to an existing order. Only allowed while the order
   * is in a modifiable state (draft / confirmed / preparing). Prices are
   * snapshotted at the time of addition.
   */
  fastify.post(
    '/:id/items',
    {
      preHandler: [fastify.authenticate, requirePermission('order:create')],
      schema: {
        tags: ['Orders'],
        summary: 'Add items to an existing order',
        description:
          'Appends line items to an order that is still in draft, confirmed, or preparing status. ' +
          'Prices are snapshotted from the current menu.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          required: ['items'],
          properties: {
            items: { type: 'array', minItems: 1, items: orderItemInput },
          },
        },
        response: {
          201: { type: 'array', items: orderItemSchema },
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { items } = request.body as {
        items: Array<{
          menuItemId: string;
          variantId?: string;
          quantity: number;
          modifiers?: Record<string, unknown>;
          notes?: string;
        }>;
      };

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });

      if (!MODIFIABLE_ORDER_STATUSES.includes(order.status as any)) {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: `Cannot add items to an order in "${order.status}" status`,
        });
      }

      const pricedItems = await Promise.all(
        items.map(async (item) => ({
          ...item,
          unitPrice: await resolvePrice(db, item.menuItemId, item.variantId),
        })),
      );

      const inserted = await db
        .insert(orderItems)
        .values(
          pricedItems.map((item) => ({
            orderId: id,
            menuItemId: item.menuItemId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            modifiers: item.modifiers ?? null,
            notes: item.notes ?? null,
            status: 'pending' as const,
            isVoid: false,
          })),
        )
        .returning();

      return reply.status(201).send(inserted);
    },
  );

  // =========================================================================
  // 6. PUT /orders/:id/items/:itemId - Modify an order item
  // =========================================================================

  /**
   * Updates quantity, modifiers, or notes on a single order item. The item
   * must still be in 'pending' status (not yet sent to the kitchen) to be
   * modifiable.
   */
  fastify.put(
    '/:id/items/:itemId',
    {
      preHandler: [fastify.authenticate, requirePermission('order:create')],
      schema: {
        tags: ['Orders'],
        summary: 'Modify an order item',
        description:
          'Update quantity, modifiers, or notes on an item that has not yet been sent to the kitchen (status = pending).',
        params: {
          type: 'object',
          required: ['id', 'itemId'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            itemId: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            quantity: { type: 'integer', minimum: 1 },
            modifiers: { type: 'object', additionalProperties: true, nullable: true },
            notes: { type: 'string', nullable: true },
          },
        },
        response: {
          200: orderItemSchema,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id, itemId } = request.params as { id: string; itemId: string };
      const body = request.body as {
        quantity?: number;
        modifiers?: Record<string, unknown>;
        notes?: string;
      };

      const [item] = await db
        .select()
        .from(orderItems)
        .where(and(eq(orderItems.id, itemId), eq(orderItems.orderId, id)));

      if (!item) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order item not found' });

      if (item.status !== 'pending') {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: `Cannot modify item that is already in "${item.status}" status (must be "pending")`,
        });
      }

      const updates: Record<string, unknown> = {};
      if (body.quantity !== undefined) updates.quantity = body.quantity;
      if (body.modifiers !== undefined) updates.modifiers = body.modifiers;
      if (body.notes !== undefined) updates.notes = body.notes;

      if (Object.keys(updates).length === 0) {
        return reply.send(item); // Nothing to update
      }

      const [updated] = await db
        .update(orderItems)
        .set(updates)
        .where(eq(orderItems.id, itemId))
        .returning();

      return reply.send(updated);
    },
  );

  // =========================================================================
  // 7. DELETE /orders/:id/items/:itemId - Void an order item
  // =========================================================================

  /**
   * Soft-deletes (voids) a line item. The row remains for audit purposes with
   * `isVoid = true`, the user who voided it, and an optional reason.
   */
  fastify.delete(
    '/:id/items/:itemId',
    {
      preHandler: [fastify.authenticate, requirePermission('order:void_item')],
      schema: {
        tags: ['Orders'],
        summary: 'Void an order item',
        description:
          'Marks an order item as void. The record is kept for auditing; isVoid is set to true.',
        params: {
          type: 'object',
          required: ['id', 'itemId'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            itemId: { type: 'string', format: 'uuid' },
          },
        },
        body: {
          type: 'object',
          properties: {
            voidReason: { type: 'string', nullable: true },
          },
        },
        response: {
          200: orderItemSchema,
          404: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id, itemId } = request.params as { id: string; itemId: string };
      const { voidReason } = (request.body as { voidReason?: string }) ?? {};
      const { userId } = request.user;

      const [item] = await db
        .select()
        .from(orderItems)
        .where(and(eq(orderItems.id, itemId), eq(orderItems.orderId, id)));

      if (!item) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order item not found' });

      const [voided] = await db
        .update(orderItems)
        .set({ isVoid: true, voidReason: voidReason ?? null, voidBy: userId })
        .where(eq(orderItems.id, itemId))
        .returning();

      return reply.send(voided);
    },
  );

  // =========================================================================
  // 8. PUT /orders/:id/status - Update order status
  // =========================================================================

  /**
   * Advances (or cancels) an order through the status lifecycle. Valid
   * forward transitions follow the chain:
   *   draft -> confirmed -> preparing -> ready -> served -> completed
   * Any status may transition to 'cancelled'.
   *
   * When an order reaches 'completed' or 'cancelled' and was dine-in, the
   * associated table is reset to 'cleaning'.
   */
  fastify.put(
    '/:id/status',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Orders'],
        summary: 'Update order status',
        description:
          'Transition an order to a new status. Cancellation requires the `order:cancel` permission; ' +
          'all other transitions require `order:create`. Terminal states free up the associated table.',
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
              enum: ['confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
            },
            reason: { type: 'string', nullable: true, description: 'Required context when cancelling' },
          },
        },
        response: {
          200: orderSchema,
          400: errorResponse,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { status: newStatus, reason } = request.body as { status: string; reason?: string };

      // Dynamic permission check: cancellation needs a separate permission
      const requiredPermission = newStatus === 'cancelled' ? 'order:cancel' : 'order:create';
      await (requirePermission(requiredPermission) as any)(request, reply);

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });

      const allowed = STATUS_TRANSITIONS[order.status] ?? [];
      if (!allowed.includes(newStatus)) {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: `Cannot transition from "${order.status}" to "${newStatus}"`,
        });
      }

      const updates: Record<string, unknown> = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (newStatus === 'completed' || newStatus === 'cancelled') {
        updates.completedAt = new Date();
      }
      if (newStatus === 'cancelled' && reason) {
        updates.cancelledReason = reason;
      }

      const result = await db.transaction(async (tx: any) => {
        const [updated] = await tx.update(orders).set(updates).where(eq(orders.id, id)).returning();

        // Free the table when a dine-in order is completed or cancelled
        if (
          (newStatus === 'completed' || newStatus === 'cancelled') &&
          order.type === 'dine_in' &&
          order.tableId
        ) {
          await tx
            .update(tables)
            .set({ status: 'cleaning' as const, currentOrderId: null })
            .where(eq(tables.id, order.tableId));
        }

        return updated;
      });

      // Attach items for a complete response
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      return reply.send({ ...result, items });
    },
  );

  // =========================================================================
  // 9. POST /orders/:id/send-to-kitchen - Create a Kitchen Order Ticket (KOT)
  // =========================================================================

  /**
   * Gathers all 'pending' order items that haven't been sent to the kitchen
   * yet and creates a kitchen ticket (KOT). Each item's status is updated to
   * 'pending' with a sentToKitchenAt timestamp. If the order was in
   * draft/confirmed, it is automatically promoted to 'preparing'.
   */
  fastify.post(
    '/:id/send-to-kitchen',
    {
      preHandler: [fastify.authenticate, requirePermission('order:create')],
      schema: {
        tags: ['Orders'],
        summary: 'Send pending items to kitchen (create KOT)',
        description:
          'Creates a kitchen ticket for all pending items not yet sent. Updates item timestamps ' +
          'and promotes the order to "preparing" if it was in draft or confirmed.',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          properties: {
            station: { type: 'string', nullable: true, description: 'Target kitchen station' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              ticket: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  orderId: { type: 'string', format: 'uuid' },
                  restaurantId: { type: 'string', format: 'uuid' },
                  ticketNumber: { type: 'integer' },
                  station: { type: 'string' },
                  items: { type: 'array', description: 'JSONB snapshot of items sent' },
                  status: { type: 'string' },
                  priority: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  createdBy: { type: 'string', format: 'uuid', nullable: true },
                },
              },
            },
          },
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { station } = (request.body as { station?: string }) ?? {};
      const { userId, restaurantId } = request.user;

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });

      // Gather unsent pending items (pending status AND no sentToKitchenAt)
      const pendingItems = await db
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.orderId, id),
            eq(orderItems.status, 'pending'),
            eq(orderItems.isVoid, false),
            sql`${orderItems.sentToKitchenAt} IS NULL`,
          ),
        );

      if (pendingItems.length === 0) {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'No pending items to send to the kitchen',
        });
      }

      const now = new Date();

      const result = await db.transaction(async (tx: any) => {
        // Create the kitchen ticket with a JSONB snapshot of item details
        const itemsSnapshot = pendingItems.map((item: any) => ({
          orderItemId: item.id,
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          quantity: item.quantity,
          modifiers: item.modifiers,
          notes: item.notes,
        }));

        const [ticket] = await tx
          .insert(kitchenTickets)
          .values({
            orderId: id,
            restaurantId,
            station: station ?? 'main',
            items: itemsSnapshot,
            status: 'pending' as const,
            priority: order.priority ?? 'normal',
            createdBy: userId,
          })
          .returning();

        // Mark items as sent
        await tx
          .update(orderItems)
          .set({ sentToKitchenAt: now })
          .where(
            inArray(
              orderItems.id,
              pendingItems.map((i: any) => i.id),
            ),
          );

        // Promote order to 'preparing' if still in an early state
        if (order.status === 'draft' || order.status === 'confirmed') {
          await tx
            .update(orders)
            .set({ status: 'preparing' as const, updatedAt: now })
            .where(eq(orders.id, id));
        }

        return ticket;
      });

      return reply.status(201).send({ ticket: result });
    },
  );

  // =========================================================================
  // 10. POST /orders/:id/transfer-table - Move order to a different table
  // =========================================================================

  /**
   * Transfers a dine-in order from its current table to a new one. The old
   * table is set to 'cleaning' and the new table is marked 'occupied' with a
   * reference to this order.
   */
  fastify.post(
    '/:id/transfer-table',
    {
      preHandler: [fastify.authenticate, requirePermission('order:create')],
      schema: {
        tags: ['Orders'],
        summary: 'Transfer order to a different table',
        description:
          'Moves the order to a new table. The previous table is set to "cleaning" and the ' +
          'new table is marked "occupied".',
        params: {
          type: 'object',
          required: ['id'],
          properties: { id: { type: 'string', format: 'uuid' } },
        },
        body: {
          type: 'object',
          required: ['toTableId'],
          properties: {
            toTableId: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: orderSchema,
          404: errorResponse,
          422: errorResponse,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const { toTableId } = request.body as { toTableId: string };

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      if (!order) return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Order not found' });

      if (order.type !== 'dine_in') {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Table transfer is only available for dine-in orders',
        });
      }

      // Verify the target table exists
      const [targetTable] = await db.select().from(tables).where(eq(tables.id, toTableId));
      if (!targetTable) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Target table not found' });
      }

      if (targetTable.status === 'occupied') {
        return reply.status(422).send({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Target table is already occupied',
        });
      }

      const result = await db.transaction(async (tx: any) => {
        // Release old table
        if (order.tableId) {
          await tx
            .update(tables)
            .set({ status: 'cleaning' as const, currentOrderId: null })
            .where(eq(tables.id, order.tableId));
        }

        // Occupy new table
        await tx
          .update(tables)
          .set({ status: 'occupied' as const, currentOrderId: id })
          .where(eq(tables.id, toTableId));

        // Update order
        const [updated] = await tx
          .update(orders)
          .set({ tableId: toTableId, updatedAt: new Date() })
          .where(eq(orders.id, id))
          .returning();

        return updated;
      });

      // Attach items for complete response
      const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      return reply.send({ ...result, items });
    },
  );
}

export default orderRoutes;
