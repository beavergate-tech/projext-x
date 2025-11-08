// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { users, landlordProfiles, tenantProfiles } from "@/lib/drizzle/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Role } from "@/lib/drizzle/schema/nextauth";

/**
 * Signup API Route
 *
 * Creates a new user account with email and password.
 * Passwords are hashed using bcrypt before storing.
 * Also creates the appropriate landlord or tenant profile.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Validate role
    const userRole: Role = role || "TENANT";
    if (userRole !== "LANDLORD" && userRole !== "TENANT") {
      return NextResponse.json(
        { error: "Invalid role. Must be LANDLORD or TENANT" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: userRole,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      });

    // Create corresponding profile based on role
    if (userRole === "LANDLORD") {
      await db.insert(landlordProfiles).values({
        userId: newUser.id,
        businessName: null, // Will be filled during onboarding
      });
    } else if (userRole === "TENANT") {
      await db.insert(tenantProfiles).values({
        userId: newUser.id,
        dateOfBirth: null, // Will be filled during onboarding
        occupation: null,
        assignedPropertyId: null,
        rentalId: null,
      });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
