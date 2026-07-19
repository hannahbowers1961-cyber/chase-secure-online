const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Wiping existing data...");
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Generating secure hashed password...");
  // This turns "demo123" into an unreadable cryptographic hash
  const hashedPassword = await bcrypt.hash("demo123", 10);

  console.log("Seeding normalized enterprise database...");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const user = await prisma.user.create({
    data: {
      username: "alex.morgan",
      password: hashedPassword,
      firstName: "Alex",
      lastName: "Morgan",
      creditScore: 742,
      accounts: {
        create: [
          {
            accountKey: "checking",
            name: "TOTAL CHECKING",
            mask: "8853",
            type: "DEPOSITORY",
            routing: "122105155",
            accountNum: "4490885392",
            transactions: {
              create: [
                { date: lastWeek, desc: "Initial Balance Forward", cat: "System", amount: 7526.34 },
                { date: today, desc: "The Home Depot", cat: "Debit Card", amount: -142.50 },
                { date: yesterday, desc: "ApexCorp Payroll", cat: "Direct Deposit", amount: 3250.00 },
                { date: yesterday, desc: "Zelle Transfer", cat: "Transfer", amount: -45.00 }
              ]
            }
          },
          {
            accountKey: "savings",
            name: "TOTAL SAVINGS",
            mask: "4421",
            type: "DEPOSITORY",
            routing: "122105155",
            accountNum: "5590114421",
            transactions: {
              create: [
                { date: lastWeek, desc: "Initial Balance Forward", cat: "System", amount: 23650.00 },
                { date: yesterday, desc: "Transfer from Checking", cat: "Online Transfer", amount: 500.00 }
              ] 
            }
          },
          {
            accountKey: "freedomUnlimited",
            name: "Freedom Unlimited",
            mask: "1081",
            type: "CREDIT",
            creditLimit: 24000.00,
            transactions: {
              create: [
                { date: lastWeek, desc: "Previous Balance", cat: "System", amount: -12989.17 },
                { date: today, desc: "Starbucks Store 14592", cat: "Food & Drink", amount: -12.45 },
                { date: yesterday, desc: "Apple Store", cat: "Shopping", amount: -1499.00 },
                { date: yesterday, desc: "Payment Thank You", cat: "Payment", amount: 500.00 }
              ] 
            }
          },
          {
            accountKey: "freedom",
            name: "Freedom",
            mask: "5445",
            type: "CREDIT",
            creditLimit: 5000.00
          },
          {
            accountKey: "autoLoan",
            name: "Auto Loan",
            mask: "5512",
            type: "CREDIT",
            transactions: {
              create: [
                { date: lastWeek, desc: "Initial Loan Amount", cat: "System", amount: -18450.00 }
              ] 
            }
          }
        ]
      }
    }
  });

  console.log("Enterprise Database successfully seeded! User ID:", user.id);
  console.log("Username: alex.morgan | Password: demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });