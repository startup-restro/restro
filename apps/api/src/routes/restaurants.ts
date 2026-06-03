import type { FastifyInstance } from 'fastify';
import { eq, sql } from 'drizzle-orm';
import { restaurants, spaces, tables, taxConfigs } from '@restroverse/db/schema';
import { requireRole } from '../middleware/rbac.js';

// ─── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Returns default tax config values based on country code. */
function getDefaultTax(country: string): { name: string; rate: string; isInclusive: boolean } {
  switch (country.toUpperCase()) {
    case 'NP':
      return { name: 'VAT', rate: '13.00', isInclusive: true };
    case 'IN':
      return { name: 'GST', rate: '5.00', isInclusive: false };
    case 'BD':
      return { name: 'VAT', rate: '5.00', isInclusive: false };
    default:
      return { name: 'Tax', rate: '0.00', isInclusive: false };
  }
}

/** Returns default currency for a country. */
function getCurrency(country: string): string {
  switch (country.toUpperCase()) {
    case 'NP':
      return 'NPR';
    case 'IN':
      return 'INR';
    case 'BD':
      return 'BDT';
    default:
      return 'USD';
  }
}

/** Returns default timezone for a country. */
function getTimezone(country: string): string {
  switch (country.toUpperCase()) {
    case 'NP':
      return 'Asia/Kathmandu';
    case 'IN':
      return 'Asia/Kolkata';
    case 'BD':
      return 'Asia/Dhaka';
    default:
      return 'UTC';
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CreateRestaurantBody {
  name: string;
  slug?: string;
  type?: string;
  country: string;
  phone?: string;
  address?: string;
  city?: string;
}

interface UpdateRestaurantBody {
  name?: string;
  type?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  logoUrl?: string;
  coverUrl?: string;
}

interface UpdateSettingsBody {
  service_charge_rate?: number;
  round_off_to?: number;
  invoice_prefix?: string;
  receipt_footer?: string;
}

// ─── Route Registration ────────────────────────────────────────────────────────

export default async function restaurantRoutes(fastify: FastifyInstance) {
  // ── POST /restaurants ────────────────────────────────────────────────────────
  // Create restaurant + auto tax config + default floor & tables

  fastify.post<{ Body: CreateRestaurantBody }>(
    '/',
    {
      schema: {
        tags: ['Restaurants'],
        body: {
          type: 'object',
          required: ['name', 'country'],
          properties: {
            name: { type: 'string', minLength: 1 },
            slug: { type: 'string' },
            type: { type: 'string' },
            country: { type: 'string', minLength: 2, maxLength: 2 },
            phone: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, slug, type, country, phone, address, city } = request.body;

      const finalSlug = slug || slugify(name);
      const currency = getCurrency(country);
      const timezone = getTimezone(country);
      const defaultTax = getDefaultTax(country);

      // Insert restaurant
      const [restaurant] = await fastify.db
        .insert(restaurants)
        .values({
          name,
          slug: finalSlug,
          type: type ?? 'restaurant',
          country: country.toUpperCase(),
          currency,
          timezone,
          phone,
          address,
          city,
        })
        .returning();

      // Create default tax config
      const [taxConfig] = await fastify.db
        .insert(taxConfigs)
        .values({
          restaurantId: restaurant!.id,
          name: defaultTax.name,
          rate: defaultTax.rate,
          isInclusive: defaultTax.isInclusive,
        })
        .returning();

      // Create default space "Main Floor"
      const [space] = await fastify.db
        .insert(spaces)
        .values({
          restaurantId: restaurant!.id,
          name: 'Main Floor',
          sortOrder: 0,
        })
        .returning();

      // Create 5 default tables (T1-T5, capacity 4)
      const tableValues = Array.from({ length: 5 }, (_, i) => ({
        restaurantId: restaurant!.id,
        spaceId: space!.id,
        name: `T${i + 1}`,
        capacity: 4,
        sortOrder: i,
      }));

      await fastify.db.insert(tables).values(tableValues);

      return reply.code(201).send({ restaurant, taxConfig });
    },
  );

  // ── GET /restaurants/:id ─────────────────────────────────────────────────────

  fastify.get<{ Params: { id: string } }>(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: { tags: ['Restaurants'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      const [restaurant] = await fastify.db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, id))
        .limit(1);

      if (!restaurant) {
        return reply.code(404).send({ error: 'Not Found', message: 'Restaurant not found' });
      }

      return restaurant;
    },
  );

  // ── PUT /restaurants/:id ─────────────────────────────────────────────────────

  fastify.put<{ Params: { id: string }; Body: UpdateRestaurantBody }>(
    '/:id',
    {
      preHandler: [fastify.authenticate, requireRole('owner', 'manager')],
      schema: {
        tags: ['Restaurants'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            type: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            logoUrl: { type: 'string' },
            coverUrl: { type: 'string' },
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
        .update(restaurants)
        .set({ ...request.body, updatedAt: new Date() })
        .where(eq(restaurants.id, id))
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Restaurant not found' });
      }

      return updated;
    },
  );

  // ── PUT /restaurants/:id/settings ──���─────────────────────────────────────────

  fastify.put<{ Params: { id: string }; Body: UpdateSettingsBody }>(
    '/:id/settings',
    {
      preHandler: [fastify.authenticate, requireRole('owner')],
      schema: {
        tags: ['Restaurants'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            service_charge_rate: { type: 'number' },
            round_off_to: { type: 'number' },
            invoice_prefix: { type: 'string' },
            receipt_footer: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      // Fetch current settings and merge
      const [existing] = await fastify.db
        .select({ settings: restaurants.settings })
        .from(restaurants)
        .where(eq(restaurants.id, id))
        .limit(1);

      if (!existing) {
        return reply.code(404).send({ error: 'Not Found', message: 'Restaurant not found' });
      }

      const currentSettings =
        typeof existing.settings === 'object' && existing.settings !== null
          ? existing.settings
          : {};

      const mergedSettings = { ...currentSettings, ...request.body };

      const [updated] = await fastify.db
        .update(restaurants)
        .set({ settings: mergedSettings, updatedAt: new Date() })
        .where(eq(restaurants.id, id))
        .returning();

      return updated;
    },
  );

  // ── POST /restaurants/:id/complete-onboarding ────────────────────────────────

  fastify.post<{ Params: { id: string } }>(
    '/:id/complete-onboarding',
    {
      preHandler: [fastify.authenticate],
      schema: { tags: ['Restaurants'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.db.execute(
        sql`SELECT set_config('app.restaurant_id', ${request.user!.restaurantId}, true)`,
      );

      const [updated] = await fastify.db
        .update(restaurants)
        .set({ onboardingCompleted: true, updatedAt: new Date() })
        .where(eq(restaurants.id, id))
        .returning();

      if (!updated) {
        return reply.code(404).send({ error: 'Not Found', message: 'Restaurant not found' });
      }

      return { success: true, restaurant: updated };
    },
  );
}
