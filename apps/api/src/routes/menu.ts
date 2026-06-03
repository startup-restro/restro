import type { FastifyInstance } from 'fastify';
import { eq, and, ilike, inArray, desc, asc, sql } from 'drizzle-orm';
import {
  restaurants,
  menuCategories,
  menuItems,
  menuVariants,
  menuModifiers,
  menuItemModifiers,
} from '@restroverse/db/schema';
import { requirePermission, PERMISSIONS } from '../middleware/rbac.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CategoryBody {
  name: string;
  nameLocal?: string;
  icon?: string;
  sortOrder?: number;
  schedule?: unknown;
}

interface ReorderBody {
  items: { id: string; sortOrder: number }[];
}

interface ItemBody {
  categoryId: string;
  name: string;
  nameLocal?: string;
  description?: string;
  basePrice: string;
  costPrice?: string;
  photoUrl?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  dietaryTags?: string[];
  allergens?: string[];
  prepTimeMin?: number;
  calories?: number;
  sortOrder?: number;
}

interface VariantBody {
  name: string;
  priceAdjustment?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
}

interface ModifierBody {
  name: string;
  options?: unknown[];
  isRequired?: boolean;
  minSelections?: number;
  maxSelections?: number;
  sortOrder?: number;
}

interface LinkModifiersBody {
  modifier_ids: string[];
}

interface ItemsQuery {
  category_id?: string;
  search?: string;
  is_available?: string;
  page?: string;
  limit?: string;
}

// ─── Route Registration ────────────────────────────────────────────────────────

