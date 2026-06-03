/**
 * Test helper: builds the Fastify app, authenticates as the seeded owner,
 * and provides convenience methods for making authenticated requests.
 */
import { buildApp } from '../app.js';
import type { FastifyInstance } from 'fastify';

let app: FastifyInstance;
let token: string;

/**
 * Boot the app and authenticate as the seed owner user.
 * Call once in beforeAll().
 */
export async function setupTestApp(): Promise<{ app: FastifyInstance; token: string }> {
  app = await buildApp();
  await app.ready();

  // Send OTP
  await app.inject({
    method: 'POST',
    url: '/auth/send-otp',
    payload: { phone: '+977-9841234567', countryCode: 'NP' },
  });

  // Get OTP from Redis (dev mode stores plain)
  const otp = await app.redis.get('otp:+977-9841234567');
  if (!otp) throw new Error('OTP not found in Redis');

  // Verify OTP
  const verifyRes = await app.inject({
    method: 'POST',
    url: '/auth/verify-otp',
    payload: { phone: '+977-9841234567', otp },
  });

  const verifyBody = JSON.parse(verifyRes.body);
  token = verifyBody.accessToken;
  if (!token) throw new Error('No accessToken in verify response');

  return { app, token };
}

/**
 * Authenticated GET request.
 */
export function get(url: string) {
  return app.inject({
    method: 'GET',
    url,
    headers: { authorization: `Bearer ${token}` },
  });
}

/**
 * Authenticated POST request.
 */
export function post(url: string, payload?: Record<string, unknown>) {
  return app.inject({
    method: 'POST',
    url,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

/**
 * Authenticated PUT request.
 */
export function put(url: string, payload?: Record<string, unknown>) {
  return app.inject({
    method: 'PUT',
    url,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

/**
 * Authenticated DELETE request.
 */
export function del(url: string, payload?: Record<string, unknown>) {
  return app.inject({
    method: 'DELETE',
    url,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

/**
 * Close the app. Call in afterAll().
 */
export async function teardownTestApp() {
  if (app) await app.close();
}
