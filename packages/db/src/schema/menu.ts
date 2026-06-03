import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { restaurants } from './restaurants.js';

// ─── menu_categories ──────────────────────────────────────────────────────────

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nameLocal: text('name_local'),
  icon: text('icon'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  schedule: jsonb('schedule'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── menu_items ───────────────────────────────────────────────────────────────

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => menuCategories.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nameLocal: text('name_local'),
  description: text('description'),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  photoUrl: text('photo_url'),
  isAvailable: boolean('is_available').notNull().default(true),
  isPopular: boolean('is_popular').notNull().default(false),
  dietaryTags: text('dietary_tags').array().default([]),
  allergens: text('allergens').array().default([]),
  prepTimeMin: integer('prep_time_min'),
  calories: integer('calories'),
  sortOrder: integer('sort_order').notNull().default(0),
  salesCount: integer('sales_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── menu_variants ────────────────────────────────────────────────────────────

export const menuVariants = pgTable('menu_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  priceAdjustment: decimal('price_adjustment', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),
  isDefault: boolean('is_default').notNull().default(false),
  isAvailable: boolean('is_available').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── menu_modifiers ───────────────────────────────────────────────────────────

export const menuModifiers = pgTable('menu_modifiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  options: jsonb('options').notNull().default([]),
  isRequired: boolean('is_required').notNull().default(false),
  minSelections: integer('min_selections').notNull().default(0),
  maxSelections: integer('max_selections').notNull().default(1),
  sortOrder: integer('sort_order').notNull().default(0),
});

// ─── menu_item_modifiers (junction) ───────────────────────────────────────────

export const menuItemModifiers = pgTable(
  'menu_item_modifiers',
  {
    menuItemId: uuid('menu_item_id')
      .notNull()
      .references(() => menuItems.id, { onDelete: 'cascade' }),
    modifierId: uuid('modifier_id')
      .notNull()
      .references(() => menuModifiers.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.menuItemId, t.modifierId] })],
);

// ─── combos ──────────────────────────��────────────────────────────────────────

export const combos = pgTable('combos', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  photoUrl: text('photo_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── combo_items ──────────────────────────────────────────────────────────────

export const comboItems = pgTable('combo_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  comboId: uuid('combo_id')
    .notNull()
    .references(() => combos.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  variantId: uuid('variant_id').references(() => menuVariants.id),
});
