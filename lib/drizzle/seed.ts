import { db } from "./index";
import * as schema from "./schema";

/**
 * Database Seed Script
 *
 * This file contains seed data for initializing the database with sample data.
 * Run with: bun run seed (add script to package.json)
 */

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Example: Seed users
    console.log("Creating sample users...");
    // await db.insert(schema.users).values([
    //   {
    //     email: "landlord@example.com",
    //     name: "John Landlord",
    //     role: "LANDLORD",
    //     phone: "+1234567890",
    //   },
    //   {
    //     email: "tenant@example.com",
    //     name: "Jane Tenant",
    //     role: "TENANT",
    //     phone: "+0987654321",
    //   },
    // ]);

    // Example: Seed landlord profiles
    // console.log("Creating landlord profiles...");
    // await db.insert(schema.landlordProfiles).values([
    //   {
    //     userId: "...", // Use actual user ID from above
    //     businessName: "Property Management Co.",
    //   },
    // ]);

    // Example: Seed properties
    // console.log("Creating sample properties...");
    // await db.insert(schema.properties).values([
    //   {
    //     name: "Sunset Apartments",
    //     description: "Beautiful 2-bedroom apartment with city views",
    //     address: "123 Main St",
    //     city: "San Francisco",
    //     state: "CA",
    //     zipCode: "94102",
    //     type: "APARTMENT",
    //     bedrooms: 2,
    //     bathrooms: 2,
    //     size: 1200,
    //     rentAmount: 2500,
    //     deposit: 5000,
    //     status: "AVAILABLE",
    //     images: ["/images/property1.jpg"],
    //     amenities: ["parking", "laundry", "gym"],
    //     landlordId: "...", // Use actual landlord profile ID
    //   },
    // ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed function
seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("Closing database connection...");
    process.exit(0);
  });
