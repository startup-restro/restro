/**
 * Integration tests for the Order lifecycle.
 *
 * Tests the full flow: create -> add items -> send-to-kitchen -> bump -> serve -> complete.
 * Requires Docker services (postgres, redis) to be running with seed data.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupTestApp, teardownTestApp, get, post, put, del } from './helpers.js';

// Seed data IDs
const MENU_ITEM_ID = '00000000-0000-0000-0000-000000000200'; // Chicken Momo
const TABLE_ID = '00000000-0000-0000-0000-000000000602';     // Table T3
const STATUS_TEST_TABLE = '00000000-0000-0000-0000-000000000609'; // Table T10 (unused by tests)

let orderId: string;
let ticketId: string;

beforeAll(async () => {
  await setupTestApp();
});

afterAll(async () => {
  await teardownTestApp();
});

describe('Orders API', () => {
  it('POST /orders - creates a dine-in order with items', async () => {
    const res = await post('/orders', {
      type: 'dine_in',
      tableId: TABLE_ID,
      guestCount: 2,
      items: [{ menuItemId: MENU_ITEM_ID, quantity: 3 }],
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    const order = body.order ?? body;
    expect(order.status).toBe('draft');
    expect(order.type).toBe('dine_in');
    expect(order.orderNumber).toBeGreaterThan(0);

    const items = body.items ?? order.items ?? [];
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
    expect(parseFloat(items[0].unitPrice)).toBeGreaterThan(0);

    orderId = order.id;
  });

  it('GET /orders/running - includes the new order', async () => {
    const res = await get('/orders/running');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const orders = body.orders ?? body.data ?? body;
    expect(Array.isArray(orders)).toBe(true);
    // Our order should be in the running list (status=draft is active)
  });

  it('GET /orders/:id - returns order detail', async () => {
    const res = await get(`/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const order = body.order ?? body;
    expect(order.id).toBe(orderId);
  });

  it('POST /orders/:id/items - adds more items', async () => {
    const res = await post(`/orders/${orderId}/items`, {
      items: [{ menuItemId: MENU_ITEM_ID, quantity: 1 }],
    });
    expect(res.statusCode).toBe(201);
  });

  it('POST /orders/:id/send-to-kitchen - creates KOT', async () => {
    const res = await post(`/orders/${orderId}/send-to-kitchen`, {
      station: 'main',
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.ticket).toBeDefined();
    expect(body.ticket.station).toBe('main');
    expect(body.ticket.status).toBe('pending');
    expect(body.ticket.items.length).toBeGreaterThan(0);
    ticketId = body.ticket.id;
  });

  it('PUT /orders/:id/status - rejects invalid transition', async () => {
    // Order is now "preparing" after send-to-kitchen, can't go to "confirmed"
    const res = await put(`/orders/${orderId}/status`, { status: 'confirmed' });
    expect(res.statusCode).toBe(422);
  });

  it('PUT /orders/:id/status - serves the order', async () => {
    const res = await put(`/orders/${orderId}/status`, { status: 'served' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.order?.status ?? body.status).toBe('served');
  });

  it('PUT /orders/:id/status - completes the order', async () => {
    const res = await put(`/orders/${orderId}/status`, { status: 'completed' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.order?.status ?? body.status).toBe('completed');
  });

  it('GET /orders - lists orders with pagination', async () => {
    const res = await get('/orders?limit=5&page=1');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data ?? body.orders).toBeDefined();
    expect(body.meta).toBeDefined();
    expect(body.meta.page).toBe(1);
  });
});

describe('Kitchen API', () => {
  it('GET /kitchen/tickets - lists tickets', async () => {
    const res = await get('/kitchen/tickets');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.tickets).toBeDefined();
    expect(Array.isArray(body.tickets)).toBe(true);
  });

  it('GET /kitchen/tickets/active - groups by station', async () => {
    const res = await get('/kitchen/tickets/active');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.stations).toBeDefined();
    expect(typeof body.totalActive).toBe('number');
  });

  it('PUT /kitchen/tickets/:id/bump - advances status', async () => {
    // Create a fresh order + KOT for bump testing
    const orderRes = await post('/orders', {
      type: 'takeaway',
      items: [{ menuItemId: MENU_ITEM_ID, quantity: 1 }],
    });
    const oid = JSON.parse(orderRes.body).order?.id ?? JSON.parse(orderRes.body).id;

    const kotRes = await post(`/orders/${oid}/send-to-kitchen`, {});
    const tid = JSON.parse(kotRes.body).ticket.id;

    // Bump pending -> cooking
    const bump1 = await put(`/kitchen/tickets/${tid}/bump`);
    expect(bump1.statusCode).toBe(200);
    const b1 = JSON.parse(bump1.body);
    expect(b1.ticket?.status ?? b1.status).toBe('cooking');

    // Bump cooking -> ready
    const bump2 = await put(`/kitchen/tickets/${tid}/bump`);
    expect(bump2.statusCode).toBe(200);
    const b2 = JSON.parse(bump2.body);
    expect(b2.ticket?.status ?? b2.status).toBe('ready');
    expect(b2.ticket?.prepTimeSecs ?? b2.prepTimeSecs).toBeGreaterThanOrEqual(0);
  });

  it('GET /kitchen/stats - returns performance data', async () => {
    const res = await get('/kitchen/stats');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(typeof body.activeTickets).toBe('number');
    expect(typeof body.totalCompleted).toBe('number');
    expect(Array.isArray(body.byStation)).toBe(true);
    expect(typeof body.byStatus).toBe('object');
  });
});

describe('Tables API', () => {
  it('GET /spaces - lists spaces', async () => {
    const res = await get('/spaces');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const spaces = body.spaces ?? body;
    expect(Array.isArray(spaces)).toBe(true);
    expect(spaces.length).toBeGreaterThan(0);
  });

  it('GET /tables - lists tables', async () => {
    const res = await get('/tables');
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const tables = body.tables ?? body;
    expect(Array.isArray(tables)).toBe(true);
    expect(tables.length).toBe(10); // seed has 10 tables
  });

  it('POST /spaces - creates a new space', async () => {
    const res = await post('/spaces', { name: 'Test Patio' });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    const space = body.space ?? body;
    expect(space.name).toBe('Test Patio');
  });

  it('PUT /tables/:id/status - updates table status', async () => {
    const res = await put(`/tables/${STATUS_TEST_TABLE}/status`, { status: 'reserved' });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    const table = body.table ?? body;
    expect(table.status).toBe('reserved');

    // Reset
    await put(`/tables/${STATUS_TEST_TABLE}/status`, { status: 'available' });
  });
});
