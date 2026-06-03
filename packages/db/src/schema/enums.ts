import { pgEnum } from 'drizzle-orm/pg-core';

export const subscriptionTierEnum = pgEnum('subscription_tier', [
  'free',
  'pro',
  'pro_plus',
  'enterprise',
]);

export const orderTypeEnum = pgEnum('order_type', [
  'dine_in',
  'takeaway',
  'delivery',
  'online',
  'reservation',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'draft',
  'confirmed',
  'preparing',
  'ready',
  'served',
  'completed',
  'cancelled',
]);

export const tableStatusEnum = pgEnum('table_status', [
  'available',
  'occupied',
  'reserved',
  'cleaning',
  'blocked',
]);

export const paymentMethodTypeEnum = pgEnum('payment_method_type', [
  'cash',
  'esewa',
  'khalti',
  'fonepay',
  'connectips',
  'upi',
  'phonepe',
  'gpay',
  'paytm',
  'card',
  'bkash',
  'nagad',
  'khata',
  'other',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const billStatusEnum = pgEnum('bill_status', [
  'draft',
  'finalized',
  'paid',
  'partially_paid',
  'void',
]);

export const stockMovementTypeEnum = pgEnum('stock_movement_type', [
  'purchase',
  'sale',
  'waste',
  'transfer',
  'adjustment',
  'return',
]);

export const deliveryStatusEnum = pgEnum('delivery_status', [
  'pending',
  'assigned',
  'picked_up',
  'in_transit',
  'delivered',
  'failed',
  'cancelled',
]);

export const shiftStatusEnum = pgEnum('shift_status', [
  'scheduled',
  'active',
  'completed',
  'cancelled',
  'no_show',
]);

export const khataEntryTypeEnum = pgEnum('khata_entry_type', [
  'credit',
  'payment',
  'adjustment',
  'writeoff',
]);

export const loyaltyTxnTypeEnum = pgEnum('loyalty_txn_type', [
  'earn',
  'redeem',
  'expire',
  'adjust',
  'bonus',
]);

export const reservationStatusEnum = pgEnum('reservation_status', [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show',
]);

export const kotStatusEnum = pgEnum('kot_status', [
  'pending',
  'cooking',
  'ready',
  'served',
  'cancelled',
]);

export const discountTypeEnum = pgEnum('discount_type', [
  'percentage',
  'flat',
  'coupon',
  'loyalty',
  'employee',
  'happy_hour',
]);

export const notificationChannelEnum = pgEnum('notification_channel', [
  'push',
  'sms',
  'whatsapp',
  'email',
  'in_app',
]);

export const deviceTypeEnum = pgEnum('device_type', [
  'pos_tablet',
  'waiter_phone',
  'owner_phone',
  'kds',
  'kiosk',
  'web',
]);
