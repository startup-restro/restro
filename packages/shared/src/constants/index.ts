// ─── User Roles ──────────────────────────────────────────────────────────────

export const USER_ROLES = [
  'super_admin',
  'owner',
  'manager',
  'captain',
  'waiter',
  'chef',
  'cashier',
  'kitchen_staff',
] as const;

export const USER_ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  super_admin: 'Super Admin',
  owner: 'Owner',
  manager: 'Manager',
  captain: 'Captain',
  waiter: 'Waiter',
  chef: 'Chef',
  cashier: 'Cashier',
  kitchen_staff: 'Kitchen Staff',
};

// ─── Order Statuses ──────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  'draft',
  'placed',
  'confirmed',
  'preparing',
  'ready',
  'served',
  'completed',
  'cancelled',
] as const;

export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> = {
  draft: 'Draft',
  placed: 'Placed',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ─── Payment Methods ─────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
  'cash',
  'card',
  'esewa',
  'khalti',
  'fonepay',
  'split',
] as const;

export const PAYMENT_METHOD_LABELS: Record<(typeof PAYMENT_METHODS)[number], string> = {
  cash: 'Cash',
  card: 'Card',
  esewa: 'eSewa',
  khalti: 'Khalti',
  fonepay: 'FonePay',
  split: 'Split Payment',
};

// ─── Table Statuses ──────────────────────────────────────────────────────────

export const TABLE_STATUSES = ['available', 'occupied', 'reserved', 'maintenance'] as const;

export const TABLE_STATUS_LABELS: Record<(typeof TABLE_STATUSES)[number], string> = {
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
  maintenance: 'Maintenance',
};

// ─── Countries ───────────────────────────────────────────────────────────────

export const COUNTRIES = [
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AE', name: 'UAE', dialCode: '+971' },
] as const;

// ─── Currencies ──────────────────────────────────────────────────────────────

export const CURRENCIES = [
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
] as const;
