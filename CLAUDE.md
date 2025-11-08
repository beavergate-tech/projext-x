# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A property management system built with Next.js 16 (App Router), Drizzle ORM, and NextAuth v5. The system supports landlords managing properties and tenants renting them, with comprehensive authentication and database schema.

## Essential Commands

### Development
```bash
bun run dev          # Start development server (localhost:3000)
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

### Database Operations
```bash
bun run db:push      # Push schema to database (recommended for development)
bun run db:generate  # Generate migration files from schema changes
bun run db:migrate   # Apply migrations to database
bun run db:studio    # Open Drizzle Studio (visual database browser)
bun run db:seed      # Seed database with sample data
```

**Important:** Always use `db:push` during development. Use `db:generate` + `db:migrate` for production deployments.

## Architecture

### Authentication (Proxy Middleware Approach)

This project uses a **proxy-based middleware pattern** where all routes are protected by default:

- **Public routes:** `/`, `/login`, `/signup`, `/api/auth/*`
- **Protected routes:** Everything else redirects to `/login` with callback URL
- **Middleware file:** `middleware.ts` (uses `auth()` from `auth.ts`)

**Auth providers configured:**
- Credentials (email/password with bcrypt)
- Google OAuth
- Magic Links (via Resend)

**Session storage:** Database sessions (not JWT) via Drizzle adapter

### Database Schema Organization

Modular schema structure in `lib/drizzle/schema/`:

```
schema/
├── index.ts          # Central export
├── nextauth.ts       # Auth tables (users, accounts, sessions, verificationTokens)
├── property.ts       # Properties with enums for type/status
├── landlord.ts       # Landlord profiles (one-to-one with users)
├── tenant.ts         # Tenant profiles (one-to-one with users)
├── rental.ts         # Rental agreements
├── payment.ts        # Rent payment tracking
└── agreement.ts      # Rent agreement documents (JSON fields for templates)
```

**Key patterns:**
- All tables use UUID primary keys (`defaultRandom()`)
- All tables have `createdAt` and `updatedAt` timestamps
- Enums for status fields (e.g., `LANDLORD`/`TENANT`, `AVAILABLE`/`OCCUPIED`)
- Cascade deletes: user → profiles, property → agreements, rental → payments
- Set null on delete: rental → agreement (preserves historical documents)

### File Structure

```
app/
├── api/auth/[...nextauth]/route.ts    # Auth.js catch-all handler
├── api/auth/signup/route.ts           # Custom signup endpoint
├── api/protected/route.ts             # Example protected API route
├── login/page.tsx                     # Login (uses Suspense for useSearchParams)
├── signup/page.tsx                    # Signup page
└── layout.tsx                         # Root layout with SessionProvider

lib/
├── auth/
│   ├── utils.ts                       # Auth helpers (requireAuth, protectApiRoute, etc.)
│   └── session-provider.tsx           # Client component wrapper
└── drizzle/
    ├── index.ts                       # Database client (postgres.js, max: 1 for serverless)
    ├── seed.ts                        # Database seeding script
    └── schema/                        # Modular schema files

auth.ts              # NextAuth configuration
middleware.ts        # Route protection (proxy approach)
drizzle.config.ts    # Drizzle Kit configuration
```

## Important Patterns

### Component Style
All components use **arrow function syntax** with exports at the end:
```typescript
const MyComponent = () => {
  return <div>...</div>;
};

export default MyComponent;
```

### Suspense Boundaries
Components using `useSearchParams()` must be wrapped in `<Suspense>`:
```typescript
const PageContent = () => {
  const searchParams = useSearchParams(); // Requires Suspense wrapper
  // ...
};

const Page = () => (
  <Suspense fallback={<Loading />}>
    <PageContent />
  </Suspense>
);
```

### Server-Side Auth Protection
```typescript
import { requireAuth, getCurrentUser } from "@/lib/auth/utils";

// Require auth or redirect to login
const session = await requireAuth();

// Optional auth (returns null if not authenticated)
const session = await getCurrentUser();
```

### API Route Protection
```typescript
import { protectApiRoute } from "@/lib/auth/utils";

export async function GET() {
  const session = await protectApiRoute();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Continue with authenticated logic
}
```

### Database Queries
Import from schema index:
```typescript
import { db } from "@/lib/drizzle";
import { properties, users } from "@/lib/drizzle/schema";

const allProperties = await db.select().from(properties);
```

## Environment Variables

Required in `.env.local`:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"  # Required
AUTH_SECRET="..."                                    # Already configured
GOOGLE_CLIENT_ID="..."                              # Optional (Google OAuth)
GOOGLE_CLIENT_SECRET="..."                          # Optional (Google OAuth)
RESEND_API_KEY="..."                                # Optional (Magic links)
EMAIL_FROM="onboarding@resend.dev"                  # Optional
```

## Database Connection

**Configured for serverless (Vercel):**
- Driver: `postgres.js`
- Connection pooling: `max: 1` (optimal for serverless environments)
- Works with: Vercel Postgres, Neon, Supabase, Railway, local PostgreSQL

**To change pooling for traditional servers:** Edit `lib/drizzle/index.ts` and increase `max` value.

## Key Schema Relationships

```
User (role: LANDLORD)
  └── LandlordProfile
       └── Properties (many)
            ├── RentAgreements
            └── Rentals
                 └── RentPayments

User (role: TENANT)
  └── TenantProfile
       ├── AssignedProperty (optional)
       └── ActiveRental (optional)
```

## Role System

Users have a `role` enum field:
- `LANDLORD` - Can create and manage properties
- `TENANT` - Can rent properties (default role)

Role is set during signup and stored in the users table.

## Schema Modification Workflow

1. Edit schema files in `lib/drizzle/schema/`
2. Run `bun run db:push` to apply changes immediately (dev)
3. For production: `bun run db:generate` → commit migration → `bun run db:migrate`

## Password Security

- Passwords hashed with bcrypt (10 rounds) in `/app/api/auth/signup/route.ts`
- Minimum 8 characters enforced
- Password field excluded from user queries in auth flow

## Additional Documentation

- **AUTH_SETUP.md** - Comprehensive authentication guide with setup instructions, API endpoints, and troubleshooting
- **SCHEMA_STRUCTURE.md** - Complete database schema documentation with relationships and design decisions

## Current Status

**Implemented:**
- ✅ Authentication system (multi-provider, database sessions)
- ✅ Complete database schema (7 tables + 4 auth tables)
- ✅ Route protection middleware
- ✅ API route examples
- ✅ Login/signup pages

**Not yet implemented:**
- ⏳ Property management UI (landlord dashboard)
- ⏳ Tenant dashboard
- ⏳ Rental agreement generation
- ⏳ Payment processing
- ⏳ Test suite (no testing framework configured)
- ⏳ Actual seeding data (seed.ts has placeholder comments)

## TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` points to project root
- Custom type extensions in `types/next-auth.d.ts` (adds `id` field to session.user)

## Deployment Notes

- Optimized for Vercel deployment
- Environment variables auto-populated by Vercel Postgres
- Database connection pooling configured for serverless (max: 1)
- Static rendering where possible (login page uses Suspense for dynamic params)
