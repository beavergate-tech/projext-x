import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Server-side Database Client
 *
 * Optimized for long-running server processes and API routes
 * with higher connection pool limits and proper resource management.
 *
 * Use this for:
 * - API routes that need multiple concurrent connections
 * - Background jobs
 * - Server-side processes
 *
 * Features:
 * - Larger connection pool for better concurrency
 * - Connection timeout management
 * - Query logging in development
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection pool for server usage
const queryClient = postgres(connectionString, {
  prepare: false, // Required for connection poolers (Supabase, PgBouncer)
  // Connection pool settings for server environment
  max: 20, // Higher limit for concurrent requests
  idle_timeout: 20, // Close idle connections after 20 seconds
  max_lifetime: 60 * 30, // 30 minutes max connection lifetime
});

// Create Drizzle instance for server
export const serverDb = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export type ServerDatabase = typeof serverDb;
