// ─── User Roles ──────────────────────────────────────────────────────────────

export const USER_ROLES = [
  'owner',
  'manager',
  'cashier',
  'waiter',
  'kitchen',
  'delivery',
] as const;

export const USER_ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  owner: 'Owner',
  manager: 'Manager',
  cashier: 'Cashier',
  waiter: 'Waiter',
  kitchen: 'Kitchen',
  delivery: 'Delivery',
};

// ─── Order Statuses ──────────────────────────────────���───────────────────────

export const ORDER_STATUSES = [
  'draft',
  'confirmed',
  'preparing',
  'ready',
  'served',
  'completed',
  'cancelled',
] as const;

export const ORDER_STATUS_LABELS: Record<(typeof ORDER_STATUSES)[number], string> = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

// ─── KOT Statuses ────────────────────────────────────────────────────────────

export const KOT_STATUSES = [
  'pending',
  'cooking',
  'ready',
  'served',
  'cancelled',
] as const;

export const KOT_STATUS_LABELS: Record<(typeof KOT_STATUSES)[number], string> = {
  pending: 'Pending',
  cooking: 'Cooking',
  ready: 'Ready',
  served: 'Served',
  cancelled: 'Cancelled',
};

// ─── Bill Statuses ───────────────────────────────────────────────────────────

export const BILL_STATUSES = [
  'draft',
  'finalized',
  'paid',
  'partially_paid',
  'void',
] as const;

export const BILL_STATUS_LABELS: Record<(typeof BILL_STATUSES)[number], string> = {
  draft: 'Draft',
  finalized: 'Finalized',
  paid: 'Paid',
  partially_paid: 'Partially Paid',
  void: 'Void',
};

// ─── Payment Methods ─────────────────────────────────────────────────────────

export const PAYMENT_METHODS = [
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
] as const;

export const PAYMENT_METHOD_LABELS: Record<(typeof PAYMENT_METHODS)[number], string> = {
  cash: 'Cash',
  esewa: 'eSewa',
  khalti: 'Khalti',
  fonepay: 'FonePay',
  connectips: 'ConnectIPS',
  upi: 'UPI',
  phonepe: 'PhonePe',
  gpay: 'GPay',
  paytm: 'Paytm',
  card: 'Card',
  bkash: 'bKash',
  nagad: 'Nagad',
  khata: 'Khata',
  other: 'Other',
};

// ─── Table Statuses ──────────────────────────────────────────────────────────

export const TABLE_STATUSES = [
  'available',
  'occupied',
  'reserved',
  'cleaning',
  'blocked',
] as const;

export const TABLE_STATUS_LABELS: Record<(typeof TABLE_STATUSES)[number], string> = {
  available: 'Available',
  occupied: 'Occupied',
  reserved: 'Reserved',
  cleaning: 'Cleaning',
  blocked: 'Blocked',
};

// ─── Countries ───────────────────────────────────────────────────────────────

export const COUNTRIES = [
  { code: 'NP', name: 'Nepal', dialCode: '+977' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'AE', name: 'UAE', dialCode: '+971' },
] as const;

// ─── Currencies ──────────────────────────────────────────────────────────────

export const CURRENCIES = [
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'रू' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
] as const;
