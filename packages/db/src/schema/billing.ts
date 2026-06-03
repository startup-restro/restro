import {
  pgTable,
  uuid,
  text,
  boolean,
  decimal,
  timestamp,
  jsonb,
  date,
} from 'drizzle-orm/pg-core';
import {
  billStatusEnum,
  discountTypeEnum,
  paymentMethodTypeEnum,
  paymentStatusEnum,
  khataEntryTypeEnum,
} from './enums.js';
import { restaurants, users } from './restaurants.js';
import { orders } from './orders.js';
import { customers } from './customers.js';

// ─── bills ────────────────────────────────────────────────────────────────────

export const bills = pgTable('bills', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id),
  customerId: uuid('customer_id').references(() => customers.id),
  invoiceNumber: text('invoice_number').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  discountType: discountTypeEnum('discount_type'),
  discountDetail: text('discount_detail'),
  serviceCharge: decimal('service_charge', { precision: 10, scale: 2 }).notNull().default('0'),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  taxBreakdown: jsonb('tax_breakdown').default([]),
  tipAmount: decimal('tip_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  roundOff: decimal('round_off', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: billStatusEnum('status').notNull().default('draft'),
  notes: text('notes'),
  createdBy: uuid('created_by').references(() => users.id),
  voidedBy: uuid('voided_by').references(() => users.id),
  voidReason: text('void_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── payments ─────────────────────────────────────────────────────────────────

export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  billId: uuid('bill_id')
    .notNull()
    .references(() => bills.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id),
  method: paymentMethodTypeEnum('method').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  referenceNumber: text('reference_number'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  gatewayResponse: jsonb('gateway_response'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── khata_entries ────────────────────────────────────────────────────────────

export const khataEntries = pgTable('khata_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id')
    .notNull()
    .references(() => customers.id),
  billId: uuid('bill_id').references(() => bills.id),
  type: khataEntryTypeEnum('type').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  balanceAfter: decimal('balance_after', { precision: 10, scale: 2 }).notNull(),
  note: text('note'),
  dueDate: date('due_date'),
  paymentMethod: paymentMethodTypeEnum('payment_method'),
  reminderSent: boolean('reminder_sent').notNull().default(false),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
