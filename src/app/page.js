"use client";

import { useState } from "react";
import { ArrowLeft, Search, CheckCircle2, ShieldCheck, Zap, User, Plus } from "lucide-react";
import { useBank } from "@/context/BankContext"; 
import { useRouter } from "next/navigation";

// Mock Contacts Database (You can move this to the DB later!)
const zelleContacts = [
  { id: 1, name: "John Smith", details: "Enrolled with Zelle®", initials: "JS", color: "bg-[#741eed]/20 text-[#741eed] border-[#741eed]/30" },
  { id: 2, name: "Maria Silva", details: "555-019-8372", initials: "MS", color: "bg-slate-800 text-slate-400 border-slate-700" },
  { id: 3, name: "David Chen", details: "david.chen@email.com", initials: "DC", color: "bg-blue-900/30 text-blue-400 border-blue-800/50" },
  { id: 4, name: "Sarah Jenkins", details: "Enrolled with Zelle®", initials: "SJ", color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50" },
];

export default function ZelleSend() {
  const router = useRouter();
  
  // Bring in the live database context!
  const { db, formatMoney } = useBank();
  
  // Multi-step Flow State
  const [step, setStep] = useState("select_contact"); 
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Guard clause: Wait for DB to load
  if (!db) return null;

  // Filter contacts based on search
  const filteredContacts = zelleContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validation: Check if the search query is an email or phone number
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchQuery);
  const isPhone = /^\d{10,}$/.test(searchQuery.replace(/\D/g, ''));
  const isValidNewRecipient = isEmail || isPhone;

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setStep("enter_amount");
  };

  const handleSend = () => {
    if (!amount || amount <= 0) return;
    
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep("success");
    }, 1500);
  };

  const handleDone = () => {
    setAmount("");
    setSelectedContact(null);
    setSearchQuery("");
    setStep("select_contact");
  };

  // --- STEP 3: SUCCESS SCREEN ---
  if (step === "success") {
    return (
      <div className="fixed inset-0 z-[99999] flex justify-center sm:bg-black/80 backdrop-blur-sm">
        <div className="w-full h-full sm:max-w-md bg-slate-950 flex flex-col items-center justify-center p-4 space-y-4 relative sm:border-x sm:border-slate-800 shadow-2xl animate-in fade-in duration-300">
          <div className="w-24 h-24 bg-[#741eed]/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-[#741eed]" />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sent!</h2>
          <p className="text-slate-400 text-center text-lg">
            ${amount} is on its way via <span className="font-semibold text-white">Zelle®</span>
          </p>
          
          <div className="w-full max-w-md bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 mt-6">
            <div className="flex justify-between text-sm py-3 border-b border-slate-700/50">
              <span className="text-slate-400">To</span>
              <span className="text-white font-medium">{selectedContact?.name}</span>
            </div>
            <div className="flex justify-between text-sm py-3">
              <span className="text-slate-400">From</span>
              <span className="text-white font-medium">{db.accounts.checking?.name}</span>
            </div>
          </div>

          <button 
            onClick={handleDone}
            className="mt-8 w-full max-w-md bg-[#741eed] hover:bg-[#6015c9] text-white font-bold py-4 rounded-2xl flex justify-center transition-all shadow-lg shadow-[#741eed]/20 active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[99999] flex justify-center sm:bg-black/80 backdrop-blur-sm">
      <div className="w-full h-full sm:max-w-md bg-slate-950 flex flex-col relative sm:border-x sm:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* --- STEP 1: SELECT CONTACT --- */}
        {step === "select_contact" && (
          <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="bg-slate-950 pt-4 pb-4 px-4 border-b border-slate-800 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-800 rounded-full transition-colors">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">Send with Zelle</h1>
                  <span className="text-xs font-bold text-[#741eed] bg-[#741eed]/10 px-1.5 py-0.5 rounded-md align-top">®</span>
                </div>
              </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative shadow-sm">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, email, or mobile number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-base text-white placeholder:text-slate-500 outline-none focus:border-[#741eed] focus:ring-1 focus:ring-[#741eed] transition-all"
                  />
                </div>

                {/* Contacts List */}
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
                    {searchQuery ? "Search Results" : "Trusted Contacts"}
                  </h2>
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
                    
                    {searchQuery && !isValidNewRecipient && filteredContacts.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <User className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-slate-300 font-medium">No contacts found</p>
                        <p className="text-slate-500 text-sm mt-1">Try entering a valid email or 10-digit phone number</p>
                      </div>
                    ) : (
                      <>
                        {isValidNewRecipient && (
                          <button 
                            onClick={() => handleContactSelect({
                              id: 'new_recipient',
                              name: searchQuery,
                              details: isEmail ? "New Email Recipient" : "New Mobile Recipient",
                              initials: isEmail ? "@" : "#",
                              color: "bg-[#741eed]/20 text-[#741eed] border-[#741eed]/30"
                            })}
                            className="w-full flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/80 active:bg-slate-800 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-[#741eed]/20 text-[#741eed] border-[#741eed]/30">
                              <Plus className="w-5 h-5" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-base font-semibold text-slate-200">{searchQuery}</p>
                              <p className="text-sm font-medium text-[#741eed]">Tap to send to new recipient</p>
                            </div>
                          </button>
                        )}

                        {filteredContacts.map((contact) => (
                          <button 
                            key={contact.id}
                            onClick={() => handleContactSelect(contact)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-800/80 active:bg-slate-800 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${contact.color}`}>
                              <span className="font-bold text-lg">{contact.initials}</span>
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-base font-semibold text-slate-200">{contact.name}</p>
                              <p className="text-sm text-slate-500">{contact.details}</p>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 2: ENTER AMOUNT --- */}
        {step === "enter_amount" && (
          <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
            {/* Amount Entry Header */}
            <div className="bg-gradient-to-b from-[#741eed]/20 to-transparent pt-4 pb-6 px-4 border-b border-[#741eed]/10">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setStep("select_contact")} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                
                {/* Sending To Pill */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-full px-4 py-1.5 flex items-center gap-2 max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex-shrink-0">To</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></div>
                  <span className="text-sm font-bold text-white truncate">{selectedContact?.name}</span>
                </div>
                
                <div className="w-10"></div>
              </div>

              {/* Massive, Clean Currency Input */}
              <div className="text-center">
                <div className="flex justify-center items-center text-7xl font-bold text-white mb-2 tracking-tighter">
                  <span className="text-slate-500 mr-1">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent border-none outline-none w-64 text-center placeholder:text-slate-700 focus:ring-0 p-0"
                    autoFocus
                  />
                </div>
                {/* Dynamic DB Balance Pull */}
                <p className="text-sm font-medium text-[#741eed] flex items-center justify-center gap-1 mt-4">
                  <Zap className="w-4 h-4" />
                  Available: {formatMoney(db.accounts.checking?.balance || 0)}
                </p>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-end pb-8">
              {/* Security Badge */}
              <div className="mb-6 flex items-center justify-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Payments are secure and instant</span>
              </div>

              {/* Zelle Purple Send Button */}
              <button 
                onClick={handleSend}
                disabled={!amount || amount <= 0 || isSending}
                className="w-full bg-[#741eed] hover:bg-[#6015c9] disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#741eed]/20 active:scale-[0.98]"
              >
                {isSending ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  `Review ${amount ? "$" + amount : ""}`
                )}
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}