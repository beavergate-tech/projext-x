// app/api/tenant/onboarding/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { tenantProfiles, users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { protectApiByRole } from "@/lib/auth/utils";

/**
 * Tenant Onboarding API Route
 *
 * Updates tenant profile with onboarding information.
 * Requires TENANT role.
 */
export async function POST(request: Request) {
  try {
    // Protect route - only tenants can access
    const session = await protectApiByRole(["TENANT"]);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Tenant access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { dateOfBirth, occupation, phone } = body;

    // Validation
    if (!dateOfBirth) {
      return NextResponse.json(
        { error: "Date of birth is required" },
        { status: 400 }
      );
    }

    if (!occupation || !occupation.trim()) {
      return NextResponse.json(
        { error: "Occupation is required" },
        { status: 400 }
      );
    }

    // Validate age (must be 18+)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDiff < 0) ||
      (age === 18 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return NextResponse.json(
        { error: "You must be at least 18 years old" },
        { status: 400 }
      );
    }

    // Find tenant profile
    const tenantProfile = await db.query.tenantProfiles.findFirst({
      where: eq(tenantProfiles.userId, session.user.id),
    });

    if (!tenantProfile) {
      return NextResponse.json(
        { error: "Tenant profile not found" },
        { status: 404 }
      );
    }

    // Update tenant profile
    await db
      .update(tenantProfiles)
      .set({
        dateOfBirth: birthDate,
        occupation: occupation.trim(),
        updatedAt: new Date(),
      })
      .where(eq(tenantProfiles.id, tenantProfile.id));

    // Update user phone if provided
    if (phone && phone.trim()) {
      await db
        .update(users)
        .set({
          phone: phone.trim(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, session.user.id));
    }

    return NextResponse.json(
      {
        message: "Onboarding completed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tenant onboarding error:", error);
    return NextResponse.json(
      { error: "An error occurred during onboarding" },
      { status: 500 }
    );
  }
}
