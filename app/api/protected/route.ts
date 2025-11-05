import { protectApiRoute } from "@/lib/auth/utils";
import { NextResponse } from "next/server";

/**
 * Protected API Route Example
 *
 * This demonstrates how to protect an API route using the auth utilities.
 * Only authenticated users can access this endpoint.
 */

export async function GET() {
  // Protect the route - returns null if not authenticated
  const session = await protectApiRoute();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // User is authenticated, return protected data
  return NextResponse.json({
    message: "This is protected data",
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const session = await protectApiRoute();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Process the authenticated request
    return NextResponse.json({
      message: "Data processed successfully",
      data: body,
      processedBy: session.user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
