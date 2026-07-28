"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); 
  
  const pathname = usePathname();

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
    setIsMounted(true); 

    if (pathname === "/") {
      setIsLoading(false);
      return;
    }

    async function fetchDatabase() {
      try {
        // ENTERPRISE FIX: Cache-Busting. 
        // We append a timestamp so Next.js treats every fetch as a brand new request.
        const response = await fetch(`/api/user?t=${Date.now()}`, {
          cache: 'no-store', // Forces Next.js to bypass the server cache
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const liveData = await response.json();

        if (response.status === 401 || liveData.error === "Unauthorized") {
          window.location.href = "/"; 
          return;
        }

        if (!response.ok || !liveData.accounts) {
          console.error("API Error:", liveData?.error || "Missing accounts data");
          setIsLoading(false);
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
      } finally { 
        setIsLoading(false); 
      }
    }
    
    fetchDatabase();
  }, [pathname]);

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
        body: JSON.stringify({
          fromAccountKey,
          toAccountKey,
          amount
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("Backend rejected transfer:", errorData.error);
        } else {
          console.error(`Backend failed with status: ${response.status}`);
        }
        
        setDb(dbSnapshot); 
        return;
      }
    } catch (error) {
      console.error("Network error while saving transfer:", error);
      setDb(dbSnapshot); 
    }
  };

  if (!isMounted) return null;

  return (
    <BankContext.Provider value={{ db, formatMoney, executeTransfer }}>
      {pathname !== "/" && (isLoading || !db) ? (
        <>
          {children}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4f5f9]">
            <div className="w-8 h-8 border-4 border-[#0b5cba] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </>
      ) : (
        children
      )}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);