import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Auth Utility Functions
 *
 * Helper functions for server-side authentication.
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

