"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ReceiptText, Building2, Calendar, ChevronDown, ChevronRight, Search } from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 
import { useRouter } from "next/navigation";

// Mock Payees Database
const mockPayees = [
  { id: 1, name: "Verizon Wireless", account: "...3924", type: "Mobile & Internet" },
  { id: 2, name: "Con Edison", account: "...8812", type: "Utility" },
  { id: 3, name: "Chase Credit Card", account: "...1199", type: "Credit Card" },
  { id: 4, name: "Geico Auto Insurance", account: "...4450", type: "Insurance" },
  { id: 5, name: "Spectrum Internet", account: "...7721", type: "Mobile & Internet" },
];

export default function PayBills() {
  const router = useRouter();
  
  // State Management
  const [step, setStep] = useState("payment_form"); // 'select_payee', 'payment_form', 'success'
  const [selectedBiller, setSelectedBiller] = useState(mockPayees[0]);
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const checkingAccount = bankAccounts[0] || { name: "Checking Account", balance: 5000 }; 

  const handlePayment = () => {
    if (!amount || amount <= 0) return;
    
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStep("success");
    }, 1500);
  };

  // ADDED: This function resets the amount and returns the user to the payment form
  const handleDone = () => {
    setAmount("");
    setStep("payment_form");
  };

  const filteredPayees = mockPayees.filter(payee => 
    payee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

// --- STEP 3: SUCCESS SCREEN ---
  if (step === "success") {
    return (
      <div className="absolute inset-0 z-30 bg-slate-950 p-4 flex flex-col items-center justify-center h-full w-full space-y-4 animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Scheduled!</h2>
        <p className="text-slate-400 text-center text-lg">
          Your payment to <span className="font-semibold text-white">{selectedBiller.name}</span> is set.
        </p>
        
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 mt-6">
          <div className="flex justify-between text-sm py-2 border-b border-slate-800">
            <span className="text-slate-400">Amount</span>
            <span className="text-white font-bold">${amount}</span>
          </div>
          <div className="flex justify-between text-sm py-2 border-b border-slate-800">
            <span className="text-slate-400">Date</span>
            <span className="text-white font-medium">Tomorrow</span>
          </div>
          <div className="flex justify-between text-sm py-2">
            <span className="text-slate-400">From</span>
            <span className="text-white font-medium">{checkingAccount.name}</span>
          </div>
        </div>

        <button 
          onClick={handleDone}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center transition-colors shadow-lg shadow-blue-500/20"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto font-sans relative">
      
      {/* --- STEP 1: SELECT PAYEE SCREEN --- */}
      {step === "select_payee" && (
        <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3 pt-6 pb-4 px-4 border-b border-slate-800/50 bg-slate-900/50">
            <button onClick={() => setStep("payment_form")} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">Select Payee</h1>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search payees..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider px-1">My Payees</label>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
                {filteredPayees.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No payees found.</div>
                ) : (
                  filteredPayees.map((payee) => (
                    <button 
                      key={payee.id}
                      onClick={() => {
                        setSelectedBiller(payee);
                        setStep("payment_form");
                        setSearchQuery(""); // reset search
                      }}
                      className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">{payee.name}</p>
                          <p className="text-sm text-slate-500">Acct ending in {payee.account}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STEP 2: MAIN BILL PAY SCREEN --- */}
      {step === "payment_form" && (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
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
              <button 
                onClick={() => setStep("select_payee")}
                className="w-full flex items-center justify-between bg-slate-900 border border-slate-700 rounded-2xl p-4 hover:border-blue-500/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-base font-semibold text-white">{selectedBiller.name}</p>
                    <p className="text-sm text-slate-500">Acct ending in {selectedBiller.account}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-400 text-sm font-medium">
                  Change <ChevronRight className="w-4 h-4 ml-1" />
                </div>
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
            <div className="mt-auto pt-6 pb-8">
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
      )}

    </div>
  );
}