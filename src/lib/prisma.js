import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  // 1. Create a standard connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Wrap it in the Prisma adapter
  const adapter = new PrismaPg(pool);
  
  // 3. Pass the adapter to the Prisma Client
  globalForPrisma.prisma = new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma;