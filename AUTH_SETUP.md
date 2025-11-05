# Authentication Setup Guide

This project uses **Auth.js (NextAuth v5)** with a **proxy-based middleware approach** for authentication.

## Features

✅ **Multiple Auth Providers:**
- Credentials (Email/Password)
- Google OAuth
- Magic Link (Passwordless Email)

✅ **Database Sessions** with Drizzle ORM + PostgreSQL

✅ **Role-Based Access Control (RBAC):**
- User
- Manager
- Admin

✅ **Proxy-Based Route Protection:**
- Protects all routes except public ones
- Automatic redirects to login
- Preserves callback URLs

✅ **Universal PostgreSQL Support:**
- Works with any PostgreSQL provider (Vercel, Neon, Supabase, Railway, local)

## Quick Start

### 1. Set Up Database

Choose one of the PostgreSQL options from `.env.local` and add your connection string:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 2. Configure Auth Providers

#### Auth Secret (Already configured)
Already generated and added to `.env.local`

#### Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Add credentials to `.env.local`:
```env
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### Resend (Magic Links) (Optional)
1. Sign up at [Resend](https://resend.com)
2. Get API key
3. Add to `.env.local`:
```env
RESEND_API_KEY="your-api-key"
EMAIL_FROM="onboarding@resend.dev"
```

### 3. Push Database Schema

Generate and apply the auth tables to your database:

```bash
# Push schema directly (recommended for development)
bun run db:push

# OR generate migrations first
bun run db:generate
bun run db:migrate
```

### 4. Start Development Server

```bash
bun run dev
```

Visit `http://localhost:3000` - you'll be redirected to login!

## Authentication Flow

### Route Protection (Proxy Approach)

The middleware at `middleware.ts` protects all routes except:
- `/` - Home page (public)
- `/login` - Login page
- `/signup` - Signup page
- `/api/auth/*` - Auth API routes

All other routes require authentication.

### How Login Works

1. **Credentials Login:**
   - User enters email/password at `/login`
   - Credentials are validated against database
   - Password is verified using bcrypt
   - Session created in database

2. **Google OAuth:**
   - User clicks "Sign in with Google"
   - Redirected to Google for authentication
   - Google redirects back with user info
   - Account linked in database, session created

3. **Magic Link:**
   - User enters email at `/login`
   - Magic link sent via Resend
   - User clicks link in email
   - Session created automatically

## Using Authentication in Your App

### Server Components

```typescript
import { getCurrentUser, requireAuth, requireRole } from "@/lib/auth/utils";

// Optional: Get current user (returns null if not authenticated)
const session = await getCurrentUser();
if (session) {
  console.log(session.user.email);
}

// Required: Redirect to login if not authenticated
const session = await requireAuth();

// Required: Check user has specific role
await requireRole("admin"); // Throws/redirects if not admin

// Check for multiple roles
await requireAnyRole(["admin", "manager"]);
```

### API Routes

```typescript
import { protectApiRoute } from "@/lib/auth/utils";

export async function GET() {
  const session = await protectApiRoute();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Continue with authenticated logic
  return Response.json({ user: session.user });
}
```

### Client Components

```typescript
"use client";

import { useSession, signOut } from "next-auth/react";

export function MyComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Welcome {session.user.name}!</p>
      <p>Role: {session.user.role}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

## Database Schema

Auth tables created:
- `user` - User accounts with role field
- `account` - OAuth provider accounts
- `session` - Active sessions
- `verificationToken` - Magic link tokens

## API Endpoints

Auth.js automatically creates these endpoints:
- `GET/POST /api/auth/signin` - Sign in
- `GET/POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/providers` - List available providers
- `POST /api/auth/callback/*` - OAuth callbacks

Custom endpoints:
- `POST /api/auth/signup` - Create new account
- `GET/POST /api/protected` - Example protected API route

## User Roles

The system includes three roles with hierarchy:
1. **user** - Default role for new signups
2. **manager** - Mid-level access
3. **admin** - Full access

Role hierarchy allows higher roles to access lower-level routes:
- Admin can access manager and user routes
- Manager can access user routes
- User can only access user routes

## Customization

### Add More Providers

Edit `auth.ts` and add providers:

```typescript
import GitHub from "next-auth/providers/github";

providers: [
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }),
  // ... other providers
]
```

### Customize Public Routes

Edit `middleware.ts`:

```typescript
const publicRoutes = ["/", "/login", "/signup", "/about", "/pricing"];
```

### Add Custom User Fields

1. Update `lib/db/auth-schema.ts` to add fields
2. Run `bun run db:generate` to create migration
3. Update type definitions in `types/next-auth.d.ts`

## Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` in `.env.local`
- Verify database is running
- Run `bun run db:push` to create tables

### "Google OAuth not working"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check redirect URI matches exactly
- Enable Google+ API in Google Cloud Console

### "Magic links not sending"
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Verify `EMAIL_FROM` address

### "Type errors with session.user.role"
- Make sure `types/next-auth.d.ts` exists
- Restart TypeScript server in your IDE

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- Sessions stored in database (not JWT-only)
- Auth secret used for encryption
- SQL injection protected by Drizzle ORM
- CSRF protection built into Auth.js

## Next Steps

- [ ] Configure OAuth providers
- [ ] Set up production database
- [ ] Deploy to Vercel
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Implement admin dashboard
- [ ] Add user profile page

## Resources

- [Auth.js Documentation](https://authjs.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Next.js App Router](https://nextjs.org/docs/app)
