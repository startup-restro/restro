import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';

// ─── Permissions ───────────────────────────────────────────────────────────────

export const PERMISSIONS = {
  // Orders
  ORDER_CREATE: 'order:create',
  ORDER_VIEW: 'order:view',
  ORDER_CANCEL: 'order:cancel',
  ORDER_VOID_ITEM: 'order:void_item',

  // Menu
  MENU_VIEW: 'menu:view',
  MENU_MANAGE: 'menu:manage',

  // Tables
  TABLE_VIEW: 'table:view',
  TABLE_MANAGE: 'table:manage',

  // Kitchen
  KITCHEN_VIEW: 'kitchen:view',
  KITCHEN_UPDATE: 'kitchen:update',

  // Bills
  BILL_CREATE: 'bill:create',
  BILL_VOID: 'bill:void',
  BILL_DISCOUNT: 'bill:discount',
  BILL_VIEW: 'bill:view',

  // Staff
  STAFF_VIEW: 'staff:view',
  STAFF_MANAGE: 'staff:manage',

  // Reports
  REPORT_VIEW: 'report:view',

  // Settings
  SETTINGS_MANAGE: 'settings:manage',

  // Inventory
  INVENTORY_VIEW: 'inventory:view',
  INVENTORY_MANAGE: 'inventory:manage',

  // Customers
  CUSTOMER_VIEW: 'customer:view',
  CUSTOMER_MANAGE: 'customer:manage',

  // Khata
  KHATA_VIEW: 'khata:view',
  KHATA_MANAGE: 'khata:manage',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ─── Role-Permission Mappings ──────────────────────────────────────────────────

const P = PERMISSIONS;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: Object.values(PERMISSIONS),

  manager: [
    P.ORDER_CREATE, P.ORDER_VIEW, P.ORDER_CANCEL, P.ORDER_VOID_ITEM,
    P.MENU_VIEW, P.MENU_MANAGE,
    P.TABLE_VIEW, P.TABLE_MANAGE,
    P.KITCHEN_VIEW, P.KITCHEN_UPDATE,
    P.BILL_CREATE, P.BILL_VOID, P.BILL_DISCOUNT, P.BILL_VIEW,
    P.STAFF_VIEW,
    P.REPORT_VIEW,
    P.INVENTORY_VIEW, P.INVENTORY_MANAGE,
    P.CUSTOMER_VIEW, P.CUSTOMER_MANAGE,
    P.KHATA_VIEW, P.KHATA_MANAGE,
  ],

  cashier: [
    P.ORDER_CREATE, P.ORDER_VIEW,
    P.MENU_VIEW,
    P.TABLE_VIEW,
    P.BILL_CREATE, P.BILL_DISCOUNT, P.BILL_VIEW,
    P.CUSTOMER_VIEW,
    P.KHATA_VIEW,
  ],

  waiter: [
    P.ORDER_CREATE, P.ORDER_VIEW,
    P.MENU_VIEW,
    P.TABLE_VIEW,
    P.KITCHEN_VIEW,
    P.CUSTOMER_VIEW,
  ],

  kitchen: [
    P.ORDER_VIEW,
    P.KITCHEN_VIEW, P.KITCHEN_UPDATE,
    P.INVENTORY_VIEW,
  ],

  delivery: [
    P.ORDER_VIEW,
  ],
};

// ─── Discount Limits ───────────────────────────────────────────────────────────

export const DISCOUNT_LIMITS: Record<string, number> = {
  owner: 100,
  manager: 30,
  cashier: 10,
  waiter: 0,
  kitchen: 0,
  delivery: 0,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Get effective permissions for a role, optionally merged with user-specific overrides.
 */
export function getPermissions(role: string, overrides?: string[]): string[] {
  const rolePerms = ROLE_PERMISSIONS[role] ?? [];
  if (!overrides || overrides.length === 0) return rolePerms;

  const merged = new Set([...rolePerms, ...overrides]);
  return Array.from(merged);
}

// ─── Middleware Factories ──────────────────────────────────────────────────────

/**
 * Returns a preHandler that checks if the authenticated user has ANY of the
 * listed permissions.
 */
export function requirePermission(...permissions: string[]): preHandlerHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const userPermissions = getPermissions(user.role);
    const hasPermission = permissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: `Missing required permission: ${permissions.join(' | ')}`,
      });
    }
  };
}

/**
 * Returns a preHandler that checks if the authenticated user has one of the
 * listed roles.
 */
export function requireRole(...roles: string[]): preHandlerHookHandler {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    if (!roles.includes(user.role)) {
      return reply.code(403).send({
        error: 'Forbidden',
        message: `Required role: ${roles.join(' | ')}`,
      });
    }
  };
}
