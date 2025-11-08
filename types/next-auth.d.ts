// types/next-auth.d.ts

import { DefaultSession } from "next-auth";
import { Role } from "@/lib/drizzle/schema/nextauth";

/**
 * Type declarations for extending Next-Auth types
 * Adds custom fields to the session and user objects
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
