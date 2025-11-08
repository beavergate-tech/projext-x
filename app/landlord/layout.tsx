// app/landlord/layout.tsx

/**
 * Landlord Layout
 *
 * Wraps all landlord routes. Authentication checks should be done
 * in individual protected pages/routes, not here, to avoid infinite
 * redirects on public routes like /landlord/login.
 */
export default async function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
