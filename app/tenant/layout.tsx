// app/tenant/layout.tsx

/**
 * Tenant Layout
 *
 * Wraps all tenant routes. Authentication checks should be done
 * in individual protected pages/routes, not here, to avoid infinite
 * redirects on public routes like /tenant/login.
 */
export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
