import { pgTable, uuid, timestamp, real, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Rental Management Schema
 *
 * Tracks active and past rental agreements between landlords and tenants.
 */

/**
 * Rental status enum
 */
export const rentalStatusEnum = pgEnum("rental_status", [
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
]);

/**
 * Rentals table
 */
export const rentals = pgTable("rentals", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id").notNull(), // References Property.id
  tenantId: uuid("tenant_id").notNull(), // References TenantProfile.id
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }),
  monthlyRent: real("monthly_rent").notNull(),
  deposit: real("deposit").notNull(),
  status: rentalStatusEnum("status").notNull().default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const rentalsRelations = relations(rentals, ({ many }) => ({
  // RentPayment and RentAgreement relations will be defined in their files
  payments: many(rentals), // Placeholder for payments relation
  agreements: many(rentals), // Placeholder for agreements relation
}));

/**
 * TypeScript types
 */
export type Rental = typeof rentals.$inferSelect;
export type NewRental = typeof rentals.$inferInsert;
export type RentalStatus = (typeof rentalStatusEnum.enumValues)[number];
