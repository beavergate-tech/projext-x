// lib/auth/utils.ts

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/drizzle/schema/nextauth";

/**
 * Auth Utility Functions
 *
 * Helper functions for server-side authentication and role-based access control.
 * These functions should be used in Server Components and API routes.
 */

/**
 * Get the current authenticated user session
 *
 * @returns The session object or null if not authenticated
 *
 * @example
 * const session = await getCurrentUser();
 * if (session) {
 *   console.log(session.user.email);
 * }
 */
export async function getCurrentUser() {
  const session = await auth();
  return session;
}

/**
 * Require authentication - throws error if not authenticated
 *
 * Use this in Server Components or API routes that require authentication.
 * Automatically redirects to login page if not authenticated.
 *
 * @param redirectUrl - Optional URL to redirect to after login
 * @returns The authenticated session
 *
 * @example
 * const session = await requireAuth();
 * console.log(session.user.email);
 */
export async function requireAuth(redirectUrl?: string) {
  const session = await auth();

  if (!session || !session.user) {
    const loginUrl = redirectUrl
      ? `/login?callbackUrl=${encodeURIComponent(redirectUrl)}`
      : "/login";
    redirect(loginUrl);
  }

  return session;
}

/**
 * API Route Protection Helper
 *
 * Use this in API routes to protect them from unauthenticated access.
 * Returns session if authenticated, or returns a 401 response.
 *
 * @returns Session object if authenticated, null otherwise
 *
 * @example
 * export async function GET(request: Request) {
 *   const session = await protectApiRoute();
 *   if (!session) {
 *     return new Response("Unauthorized", { status: 401 });
 *   }
 *   // Continue with authenticated logic...
 * }
 */
export async function protectApiRoute() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  return session;
}

/**
 * Check if user is authenticated (client or server)
 *
 * @returns Boolean indicating if user is authenticated
 *
 * @example
 * const isAuth = await isAuthenticated();
 * if (isAuth) {
 *   // Show authenticated content
 * }
 */
export async function isAuthenticated() {
  const session = await auth();
  return !!session?.user;
}

/**
 * Require LANDLORD role - redirects if not authenticated or not a landlord
 *
 * Use this in Server Components or API routes that require landlord access.
 * Automatically redirects to appropriate page if not authorized.
 *
 * @returns The authenticated landlord session
 *
 * @example
 * const session = await requireLandlord();
 * console.log(session.user.email);
 */
export async function requireLandlord() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/landlord/login");
  }

  if (session.user.role !== "LANDLORD") {
    // User is authenticated but not a landlord
    redirect("/tenant/dashboard");
  }

  return session;
}

/**
 * Require TENANT role - redirects if not authenticated or not a tenant
 *
 * Use this in Server Components or API routes that require tenant access.
 * Automatically redirects to appropriate page if not authorized.
 *
 * @returns The authenticated tenant session
 *
 * @example
 * const session = await requireTenant();
 * console.log(session.user.email);
 */
export async function requireTenant() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/tenant/login");
  }

  if (session.user.role !== "TENANT") {
    // User is authenticated but not a tenant
    redirect("/landlord/dashboard");
  }

  return session;
}

/**
 * API Route Protection Helper with Role Check
 *
 * Use this in API routes to protect them based on user roles.
 * Returns session if user has the required role, null otherwise.
 *
 * @param allowedRoles - Array of roles that are allowed to access this route
 * @returns Session object if authorized, null otherwise
 *
 * @example
 * export async function GET(request: Request) {
 *   const session = await protectApiByRole(["LANDLORD"]);
 *   if (!session) {
 *     return new Response("Forbidden", { status: 403 });
 *   }
 *   // Continue with authenticated landlord logic...
 * }
 */
export async function protectApiByRole(allowedRoles: Role[]) {
  const session = await auth();

  console.log("allowedRoles", allowedRoles);
  console.log("session", session);

  if (!session || !session.user) {
    return null;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return null;
  }

  return session;
}

/**
 * Check if user has a specific role
 *
 * @param role - The role to check for
 * @returns Boolean indicating if user has the specified role
 *
 * @example
 * const isLandlord = await hasRole("LANDLORD");
 * if (isLandlord) {
 *   // Show landlord-specific content
 * }
 */
export async function hasRole(role: Role) {
  const session = await auth();
  return session?.user?.role === role;
}
