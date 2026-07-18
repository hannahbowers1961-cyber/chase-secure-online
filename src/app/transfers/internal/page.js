"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ArrowRightLeft, ChevronDown, Landmark } from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 

export default function InternalTransfers() {
  const [amount, setAmount] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Grab the two mock accounts for the transfer simulation
  const checkingAccount = bankAccounts[0];
  const savingsAccount = bankAccounts[1];

  const handleTransfer = () => {
    if (!amount || amount <= 0) return;
    
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setIsSuccess(true);
    }, 1500);
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full w-full space-y-4 mt-20">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Transfer Complete</h2>
        <p className="text-slate-400 text-center text-lg">
          Your funds are available immediately.
        </p>
        
        <div className="w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mt-6 relative overflow-hidden">
          {/* A subtle green gradient background for the receipt */}
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          
          <div className="flex justify-between text-sm py-3 border-b border-slate-700/50">
            <span className="text-slate-400">Amount Transferred</span>
            <span className="text-emerald-400 font-bold text-lg">${amount}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-3 border-b border-slate-700/50">
            <span className="text-slate-400">From</span>
            <span className="text-white font-medium">{checkingAccount.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm py-3">
            <span className="text-slate-400">To</span>
            <span className="text-white font-medium">{savingsAccount.name}</span>
          </div>
        </div>

        <Link 
          href="/transfers"
          className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex justify-center transition-colors shadow-lg shadow-emerald-500/20"
        >
          Done
        </Link>
      </div>
    );
  }

  // --- MAIN TRANSFER SCREEN ---
  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-4 px-4 border-b border-slate-800/50 bg-slate-900/50">
        <Link href="/transfers" className="p-2 -ml-2 bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors border border-slate-700">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Transfer Funds</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        
        {/* From / To Selectors */}
        <div className="relative space-y-3 bg-slate-900 border border-slate-800 rounded-2xl p-2">
          
          {/* From Account */}
          <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-4 flex items-center justify-between hover:border-emerald-500/30 transition-colors cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">From</p>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-slate-400" />
                <p className="text-base font-semibold text-white">{checkingAccount.name}</p>
              </div>
              <p className="text-sm text-slate-400 mt-1">Available: ${checkingAccount.balance.toLocaleString()}</p>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </div>

          {/* Transfer Arrow Icon bridging the two accounts */}
          <div className="absolute top-1/2 left-8 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-900 z-10">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>

          {/* To Account */}
          <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-4 pl-14 flex items-center justify-between hover:border-emerald-500/30 transition-colors cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">To</p>
              <p className="text-base font-semibold text-white">{savingsAccount.name}</p>
              <p className="text-sm text-slate-400 mt-1">Balance: ${savingsAccount.balance.toLocaleString()}</p>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </div>

        </div>

        {/* Amount Input */}
        <div className="space-y-2 mt-4">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Amount</label>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex items-center focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
            <span className="text-2xl font-medium text-slate-500 mr-2">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-transparent border-none outline-none w-full text-2xl font-bold text-white placeholder:text-slate-600 focus:ring-0"
            />
          </div>
        </div>

        {/* Frequency */}
        <button className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:bg-slate-800/50 transition-colors">
          <span className="text-sm font-medium text-slate-300">Frequency</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">One-time</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </div>
        </button>

        {/* Emerald Transfer Button */}
        <div className="mt-auto pt-6">
          <button 
            onClick={handleTransfer}
            disabled={!amount || amount <= 0 || isTransferring}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            {isTransferring ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              `Slide to Transfer`
            )}
          </button>
        </div>

      </div>
    </div>
  );
}