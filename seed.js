const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/**
 * Helper function to generate transactions from Jan 1, 2023 to Now
 */
function generateHistory(accountKey, startDateStr = "2023-01-01") {
  const transactions = [];
  const startDate = new Date(startDateStr);
  const endDate = new Date();

  // 1. Set initial historical opening balance
  if (accountKey === "checking") {
    transactions.push({ date: startDate, desc: "Initial Balance Forward", cat: "System", amount: 5000.00 });
  } else if (accountKey === "savings") {
    transactions.push({ date: startDate, desc: "Initial Balance Forward", cat: "System", amount: 20000.00 });
  } else if (accountKey === "freedomUnlimited") {
    transactions.push({ date: startDate, desc: "Previous Balance", cat: "System", amount: -1250.00 });
  } else if (accountKey === "autoLoan") {
    transactions.push({ date: startDate, desc: "Initial Loan Amount", cat: "System", amount: -22000.00 });
    return transactions; // Auto loan doesn't need frequent card transactions
  }

  // Transaction templates per account type
  const templates = {
    checking: [
      { desc: "ApexCorp Payroll", cat: "Direct Deposit", min: 3100, max: 3400 },
      { desc: "The Home Depot", cat: "Debit Card", min: -180, max: -25 },
      { desc: "Trader Joe's", cat: "Groceries", min: -140, max: -40 },
      { desc: "Zelle Transfer", cat: "Transfer", min: -100, max: -20 },
      { desc: "Con Edison Utility", cat: "Bills", min: -160, max: -70 },
      { desc: "Starbucks Store", cat: "Food & Drink", min: -15, max: -5 }
    ],
    savings: [
      { desc: "Transfer from Checking", cat: "Online Transfer", min: 250, max: 750 },
      { desc: "Monthly Interest Paid", cat: "Interest", min: 12, max: 45 }
    ],
    freedomUnlimited: [
      { desc: "Amazon.com", cat: "Shopping", min: -150, max: -15 },
      { desc: "Apple Store", cat: "Shopping", min: -800, max: -30 },
      { desc: "Starbucks Store", cat: "Food & Drink", min: -12, max: -4 },
      { desc: "Uber Trip", cat: "Travel", min: -45, max: -12 },
      { desc: "Payment Thank You", cat: "Payment", min: 300, max: 900 }
    ]
  };

  const poolList = templates[accountKey] || [];
  if (poolList.length === 0) return transactions;

  // 2. Loop month by month from 2023 to Present
  let current = new Date(startDate);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();

    // Generate 3 to 6 random transactions per month
    const count = Math.floor(Math.random() * 4) + 3;
    for (let i = 0; i < count; i++) {
      const day = Math.floor(Math.random() * 27) + 1; // Pick day 1-28
      const txDate = new Date(year, month, day);

      if (txDate > endDate) break; // Don't generate future dates

      const template = poolList[Math.floor(Math.random() * poolList.length)];
      const rawAmount = (Math.random() * (template.max - template.min) + template.min).toFixed(2);

      transactions.push({
        date: txDate,
        desc: template.desc,
        cat: template.cat,
        amount: parseFloat(rawAmount)
      });
    }

    // Move to next month
    current.setMonth(current.getMonth() + 1);
  }

  // 3. Sort chronologically from oldest to newest
  return transactions.sort((a, b) => a.date - b.date);
}

async function main() {
  console.log("Wiping existing data...");
  await prisma.transaction.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding multi-year enterprise database (2023 - Present)...");

  const user = await prisma.user.create({
    data: {
      username: "alex.morgan",
      password: "demo123",
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
              create: generateHistory("checking", "2023-01-01")
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
              create: generateHistory("savings", "2023-01-01")
            }
          },
          {
            accountKey: "freedomUnlimited",
            name: "Freedom Unlimited",
            mask: "1081",
            type: "CREDIT",
            creditLimit: 24000.00,
            transactions: {
              create: generateHistory("freedomUnlimited", "2023-01-01")
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
              create: generateHistory("autoLoan", "2023-01-01")
            }
          }
        ]
      }
    }
  });

  console.log("Enterprise Database successfully seeded!");
  console.log("User ID:", user.id);
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