"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 
import { useRouter } from "next/navigation";

export default function ZelleSend() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkingAccount = bankAccounts[0]; 

  const handleSend = () => {
    if (!amount || amount <= 0) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
    }, 1500);
  };

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-full w-full space-y-4 mt-20">
        <div className="w-24 h-24 bg-[#741eed]/20 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-[#741eed]" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Sent!</h2>
        <p className="text-slate-400 text-center text-lg">
          ${amount} is on its way via <span className="font-semibold text-white">Zelle®</span>
        </p>
        
        <div className="w-full bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mt-6">
          <div className="flex justify-between text-sm py-2 border-b border-slate-700/50">
            <span className="text-slate-400">To</span>
            <span className="text-white font-medium">John Smith</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-slate-400">From</span>
            <span className="text-white font-medium">{checkingAccount.name}</span>
          </div>
        </div>

        <Link 
          href="/transfers"
          className="mt-8 w-full bg-[#741eed] hover:bg-[#6015c9] text-white font-bold py-3.5 rounded-xl flex justify-center transition-colors shadow-lg shadow-[#741eed]/20"
        >
          Done
        </Link>
      </div>
    );
  }

  // --- MAIN TRANSFER SCREEN ---
  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto">
      
      {/* Premium Zelle Header */}
      <div className="bg-gradient-to-b from-[#741eed]/20 to-transparent pt-4 pb-6 px-4 border-b border-[#741eed]/10">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Send with Zelle</h1>
            <span className="text-xs font-bold text-[#741eed] bg-[#741eed]/10 px-1.5 py-0.5 rounded-md align-top">®</span>
          </div>
        </div>

        {/* Massive, Clean Currency Input */}
        <div className="text-center">
          <div className="flex justify-center items-center text-6xl font-bold text-white mb-2 tracking-tighter">
            <span className="text-slate-500 mr-1">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="bg-transparent border-none outline-none w-48 text-center placeholder:text-slate-700 focus:ring-0 p-0"
              autoFocus
            />
          </div>
          <p className="text-sm font-medium text-[#741eed] flex items-center justify-center gap-1">
            <Zap className="w-4 h-4" />
            Available: ${checkingAccount.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        {/* Recipient Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-1">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Send To</h2>
          </div>
          
          <div className="relative shadow-sm">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Name, email, or mobile number"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 outline-none focus:border-[#741eed] focus:ring-1 focus:ring-[#741eed] transition-all"
            />
          </div>

          {/* Trusted Contacts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#741eed]/20 flex items-center justify-center border border-[#741eed]/30">
                <span className="text-[#741eed] font-bold text-lg">JS</span>
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold text-slate-200">John Smith</p>
                <p className="text-sm text-slate-500">Enrolled with Zelle®</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <span className="text-slate-400 font-bold text-lg">MS</span>
              </div>
              <div className="text-left flex-1">
                <p className="text-base font-semibold text-slate-200">Maria Silva</p>
                <p className="text-sm text-slate-500">555-019-8372</p>
              </div>
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-auto pt-4 pb-2 flex items-center justify-center gap-2 text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-medium">Payments are secure and instant</span>
        </div>

        {/* Zelle Purple Send Button */}
        <button 
          onClick={handleSend}
          disabled={!amount || amount <= 0 || isSending}
          className="w-full bg-[#741eed] hover:bg-[#6015c9] disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#741eed]/20"
        >
          {isSending ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            `Review ${amount ? "$" + amount : ""}`
          )}
        </button>
      </div>

    </div>
  );
}