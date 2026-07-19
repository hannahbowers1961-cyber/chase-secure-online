const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Initialize the raw Postgres connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap the pool in Prisma's new Edge-compatible Adapter
const adapter = new PrismaPg(pool);

// 3. Initialize the Prisma Client using the adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Wiping existing data to start fresh...");
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding new database...");

  const user = await prisma.user.create({
    data: {
      firstName: "Alex",
      lastName: "Morgan",
      creditScore: 742,
      snapshotAmount: 10607.00,
      accounts: {
        create: [
          {
            accountKey: "checking",
            name: "TOTAL CHECKING",
            mask: "8853",
            routing: "122105155",
            accountNum: "4490885392",
            balance: 10588.84,
            transactions: {
              create: [
                { date: "Today", desc: "The Home Depot", cat: "Debit Card", amount: -142.50 },
                { date: "Yesterday", desc: "ApexCorp Payroll", cat: "Direct Deposit", amount: 3250.00 },
                { date: "Yesterday", desc: "Zelle Transfer", cat: "Transfer", amount: -45.00 }
              ]
            }
          },
          {
            accountKey: "savings",
            name: "TOTAL SAVINGS",
            mask: "4421",
            routing: "122105155",
            accountNum: "5590114421",
            balance: 24150.00,
            transactions: {
              create: [
                { date: "This Month", desc: "Transfer from Checking", cat: "Online Transfer", amount: 500.00 }
              ]
            }
          },
          {
            accountKey: "freedomUnlimited",
            name: "Freedom Unlimited",
            mask: "1081",
            balance: 14000.62,
            creditLimit: 24000.00,
            paymentDue: 385.00,
            transactions: {
              create: [
                { date: "Today", desc: "Starbucks Store 14592", cat: "Food & Drink", amount: -12.45 },
                { date: "Yesterday", desc: "Apple Store", cat: "Shopping", amount: -1499.00 },
                { date: "Yesterday", desc: "Payment Thank You", cat: "Payment", amount: 500.00 }
              ]
            }
          },
          {
            accountKey: "freedom",
            name: "Freedom",
            mask: "5445",
            balance: 0.00,
            creditLimit: 5000.00,
            paymentDue: 0.00
          },
          {
            accountKey: "autoLoan",
            name: "Auto Loan",
            mask: "5512",
            balance: 18450.00
          }
        ]
      }
    }
  });

  console.log("Database successfully seeded! User ID:", user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });