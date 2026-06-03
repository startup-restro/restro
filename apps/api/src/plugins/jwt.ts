import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

export default fp(
  async (fastify) => {
    await fastify.register(fastifyJwt, {
      secret: env.JWT_SECRET,
      sign: {
        expiresIn: '15m',
      },
    });

    fastify.decorate(
      'authenticate',
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
          const decoded = request.user as Record<string, unknown>;
          request.user = {
            userId: decoded.userId as string,
            restaurantId: decoded.restaurantId as string,
            role: decoded.role as string,
            deviceId: decoded.deviceId as string | undefined,
          };
        } catch {
          reply.code(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
        }
      },
    );
  },
  { name: 'jwt', dependencies: ['db'] },
);
