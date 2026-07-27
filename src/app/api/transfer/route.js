import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Use the singleton!

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fromAccountKey, toAccountKey, amount } = body;

    if (!fromAccountKey || !toAccountKey || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer details" }, { status: 400 });
    }

    // SECURITY NOTE: In a production app with multiple users, you must also 
    // check that the accounts belong to the currently logged-in user.
    // e.g., where: { accountKey: fromAccountKey, userId: loggedInUserId }
    
    const fromAccount = await prisma.account.findFirst({
      where: { accountKey: fromAccountKey }
    });

    const toAccount = await prisma.account.findFirst({
      where: { accountKey: toAccountKey }
    });

    if (!fromAccount || !toAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (fromAccount.balance < amount) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 });
    }

    // Execute the database transaction
    await prisma.$transaction([
      // 1. Deduct from sender
      prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: fromAccount.balance - amount },
      }),
      
      // 2. Add to receiver
      prisma.account.update({
        where: { id: toAccount.id },
        data: { balance: toAccount.balance + amount },
      }),
      
      // 3. Log the withdrawal
      prisma.transaction.create({
        data: {
          accountId: fromAccount.id,
          date: new Date(),
          desc: `Transfer to ${toAccount.name}`,
          cat: "Transfer",
          amount: -amount,
        }
      }),
      
      // 4. Log the deposit
      prisma.transaction.create({
        data: {
          accountId: toAccount.id,
          date: new Date(),
          desc: `Transfer from ${fromAccount.name}`,
          cat: "Transfer",
          amount: amount,
        }
      })
    ]);

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Transfer API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}