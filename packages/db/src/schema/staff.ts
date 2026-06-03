import {
  pgTable,
  uuid,
  text,
  boolean,
  decimal,
  timestamp,
  date,
  time,
} from 'drizzle-orm/pg-core';
import { shiftStatusEnum } from './enums.js';
import { restaurants, users } from './restaurants.js';

// ─── shifts ───────────────────────────────────────────────────────────────────

export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  actualStart: timestamp('actual_start', { withTimezone: true }),
  actualEnd: timestamp('actual_end', { withTimezone: true }),
  status: shiftStatusEnum('status').notNull().default('scheduled'),
  notes: text('notes'),
});

// ─── attendance_records ───────────────────────────────────────────────────────

export const attendanceRecords = pgTable('attendance_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  clockIn: timestamp('clock_in', { withTimezone: true }).notNull(),
  clockOut: timestamp('clock_out', { withTimezone: true }),
  hoursWorked: decimal('hours_worked', { precision: 5, scale: 2 }),
  isLate: boolean('is_late').notNull().default(false),
  notes: text('notes'),
});

// ─── salary_advances ──────────────────────────────────────────────────────────

export const salaryAdvances = pgTable('salary_advances', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: date('date').notNull(),
  note: text('note'),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
