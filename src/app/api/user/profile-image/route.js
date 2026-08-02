import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, base64Image } = body;

    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: base64Image }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Failed to update profile image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update image in database" },
      { status: 500 }
    );
  }
}