"use client";

import { createContext, useContext, useState, useEffect } from "react";

const BankContext = createContext();

export function BankProvider({ children }) {
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live data from your new Postgres Database
  useEffect(() => {
    async function fetchDatabase() {
      try {
        const response = await fetch("/api/user");
        const liveData = await response.json();

        // Transform the array of accounts into an easy-to-read object map for your UI
        const formattedAccounts = {};
        liveData.accounts.forEach(acc => {
          formattedAccounts[acc.accountKey] = acc;
        });

        // Set the live global state
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
        console.error("Error loading bank data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDatabase();
  }, []);

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Show a blank screen (or you could add a spinner here) while the database connects
  if (isLoading || !db) return <div className="w-full h-screen bg-[#f4f5f9]"></div>;

  return (
    <BankContext.Provider value={{ db, setDb, formatMoney }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  return useContext(BankContext);
}