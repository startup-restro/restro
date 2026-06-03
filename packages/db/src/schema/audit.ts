import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { restaurants, users } from './restaurants.js';

// ─── audit_log ────────────────────────────────────────────────────────────────

export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id'),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  ipAddress: text('ip_address'),
  deviceId: text('device_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── sync_log ─────────────────────────────────────────────────────────────────

export const syncLog = pgTable('sync_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  deviceId: text('device_id').notNull(),
  syncType: text('sync_type').notNull(),
  recordsCount: integer('records_count').notNull().default(0),
  bytesTransferred: integer('bytes_transferred').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  status: text('status').notNull().default('success'),
  error: text('error'),
});
