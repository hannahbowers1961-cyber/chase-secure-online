"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext";
import { Info, ChevronDown, Calendar, X, Building2, User, Lock } from "lucide-react";

export default function WireTransfer() {
  const router = useRouter();
  const { db, formatMoney } = useBank();
  
  // --- Dynamic Form State ---
  const [recipient, setRecipient] = useState({ name: "", account: "", routing: "" });
  const [usdAmount, setUsdAmount] = useState("");
  const [selectedAccountKey, setSelectedAccountKey] = useState("checking");
  const [targetCurrency, setTargetCurrency] = useState("INR");
  
  // --- UI Modal State ---
  const [activeModal, setActiveModal] = useState(null);

  // Dynamic Exchange Rates & Flags
  const currencies = {
    INR: { name: "Indian Rupee", flag: "🇮🇳", rate: 83.5020 },
    EUR: { name: "Euro", flag: "🇪🇺", rate: 0.9240 },
    GBP: { name: "British Pound", flag: "🇬🇧", rate: 0.7910 },
    MXN: { name: "Mexican Peso", flag: "🇲🇽", rate: 16.5400 }
  };

  // Derived Data
  const selectedAccount = db?.accounts?.[selectedAccountKey] || {}; 
  const activeCurrency = currencies[targetCurrency];
  const foreignAmount = usdAmount ? (parseFloat(usdAmount) * activeCurrency.rate).toFixed(2) : "0.00";
  const todayDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  // --- RESTRICTION LOGIC ---
  // Assuming your Prisma database populates the user object inside the db context
  // Fallback to true so it doesn't block users if the data hasn't loaded yet
  const canWireTransfer = db?.user?.canWireTransfer ?? true;

  // Form Validation
  const isFormValid = usdAmount && recipient.name && recipient.account && recipient.routing;

  return (
    <div className="w-full h-full bg-white text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col relative">
      
      {/* Hydration Safety Overlay */}
      {!db && (
        <div className="absolute inset-0 bg-white/70 z-[100] flex items-center justify-center backdrop-blur-sm">
          <span className="w-8 h-8 border-4 border-[#0b5cba] border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      {/* 1. Header */}
      <div className="bg-[#0b5cba] text-white pt-6 pb-4 px-4 sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="w-16"></div>
        <span className="font-medium text-[15px] tracking-wide">Schedule Transfer</span>
        <button onClick={() => router.back()} className="text-[15px] w-16 text-right hover:text-white/80 transition-colors">
          Cancel
        </button>
      </div>

      {/* 2. Live Exchange Rate Banner */}
      <div className="bg-white border-b border-gray-200 py-3.5 flex flex-col items-center justify-center shadow-sm relative z-0 transition-all duration-300">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-gray-800">
            JPMC rate $1.00 USD = {activeCurrency.rate.toFixed(4)} {targetCurrency}
          </span>
          <div className="bg-gray-400 rounded-full w-4 h-4 flex items-center justify-center">
            <Info className="w-3 h-3 text-white" />
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">expires in 30 min</span>
      </div>

      {/* 3. Interactive Wire Form */}
      <div className="px-4 pt-6 space-y-6">
        
        {/* INTERACTIVE: Wire To */}
        <div onClick={() => setActiveModal("recipient")} className="border-b border-gray-300 pb-1.5 cursor-pointer group hover:border-gray-400 transition-colors">
          <label className="text-[13px] text-gray-500 block mb-1 group-hover:text-gray-700">Wire to</label>
          <div className="flex justify-between items-center">
            <span className={`text-[15px] truncate pr-2 ${recipient.name ? 'text-gray-900' : 'text-[#0b5cba] font-medium'}`}>
              {recipient.name ? `${recipient.name} (...${recipient.account.slice(-4) || 'XXXX'})` : "Add recipient details"}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-gray-600" />
          </div>
        </div>

        {/* INTERACTIVE: Wire From Selector */}
        <div onClick={() => setActiveModal("account")} className="border-b border-gray-300 pb-1.5 cursor-pointer group hover:border-gray-400 transition-colors">
          <label className="text-[13px] text-gray-500 block mb-1 group-hover:text-gray-700">Wire from</label>
          <div className="flex justify-between items-center">
            <span className="text-gray-900 text-[15px] truncate pr-2">
              {selectedAccount.name || 'Loading'} (...{selectedAccount.mask || '0000'}): {formatMoney(selectedAccount.balance || 0)}
            </span>
            <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 group-hover:text-gray-600" />
          </div>
        </div>

        {/* INTERACTIVE: USD Amount Input */}
        <div className="border-b border-gray-300 pb-1.5 focus-within:border-[#0b5cba] transition-colors">
          <label className="text-[13px] text-gray-500 block mb-1">Equivalent dollar amount (Amount debited)</label>
          <div className="flex justify-between items-center">
            <div className="flex items-center flex-1">
              <span className="text-gray-900 text-base mr-1">$</span>
              <input 
                type="number" 
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-gray-900 text-base bg-transparent outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 border-l border-gray-200 pl-3 ml-2">
              <span className="text-xl leading-none">🇺🇸</span>
              <span className="text-[15px] text-gray-900 font-medium w-8">USD</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE: Foreign Amount & Currency Selector */}
        <div className="relative">
          <div className="flex justify-between items-end border-b border-gray-300 pb-1.5">
            <div className="flex-1 overflow-hidden pr-4">
              <label className="text-[13px] text-gray-500 block mb-1">Wire amount</label>
              <span className={`text-base truncate block ${usdAmount ? 'text-gray-900 font-medium' : 'text-gray-300'}`}>
                {foreignAmount}
              </span>
            </div>
            <div onClick={() => setActiveModal("currency")} className="flex flex-col items-end cursor-pointer group border-l border-gray-200 pl-3">
              <label className="text-[13px] text-gray-500 block mb-1 group-hover:text-gray-700">Currency</label>
              <div className="flex items-center gap-2">
                <span className="text-xl leading-none">{activeCurrency.flag}</span>
                <span className="text-[15px] text-gray-900 font-medium">{targetCurrency}</span>
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">Your daily limit is $25,000.00</p>
        </div>

        {/* Date (Auto-sets to today) */}
        <div className="border-b border-gray-300 pb-1.5 pt-2">
          <div className="flex items-center gap-1.5 mb-1">
            <label className="text-[13px] text-gray-500">Wire date</label>
            <div className="bg-gray-400 rounded-full w-3.5 h-3.5 flex items-center justify-center">
              <Info className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-900 text-[15px]">{todayDate}</span>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Action Button & Restriction Message */}
        <div className="mt-4 flex flex-col items-center">
          <button 
            className={`w-full font-semibold py-3.5 rounded-xl transition-colors 
              ${!canWireTransfer 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-80' 
                : isFormValid 
                  ? 'bg-[#0b5cba] text-white hover:bg-[#094a96]' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            disabled={!isFormValid || !canWireTransfer}
          >
            Review Wire
          </button>
          
          {/* Helpful restriction message for the user */}
          {!canWireTransfer && (
            <p className="text-[13px] text-red-500 font-medium mt-3 text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100 w-full">
              Wire transfers are currently restricted on your account.
            </p>
          )}
        </div>

      </div>

      {/* --- BOTTOM SLIDE-UP MODALS --- */}
      {/* ... (The rest of your modal code remains exactly the same) ... */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-lg text-gray-900">
                {activeModal === "account" && "Select Account"}
                {activeModal === "currency" && "Select Currency"}
                {activeModal === "recipient" && "Recipient Details"}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Input Form Modal */}
            {activeModal === "recipient" && (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 focus-within:ring-[#0b5cba] transition-all bg-gray-50">
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Full Name / Business Name</label>
                  <input 
                    type="text" 
                    value={recipient.name} 
                    onChange={(e) => setRecipient({...recipient, name: e.target.value})} 
                    placeholder="e.g. John Doe or United Med" 
                    className="w-full bg-transparent outline-none text-gray-900 text-[15px]" 
                  />
                </div>
                <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 focus-within:ring-[#0b5cba] transition-all bg-gray-50">
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Account Number</label>
                  <input 
                    type="number" 
                    value={recipient.account} 
                    onChange={(e) => setRecipient({...recipient, account: e.target.value})} 
                    placeholder="Enter recipient account number" 
                    className="w-full bg-transparent outline-none text-gray-900 text-[15px]" 
                  />
                </div>
                <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 focus-within:ring-[#0b5cba] transition-all bg-gray-50">
                  <label className="text-xs text-gray-500 font-semibold uppercase mb-1 block">Routing / SWIFT Code</label>
                  <input 
                    type="text" 
                    value={recipient.routing} 
                    onChange={(e) => setRecipient({...recipient, routing: e.target.value})} 
                    placeholder="9-digit routing or 8-11 character SWIFT" 
                    className="w-full bg-transparent outline-none text-gray-900 text-[15px] uppercase" 
                  />
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  disabled={!recipient.name || !recipient.account || !recipient.routing}
                  className={`w-full py-3.5 rounded-xl font-semibold mt-4 transition-colors ${recipient.name && recipient.account && recipient.routing ? 'bg-[#0b5cba] text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  Save Recipient
                </button>
              </div>
            )}

            {/* Account Selection Modal Content */}
            {activeModal === "account" && (
              <div className="space-y-3">
                {['checking', 'savings'].map((key) => {
                  const acc = db?.accounts?.[key];
                  if (!acc) return null; 
                  
                  return (
                    <button 
                      key={key}
                      onClick={() => { setSelectedAccountKey(key); setActiveModal(null); }}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-[#0b5cba] transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-[#0b5cba]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{acc.name} (...{acc.mask})</p>
                          <p className="text-xs text-gray-500">Available: {formatMoney(acc.balance)}</p>
                        </div>
                      </div>
                      {selectedAccountKey === key && <div className="w-3 h-3 bg-[#0b5cba] rounded-full mr-2"></div>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Currency Selection Modal Content */}
            {activeModal === "currency" && (
              <div className="space-y-2">
                {Object.entries(currencies).map(([code, data]) => (
                  <button 
                    key={code}
                    onClick={() => { setTargetCurrency(code); setActiveModal(null); }}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-[#0b5cba] transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{data.flag}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{code} - {data.name}</p>
                        <p className="text-xs text-gray-500">Rate: {data.rate.toFixed(4)}</p>
                      </div>
                    </div>
                    {targetCurrency === code && <div className="w-3 h-3 bg-[#0b5cba] rounded-full mr-2"></div>}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
      
    </div>
  );
}