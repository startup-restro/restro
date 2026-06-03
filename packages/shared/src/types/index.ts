// ─── Core Entity Types ───────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country: string;
  currency: string;
  timezone: string;
  lat?: string;
  lng?: string;
  logoUrl?: string;
  coverUrl?: string;
  taxConfig: unknown[];
  settings: Record<string, unknown>;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  isActive: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionTier = 'free' | 'pro' | 'pro_plus' | 'enterprise';

export interface User {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email?: string;
  pin?: string;
  role: UserRole;
  avatarUrl?: string;
  language: string;
  permissions: unknown[];
  hourlyRate?: string;
  monthlySalary?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'owner' | 'manager' | 'cashier' | 'waiter' | 'kitchen' | 'delivery';

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  nameLocal?: string;
  description?: string;
  basePrice: string;
  costPrice?: string;
  photoUrl?: string;
  isAvailable: boolean;
  isPopular: boolean;
  dietaryTags: string[];
  allergens: string[];
  prepTimeMin?: number;
  calories?: number;
  sortOrder: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  nameLocal?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  schedule?: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  restaurantId: string;
  spaceId: string;
  name: string;
  capacity: number;
  shape: string;
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  status: TableStatus;
  currentOrderId?: string;
  occupiedAt?: Date;
  serverId?: string;
  qrCode?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'blocked';

export interface Order {
  id: string;
  restaurantId: string;
  orderNumber: number;
  tableId?: string;
  customerId?: string;
  type: OrderType;
  status: OrderStatus;
  channel: string;
  aggregator?: string;
  guestCount?: number;
  notes?: string;
  priority?: string;
  createdBy?: string;
  cancelledReason?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery' | 'online' | 'reservation';

export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  variantId?: string;
  quantity: number;
  unitPrice: string;
  modifiers?: unknown[];
  notes?: string;
  status: KOTStatus;
  sentToKitchenAt?: Date;
  preparedAt?: Date;
  isVoid: boolean;
  voidReason?: string;
  voidBy?: string;
  createdAt: Date;
}

export type KOTStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'cancelled';

export interface Bill {
  id: string;
  restaurantId: string;
  orderId: string;
  customerId?: string;
  invoiceNumber: string;
  subtotal: string;
  discountAmount: string;
  discountType?: DiscountType;
  discountDetail?: string;
  serviceCharge: string;
  taxAmount: string;
  taxBreakdown?: unknown[];
  tipAmount: string;
  roundOff: string;
  total: string;
  status: BillStatus;
  notes?: string;
  createdBy?: string;
  voidedBy?: string;
  voidReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BillStatus = 'draft' | 'finalized' | 'paid' | 'partially_paid' | 'void';

export type DiscountType = 'percentage' | 'flat' | 'coupon' | 'loyalty' | 'employee' | 'happy_hour';

export type PaymentMethod =
  | 'cash'
  | 'esewa'
  | 'khalti'
  | 'fonepay'
  | 'connectips'
  | 'upi'
  | 'phonepe'
  | 'gpay'
  | 'paytm'
  | 'card'
  | 'bkash'
  | 'nagad'
  | 'khata'
  | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Customer {
  id: string;
  restaurantId: string;
  phone: string;
  name?: string;
  email?: string;
  notes?: string;
  dietaryPreferences: string[];
  allergens: string[];
  tags: string[];
  totalVisits: number;
  totalSpent: string;
  avgOrderValue: string;
  loyaltyPoints: number;
  loyaltyTier: string;
  creditLimit: string;
  creditBalance: string;
  lastVisitAt?: Date;
  birthday?: string;
  isActive: boolean;
  doNotDisturb: boolean;
  createdAt: Date;
  updatedAt: Date;
}
