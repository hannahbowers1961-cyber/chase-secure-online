"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false); // NEW: Hydration safeguard
  
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
    setIsMounted(true); // Tells React the client has successfully hydrated

    // If we are on the login page, don't fetch secure data
    if (pathname === "/") {
      setIsLoading(false);
      return;
    }

    async function fetchDatabase() {
      try {
        const response = await fetch("/api/user");
        const liveData = await response.json();

        // ENTERPRISE SECURITY: Hard-redirect to clear cache and bypass router errors
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

  // HYDRATION FIX: Do not render the Context until the browser and server are perfectly synced
  if (!isMounted) return null;

  return (
    <BankContext.Provider value={{ db, formatMoney }}>
      {/* 
        Instead of destroying the layout.js HTML, we render it safely via {children}.
        If the app is loading secure data, we render an overlay spinner ON TOP of the layout.
      */}
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