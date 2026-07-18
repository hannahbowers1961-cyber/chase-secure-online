"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ReceiptText, Building2, Calendar, ChevronDown } from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 
import { useRouter } from "next/navigation";

export default function PayBills() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedBiller, setSelectedBiller] = useState("Verizon Wireless");

  const checkingAccount = bankAccounts[0]; 

  const handlePayment = () => {
    if (!amount || amount <= 0) return;
    
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsSuccess(true);
    }, 1500);
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full w-full space-y-4 mt-20">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Scheduled!</h2>
        <p className="text-slate-400 text-center text-lg">
          Your payment to <span className="font-semibold text-white">{selectedBiller}</span> is set.
        </p>
        
        <div className="w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mt-6">
          <div className="flex justify-between text-sm py-2 border-b border-slate-700/50">
            <span className="text-slate-400">Amount</span>
            <span className="text-white font-bold">${amount}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-700/50">
            <span className="text-slate-400">Date</span>
            <span className="text-white font-medium">Tomorrow</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-slate-400">From</span>
            <span className="text-white font-medium">{checkingAccount.name}</span>
          </div>
        </div>

        <Link 
          href="/transfers"
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex justify-center transition-colors shadow-lg shadow-blue-500/20"
        >
          Done
        </Link>
      </div>
    );
  }

  // --- MAIN BILL PAY SCREEN ---
  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 pb-4 px-4 border-b border-slate-800/50 bg-slate-900/50">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <ReceiptText className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-bold text-white tracking-tight">Pay Bills</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        
        {/* Biller Selection Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Pay To</label>
          <button className="w-full flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-slate-300" />
              </div>
              <div className="text-left">
                <p className="text-base font-semibold text-white">{selectedBiller}</p>
                <p className="text-sm text-slate-500">Acct ending in ...3924</p>
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">Amount</label>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 flex items-center focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
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

        {/* Payment Date & Account */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-base text-slate-200">Delivery Date</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-medium">Tomorrow</span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </div>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex flex-col text-left">
              <span className="text-sm text-slate-400 mb-0.5">Pay From</span>
              <span className="text-base font-medium text-white">{checkingAccount.name}</span>
            </div>
            <div className="text-right">
              <span className="text-sm text-slate-400 block mb-0.5">Available Balance</span>
              <span className="text-base font-medium text-white">${checkingAccount.balance.toLocaleString()}</span>
            </div>
          </button>
        </div>

        {/* Blue Pay Button */}
        <div className="mt-auto pt-6">
          <button 
            onClick={handlePayment}
            disabled={!amount || amount <= 0 || isPaying}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            {isPaying ? (
              <span className="animate-pulse">Scheduling...</span>
            ) : (
              `Schedule Payment`
            )}
          </button>
        </div>

      </div>
    </div>
  );
}