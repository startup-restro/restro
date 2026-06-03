import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { tableStatusEnum } from './enums.js';
import { restaurants, users } from './restaurants.js';

// ─── spaces ───────────────────────────────────────────────────────────────────

export const spaces = pgTable('spaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// ─── tables ───────────────────────────────────────────────────────────────────

export const tables = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  spaceId: uuid('space_id')
    .notNull()
    .references(() => spaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  capacity: integer('capacity').notNull().default(4),
  shape: text('shape').notNull().default('square'),
  xPos: integer('x_pos').notNull().default(0),
  yPos: integer('y_pos').notNull().default(0),
  width: integer('width').notNull().default(1),
  height: integer('height').notNull().default(1),
  status: tableStatusEnum('status').notNull().default('available'),
  currentOrderId: uuid('current_order_id'),
  occupiedAt: timestamp('occupied_at', { withTimezone: true }),
  serverId: uuid('server_id').references(() => users.id),
  qrCode: text('qr_code'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
