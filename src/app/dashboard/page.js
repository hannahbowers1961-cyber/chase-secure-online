"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBank } from "@/context/BankContext";
import { 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  Check,
  UserCircle,
  MessageSquare,
  Search,
  Car,
  Gauge,
  Landmark
} from "lucide-react";
import BankLogo from "@/components/BankLogo";

export default function Dashboard() {
  const { db, formatMoney } = useBank();
  const [greeting, setGreeting] = useState("Good morning");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");
    
    setCurrentDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  return (
    <div className="w-full h-full bg-[#f4f5f9] overflow-y-auto pb-24 font-sans relative">
      
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f4f5f9] sticky top-0 z-20">
        <div className="flex gap-4">
          <MessageSquare className="w-6 h-6 text-[#0b5cba]" />
          <Search className="w-6 h-6 text-[#0b5cba]" />
        </div>
        <BankLogo className="w-8 h-8 text-[#0b5cba]" />
        <UserCircle className="w-7 h-7 text-[#0b5cba]" />
      </div>

      <div className="px-4 pt-2">
        {/* Authentic Header */}
        <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
          {greeting}
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-5">{currentDate}</p>

        {/* Quick Action Pills (Horizontal Scroll) */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 scroll-smooth">
          <button className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-[#0b5cba]"><Plus className="w-5 h-5" /></button>
          <Link href="/transfers/zelle" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba]">Send | Zelle®</Link>
          <Link href="/dashboard/deposit" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba]">Deposit checks</Link>
          <Link href="/transfers/bills" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba]">Pay bills</Link>
        </div>

        {/* Today's Snapshot (DYNAMIC) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm mb-8 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Landmark className="w-6 h-6 text-[#0b5cba]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-[15px]">Today's Snapshot</h3>
                <span className="bg-gray-100 text-gray-600 text-[11px] px-2 py-0.5 rounded font-medium">30 sec read</span>
              </div>
              {/* Splitting to remove the decimal .00 to match your exact screenshot style */}
              <p className="text-sm text-gray-600 mt-0.5">Your money in this month is <span className="font-semibold text-gray-900">{formatMoney(db.user.snapshotAmount).split('.')[0]}.</span></p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* --- ACCOUNTS SECTION HEADER --- */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </div>

        {/* 1. BANK ACCOUNTS BLOCK (DYNAMIC) */}
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="bg-[#0b5cba] px-4 py-3.5">
            <h3 className="text-white font-semibold text-[15px]">Bank accounts (2)</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            <Link href="/dashboard/checking" className="block p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-[15px] text-gray-800 mb-1">
                {db.accounts.checking.name} (...{db.accounts.checking.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
              </div>
              <div className="text-right">
                <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                  {formatMoney(db.accounts.checking.balance)}
                </div>
                <div className="text-[13px] text-gray-500 font-medium">Available balance</div>
              </div>
            </Link>

            <Link href="/dashboard/savings" className="block p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-[15px] text-gray-800 mb-1">
                {db.accounts.savings.name} (...{db.accounts.savings.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
              </div>
              <div className="text-right">
                <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                  {formatMoney(db.accounts.savings.balance)}
                </div>
                <div className="text-[13px] text-gray-500 font-medium">Available balance</div>
              </div>
            </Link>

            <Link href="/transfers/external" className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
              <span className="font-semibold text-gray-900 text-[15px]">Link external accounts</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* 2. CREDIT CARDS BLOCK (DYNAMIC) */}
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="bg-[#0b5cba] px-4 py-3.5">
            <h3 className="text-white font-semibold text-[15px]">Credit cards (2)</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            <Link href="/dashboard/freedom" className="block p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-[15px] text-gray-800 mb-4">
                {db.accounts.freedom.name} (...{db.accounts.freedom.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
              </div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-20 h-[52px] rounded-md bg-gradient-to-br from-[#1F618D] via-[#2980B9] to-[#85C1E9] p-1.5 relative overflow-hidden shadow-sm border border-blue-800/20">
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    <span className="text-[6px] text-white font-bold tracking-wider opacity-90">freedom</span>
                  </div>
                  <span className="absolute bottom-1 right-1.5 text-[5px] text-white font-bold opacity-80 italic">VISA</span>
                </div>
                <div className="text-right">
                  <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                    {formatMoney(db.accounts.freedom.balance)}
                  </div>
                  <div className="text-[13px] text-gray-500 font-medium">Current balance</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[13px] text-[#1e8b4e] font-medium">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                You don't have a payment due right now.
              </div>
            </Link>

            <Link href="/dashboard/credit-card" className="block p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center text-[15px] text-gray-800 mb-4">
                {db.accounts.freedomUnlimited.name} (...{db.accounts.freedomUnlimited.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
              </div>
              <div className="flex justify-between items-start">
                <div className="w-20 h-[52px] rounded-md bg-gradient-to-br from-[#1A5276] via-[#2471A3] to-[#5DADE2] p-1.5 relative overflow-hidden shadow-sm border border-blue-800/20">
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                    <div className="flex flex-col leading-none">
                      <span className="text-[6px] text-white font-bold tracking-wider opacity-90">freedom</span>
                      <span className="text-[4px] text-white font-medium opacity-80 uppercase tracking-widest mt-[1px]">unlimited</span>
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1.5 text-[5px] text-white font-bold opacity-80 italic">VISA</span>
                </div>
                <div className="text-right">
                  <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                    {formatMoney(db.accounts.freedomUnlimited.balance)}
                  </div>
                  <div className="text-[13px] text-gray-500 font-medium">Current balance</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 3. AUTO / HOME LOANS BLOCK (DYNAMIC) */}
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="bg-[#0b5cba] px-4 py-3.5">
            <h3 className="text-white font-semibold text-[15px]">Auto / Home Loans (1)</h3>
          </div>
          <div className="divide-y divide-gray-200">
            <Link href="/dashboard/loans" className="block p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-[15px] text-gray-800">
                  {db.accounts.autoLoan.name} (...{db.accounts.autoLoan.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="w-20 h-[52px] rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-right">
                  <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                    {formatMoney(db.accounts.autoLoan.balance)}
                  </div>
                  <div className="text-[13px] text-gray-500 font-medium">Remaining balance</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 4. CREDITWISE (CREDIT JOURNEY) BLOCK (DYNAMIC) */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-300 overflow-hidden">
            <Link href="/dashboard/creditwise" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#eef4fb] flex items-center justify-center border border-blue-100">
                  <Gauge className="w-6 h-6 text-[#0b5cba]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[15px]">Credit Journey</h3>
                  <p className="text-xs text-gray-600 mt-0.5">Your score is <span className="font-bold text-[#1e8b4e]">{db.user.creditScore}</span></p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}