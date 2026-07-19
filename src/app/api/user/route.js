import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = new TextEncoder().encode("super-secret-bank-key-2026");

export async function GET(req) {
  try {
    // 1. Intercept the request and check for the security cookie
    const token = req.cookies.get("bank_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Verify the JWT and extract the exact User ID
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId;

    // 3. Fetch ONLY this specific user's data from PostgreSQL
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          include: { transactions: { orderBy: { date: 'desc' } } }
        }
      }
    });

    if (!userData) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Calculate dynamic enterprise balances
    const accountsWithMath = userData.accounts.map(acc => {
      const balance = acc.transactions.reduce((sum, tx) => sum + tx.amount, 0);
      return { ...acc, balance };
    });

    const snapshotAmount = accountsWithMath
      .filter(a => a.type === 'DEPOSITORY')
      .reduce((sum, a) => sum + a.balance, 0);

    // Remove the hashed password before sending data to the frontend
    const { password, ...safeUserData } = userData;

    return NextResponse.json({
      ...safeUserData,
      accounts: accountsWithMath,
      snapshotAmount
    });
  } catch (error) {
    console.error("Database or JWT Error:", error);
    return NextResponse.json({ error: "Unauthorized or Failed to fetch" }, { status: 401 });
  }
}