"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext";
import { ArrowLeft, Eye, EyeOff, Search, ArrowRightLeft, Download, X, FileText, DownloadCloud, Building2 } from "lucide-react";

export default function SavingsAccount() {
  const router = useRouter();
  
  const { db, formatMoney, executeTransfer } = useBank();
  
  const [showNumbers, setShowNumbers] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  
  const [transferAmount, setTransferAmount] = useState("");

  const account = db.accounts.savings;
  const targetAccount = db.accounts.checking; // Automatically point back to Checking

  const handleTransfer = () => {
    executeTransfer("savings", "checking", transferAmount);
    setTransferAmount("");
    setActiveAction(null);
  };

  const renderModalContent = () => {
    switch (activeAction) {
      case "Transfer Funds":
        return (
          <div className="space-y-5">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">From</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{account.name} (...{account.mask})</span>
                <span className="text-sm text-gray-500">{formatMoney(account.balance)}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">To</p>
                <span className="font-semibold text-gray-900">{targetAccount.name} (...{targetAccount.mask})</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Amount</p>
              <div className="flex items-center text-3xl font-light">
                <span className="text-gray-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00" 
                  className="w-full outline-none bg-transparent placeholder:text-gray-300 text-gray-900" 
                />
              </div>
            </div>
            
            <button 
              onClick={handleTransfer}
              disabled={!transferAmount || transferAmount <= 0}
              className={`w-full font-semibold py-4 rounded-xl mt-4 transition-colors ${transferAmount > 0 ? 'bg-[#0b5cba] text-white hover:bg-[#094a96]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Confirm Transfer
            </button>
          </div>
        );
      case "Statements & Docs":
        return (
          <div className="divide-y divide-gray-100">
            {['June 2026', 'May 2026', 'April 2026', 'March 2026'].map((month, i) => (
              <div key={i} className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{month} Statement</span>
                </div>
                <DownloadCloud className="w-5 h-5 text-[#0b5cba]" />
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col relative">
      <div className="bg-[#0b5cba] text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-semibold text-lg uppercase">{account.name}</span>
          <div className="w-10"></div>
        </div>
        <div className="text-center">
          <p className="text-4xl font-light tracking-tight mb-1">{formatMoney(account.balance)}</p>
          <p className="text-sm text-blue-100">Available balance</p>
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-2 relative z-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Account Details</h3>
            <button onClick={() => setShowNumbers(!showNumbers)} className="text-[#0b5cba] flex items-center gap-1.5 text-sm font-medium hover:underline">
              {showNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showNumbers ? "Hide" : "Show"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Routing Number</p>
              <p className="text-sm font-medium text-gray-900 font-mono tracking-wider">{showNumbers ? account.routing : `••••${account.routing.slice(-5)}`}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Account Number</p>
              <p className="text-sm font-medium text-gray-900 font-mono tracking-wider">{showNumbers ? account.accountNum : `••••••${account.mask}`}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setActiveAction("Transfer Funds")} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center"><ArrowRightLeft className="w-5 h-5 text-[#0b5cba]" /></div>
            <span className="text-xs font-medium text-gray-700">Transfer</span>
          </button>
          <button onClick={() => setActiveAction("Statements & Docs")} className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center"><Download className="w-5 h-5 text-[#0b5cba]" /></div>
            <span className="text-xs font-medium text-gray-700">Statements</span>
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search transactions" className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#0b5cba] transition-all" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {account.transactions.length === 0 ? (
              <p className="p-4 text-center text-gray-500 text-sm">No recent transactions</p>
            ) : (
              account.transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Building2 className={`w-5 h-5 ${tx.amount > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{tx.desc}</p>
                      <p className="text-xs text-gray-500">{tx.date} • {tx.cat}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-[#1e8b4e]' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {activeAction && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setActiveAction(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl min-h-[60vh] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10">
              <h3 className="font-semibold text-xl text-gray-900">{activeAction}</h3>
              <button onClick={() => setActiveAction(null)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}