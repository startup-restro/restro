import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const connectionString = process.env.DATABASE_URL!;

// For query purposes
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;

export { schema };

// Re-export all schema tables, enums, and relations for direct imports
export * from './schema/index.js';
