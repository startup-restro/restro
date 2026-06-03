import {
  pgTable,
  uuid,
  text,
  boolean,
  decimal,
  timestamp,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';
import { subscriptionTierEnum, deviceTypeEnum } from './enums.js';

// ─── restaurants ──────────────────────────────────────────────────────────────

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull().default('restaurant'),
  country: text('country').notNull().default('NP'),
  currency: text('currency').notNull().default('NPR'),
  timezone: text('timezone').notNull().default('Asia/Kathmandu'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  city: text('city'),
  lat: decimal('lat', { precision: 10, scale: 7 }),
  lng: decimal('lng', { precision: 10, scale: 7 }),
  logoUrl: text('logo_url'),
  coverUrl: text('cover_url'),
  taxConfig: jsonb('tax_config').notNull().default([]),
  settings: jsonb('settings').notNull().default({}),
  subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('free'),
  subscriptionExpiresAt: timestamp('subscription_expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── users ────────────────────────────────────────────────────────────────────

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    phone: text('phone').notNull(),
    email: text('email'),
    name: text('name').notNull(),
    role: text('role').notNull().default('waiter'),
    pin: text('pin'),
    avatarUrl: text('avatar_url'),
    language: text('language').notNull().default('en'),
    permissions: jsonb('permissions').notNull().default([]),
    hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }),
    monthlySalary: decimal('monthly_salary', { precision: 10, scale: 2 }),
    isActive: boolean('is_active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('users_restaurant_id_phone_unique').on(t.restaurantId, t.phone)],
);

// ─── devices ──────────────────────────────────────────────────────────────────

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurant_id')
    .notNull()
    .references(() => restaurants.id, { onDelete: 'cascade' }),
  deviceType: deviceTypeEnum('device_type').notNull(),
  deviceName: text('device_name'),
  deviceId: text('device_id').notNull(),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  lastUserId: uuid('last_user_id').references(() => users.id),
  isTrusted: boolean('is_trusted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
