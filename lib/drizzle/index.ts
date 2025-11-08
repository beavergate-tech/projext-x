import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Serverless Database Client
 *
 * Optimized for serverless environments (Vercel, AWS Lambda, Edge Functions)
 *
 * This configuration works with ANY PostgreSQL provider:
 * - Vercel Postgres
 * - Neon
 * - Supabase (use connection pooling URL - port 6543)
 * - Railway
 * - Local PostgreSQL
 *
 * Features:
 * - Connection caching to prevent exhaustion
 * - Optimized for serverless cold starts
 * - Compatible with connection poolers (prepare: false)
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 *   For Supabase: Use the pooling URL (port 6543, not 5432)
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// For serverless environments, we need to handle connections carefully
let client: postgres.Sql | undefined;

export function getDbClient() {
  if (!client) {
    client = postgres(connectionString!, {
      prepare: false, // Required for connection poolers (Supabase, PgBouncer)
      max: 1, // Limit connection pool for serverless
    });
  }
  return client;
}

// Create Drizzle instance
export const db = drizzle(getDbClient(), {
  schema,
  logger: process.env.NODE_ENV === "development",
});

// Export types
export type Database = typeof db;
export type Schema = typeof schema;
