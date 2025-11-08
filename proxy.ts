import { auth } from "./auth";
import { NextResponse } from "next/server";

/**
 * Middleware for Route Protection (Proxy Approach)
 *
 * Strategy: Protect all routes except public ones
 *
 * Public routes:
 * - / (home)
 * - /login
 * - /signup
 * - /api/auth/* (Auth.js endpoints)
 *
 * Protected routes:
 * - Everything else requires authentication
 * - Unauthenticated users are redirected to /login
 */

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  console.log("isLoggedIn", isLoggedIn);

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/tenant/login",
    "/landlord/login",
    "/tenant/signup",
    "/landlord/signup",
  ];

  // Check if the current route is public
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");

  // If user is not logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and trying to access login/signup pages
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

/**
 * Matcher configuration
 *
 * This tells Next.js which routes should run through the middleware.
 * We exclude static files, images, and Next.js internals.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
