import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./nextauth";
import { relations } from "drizzle-orm";

/**
 * Tenant Profile Schema
 *
 * Extended profile information for tenants/renters.
 */

/**
 * Tenant profiles table
 */
export const tenantProfiles = pgTable("tenant_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  occupation: text("occupation"),
  assignedPropertyId: uuid("assigned_property_id"), // References Property.id
  rentalId: uuid("rental_id"), // References Rental.id when active
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const tenantProfilesRelations = relations(
  tenantProfiles,
  ({ one }) => ({
    user: one(users, {
      fields: [tenantProfiles.userId],
      references: [users.id],
    }),
    // Property and Rental relations will be defined in their respective files
  })
);

/**
 * TypeScript types
 */
export type TenantProfile = typeof tenantProfiles.$inferSelect;
export type NewTenantProfile = typeof tenantProfiles.$inferInsert;
