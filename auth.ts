import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/drizzle";
import * as schema from "./lib/drizzle/schema";
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
  }) as never,

  // Use JWT sessions for credentials provider compatibility
  // Database sessions don't work well with credentials provider
  session: {
    strategy: "jwt",
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
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Build where condition based on role if provided
        let whereCondition;
        if (credentials.role) {
          whereCondition = eq(schema.users.email, credentials.email as string);
          // Note: Role filtering happens on the client side for security
        } else {
          whereCondition = eq(schema.users.email, credentials.email as string);
        }

        const user = await db.query.users.findFirst({
          where: whereCondition,
        });

        if (!user || !user.password) {
          return null;
        }

        // If role is specified, check if user has the correct role
        if (credentials.role && user.role !== credentials.role) {
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
          role: user.role,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Add user id and role to JWT token
    async jwt({ token, user }) {
      // When user signs in, add id and role to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Add user id and role to session from token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "LANDLORD" | "TENANT";
      }
      return session;
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
});
