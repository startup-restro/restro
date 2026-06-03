import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
} from 'drizzle-orm/pg-core';
import { notificationChannelEnum } from './enums.js';
import { restaurants } from './restaurants.js';

// ─── tax_configs ──────────────────────────────────────────────────────────────

export const taxConfigs = pgTable('tax_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  rate: decimal('rate', { precision: 5, scale: 2 }).notNull(),
  isInclusive: boolean('is_inclusive').notNull().default(false),
  appliesTo: text('applies_to').notNull().default('all'),
  isActive: boolean('is_active').notNull().default(true),
});

// ─── printer_configs ──────────────────────────────────────────────────────────

export const printerConfigs = pgTable('printer_configs', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: text('type').notNull(),
  connectionString: text('connection_string'),
  paperWidth: integer('paper_width').notNull().default(80),
  station: text('station').notNull().default('main'),
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
});

// ─── notification_templates ───────────────────────────────────────────────────

export const notificationTemplates = pgTable('notification_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  channel: notificationChannelEnum('channel').notNull(),
  language: text('language').notNull().default('en'),
  subject: text('subject'),
  body: text('body').notNull(),
  variables: text('variables').array().default([]),
  isActive: boolean('is_active').notNull().default(true),
});
