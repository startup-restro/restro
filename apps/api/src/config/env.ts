import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Database
  DATABASE_URL: z.string().url().default('postgresql://restroverse:restroverse_dev@localhost:5432/restroverse_dev'),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // JWT
  JWT_SECRET: z.string().min(1).default('dev-jwt-secret'),
  JWT_REFRESH_SECRET: z.string().min(1).default('dev-jwt-refresh-secret'),

  // SMS
  SMS_API_KEY: z.string().optional(),
  SMS_API_URL: z.string().url().optional(),

  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().default(9000),
  MINIO_ACCESS_KEY: z.string().default('restroverse'),
  MINIO_SECRET_KEY: z.string().default('restroverse_minio'),
  MINIO_BUCKET: z.string().default('restroverse'),

  // NATS
  NATS_URL: z.string().default('nats://localhost:4222'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
