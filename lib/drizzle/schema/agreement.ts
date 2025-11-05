import {
  pgTable,
  uuid,
  text,
  real,
  timestamp,
  integer,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";
import { properties } from "./property";
import { rentals } from "./rental";
import { relations } from "drizzle-orm";

/**
 * Rent Agreement Schema
 *
 * Manages rental agreement documents, templates, and terms.
 */

/**
 * Agreement status enum
 */
export const agreementStatusEnum = pgEnum("agreement_status", [
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
]);

/**
 * Rent agreements table
 */
export const rentAgreements = pgTable("rent_agreements", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  rentalId: uuid("rental_id").references(() => rentals.id, {
    onDelete: "set null",
  }),
  templateName: text("template_name").notNull(),
  content: text("content").notNull(), // Agreement document content
  variables: json("variables"), // Dynamic variables for template
  templateVariables: json("template_variables"), // Template-specific variables
  rentAmount: real("rent_amount"),
  securityDeposit: real("security_deposit"),
  terms: text("terms"), // Legal terms and conditions
  status: agreementStatusEnum("status").notNull().default("DRAFT"),
  startDate: timestamp("start_date", { mode: "date" }),
  endDate: timestamp("end_date", { mode: "date" }),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const rentAgreementsRelations = relations(
  rentAgreements,
  ({ one }) => ({
    property: one(properties, {
      fields: [rentAgreements.propertyId],
      references: [properties.id],
    }),
    rental: one(rentals, {
      fields: [rentAgreements.rentalId],
      references: [rentals.id],
    }),
  })
);

/**
 * TypeScript types
 */
export type RentAgreement = typeof rentAgreements.$inferSelect;
export type NewRentAgreement = typeof rentAgreements.$inferInsert;
export type AgreementStatus = (typeof agreementStatusEnum.enumValues)[number];
