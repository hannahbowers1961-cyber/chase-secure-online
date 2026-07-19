import { NextResponse } from "next/server";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// Initialize the database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    // Fetch the user, including all accounts and nested transactions
    const userData = await prisma.user.findFirst({
      include: {
        accounts: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' } // Order transactions by newest first
            }
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json({ error: "No user found" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch database" }, { status: 500 });
  }
}