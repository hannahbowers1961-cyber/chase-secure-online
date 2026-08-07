import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";

// 1. Add all your valid frontend URLs here
const allowedOrigins = [
  "http://localhost:3000",
  "https://wagwan-testpage.vercel.app" // Replace or add your actual live frontend link here
];

// 2. Helper function to dynamically check and set the origin
function getCorsHeaders(req) {
  const origin = req.headers.get("origin");
  
  // If the request comes from an allowed origin, echo it back. 
  // Otherwise, default to localhost to prevent errors.
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
        sameSite: "none",
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