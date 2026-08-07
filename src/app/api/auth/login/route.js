import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";

// Define strict CORS headers for credentials
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000", // MUST be exact when using cookies, no "*"
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true", // Required for cookies
};

// Handle the preflight request explicitly
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
    }

    if (!user.email) {
      return NextResponse.json({ error: "No email registered for this account" }, { status: 400, headers: corsHeaders });
    }

    const cookieStore = await cookies();
    const trustedDevice = cookieStore.get("trusted_device")?.value;

    if (trustedDevice === user.id) {
      cookieStore.set("session_token", user.id, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: "none", // Must be "none" for cross-origin cookies
        maxAge: 60 * 60 * 24 * 7 
      });
      return NextResponse.json({ success: true, requiresOtp: false }, { headers: corsHeaders });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry }
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Chase Security" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Chase verification code",
      text: `Your identification code is: ${otp}. This code will expire in 10 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2 style="color: #0d47a1;">Verify your identity</h2><p>Your temporary identification code is:</p><h1 style="font-size: 32px; letter-spacing: 4px;">${otp}</h1><p>This code will expire in 10 minutes.</p></div>`,
    });

    const [name, domain] = user.email.split('@');
    const maskedEmail = `${name[0]}***@${domain}`;

    return NextResponse.json({ success: true, requiresOtp: true, maskedEmail }, { headers: corsHeaders });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: corsHeaders });
  }
}