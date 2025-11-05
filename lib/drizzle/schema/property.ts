import { pgTable, text, uuid, pgEnum, real, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Property Management Schema
 *
 * Handles property listings, types, and statuses.
 */

/**
 * Property type enum
 */
export const propertyTypeEnum = pgEnum("property_type", [
  "APARTMENT",
  "HOUSE",
  "CONDO",
  "STUDIO",
  "ROOM",
]);

/**
 * Property status enum
 */
export const propertyStatusEnum = pgEnum("property_status", [
  "AVAILABLE",
  "OCCUPIED",
  "MAINTENANCE",
]);

/**
 * Properties table
 */
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  type: propertyTypeEnum("type").notNull(),
  size: real("size"), // Square footage
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  rentAmount: real("rent_amount").notNull(),
  deposit: real("deposit"),
  status: propertyStatusEnum("status").notNull().default("AVAILABLE"),
  images: text("images").array().default([]),
  amenities: text("amenities").array().default([]),
  landlordId: uuid("landlord_id").notNull(), // References LandlordProfile.id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * TypeScript types
 */
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type PropertyType = (typeof propertyTypeEnum.enumValues)[number];
export type PropertyStatus = (typeof propertyStatusEnum.enumValues)[number];
