import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Universal PostgreSQL Database Client
 *
 * This configuration works with ANY PostgreSQL provider:
 * - Vercel Postgres
 * - Neon
 * - Supabase
 * - Railway
 * - Local PostgreSQL
 * - Any standard PostgreSQL database
 *
 * Features:
 * - Connection pooling enabled
 * - Optimized for serverless environments
 * - Prepared statements by default
 *
 * Environment Variables Required:
 * - DATABASE_URL: PostgreSQL connection string
 *
 * Note: In serverless environments (Vercel, AWS Lambda), set max connections to 1
 * to avoid connection pooling issues. For traditional servers, adjust as needed.
 */
const connectionString = process.env.DATABASE_URL!;

// Create postgres.js client
const queryClient = postgres(connectionString, {
  max: 1, // Recommended for serverless (Vercel, AWS Lambda)
  // For non-serverless deployments, you can increase this:
  // max: 10,
});

export const db = drizzle(queryClient, { schema });
