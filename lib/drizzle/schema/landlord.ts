import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./nextauth";
import { relations } from "drizzle-orm";

/**
 * Landlord Profile Schema
 *
 * Extended profile information for landlords/property owners.
 */

/**
 * Landlord profiles table
 */
export const landlordProfiles = pgTable("landlord_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  businessName: text("business_name"),
  // TODO: Add more landlord-specific onboarding fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const landlordProfilesRelations = relations(
  landlordProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [landlordProfiles.userId],
      references: [users.id],
    }),
    // Properties will be defined in property.ts relations
  })
);

/**
 * TypeScript types
 */
export type LandlordProfile = typeof landlordProfiles.$inferSelect;
export type NewLandlordProfile = typeof landlordProfiles.$inferInsert;
