import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  date,
  unique,
} from 'drizzle-orm/pg-core';
import { loyaltyTxnTypeEnum } from './enums.js';
import { restaurants } from './restaurants.js';

// ─── customers ────────────────────────────────────────────────────────────────

export const customers = pgTable(
  'customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    phone: text('phone').notNull(),
    name: text('name'),
    email: text('email'),
    notes: text('notes'),
    dietaryPreferences: text('dietary_preferences').array().default([]),
    allergens: text('allergens').array().default([]),
    tags: text('tags').array().default([]),
    totalVisits: integer('total_visits').notNull().default(0),
    totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).notNull().default('0'),
    avgOrderValue: decimal('avg_order_value', { precision: 10, scale: 2 }).notNull().default('0'),
    loyaltyPoints: integer('loyalty_points').notNull().default(0),
    loyaltyTier: text('loyalty_tier').notNull().default('bronze'),
    creditLimit: decimal('credit_limit', { precision: 10, scale: 2 }).notNull().default('0'),
    creditBalance: decimal('credit_balance', { precision: 10, scale: 2 }).notNull().default('0'),
    lastVisitAt: timestamp('last_visit_at', { withTimezone: true }),
    birthday: date('birthday'),
    isActive: boolean('is_active').notNull().default(true),
    doNotDisturb: boolean('do_not_disturb').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('customers_restaurant_id_phone_unique').on(t.restaurantId, t.phone)],
);

// ─── loyalty_transactions ─────────────────────────────────────────────────────

export const loyaltyTransactions = pgTable('loyalty_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  orderId: uuid('order_id'),
  type: loyaltyTxnTypeEnum('type').notNull(),
  points: integer('points').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
