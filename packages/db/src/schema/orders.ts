import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';
import { orderTypeEnum, orderStatusEnum, kotStatusEnum } from './enums.js';
import { restaurants, users } from './restaurants.js';
import { tables } from './tables.js';
import { customers } from './customers.js';
import { menuItems } from './menu.js';
import { menuVariants } from './menu.js';

// ─── orders ─────���─────────────────────────────────────────────────────────────

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  orderNumber: serial('order_number'),
  tableId: uuid('table_id').references(() => tables.id),
  customerId: uuid('customer_id').references(() => customers.id),
  type: orderTypeEnum('type').notNull().default('dine_in'),
  status: orderStatusEnum('status').notNull().default('draft'),
  channel: text('channel').notNull().default('pos'),
  aggregator: text('aggregator'),
  guestCount: integer('guest_count'),
  notes: text('notes'),
  priority: text('priority').default('normal'),
  createdBy: uuid('created_by').references(() => users.id),
  cancelledReason: text('cancelled_reason'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  syncId: uuid('sync_id'),
  deviceId: text('device_id'),
  vectorClock: jsonb('vector_clock').default({}),
});

// ─── order_items ──────────────────────────────────────────────────────────────

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  menuItemId: uuid('menu_item_id')
    .notNull()
    .references(() => menuItems.id),
  variantId: uuid('variant_id').references(() => menuVariants.id),
  quantity: integer('quantity').notNull().default(1),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  modifiers: jsonb('modifiers').default([]),
  notes: text('notes'),
  status: kotStatusEnum('status').notNull().default('pending'),
  sentToKitchenAt: timestamp('sent_to_kitchen_at', { withTimezone: true }),
  preparedAt: timestamp('prepared_at', { withTimezone: true }),
  isVoid: boolean('is_void').notNull().default(false),
  voidReason: text('void_reason'),
  voidBy: uuid('void_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── kitchen_tickets ──────────────────────────────────────────────────────────

export const kitchenTickets = pgTable('kitchen_tickets', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  ticketNumber: serial('ticket_number'),
  station: text('station').notNull().default('main'),
  items: jsonb('items').notNull(),
  status: kotStatusEnum('status').notNull().default('pending'),
  priority: text('priority').default('normal'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  prepTimeSecs: integer('prep_time_secs'),
  createdBy: uuid('created_by').references(() => users.id),
  completedBy: uuid('completed_by').references(() => users.id),
});
