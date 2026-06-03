import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  date,
  time,
  jsonb,
} from 'drizzle-orm/pg-core';
import { deliveryStatusEnum, reservationStatusEnum } from './enums.js';
import { restaurants, users } from './restaurants.js';
import { orders } from './orders.js';
import { customers } from './customers.js';
import { tables } from './tables.js';

// ─── delivery_zones ───────────────────────────────────────────────────────────

export const deliveryZones = pgTable('delivery_zones', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  polygon: jsonb('polygon'),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  minOrder: decimal('min_order', { precision: 10, scale: 2 }).notNull().default('0'),
  estimatedTimeMin: integer('estimated_time_min'),
  isActive: boolean('is_active').notNull().default(true),
});

// ─── riders ───────────────────────────────────────────────────────────────────

export const riders = pgTable('riders', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  vehicleType: text('vehicle_type'),
  licensePlate: text('license_plate'),
  isAvailable: boolean('is_available').notNull().default(true),
  currentLocation: jsonb('current_location'),
});

// ─── delivery_orders ──────────────────────────────────────────────────────────

export const deliveryOrders = pgTable('delivery_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  riderId: uuid('rider_id').references(() => riders.id),
  zoneId: uuid('zone_id').references(() => deliveryZones.id),
  customerAddress: text('customer_address').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerLat: decimal('customer_lat', { precision: 10, scale: 7 }),
  customerLng: decimal('customer_lng', { precision: 10, scale: 7 }),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  status: deliveryStatusEnum('status').notNull().default('pending'),
  assignedAt: timestamp('assigned_at', { withTimezone: true }),
  pickedUpAt: timestamp('picked_up_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  proofPhotoUrl: text('proof_photo_url'),
  proofOtp: text('proof_otp'),
  notes: text('notes'),
});

// ─── reservations ─────────────────────────────────────────────────────────────

export const reservations = pgTable('reservations', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  customerId: uuid('customer_id').references(() => customers.id),
  tableId: uuid('table_id').references(() => tables.id),
  date: date('date').notNull(),
  time: time('time').notNull(),
  partySize: integer('party_size').notNull().default(2),
  status: reservationStatusEnum('status').notNull().default('pending'),
  depositAmount: decimal('deposit_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  depositPaid: boolean('deposit_paid').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
