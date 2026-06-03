import { relations } from 'drizzle-orm';
import { restaurants, users } from './restaurants.js';
import { menuCategories, menuItems, menuVariants, menuModifiers, menuItemModifiers } from './menu.js';
import { spaces, tables } from './tables.js';
import { orders, orderItems } from './orders.js';

// ─── Restaurant relations ─────────────────────────────────────────────────────

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  users: many(users),
  menuCategories: many(menuCategories),
  menuModifiers: many(menuModifiers),
  spaces: many(spaces),
  orders: many(orders),
}));

// ─── User relations ───────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [users.restaurantId],
    references: [restaurants.id],
  }),
}));

// ─── Menu Category relations ──────────────────────────────────────────────────

export const menuCategoriesRelations = relations(menuCategories, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuCategories.restaurantId],
    references: [restaurants.id],
  }),
  menuItems: many(menuItems),
}));

// ─── Menu Item relations ──────────────────────────────────────────────────────

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  variants: many(menuVariants),
  itemModifiers: many(menuItemModifiers),
}));

// ─── Menu Variant relations ───────────────────────────────────────────────────

export const menuVariantsRelations = relations(menuVariants, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [menuVariants.menuItemId],
    references: [menuItems.id],
  }),
}));

// ─── Menu Modifier relations ──────────────────────────────────────────────────

export const menuModifiersRelations = relations(menuModifiers, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuModifiers.restaurantId],
    references: [restaurants.id],
  }),
  itemModifiers: many(menuItemModifiers),
}));

// ─── Menu Item Modifier (junction) relations ──────────────────────────────────

export const menuItemModifiersRelations = relations(menuItemModifiers, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [menuItemModifiers.menuItemId],
    references: [menuItems.id],
  }),
  modifier: one(menuModifiers, {
    fields: [menuItemModifiers.modifierId],
    references: [menuModifiers.id],
  }),
}));

// ─── Space relations ──────────────────────────────────────────────────────────

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [spaces.restaurantId],
    references: [restaurants.id],
  }),
  tables: many(tables),
}));

// ─── Table relations ──────────────────────────────────────────────────────────

export const tablesRelations = relations(tables, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
  space: one(spaces, {
    fields: [tables.spaceId],
    references: [spaces.id],
  }),
}));

// ─── Order relations ──────────────────────────────────────────────────────────

export const ordersRelations = relations(orders, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [orders.restaurantId],
    references: [restaurants.id],
  }),
  table: one(tables, {
    fields: [orders.tableId],
    references: [tables.id],
  }),
  orderItems: many(orderItems),
}));

// ─── Order Item relations ─────────────────────────────────────────────────────

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));
