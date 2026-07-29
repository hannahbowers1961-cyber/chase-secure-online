"use server";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Initialize a connection pool using your environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter into the Prisma Client (This fixes your error!)
const prisma = new PrismaClient({ adapter });

export async function toggleCardLockInDB(accountId, newLockState) {
  try {
    await prisma.account.update({
      where: { id: accountId },
      data: { isLocked: newLockState },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update card lock status:", error);
    return { success: false, error: "Failed to update database" };
  }
}