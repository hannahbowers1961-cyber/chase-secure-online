"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    // If we are on the login page, stop loading and do nothing.
    if (pathname === "/") {
      setIsLoading(false);
      return;
    }

    async function fetchDatabase() {
      try {
        const response = await fetch(`/api/user?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const liveData = await response.json();

        // If unauthorized or missing data, push back to login
        if (response.status === 401 || liveData.error === "Unauthorized" || !liveData.accounts) {
          router.push("/"); 
          return;
        }

        const formattedAccounts = {};
        liveData.accounts.forEach(acc => {
          formattedAccounts[acc.accountKey] = {
            ...acc,
            transactions: acc.transactions.map(t => ({
              ...t,
              date: formatDate(t.date)
            }))
          };
        });

        setDb({
          user: {
            firstName: liveData.firstName,
            lastName: liveData.lastName,
            creditScore: liveData.creditScore,
            snapshotAmount: liveData.snapshotAmount,
          },
          accounts: formattedAccounts
        });
      } catch (error) { 
        console.error("Network Error:", error); 
        router.push("/");
      } finally { 
        setIsLoading(false); 
      }
    }
    
    fetchDatabase();
  }, [pathname, router]);

  const formatMoney = (amount) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const executeTransfer = async (fromAccountKey, toAccountKey, amountString) => {
    const amount = parseFloat(amountString);
    if (isNaN(amount) || amount <= 0) return;

    const dbSnapshot = JSON.parse(JSON.stringify(db));

    setDb((prevDb) => {
      if (!prevDb) return prevDb;
      const newDb = JSON.parse(JSON.stringify(prevDb));
      const fromAccount = newDb.accounts[fromAccountKey];
      const toAccount = newDb.accounts[toAccountKey];

      if (!fromAccount || !toAccount) return prevDb;

      fromAccount.balance -= amount;
      toAccount.balance += amount;

      const todayFormatted = formatDate(new Date().toISOString());

      fromAccount.transactions.unshift({
        id: `tx_${Date.now()}_out`, desc: `Transfer to ${toAccount.name}`, date: todayFormatted, cat: 'Transfer', amount: -amount,
      });

      toAccount.transactions.unshift({
        id: `tx_${Date.now()}_in`, desc: `Transfer from ${fromAccount.name}`, date: todayFormatted, cat: 'Transfer', amount: amount,
      });

      return newDb;
    });

    try {
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountKey, toAccountKey, amount })
      });

      if (!response.ok) {
        setDb(dbSnapshot); 
      }
    } catch (error) {
      setDb(dbSnapshot); 
    }
  };

  const executeCashAdvance = async (fromAccountKey, toAccountKey, amountString) => {
    return executeTransfer(fromAccountKey, toAccountKey, amountString);
  };

  // HYDRATION FIX: We NEVER block {children}. We render it 100% of the time.
  // The loading spinner now safely floats *over* the UI instead of replacing it.
  return (
    <BankContext.Provider value={{ db, formatMoney, executeTransfer, executeCashAdvance }}>
      {children}
      
      {pathname !== "/" && isLoading && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#f4f5f9]">
          <div className="w-8 h-8 border-4 border-[#0b5cba] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);