export default async function menuRoutes(fastify: FastifyInstance) {
  // ═══════════════════════════════════════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════════════════════════════════════

  // ── GET /menu/categories ─────────────────────────────────────────────────

  fastify.get(
    '/categories',
    { preHandler: [fastify.authenticate], schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] } },
    async (request) => {
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const categories = await fastify.db
        .select()
        .from(menuCategories)
        .where(eq(menuCategories.restaurantId, request.user!.restaurantId))
        .orderBy(asc(menuCategories.sortOrder));

      return categories;
    },
  );

  // ── POST /menu/categories ────────────────────────────────────────────────

  fastify.post<{ Body: CategoryBody }>(
    '/categories',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 },
            nameLocal: { type: 'string' },
            icon: { type: 'string' },
            sortOrder: { type: 'integer' },
            schedule: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [cat] = await fastify.db
        .insert(menuCategories)
        .values({
          restaurantId: request.user!.restaurantId,
          ...request.body,
        })
        .returning();

      return reply.code(201).send(cat);
    },
  );

  // ── PUT /menu/categories/:id ─────────────────────────────────────────────

  fastify.put<{ Params: { id: string }; Body: Partial<CategoryBody> }>(
    '/categories/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            nameLocal: { type: 'string' },
            icon: { type: 'string' },
            sortOrder: { type: 'integer' },
            schedule: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [updated] = await fastify.db
        .update(menuCategories)
        .set({ ...request.body, updatedAt: new Date() })
        .where(
          and(
            eq(menuCategories.id, id),
            eq(menuCategories.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Category not found' });
      }

      return updated;
    },
  );

  // ── DELETE /menu/categories/:id (soft delete) ────────────────────────────

  fastify.delete<{ Params: { id: string } }>(
    '/categories/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [updated] = await fastify.db
        .update(menuCategories)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(menuCategories.id, id),
            eq(menuCategories.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Category not found' });
      }

      return { success: true };
    },
  );

  // ── PUT /menu/categories/reorder ─────────────────────────────────────────

  fastify.put<{ Body: ReorderBody }>(
    '/categories/reorder',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'sortOrder'],
                properties: {
                  id: { type: 'string' },
                  sortOrder: { type: 'integer' },
                },
              },
            },
          },
        },
      },
    },
    async (request) => {
      const { items } = request.body;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      // Batch update sort orders within a transaction
      await fastify.db.transaction(async (tx) => {
        for (const item of items) {
          await tx
            .update(menuCategories)
            .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
            .where(
              and(
                eq(menuCategories.id, item.id),
                eq(menuCategories.restaurantId, request.user!.restaurantId),
              ),
            );
        }
      });

      return { success: true };
    },
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // ITEMS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── GET /menu/items ──────────────────────────────────────────────────────

  fastify.get<{ Querystring: ItemsQuery }>(
    '/items',
    { preHandler: [fastify.authenticate], schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] } },
    async (request) => {
      const { category_id, search, is_available, page = '1', limit = '50' } = request.query;
      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      // Build conditions
      const conditions = [eq(menuItems.restaurantId, request.user!.restaurantId)];
      if (category_id) conditions.push(eq(menuItems.categoryId, category_id));
      if (search) conditions.push(ilike(menuItems.name, `%${search}%`));
      if (is_available !== undefined) {
        conditions.push(eq(menuItems.isAvailable, is_available === 'true'));
      }

      const items = await fastify.db
        .select()
        .from(menuItems)
        .where(and(...conditions))
        .orderBy(asc(menuItems.sortOrder), desc(menuItems.createdAt))
        .limit(parseInt(limit, 10))
        .offset(offset);

      // Fetch variants and modifiers for the returned items
      if (items.length > 0) {
        const itemIds = items.map((i) => i.id);

        const variants = await fastify.db
          .select()
          .from(menuVariants)
          .where(inArray(menuVariants.menuItemId, itemIds))
          .orderBy(asc(menuVariants.sortOrder));

        const itemModifierLinks = await fastify.db
          .select()
          .from(menuItemModifiers)
          .where(inArray(menuItemModifiers.menuItemId, itemIds));

        const modifierIds = [...new Set(itemModifierLinks.map((l) => l.modifierId))];

        let modifiers: (typeof menuModifiers.$inferSelect)[] = [];
        if (modifierIds.length > 0) {
          modifiers = await fastify.db
            .select()
            .from(menuModifiers)
            .where(inArray(menuModifiers.id, modifierIds));
        }

        // Group by item
        const variantMap = new Map<string, typeof variants>();
        for (const v of variants) {
          const arr = variantMap.get(v.menuItemId) ?? [];
          arr.push(v);
          variantMap.set(v.menuItemId, arr);
        }

        const modifierMap = new Map<string, typeof modifiers>();
        for (const link of itemModifierLinks) {
          const arr = modifierMap.get(link.menuItemId) ?? [];
          const mod = modifiers.find((m) => m.id === link.modifierId);
          if (mod) arr.push(mod);
          modifierMap.set(link.menuItemId, arr);
        }

        return items.map((item) => ({
          ...item,
          variants: variantMap.get(item.id) ?? [],
          modifiers: modifierMap.get(item.id) ?? [],
        }));
      }

      return items;
    },
  );

  // ── GET /menu/items/:id ──────────────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/items/:id',
    { preHandler: [fastify.authenticate], schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] } },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [item] = await fastify.db
        .select()
        .from(menuItems)
        .where(
          and(
            eq(menuItems.id, id),
            eq(menuItems.restaurantId, request.user!.restaurantId),
          ),
        )
        .limit(1);

      if (!item) {
        return reply.code(404).send({ error: 'Not Found', message: 'Item not found' });
      }

      // Fetch variants
      const variants = await fastify.db
        .select()
        .from(menuVariants)
        .where(eq(menuVariants.menuItemId, id))
        .orderBy(asc(menuVariants.sortOrder));

      // Fetch modifiers via junction
      const links = await fastify.db
        .select()
        .from(menuItemModifiers)
        .where(eq(menuItemModifiers.menuItemId, id));

      const modifierIds = links.map((l) => l.modifierId);
      let modifiers: (typeof menuModifiers.$inferSelect)[] = [];
      if (modifierIds.length > 0) {
        modifiers = await fastify.db
          .select()
          .from(menuModifiers)
          .where(inArray(menuModifiers.id, modifierIds));
      }

      return { ...item, variants, modifiers };
    },
  );

  // ── POST /menu/items ─────────────────────────────────────────────────────

  fastify.post<{ Body: ItemBody }>(
    '/items',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['categoryId', 'name', 'basePrice'],
          properties: {
            categoryId: { type: 'string' },
            name: { type: 'string', minLength: 1 },
            nameLocal: { type: 'string' },
            description: { type: 'string' },
            basePrice: { type: 'string' },
            costPrice: { type: 'string' },
            photoUrl: { type: 'string' },
            isAvailable: { type: 'boolean' },
            isPopular: { type: 'boolean' },
            dietaryTags: { type: 'array', items: { type: 'string' } },
            allergens: { type: 'array', items: { type: 'string' } },
            prepTimeMin: { type: 'integer' },
            calories: { type: 'integer' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [item] = await fastify.db
        .insert(menuItems)
        .values({
          restaurantId: request.user!.restaurantId,
          ...request.body,
        })
        .returning();

      return reply.code(201).send(item);
    },
  );

  // ── PUT /menu/items/:id ──────────────────────────────────────────────────

  fastify.put<{ Params: { id: string }; Body: Partial<ItemBody> }>(
    '/items/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            categoryId: { type: 'string' },
            name: { type: 'string', minLength: 1 },
            nameLocal: { type: 'string' },
            description: { type: 'string' },
            basePrice: { type: 'string' },
            costPrice: { type: 'string' },
            photoUrl: { type: 'string' },
            isAvailable: { type: 'boolean' },
            isPopular: { type: 'boolean' },
            dietaryTags: { type: 'array', items: { type: 'string' } },
            allergens: { type: 'array', items: { type: 'string' } },
            prepTimeMin: { type: 'integer' },
            calories: { type: 'integer' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [updated] = await fastify.db
        .update(menuItems)
        .set({ ...request.body, updatedAt: new Date() })
        .where(
          and(
            eq(menuItems.id, id),
            eq(menuItems.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Item not found' });
      }

      return updated;
    },
  );

  // ── DELETE /menu/items/:id (hard delete) ─────────────────────────────────

  fastify.delete<{ Params: { id: string } }>(
    '/items/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [deleted] = await fastify.db
        .delete(menuItems)
        .where(
          and(
            eq(menuItems.id, id),
            eq(menuItems.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Item not found' });
      }

      return { success: true };
    },
  );

  // ── POST /menu/items/:id/toggle-availability ────────────────────────────

  fastify.post<{ Params: { id: string } }>(
    '/items/:id/toggle-availability',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      // Fetch current value
      const [item] = await fastify.db
        .select({ isAvailable: menuItems.isAvailable })
        .from(menuItems)
        .where(
          and(
            eq(menuItems.id, id),
            eq(menuItems.restaurantId, request.user!.restaurantId),
          ),
        )
        .limit(1);

      if (!item) {
        return reply.code(404).send({ error: 'Not Found', message: 'Item not found' });
      }

      const [updated] = await fastify.db
        .update(menuItems)
        .set({ isAvailable: !item.isAvailable, updatedAt: new Date() })
        .where(eq(menuItems.id, id))
        .returning();

      return updated;
    },
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // VARIANTS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── GET /menu/items/:itemId/variants ─────────────────────────────────────

  fastify.get<{ Params: { itemId: string } }>(
    '/items/:itemId/variants',
    { preHandler: [fastify.authenticate], schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] } },
    async (request) => {
      const { itemId } = request.params;

      return fastify.db
        .select()
        .from(menuVariants)
        .where(eq(menuVariants.menuItemId, itemId))
        .orderBy(asc(menuVariants.sortOrder));
    },
  );

  // ── POST /menu/items/:itemId/variants ────────────────────────────────────

  fastify.post<{ Params: { itemId: string }; Body: VariantBody }>(
    '/items/:itemId/variants',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 },
            priceAdjustment: { type: 'string' },
            isDefault: { type: 'boolean' },
            isAvailable: { type: 'boolean' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      const { itemId } = request.params;

      const [variant] = await fastify.db
        .insert(menuVariants)
        .values({
          menuItemId: itemId,
          ...request.body,
        })
        .returning();

      return reply.code(201).send(variant);
    },
  );

  // ── PUT /menu/items/:itemId/variants/:variantId ──────────────────────────

  fastify.put<{ Params: { itemId: string; variantId: string }; Body: Partial<VariantBody> }>(
    '/items/:itemId/variants/:variantId',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            priceAdjustment: { type: 'string' },
            isDefault: { type: 'boolean' },
            isAvailable: { type: 'boolean' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      const { variantId, itemId } = request.params;

      const [updated] = await fastify.db
        .update(menuVariants)
        .set(request.body)
        .where(
          and(
            eq(menuVariants.id, variantId),
            eq(menuVariants.menuItemId, itemId),
          ),
        )
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Variant not found' });
      }

      return updated;
    },
  );

  // ── DELETE /menu/items/:itemId/variants/:variantId ───────────────────────

  fastify.delete<{ Params: { itemId: string; variantId: string } }>(
    '/items/:itemId/variants/:variantId',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { variantId, itemId } = request.params;

      const [deleted] = await fastify.db
        .delete(menuVariants)
        .where(
          and(
            eq(menuVariants.id, variantId),
            eq(menuVariants.menuItemId, itemId),
          ),
        )
        .returning();

      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Variant not found' });
      }

      return { success: true };
    },
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODIFIERS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── GET /menu/modifiers ──────────────────────────────────────────────────

  fastify.get(
    '/modifiers',
    { preHandler: [fastify.authenticate], schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] } },
    async (request) => {
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      return fastify.db
        .select()
        .from(menuModifiers)
        .where(eq(menuModifiers.restaurantId, request.user!.restaurantId))
        .orderBy(asc(menuModifiers.sortOrder));
    },
  );

  // ── POST /menu/modifiers ─────────────────────────────────────────────────

  fastify.post<{ Body: ModifierBody }>(
    '/modifiers',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1 },
            options: { type: 'array' },
            isRequired: { type: 'boolean' },
            minSelections: { type: 'integer' },
            maxSelections: { type: 'integer' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [modifier] = await fastify.db
        .insert(menuModifiers)
        .values({
          restaurantId: request.user!.restaurantId,
          ...request.body,
        })
        .returning();

      return reply.code(201).send(modifier);
    },
  );

  // ── PUT /menu/modifiers/:id ──────────────────────────────────────────────

  fastify.put<{ Params: { id: string }; Body: Partial<ModifierBody> }>(
    '/modifiers/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            options: { type: 'array' },
            isRequired: { type: 'boolean' },
            minSelections: { type: 'integer' },
            maxSelections: { type: 'integer' },
            sortOrder: { type: 'integer' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [updated] = await fastify.db
        .update(menuModifiers)
        .set(request.body)
        .where(
          and(
            eq(menuModifiers.id, id),
            eq(menuModifiers.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Modifier not found' });
      }

      return updated;
    },
  );

  // ── DELETE /menu/modifiers/:id ───────────────────────────────────────────

  fastify.delete<{ Params: { id: string } }>(
    '/modifiers/:id',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [deleted] = await fastify.db
        .delete(menuModifiers)
        .where(
          and(
            eq(menuModifiers.id, id),
            eq(menuModifiers.restaurantId, request.user!.restaurantId),
          ),
        )
        .returning();

      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Modifier not found' });
      }

      return { success: true };
    },
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // ITEM-MODIFIER LINKING
  // ═══════════════════════════════════════════════════════════════════════════

  // ── POST /menu/items/:id/modifiers ───────────────────────────────────────

  fastify.post<{ Params: { id: string }; Body: LinkModifiersBody }>(
    '/items/:id/modifiers',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: {
        tags: ['Menu'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['modifier_ids'],
          properties: {
            modifier_ids: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { modifier_ids } = request.body;

      const values = modifier_ids.map((modifierId) => ({
        menuItemId: id,
        modifierId,
      }));

      await fastify.db
        .insert(menuItemModifiers)
        .values(values)
        .onConflictDoNothing();

      return reply.code(201).send({ success: true, linked: modifier_ids.length });
    },
  );

  // ── DELETE /menu/items/:id/modifiers/:modifierId ─────────────────────────

  fastify.delete<{ Params: { id: string; modifierId: string } }>(
    '/items/:id/modifiers/:modifierId',
    {
      preHandler: [fastify.authenticate, requirePermission(PERMISSIONS.MENU_MANAGE)],
      schema: { tags: ['Menu'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id, modifierId } = request.params;

      const [deleted] = await fastify.db
        .delete(menuItemModifiers)
        .where(
          and(
            eq(menuItemModifiers.menuItemId, id),
            eq(menuItemModifiers.modifierId, modifierId),
          ),
        )
        .returning();

      if (!deleted) {
        return reply.code(404).send({ error: 'Not Found', message: 'Link not found' });
      }

      return { success: true };
    },
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC MENU (no auth)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── GET /menu/public/:slug ───────────────────────────────────────────────

  fastify.get<{ Params: { slug: string } }>(
    '/public/:slug',
    { schema: { tags: ['Menu'] } },
    async (request, reply) => {
      const { slug } = request.params;

      // Look up restaurant by slug
      const [restaurant] = await fastify.db
        .select({
          id: restaurants.id,
          name: restaurants.name,
          slug: restaurants.slug,
          type: restaurants.type,
          currency: restaurants.currency,
          logoUrl: restaurants.logoUrl,
          coverUrl: restaurants.coverUrl,
        })
        .from(restaurants)
        .where(and(eq(restaurants.slug, slug), eq(restaurants.isActive, true)))
        .limit(1);

      if (!restaurant) {
        return reply.code(404).send({ error: 'Not Found', message: 'Restaurant not found' });
      }

      // Fetch active categories
      const categories = await fastify.db
        .select()
        .from(menuCategories)
        .where(
          and(
            eq(menuCategories.restaurantId, restaurant.id),
            eq(menuCategories.isActive, true),
          ),
        )
        .orderBy(asc(menuCategories.sortOrder));

      // Fetch available items
      const items = await fastify.db
        .select()
        .from(menuItems)
        .where(
          and(
            eq(menuItems.restaurantId, restaurant.id),
            eq(menuItems.isAvailable, true),
          ),
        )
        .orderBy(asc(menuItems.sortOrder));

      // Fetch variants for available items
      const itemIds = items.map((i) => i.id);
      let variants: (typeof menuVariants.$inferSelect)[] = [];
      let modifiers: (typeof menuModifiers.$inferSelect)[] = [];

      if (itemIds.length > 0) {
        variants = await fastify.db
          .select()
          .from(menuVariants)
          .where(
            and(
              inArray(menuVariants.menuItemId, itemIds),
              eq(menuVariants.isAvailable, true),
            ),
          )
          .orderBy(asc(menuVariants.sortOrder));

        // Fetch modifiers via junction
        const links = await fastify.db
          .select()
          .from(menuItemModifiers)
          .where(inArray(menuItemModifiers.menuItemId, itemIds));

        const modifierIds = [...new Set(links.map((l) => l.modifierId))];
        if (modifierIds.length > 0) {
          modifiers = await fastify.db
            .select()
            .from(menuModifiers)
            .where(inArray(menuModifiers.id, modifierIds));
        }

        // Build modifier map per item
        const modifierByItem = new Map<string, typeof modifiers>();
        for (const link of links) {
          const arr = modifierByItem.get(link.menuItemId) ?? [];
          const mod = modifiers.find((m) => m.id === link.modifierId);
          if (mod) arr.push(mod);
          modifierByItem.set(link.menuItemId, arr);
        }

        // Build variant map per item
        const variantByItem = new Map<string, typeof variants>();
        for (const v of variants) {
          const arr = variantByItem.get(v.menuItemId) ?? [];
          arr.push(v);
          variantByItem.set(v.menuItemId, arr);
        }

        // Group items under categories
        const menu = categories.map((cat) => ({
          ...cat,
          items: items
            .filter((item) => item.categoryId === cat.id)
            .map((item) => ({
              ...item,
              variants: variantByItem.get(item.id) ?? [],
              modifiers: modifierByItem.get(item.id) ?? [],
            })),
        }));

        return { restaurant, menu };
      }

      // No items case
      const menu = categories.map((cat) => ({ ...cat, items: [] }));
      return { restaurant, menu };
    },
  );
}
