"use client";

import { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  ChevronUp,
  Lock // Added Lock icon for the restriction screen
} from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext"; 

// Mock Contacts Database (Original Dark Theme Colors)
const zelleContacts = [
  { id: 1, name: "Grandma", details: "Enrolled with Zelle®", initials: "JS", color: "bg-[#741eed]/20 text-[#741eed] border-[#741eed]/30" },
  { id: 2, name: "Maria Silva", details: "555-019-8372", initials: "MS", color: "bg-slate-800 text-slate-400 border-slate-700" },
  { id: 3, name: "David Chen", details: "david.chen@email.com", initials: "DC", color: "bg-blue-900/30 text-blue-400 border-blue-800/50" },
  { id: 4, name: "Sarah Jenkins", details: "Enrolled with Zelle®", initials: "SJ", color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50" },
];

export default function ZelleSend() {
  const router = useRouter();
  const { db } = useBank(); 
  
  // Multi-step Flow State
  const [step, setStep] = useState("select_contact");
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [repeatPayment, setRepeatPayment] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const checkingAccount = bankAccounts?.[0] || { name: "CHASE CHECKING (...1234)", balance: 5432.10 }; 

  // --- RESTRICTION LOGIC ---
  const canUseZelle = db?.user?.canUseZelle ?? true;

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
    setMemo("");
    setRepeatPayment(false);
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
              <span className="text-white font-medium">{checkingAccount.name}</span>
            </div>
            {memo && (
              <div className="flex justify-between text-sm py-3 border-t border-slate-700/50">
                <span className="text-slate-400">Memo</span>
                <span className="text-white font-medium truncate max-w-[150px]">{memo}</span>
              </div>
            )}
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
      <div className="w-full h-full sm:max-w-md bg-slate-950 flex flex-col relative sm:border-x sm:border-slate-800 shadow-2xl overflow-hidden font-sans">
        
        {/* --- STEP 1: SELECT CONTACT --- */}
        {step === "select_contact" && (
          <div className="flex flex-col h-full animate-in slide-in-from-left-4 duration-300">
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
                              {isEmail ? <Plus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
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
            <div className="bg-gradient-to-b from-[#741eed]/20 to-transparent pt-4 pb-6 px-4 border-b border-[#741eed]/10 shrink-0">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setStep("select_contact")} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-full px-4 py-1.5 flex items-center gap-2 max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider flex-shrink-0">To</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0"></div>
                  <span className="text-sm font-bold text-white truncate">{selectedContact?.name}</span>
                </div>
                
                <div className="w-10"></div> 
              </div>

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
                
                <p className="text-[13px] text-slate-400 mt-4">
                  Today's limit for this recipient is $5,000.00.
                </p>
                <button className="text-[14px] text-[#741eed] font-medium flex items-center justify-center mx-auto mt-2 hover:underline">
                  Learn more <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col overflow-y-auto pb-8">
              <div className="mb-8">
                <label className="text-[14px] text-slate-400 mb-1 block">Memo (optional)</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value.substring(0, 140))}
                  className="w-full border-b border-slate-700 py-2 text-[16px] text-white outline-none focus:border-[#741eed] focus:border-b-2 bg-transparent transition-colors"
                />
                <p className="text-[12px] text-slate-500 mt-2">
                  You have {140 - memo.length} of 140 characters remaining.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50 mb-8 shadow-sm">
                <div className="px-4 py-3 relative">
                  <label className="text-[14px] text-slate-400 block mb-0.5">Pay from</label>
                  <select className="w-full appearance-none bg-transparent text-[16px] text-[#741eed] font-medium outline-none pr-8">
                    <option className="bg-slate-900 text-white">{checkingAccount.name}</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 bottom-3 pointer-events-none" />
                </div>

                <div className="px-4 py-3 relative">
                  <label className="text-[14px] text-slate-400 block mb-0.5">Send on</label>
                  <div className="text-[16px] text-[#741eed] font-medium">Today</div>
                  <Calendar className="w-5 h-5 text-slate-500 absolute right-4 bottom-3 pointer-events-none" />
                </div>

                <div className="px-4 py-4 flex justify-between items-center">
                  <span className="text-[16px] text-slate-200">Repeat payment</span>
                  <button 
                    type="button"
                    onClick={() => setRepeatPayment(!repeatPayment)}
                    className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative flex items-center ${repeatPayment ? 'bg-[#741eed]' : 'bg-slate-700'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute left-0.5 ${repeatPayment ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-auto">
                <div className="mb-6 flex items-center justify-center gap-2 text-slate-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs font-medium">Payments are secure and instant</span>
                </div>

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

                <div className="mt-6 flex flex-col items-center cursor-pointer text-slate-500 hover:text-slate-400 transition-colors">
                  <ChevronUp className="w-5 h-5 mb-1" />
                  <span className="text-[13px] font-bold">Delivery time and sending limits</span>
                </div>
              </div>

            </div>
          </div>
)}

        {/* --- CHASE-STYLE MODAL OVERLAY --- */}
        {!canUseZelle && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-[#f2f4f7] w-full max-w-[320px] rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              
              <div className="p-6 text-center space-y-4">
                <h2 className="text-[20px] font-bold text-black leading-tight">
                  We locked your account due to unusual activity
                </h2>
                <p className="text-[15px] font-medium text-black leading-snug">
                  Call us to unlock it. If you're a commercial client, reach out to your servicing team.
                </p>
                <p className="text-[14px] font-medium text-black leading-snug">
                  Please note that you will not be able to access your account information, documents or statements online or on the mobile app until we unlock your account.
                </p>
              </div>

              <div className="flex border-t border-gray-300 h-[52px]">
                <a 
                  href="tel:18009359935" 
                  className="flex-1 flex items-center justify-center text-[#0b5cba] font-semibold text-[17px] border-r border-gray-300 hover:bg-gray-200/50 transition-colors active:bg-gray-300"
                >
                  Call us
                </a>
                <button 
                  onClick={() => router.back()} 
                  className="flex-1 flex items-center justify-center text-[#0b5cba] font-semibold text-[17px] hover:bg-gray-200/50 transition-colors active:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}