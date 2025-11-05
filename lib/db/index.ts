import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

// Create postgres.js client
const queryClient = postgres(connectionString, {
  max: 1, // Recommended for serverless (Vercel, AWS Lambda)
  // For non-serverless deployments, you can increase this:
  // max: 10,
});

export const db = drizzle(queryClient, { schema });
