// app/api/landlord/onboarding/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { landlordProfiles, users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { protectApiByRole } from "@/lib/auth/utils";

/**
 * Landlord Onboarding API Route
 *
 * Updates landlord profile with onboarding information.
 * Requires LANDLORD role.
 */
export async function POST(request: Request) {
  try {
    // Protect route - only landlords can access
    const session = await protectApiByRole(["LANDLORD"]);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Landlord access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { businessName, phone } = body;

    // Validation
    if (!businessName || !businessName.trim()) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    // Find landlord profile
    const landlordProfile = await db.query.landlordProfiles.findFirst({
      where: eq(landlordProfiles.userId, session.user.id),
    });

    if (!landlordProfile) {
      return NextResponse.json(
        { error: "Landlord profile not found" },
        { status: 404 }
      );
    }

    // Update landlord profile
    await db
      .update(landlordProfiles)
      .set({
        businessName: businessName.trim(),
        updatedAt: new Date(),
      })
      .where(eq(landlordProfiles.id, landlordProfile.id));

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
    console.error("Landlord onboarding error:", error);
    return NextResponse.json(
      { error: "An error occurred during onboarding" },
      { status: 500 }
    );
  }
}
