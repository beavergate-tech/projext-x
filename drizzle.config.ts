import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit Configuration
 *
 * This configuration works with ANY PostgreSQL provider:
 * - Vercel Postgres
 * - Neon
 * - Supabase
 * - Railway
 * - Local PostgreSQL
 * - Any standard PostgreSQL database
 */
export default defineConfig({
  // Database dialect
  dialect: "postgresql",

  // Schema files location
  schema: "./lib/drizzle/schema/index.ts",

  // Output directory for migrations
  out: "./drizzle",

  // Database connection
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Enable verbose logging for detailed migration info
  verbose: true,

  // Enable strict mode for better type safety
  strict: true,
});
