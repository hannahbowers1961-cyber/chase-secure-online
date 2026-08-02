import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(req) {
  try {
    const { username, password, firstName, lastName } = await req.json();

    // 1. Check if the username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    // 2. Cryptographically hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the user AND instantiate a default checking account for them
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        creditScore: Math.floor(Math.random() * (800 - 600 + 1)) + 600, // Random score between 600-800
        accounts: {
          create: [
            {
              accountKey: "checking",
              name: "TOTAL CHECKING",
              mask: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4 digit mask
              type: "DEPOSITORY",
              transactions: {
                create: [
                  { date: new Date(), desc: "Initial Deposit", cat: "System", amount: 500.00 }
                ]
              }
            }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}