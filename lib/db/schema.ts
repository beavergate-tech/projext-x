import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Main Application Schema
 *
 * This file exports all database tables for the application.
 * Auth-related tables are imported from auth-schema.ts
 */

// Export auth tables for Auth.js adapter
export * from "./auth-schema";

/**
 * Properties Table - Property management schema
 */
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * TypeScript types inferred from the schema
 */
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
