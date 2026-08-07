import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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

export async function POST(req) {
  // Generate the correct headers for this specific request
  const corsHeaders = getCorsHeaders(req);

  try {
    const { username, otp, rememberMe } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404, headers: corsHeaders });
    }

    if (user.otpCode !== otp || new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400, headers: corsHeaders });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null }
    });

    const cookieStore = await cookies();
    
    // Set standard session cookie (Changed sameSite to "none" for cross-origin)
    cookieStore.set("session_token", user.id, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "none", 
      maxAge: 60 * 60 * 24 * 7 
    });

    // Set 30-day trusted device cookie if they checked the box
    if (rememberMe) {
      cookieStore.set("trusted_device", user.id, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "none", 
        maxAge: 60 * 60 * 24 * 30 
      });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}