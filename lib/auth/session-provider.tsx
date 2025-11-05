"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Session Provider Wrapper Component
 *
 * This is a client component that wraps the application with NextAuth's SessionProvider.
 * It enables client-side access to the session via useSession() hook.
 *
 * Usage in app/layout.tsx:
 * <SessionProvider>
 *   {children}
 * </SessionProvider>
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
