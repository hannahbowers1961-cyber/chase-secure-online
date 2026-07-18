"use client";

import { createContext, useContext, useState } from "react";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState({
    user: { 
      firstName: "Alex", 
      lastName: "Morgan",
      creditScore: 742,
      snapshotAmount: 10607.00
    },
    accounts: {
      checking: {
        name: "TOTAL CHECKING", mask: "8853", routing: "122105155", accountNum: "4490885392", balance: 10588.84,
        transactions: [
          { id: "1", date: "Today", desc: "The Home Depot", cat: "Debit Card", amount: -142.50 },
          { id: "2", date: "Yesterday", desc: "ApexCorp Payroll", cat: "Direct Deposit", amount: 3250.00 },
          { id: "3", date: "Yesterday", desc: "Zelle Transfer", cat: "Transfer", amount: -45.00 }
        ]
      },
      savings: {
        name: "TOTAL SAVINGS", mask: "4421", routing: "122105155", accountNum: "5590114421", balance: 24150.00,
        transactions: [
          { id: "1", date: "This Month", desc: "Transfer from Checking", cat: "Online Transfer", amount: 500.00 }
        ]
      },
      freedomUnlimited: {
        name: "Freedom Unlimited", mask: "1081", balance: 14000.62, creditLimit: 24000.00, paymentDue: 385.00,
        transactions: [
          { id: "1", date: "Today", desc: "Starbucks Store 14592", cat: "Food & Drink", amount: -12.45 },
          { id: "2", date: "Yesterday", desc: "Apple Store", cat: "Shopping", amount: -1499.00 },
          { id: "3", date: "Yesterday", desc: "Payment Thank You", cat: "Payment", amount: 500.00 }
        ]
      },
      freedom: {
        name: "Freedom", mask: "5445", balance: 0.00, creditLimit: 5000.00, paymentDue: 0.00,
        transactions: []
      },
      autoLoan: {
        name: "Auto Loan", mask: "5512", balance: 18450.00,
        transactions: []
      }
    }
  });

  // --- STANDARD TRANSFER ENGINE ---
  const executeTransfer = (fromKey, toKey, amountStr) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    setDb(prev => {
      const newDb = { ...prev };
      newDb.accounts = { ...prev.accounts };
      const fromAcc = { ...prev.accounts[fromKey], transactions: [...prev.accounts[fromKey].transactions] };
      const toAcc = { ...prev.accounts[toKey], transactions: [...prev.accounts[toKey].transactions] };

      fromAcc.balance -= amount;
      toAcc.balance += amount;

      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const txId = Math.random().toString(36).substr(2, 9);

      fromAcc.transactions.unshift({ id: txId + "A", date: today, desc: `Transfer to ${toAcc.name}`, cat: "Online Transfer", amount: -amount });
      toAcc.transactions.unshift({ id: txId + "B", date: today, desc: `Transfer from ${fromAcc.name}`, cat: "Online Transfer", amount: amount });

      newDb.accounts[fromKey] = fromAcc;
      newDb.accounts[toKey] = toAcc;
      return newDb;
    });
  };

  // --- NEW: CASH ADVANCE ENGINE ---
  const executeCashAdvance = (cardKey, targetKey, amountStr) => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    setDb(prev => {
      const newDb = { ...prev };
      newDb.accounts = { ...prev.accounts };
      const cardAcc = { ...prev.accounts[cardKey], transactions: [...prev.accounts[cardKey].transactions] };
      const targetAcc = { ...prev.accounts[targetKey], transactions: [...prev.accounts[targetKey].transactions] };

      // Math is reversed: Adding amount increases Credit Card debt, AND increases Checking cash.
      cardAcc.balance += amount;
      targetAcc.balance += amount;

      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const txId = Math.random().toString(36).substr(2, 9);

      // Card purchases show as negative on ledgers
      cardAcc.transactions.unshift({ id: txId + "A", date: today, desc: `Cash Advance to ${targetAcc.name}`, cat: "Cash Advance", amount: -amount });
      targetAcc.transactions.unshift({ id: txId + "B", date: today, desc: `Cash Advance from ${cardAcc.name}`, cat: "Transfer", amount: amount });

      newDb.accounts[cardKey] = cardAcc;
      newDb.accounts[targetKey] = targetAcc;
      return newDb;
    });
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <BankContext.Provider value={{ db, setDb, formatMoney, executeTransfer, executeCashAdvance }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  return useContext(BankContext);
}