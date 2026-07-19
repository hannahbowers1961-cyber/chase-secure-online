const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ====================================================================
  // 1. CHANGE THESE VALUES EVERY TIME YOU WANT TO MINT A NEW USER
  // ====================================================================
  const targetUsername = "sarah.jenkins.new"; // Changed to avoid "already taken" error
  const targetPassword = "demopassword1";
  const targetFirstName = "Sarah";
  const targetLastName = "Jenkins";
  const targetCreditScore = 785;
  // ====================================================================

  console.log(`Checking database for ${targetUsername}...`);

  const existingUser = await prisma.user.findUnique({ where: { username: targetUsername } });
  if (existingUser) {
    console.error(`❌ Error: The username "${targetUsername}" is already taken!`);
    return;
  }

  console.log("Hashing password securely...");
  const hashedPassword = await bcrypt.hash(targetPassword, 10);

  console.log("Minting user with a fresh, zero-balance portfolio...");
  
  const generateMask = () => Math.floor(1000 + Math.random() * 9000).toString();
  const today = new Date();

  const user = await prisma.user.create({
    data: {
      username: targetUsername,
      password: hashedPassword,
      firstName: targetFirstName,
      lastName: targetLastName,
      creditScore: targetCreditScore,
      accounts: {
        create: [
          // 1. CHECKING ACCOUNT (Starts at $0.00)
          {
            accountKey: "checking",
            name: "TOTAL CHECKING",
            mask: generateMask(),
            type: "DEPOSITORY",
            transactions: {
              create: [
                { date: today, desc: "Account Opened", cat: "System", amount: 0.00 }
              ]
            }
          },
          // 2. SAVINGS ACCOUNT (Starts at $0.00)
          {
            accountKey: "savings",
            name: "TOTAL SAVINGS",
            mask: generateMask(),
            type: "DEPOSITORY",
            transactions: {
              create: [
                { date: today, desc: "Account Opened", cat: "System", amount: 0.00 }
              ]
            }
          },
          // 3. CREDIT CARD ($0.00 Balance, but has a limit)
          {
            accountKey: "freedomUnlimited",
            name: "Freedom Unlimited",
            mask: generateMask(),
            type: "CREDIT",
            creditLimit: 15000.00,
            transactions: {
              create: [
                { date: today, desc: "Account Opened", cat: "System", amount: 0.00 }
              ]
            }
          },
          // 4. AUTO LOAN ($0.00 Balance)
          {
            accountKey: "autoLoan",
            name: "Auto Loan",
            mask: generateMask(),
            type: "CREDIT",
            transactions: {
              create: [
                { date: today, desc: "Account Opened", cat: "System", amount: 0.00 }
              ]
            }
          }
        ]
      }
    }
  });

  console.log("\n✅ ZERO-BALANCE PORTFOLIO SUCCESSFULLY PROVISIONED!");
  console.log("==========================================");
  console.log(`Give them these exact credentials to log in:`);
  console.log(`Username: ${targetUsername}`);
  console.log(`Password: ${targetPassword}`);
  console.log("==========================================\n");
}

main()
  .catch((e) => {
    console.error("Critical Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });