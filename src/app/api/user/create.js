import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// In production, this would be inside your .env file
const JWT_SECRET = new TextEncoder().encode("super-secret-bank-key-2026");

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 1. Find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // 2. Cryptographically verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // 3. Generate a secure JWT Token
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(JWT_SECRET);

    // 4. Attach token as an HttpOnly cookie (cannot be stolen by JavaScript)
    const response = NextResponse.json({ success: true });
    response.cookies.set("bank_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return response;
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}