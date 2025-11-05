import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db";
import * as schema from "./lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

/**
 * Auth.js Configuration with Proxy Approach
 *
 * Providers:
 * - Credentials (Email/Password)
 * - Google OAuth
 * - Magic Link (via Resend)
 *
 * Features:
 * - Database sessions via Drizzle adapter
 * - Custom login/signup pages
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),

  // Use database sessions for better security and session management
  session: {
    strategy: "database",
  },

  // Custom pages
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },

  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Auto-link accounts with same email
    }),

    // Magic Link Provider (passwordless via email)
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),

    // Credentials Provider (Email/Password)
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(schema.users.email, credentials.email as string),
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return user without password
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // Add user id to session
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
});
