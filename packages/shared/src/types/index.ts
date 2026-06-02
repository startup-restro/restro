// ─── Core Entity Types ───────────────────────────────────────────────────────

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
  taxRate: number;
  serviceChargeRate: number;
  logoUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email?: string;
  pin?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | 'super_admin'
  | 'owner'
  | 'manager'
  | 'captain'
  | 'waiter'
  | 'chef'
  | 'cashier'
  | 'kitchen_staff';

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVeg: boolean;
  isAvailable: boolean;
  preparationTime: number; // minutes
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Table {
  id: string;
  restaurantId: string;
  floorId: string;
  number: string;
  capacity: number;
  status: TableStatus;
  posX?: number;
  posY?: number;
}

export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  userId: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery' | 'online';

export type OrderStatus =
  | 'draft'
  | 'placed'
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
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: OrderItemStatus;
  modifiers?: OrderItemModifier[];
}

export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export interface OrderItemModifier {
  name: string;
  price: number;
}

export interface Bill {
  id: string;
  restaurantId: string;
  orderId: string;
  billNumber: string;
  subtotal: number;
  taxAmount: number;
  serviceCharge: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: Date;
  createdAt: Date;
}

export type PaymentMethod = 'cash' | 'card' | 'esewa' | 'khalti' | 'fonepay' | 'split';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface Customer {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: number;
  createdAt: Date;
}
