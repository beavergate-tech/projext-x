import { pgTable, uuid, real, timestamp, text, pgEnum } from "drizzle-orm/pg-core";
import { rentals } from "./rental";
import { relations } from "drizzle-orm";

/**
 * Rent Payment Schema
 *
 * Tracks rent payments, due dates, and payment status.
 */

/**
 * Payment status enum
 */
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "PAID",
  "OVERDUE",
  "CANCELLED",
]);

/**
 * Rent payments table
 */
export const rentPayments = pgTable("rent_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  rentalId: uuid("rental_id")
    .notNull()
    .references(() => rentals.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  paidDate: timestamp("paid_date", { mode: "date" }),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  lateFee: real("late_fee"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Relations
 */
export const rentPaymentsRelations = relations(rentPayments, ({ one }) => ({
  rental: one(rentals, {
    fields: [rentPayments.rentalId],
    references: [rentals.id],
  }),
}));

/**
 * TypeScript types
 */
export type RentPayment = typeof rentPayments.$inferSelect;
export type NewRentPayment = typeof rentPayments.$inferInsert;
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];
