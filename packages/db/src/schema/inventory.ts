import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { stockMovementTypeEnum } from './enums.js';
import { restaurants, users } from './restaurants.js';
import { menuItems } from './menu.js';

// ─── suppliers ────────────────────────────────────────────────────────────────

export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── inventory_items ──────────────────────────────────────────────────────────

export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  unit: text('unit').notNull().default('kg'),
  currentStock: decimal('current_stock', { precision: 10, scale: 3 }).notNull().default('0'),
  minStock: decimal('min_stock', { precision: 10, scale: 3 }).notNull().default('0'),
  costPerUnit: decimal('cost_per_unit', { precision: 10, scale: 2 }).notNull().default('0'),
  supplierId: uuid('supplier_id').references(() => suppliers.id),
  expiryDate: date('expiry_date'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── stock_movements ──────────────────────────────────────────────────────────

export const stockMovements = pgTable('stock_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  inventoryItemId: uuid('inventory_item_id')
    .notNull()
    .references(() => inventoryItems.id),
  type: stockMovementTypeEnum('type').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }),
  referenceId: uuid('reference_id'),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── recipes ──────────────────────────────────────────────────────────────────

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id, { onDelete: 'cascade' }),
  yieldQty: integer('yield_qty').notNull().default(1),
  instructions: text('instructions'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── recipe_ingredients ───────────────────────────────────────────────────────

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  inventoryItemId: uuid('inventory_item_id')
    .notNull()
    .references(() => inventoryItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unit: text('unit').notNull().default('g'),
});

// ─── purchase_orders ──────────────────────────────────────────────────────────

export const purchaseOrders = pgTable('purchase_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  supplierId: uuid('supplier_id')
    .notNull()
    .references(() => suppliers.id),
  poNumber: text('po_number'),
  status: text('status').notNull().default('draft'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  notes: text('notes'),
  orderedAt: timestamp('ordered_at', { withTimezone: true }),
  receivedAt: timestamp('received_at', { withTimezone: true }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── purchase_order_items ─────────────────────────────────────────────────────

export const purchaseOrderItems = pgTable('purchase_order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchaseOrderId: uuid('purchase_order_id')
    .notNull()
    .references(() => purchaseOrders.id, { onDelete: 'cascade' }),
  inventoryItemId: uuid('inventory_item_id')
    .notNull()
    .references(() => inventoryItems.id),
  quantity: decimal('quantity', { precision: 10, scale: 3 }).notNull(),
  unitCost: decimal('unit_cost', { precision: 10, scale: 2 }).notNull(),
  receivedQty: decimal('received_qty', { precision: 10, scale: 3 }).default('0'),
});
