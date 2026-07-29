"use client";

import Link from "next/link";
import { ArrowLeft, Car, FileText, ChevronRight, CheckCircle2 } from "lucide-react";
import { useBank } from "@/context/BankContext";

export default function AutoLoan() {
  const { db, formatMoney } = useBank();

  // 1. Safe fallback while DB is loading
  if (!db) return null;

  // 2. STRICT DB BINDING: Pull live account data
  const account = db.accounts?.autoLoan;

  // 3. Graceful fallback if the user doesn't have an auto loan in the DB yet
  if (!account) {
    return (
      <div className="w-full h-full min-h-screen bg-[#f4f5f9] flex flex-col items-center justify-center p-8 text-center">
        <Car className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900">No Auto Loan Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          You don't currently have an active auto loan associated with this account.
        </p>
        <Link 
          href="/dashboard" 
          className="bg-[#0b5cba] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#094a96] transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // --- 4. 100% DATABASE-DRIVEN VARIABLES ---
  const nextPaymentDate = account.nextPaymentDate || "TBD";
  const paymentAmount = account.paymentAmount || 0;
  const vehicleDetails = account.vehicleDetails || "Vehicle details unavailable";
  const liveTransactions = account.transactions || [];

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col">
      
      {/* Header */}
      <div className="bg-[#0b5cba] text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="font-semibold text-lg uppercase">{account.name}</span>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center pb-2">
          {/* Dynamic Balance: Accurately reflects negative balance until paid off */}
          <p className="text-4xl font-light tracking-tight mb-1">
            {formatMoney(account.balance || 0)}
          </p>
          <p className="text-sm text-blue-100">Remaining Principal Balance</p>
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-2 relative z-20">
        
        {/* Next Payment Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-end mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Next payment due</p>
              <p className="text-sm font-semibold text-gray-900">{nextPaymentDate}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-light text-gray-900">
                ${parseFloat(paymentAmount).toFixed(2)}
              </p>
            </div>
          </div>
          
          <button className="w-full bg-[#0b5cba] text-white font-semibold py-3 rounded-xl hover:bg-[#094a96] transition-colors">
            Make a Payment
          </button>
        </div>

        {/* Loan Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Vehicle Details</span>
                <span className="text-xs text-gray-500 block">{vehicleDetails}</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Request Payoff Quote</span>
                <span className="text-xs text-gray-500 block">Valid through today</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Payment History Mapped Directly From DB */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Recent Payments
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {liveTransactions.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No payment history available.
              </div>
            ) : (
              liveTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1e8b4e]" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{tx.date}</p>
                      <p className="text-xs text-gray-500">{tx.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {tx.amount > 0 ? "+" : ""}
                    {formatMoney(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}