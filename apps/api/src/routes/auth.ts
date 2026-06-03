import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { users, restaurants, devices } from '@restroverse/db/schema';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { getPermissions } from '../middleware/rbac.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SendOtpBody {
  phone: string;
  countryCode: string;
}

interface VerifyOtpBody {
  phone: string;
  otp: string;
  deviceId?: string;
  deviceType?: string;
}

interface RefreshBody {
  refreshToken: string;
}

interface StaffPinBody {
  pin: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function generateOtp(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
}

function signAccessToken(
  fastify: FastifyInstance,
  payload: { userId: string; restaurantId: string; role: string; deviceId?: string },
): string {
  return fastify.jwt.sign(payload, { expiresIn: '15m' });
}

function signRefreshToken(
  fastify: FastifyInstance,
  payload: { userId: string; tokenId: string },
): string {
  // Refresh tokens use the same JWT secret but with longer expiry.
  // Cast needed because refresh token payload differs from access token payload.
  return (fastify.jwt.sign as (p: unknown, o: object) => string)(payload, { expiresIn: '30d' });
}

function signTempToken(
  fastify: FastifyInstance,
  payload: { phone: string; isNewUser: true },
): string {
  // Temp token for new user onboarding flow - different payload shape.
  return (fastify.jwt.sign as (p: unknown, o: object) => string)(payload, { expiresIn: '30m' });
}

// ─── Route Registration ────────────────────────────────────────────────────────

export default async function authRoutes(fastify: FastifyInstance) {
  // ── POST /auth/send-otp ──────────────────────────────────────────────────────

  fastify.post<{ Body: SendOtpBody }>(
    '/send-otp',
    {
      schema: {
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['phone', 'countryCode'],
          properties: {
            phone: { type: 'string' },
            countryCode: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { phone, countryCode } = request.body;

      // Rate limit: max 5 attempts per hour
      const attemptKey = `otp-attempts:${phone}`;
      const attempts = await fastify.redis.get(attemptKey);
      if (attempts && parseInt(attempts, 10) >= 5) {
        return reply.code(429).send({
          error: 'Too Many Requests',
          message: 'Too many OTP attempts. Try again later.',
        });
      }

      // Generate and store OTP
      const otp = generateOtp();
      const otpKey = `otp:${phone}`;

      await fastify.redis.setex(otpKey, 300, otp); // 5 min TTL
      await fastify.redis.incr(attemptKey);
      // Set TTL only on first attempt
      if (!attempts) {
        await fastify.redis.expire(attemptKey, 3600); // 1 hour
      }

      // Send OTP (countryCode used for SMS gateway routing)
      if (env.NODE_ENV === 'development') {
        fastify.log.info({ phone, countryCode, otp }, 'OTP generated (dev mode)');
      } else {
        // TODO: Integrate SMS gateway (e.g., Sparrow SMS for Nepal)
        fastify.log.info({ phone, countryCode }, 'Sending OTP via SMS gateway');
      }

      return { success: true, message: 'OTP sent' };
    },
  );

  // ── POST /auth/verify-otp ────────────────────────────────────────────────────

  fastify.post<{ Body: VerifyOtpBody }>(
    '/verify-otp',
    {
      schema: {
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['phone', 'otp'],
          properties: {
            phone: { type: 'string' },
            otp: { type: 'string' },
            deviceId: { type: 'string' },
            deviceType: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { phone, otp, deviceId, deviceType } = request.body;

      // Verify OTP
      const otpKey = `otp:${phone}`;
      const storedOtp = await fastify.redis.get(otpKey);

      if (!storedOtp || storedOtp !== otp) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired OTP',
        });
      }

      // OTP is valid, delete it
      await fastify.redis.del(otpKey);
      await fastify.redis.del(`otp-attempts:${phone}`);

      // Look up user by phone
      const userRows = await fastify.db
        .select()
        .from(users)
        .where(eq(users.phone, phone))
        .limit(1);

      // New user: no account found
      if (userRows.length === 0) {
        const tempToken = signTempToken(fastify, { phone, isNewUser: true });
        return {
          isNewUser: true,
          tempToken,
        };
      }

      const user = userRows[0]!;

      // Fetch restaurant
      const restaurantRows = await fastify.db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, user.restaurantId))
        .limit(1);

      const restaurant = restaurantRows[0];

      if (!restaurant) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'Restaurant not found',
        });
      }

      // Generate tokens
      const tokenId = crypto.randomUUID();
      const accessToken = signAccessToken(fastify, {
        userId: user.id,
        restaurantId: user.restaurantId,
        role: user.role,
        deviceId,
      });
      const refreshToken = signRefreshToken(fastify, {
        userId: user.id,
        tokenId,
      });

      // Store refresh token in Redis (30 days TTL)
      const refreshKey = `refresh:${user.id}:${tokenId}`;
      await fastify.redis.setex(refreshKey, 30 * 24 * 60 * 60, 'valid');

      // Register/update device
      if (deviceId && deviceType) {
        await upsertDevice(fastify, {
          restaurantId: user.restaurantId,
          deviceId,
          deviceType,
          userId: user.id,
        });
      }

      // Update last login
      await fastify.db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id));

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          restaurantId: user.restaurantId,
        },
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
        },
      };
    },
  );

  // ── POST /auth/refresh ───────────────────────────────────────────────────────

  fastify.post<{ Body: RefreshBody }>(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body;

      let payload: { userId: string; tokenId: string };
      try {
        payload = fastify.jwt.verify<{ userId: string; tokenId: string }>(refreshToken);
      } catch {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid or expired refresh token',
        });
      }

      // Check if refresh token exists in Redis
      const refreshKey = `refresh:${payload.userId}:${payload.tokenId}`;
      const isValid = await fastify.redis.get(refreshKey);

      if (!isValid) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Refresh token has been revoked',
        });
      }

      // Token rotation: invalidate old token
      await fastify.redis.del(refreshKey);

      // Look up user
      const userRows = await fastify.db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      const user = userRows[0];
      if (!user) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'User not found',
        });
      }

      // Issue new token pair
      const newTokenId = crypto.randomUUID();
      const accessToken = signAccessToken(fastify, {
        userId: user.id,
        restaurantId: user.restaurantId,
        role: user.role,
      });
      const newRefreshToken = signRefreshToken(fastify, {
        userId: user.id,
        tokenId: newTokenId,
      });

      // Store new refresh token
      await fastify.redis.setex(
        `refresh:${user.id}:${newTokenId}`,
        30 * 24 * 60 * 60,
        'valid',
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    },
  );

  // ── POST /auth/staff-pin ─────────────────────────────────────────────────────

  fastify.post<{ Body: StaffPinBody }>(
    '/staff-pin',
    {
      preHandler: [fastify.authenticate],
      schema: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['pin'],
          properties: {
            pin: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { pin } = request.body;
      const currentUser = request.user!;

      // Find all active users in the same restaurant with a PIN set
      const staffMembers = await fastify.db
        .select()
        .from(users)
        .where(
          and(
            eq(users.restaurantId, currentUser.restaurantId),
            eq(users.isActive, true),
          ),
        );

      // Check PIN against each staff member (PIN is unique per restaurant)
      let matchedUser: typeof staffMembers[0] | null = null;
      for (const staff of staffMembers) {
        if (!staff.pin) continue;
        const isMatch = await bcrypt.compare(pin, staff.pin);
        if (isMatch) {
          matchedUser = staff;
          break;
        }
      }

      if (!matchedUser) {
        return reply.code(401).send({
          error: 'Unauthorized',
          message: 'Invalid PIN',
        });
      }

      // Issue new access token for the matched staff member
      const accessToken = signAccessToken(fastify, {
        userId: matchedUser.id,
        restaurantId: matchedUser.restaurantId,
        role: matchedUser.role,
        deviceId: currentUser.deviceId,
      });

      return {
        accessToken,
        user: {
          id: matchedUser.id,
          name: matchedUser.name,
          role: matchedUser.role,
        },
      };
    },
  );

  // ── GET /auth/me ─────────────────────────────────────────────────────────────

  fastify.get(
    '/me',
    {
      preHandler: [fastify.authenticate],
      schema: { tags: ['Auth'], security: [{ bearerAuth: [] }] },
    },
    async (request, reply) => {
      const currentUser = request.user!;

      const userRows = await fastify.db
        .select()
        .from(users)
        .where(eq(users.id, currentUser.userId))
        .limit(1);

      const user = userRows[0];
      if (!user) {
        return reply.code(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      const restaurantRows = await fastify.db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, user.restaurantId))
        .limit(1);

      const restaurant = restaurantRows[0];

      const permissions = getPermissions(
        user.role,
        Array.isArray(user.permissions) ? (user.permissions as string[]) : undefined,
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          phone: user.phone,
          email: user.email,
          avatarUrl: user.avatarUrl,
          language: user.language,
          restaurantId: user.restaurantId,
        },
        restaurant: restaurant
          ? {
              id: restaurant.id,
              name: restaurant.name,
              slug: restaurant.slug,
              type: restaurant.type,
              currency: restaurant.currency,
              timezone: restaurant.timezone,
            }
          : null,
        permissions,
      };
    },
  );

  // ── POST /auth/logout ────────────────────────────────────────────────────────

  fastify.post(
    '/logout',
    {
      preHandler: [fastify.authenticate],
      schema: { tags: ['Auth'], security: [{ bearerAuth: [] }] },
    },
    async (request, _reply) => {
      const currentUser = request.user!;

      // Delete all refresh tokens for this user
      // We use a scan pattern since we might not know the exact tokenId
      const pattern = `refresh:${currentUser.userId}:*`;
      let cursor = '0';
      do {
        const [nextCursor, keys] = await fastify.redis.scan(
          cursor,
          'MATCH',
          pattern,
          'COUNT',
          100,
        );
        cursor = nextCursor;
        if (keys.length > 0) {
          await fastify.redis.del(...keys);
        }
      } while (cursor !== '0');

      return { success: true };
    },
  );
}

// ─── Device Management ─────────────────────────────────────────────────────────

async function upsertDevice(
  fastify: FastifyInstance,
  opts: {
    restaurantId: string;
    deviceId: string;
    deviceType: string;
    userId: string;
  },
) {
  // Check if device already exists
  const existing = await fastify.db
    .select()
    .from(devices)
    .where(
      and(
        eq(devices.restaurantId, opts.restaurantId),
        eq(devices.deviceId, opts.deviceId),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing device
    await fastify.db
      .update(devices)
      .set({
        lastUserId: opts.userId,
        lastSyncAt: new Date(),
      })
      .where(eq(devices.id, existing[0]!.id));
  } else {
    // Insert new device
    await fastify.db.insert(devices).values({
      restaurantId: opts.restaurantId,
      deviceId: opts.deviceId,
      deviceType: opts.deviceType as any,
      lastUserId: opts.userId,
      lastSyncAt: new Date(),
    });
  }
}
