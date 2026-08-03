"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react"; // Imported for the premium spinner
import { App } from '@capacitor/app';

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();
  
  // 👉 THE FIX: Track the previous path to catch navigations instantly
  const [lastPath, setLastPath] = useState(pathname);

  // By doing this OUTSIDE of a useEffect, we force React to instantly 
  // show the loading spinner before it even tries to paint the new page.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setIsLoading(true);
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Handle Android Hardware Back Button
  useEffect(() => {
    const setupBackButton = async () => {
      await App.addListener('backButton', () => {
        if (window.location.pathname !== "/") {
          // If not on the login screen, go back one page
          window.history.back();
        } else {
          // If on the login screen, safely exit the app
          App.exitApp();
        }
      });
    };

    setupBackButton();
  }, []);
  useEffect(() => {
    if (pathname === "/") {
      setIsLoading(false);
      return;
    }

    // Explicitly kill the spinner before returning!
    if (db) {
      setIsLoading(false);
      return;
    }

    async function fetchDatabase() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/api/user?t=${Date.now()}`, {
          cache: 'no-store',
          credentials: 'include', // <--- CRUCIAL: Sends your session cookie!
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        const liveData = await response.json();

        if (response.status === 401 || liveData.error === "Unauthorized" || !liveData.accounts) {
          router.push("/"); 
          return;
        }

        // Artificial Bank Security Delay (1.2 seconds)
        await new Promise((resolve) => setTimeout(resolve, 1200));

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
            id: liveData.id,
            firstName: liveData.firstName,
            lastName: liveData.lastName,
            creditScore: liveData.creditScore,
            snapshotAmount: liveData.snapshotAmount,
            email: liveData.email,
            phoneNumber: liveData.phoneNumber,
            address: liveData.address,
            city: liveData.city,
            state: liveData.state,
            zipCode: liveData.zipCode,
            profileImage: liveData.profileImage
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
  }, [pathname, router]); // Triggered every time pathname changes

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
      // Artificial Transfer Security Delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/transfer`, {
        method: 'POST',
        credentials: 'include',
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

  return (
    <BankContext.Provider value={{ db, formatMoney, executeTransfer, executeCashAdvance }}>
      {children}
      
      {/* 
        PREMIUM LOADING OVERLAY
        This strictly blocks the screen while the context is fetching data 
      */}
      {pathname !== "/" && isLoading && (
        <div className="fixed inset-0 z-[99999] bg-[#f4f5f9] flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute inset-0 w-full h-full border-4 border-gray-200 border-t-[#0b5cba] rounded-full animate-spin"></div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center z-10 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-[#0b5cba]" />
            </div>
          </div>
          <p className="text-gray-500 font-semibold mt-6 tracking-widest animate-pulse uppercase text-xs">
            Secure Connection
          </p>
        </div>
      )}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);