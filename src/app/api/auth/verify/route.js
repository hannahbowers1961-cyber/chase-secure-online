import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const { username, otp, rememberMe } = await req.json();

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.otpCode !== otp || new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: null, otpExpiry: null }
    });

    const cookieStore = await cookies();
    
    // Set standard session cookie
    cookieStore.set("session_token", user.id, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7 
    });

    // Set 30-day trusted device cookie if they checked the box
    if (rememberMe) {
      cookieStore.set("trusted_device", user.id, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 30 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}