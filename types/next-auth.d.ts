import { DefaultSession } from "next-auth";

/**
 * Type declarations for extending Next-Auth types
 * Adds custom fields to the session and user objects
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
