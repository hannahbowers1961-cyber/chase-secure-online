import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Completely disable Next.js server-side caching for this endpoint
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    // 1. Await the cookie store and look for the exact cookie name we set in verify
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. The token we set in the verify route IS the raw user.id, so no JWT decoding is needed
    const userId = token;

    // 3. Fetch ONLY this specific user's data from PostgreSQL using your singleton
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: { transactions: { orderBy: { date: 'desc' } } }
        }
      }
    });

    if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Trust the database balance column! Do not overwrite it with transaction math.
    const snapshotAmount = userData.accounts
      .filter(a => a.type === 'DEPOSITORY') // Typically Checking/Savings
      .reduce((sum, a) => sum + (a.balance || 0), 0);

    // Remove the hashed password before sending data to the frontend
    const { password, ...safeUserData } = userData;

    return NextResponse.json({
      ...safeUserData,
      accounts: userData.accounts, 
      snapshotAmount
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Unauthorized or Failed to fetch" }, { status: 401 });
  }
}