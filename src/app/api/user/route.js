import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// Completely disable Next.js server-side caching for this endpoint
export const dynamic = 'force-dynamic';

// 1. Add all your valid frontend URLs here
const allowedOrigins = [
  "http://localhost:3000",
  "https://wagwan-testpage.vercel.app" // Your live frontend link
];

// 2. Helper function to dynamically check and set the origin
function getCorsHeaders(req) {
  const origin = req.headers.get("origin");
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// Handle the preflight request dynamically
export async function OPTIONS(req) {
  return NextResponse.json({}, { headers: getCorsHeaders(req) });
}

export async function GET(req) {
  // Generate the correct headers for this specific request
  const corsHeaders = getCorsHeaders(req);

  try {
    // 1. Await the cookie store and look for the exact cookie name we set in verify
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

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

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

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
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Unauthorized or Failed to fetch" }, { status: 401, headers: corsHeaders });
  }
}