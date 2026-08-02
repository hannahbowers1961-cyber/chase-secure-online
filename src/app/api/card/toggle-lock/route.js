import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

// 1. Initialize Prisma just like you did in your actions file
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 2. Create the POST request handler
export async function POST(request) {
  try {
    // We extract the data sent from the frontend
    const body = await request.json();
    const { accountId, newLockState } = body;

    // Your exact Prisma update logic
    await prisma.account.update({
      where: { id: accountId },
      data: { isLocked: newLockState },
    });
    
    // Send a success response back to the frontend
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Failed to update card lock status:", error);
    // Send an error response back if it fails
    return NextResponse.json(
      { success: false, error: "Failed to update database" },
      { status: 500 }
    );
  }
}