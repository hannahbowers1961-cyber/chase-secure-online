"use client";

import { useState } from "react";
import { 
  ChevronLeft, 
  Search, 
  CheckCircle2, 
  User, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  ChevronUp, 
  Contact
} from "lucide-react";
import { bankAccounts } from "@/lib/mockData"; 
import { useRouter } from "next/navigation";

// Mock Contacts Database
const zelleContacts = [
  { id: 1, name: "John Smith", details: "Enrolled with Zelle®", initials: "JS", color: "bg-blue-100 text-[#0b5cba]" },
  { id: 2, name: "Maria Silva", details: "555-019-8372", initials: "MS", color: "bg-gray-100 text-gray-600" },
  { id: 3, name: "David Chen", details: "david.chen@email.com", initials: "DC", color: "bg-blue-100 text-[#0b5cba]" },
  { id: 4, name: "Sarah Jenkins", details: "Enrolled with Zelle®", initials: "SJ", color: "bg-emerald-100 text-emerald-700" },
];

export default function ZelleSend() {
  const router = useRouter();
  
  // Multi-step Flow State
  const [step, setStep] = useState("select_contact"); // 'select_contact', 'enter_amount', 'success'
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [repeatPayment, setRepeatPayment] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const checkingAccount = bankAccounts?.[0] || { name: "CHASE CHECKING (...1234)", balance: 5432.10 }; 

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
    // Reset everything back to the Zelle homepage state
    setAmount("");
    setMemo("");
    setRepeatPayment(false);
    setSelectedContact(null);
    setSearchQuery("");
    setStep("select_contact");
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-center sm:bg-black/80 backdrop-blur-sm">
      <div className="w-full h-full sm:max-w-md bg-[#f4f4f4] flex flex-col relative shadow-2xl overflow-hidden font-sans">
        
        {/* --- STEP 1: SELECT CONTACT --- */}
        {step === "select_contact" && (
          <div className="flex flex-col h-full bg-white animate-in slide-in-from-left-4 duration-300">
            {/* Header */}
            <div className="bg-white pt-4 pb-3 px-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
              <button onClick={() => router.back()} className="text-[#0b5cba] flex items-center gap-1 -ml-2 p-2">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <h1 className="text-[17px] font-semibold text-gray-900">Send Money</h1>
              <div className="w-8"></div> {/* Spacer to center title */}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, email, or mobile number"
                    className="w-full bg-white border border-gray-400 rounded-md py-3 pl-10 pr-4 text-[16px] text-gray-900 placeholder:text-gray-600 focus:outline-none focus:border-[#0b5cba] focus:ring-1 focus:ring-[#0b5cba] transition-all"
                  />
                </div>

                {/* Contacts List */}
                <div>
                  <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
                    {searchQuery ? "Search Results" : "Trusted Contacts"}
                  </h2>
                  
                  <div className="bg-white border-t border-gray-200 divide-y divide-gray-200">
                    
                    {/* Render empty state ONLY if there are no contacts AND it's not a valid new recipient */}
                    {searchQuery && !isValidNewRecipient && filteredContacts.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center">
                        <User className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="text-gray-900 font-medium">No contacts found</p>
                        <p className="text-gray-500 text-sm mt-1">Try entering a valid email or 10-digit phone number</p>
                      </div>
                    ) : (
                      <>
                        {/* Dynamic New Recipient Button */}
                        {isValidNewRecipient && (
                          <button 
                            onClick={() => handleContactSelect({
                              id: 'new_recipient',
                              name: searchQuery,
                              details: isEmail ? "New Email Recipient" : "New Mobile Recipient",
                              initials: isEmail ? "@" : "#",
                              color: "bg-blue-100 text-[#0b5cba]"
                            })}
                            className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-[#0b5cba]">
                              <Plus className="w-6 h-6" />
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-[16px] font-medium text-gray-900">{searchQuery}</p>
                              <p className="text-[13px] text-gray-500">Tap to send to new recipient</p>
                            </div>
                          </button>
                        )}

                        {/* Existing Filtered Contacts */}
                        {filteredContacts.map((contact) => (
                          <button 
                            key={contact.id}
                            onClick={() => handleContactSelect(contact)}
                            className="w-full flex items-center gap-4 py-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${contact.color}`}>
                              <span className="font-medium text-[18px]">{contact.initials}</span>
                            </div>
                            <div className="text-left flex-1">
                              <p className="text-[16px] font-medium text-gray-900">{contact.name}</p>
                              <p className="text-[13px] text-gray-500">{contact.details}</p>
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
          <div className="flex flex-col h-full bg-[#f4f4f4] animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="bg-white pt-4 pb-3 px-2 flex items-center justify-between border-b border-gray-200 sticky top-0 z-10">
              <button onClick={() => setStep("select_contact")} className="p-2 -ml-1 flex items-center text-gray-900">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <h1 className="text-[17px] font-semibold text-gray-900 absolute left-1/2 -translate-x-1/2">Enter Amount</h1>
              <button onClick={handleDone} className="text-[#0b5cba] text-[16px] font-medium px-4">
                Cancel
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
              
              {/* Main Amount Card */}
              <div className="bg-white px-4 pt-6 pb-4 mb-4 shadow-sm border-b border-gray-200">
                
                {/* Recipient Identifier */}
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[28px] font-light text-[#0b5cba] leading-tight max-w-[85%] break-words">
                    {selectedContact?.name}
                  </div>
                  <Contact className="w-7 h-7 text-[#0b5cba] flex-shrink-0 mt-1" />
                </div>

                {/* Amount Entry */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="flex items-center justify-center w-full max-w-[280px] border-b border-gray-400 pb-1">
                    <span className="text-[40px] font-light text-gray-900 mr-1">$</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-transparent border-none outline-none text-center text-[48px] font-light text-gray-900 placeholder:text-gray-400 p-0 w-full focus:ring-0"
                      autoFocus
                    />
                  </div>
                  
                  <p className="text-[13px] text-gray-600 mt-4">
                    Today's limit for this recipient is $5,000.00.
                  </p>
                  
                  <button className="text-[14px] text-[#0b5cba] font-medium flex items-center mt-2 hover:underline">
                    Learn more <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>

                {/* Memo Field */}
                <div className="mt-8">
                  <label className="text-[14px] text-gray-600 mb-1 block">Memo (optional)</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value.substring(0, 140))}
                    className="w-full border-b border-gray-400 py-2 text-[16px] text-gray-900 outline-none focus:border-[#0b5cba] focus:border-b-2 bg-transparent transition-colors"
                  />
                  <p className="text-[12px] text-gray-500 mt-2">
                    You have {140 - memo.length} of 140 characters remaining.
                  </p>
                </div>
              </div>

              {/* Payment Details Options */}
              <div className="bg-white border-t border-b border-gray-200 shadow-sm flex flex-col">
                
                {/* Pay From */}
                <div className="px-4 py-3 border-b border-gray-200 relative">
                  <label className="text-[14px] text-gray-600 block mb-0.5">Pay from</label>
                  <select className="w-full appearance-none bg-transparent text-[16px] text-[#0b5cba] outline-none pr-8">
                    <option>{checkingAccount.name.toUpperCase()}</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-900 absolute right-4 bottom-3 pointer-events-none" />
                </div>

                {/* Send On */}
                <div className="px-4 py-3 border-b border-gray-200 relative">
                  <label className="text-[14px] text-gray-600 block mb-0.5">Send on</label>
                  <div className="text-[16px] text-[#0b5cba]">Today</div>
                  <Calendar className="w-5 h-5 text-gray-600 absolute right-4 bottom-3 pointer-events-none" />
                </div>

                {/* Repeat Payment Toggle */}
                <div className="px-4 py-4 flex justify-between items-center">
                  <span className="text-[16px] text-gray-900">Repeat payment</span>
                  <button 
                    type="button"
                    onClick={() => setRepeatPayment(!repeatPayment)}
                    className={`w-12 h-7 rounded-full transition-colors duration-200 ease-in-out relative flex items-center ${repeatPayment ? 'bg-green-700' : 'bg-gray-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute left-0.5 ${repeatPayment ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>

              {/* Actions & Footer Info */}
              <div className="p-4 mt-2">
                <button 
                  onClick={handleSend}
                  disabled={!amount || amount <= 0 || isSending}
                  className="w-full bg-[#0b5cba] hover:bg-[#0a4b98] disabled:bg-[#0b5cba]/60 text-white font-medium text-[16px] py-3.5 rounded-sm flex items-center justify-center transition-colors"
                >
                  {isSending ? "Processing..." : "Review & send"}
                </button>
                
                <div className="mt-6 flex flex-col items-center cursor-pointer">
                  <ChevronUp className="w-5 h-5 text-gray-500 mb-1" />
                  <span className="text-[13px] font-bold text-gray-900">Delivery time and sending limits</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* --- STEP 3: SUCCESS SCREEN --- */}
        {step === "success" && (
          <div className="flex flex-col h-full bg-white animate-in fade-in duration-300 p-6 items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-700" />
            </div>
            
            <h2 className="text-2xl font-light text-gray-900 mb-2">Money Sent!</h2>
            <p className="text-[16px] text-gray-600 mb-8">
              Your payment of <span className="font-semibold text-gray-900">${amount}</span> to <span className="font-semibold text-gray-900">{selectedContact?.name}</span> has been processed.
            </p>
            
            <div className="w-full max-w-sm bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500">From</span>
                <span className="text-gray-900 font-medium">{checkingAccount.name}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-gray-500">Sent on</span>
                <span className="text-gray-900 font-medium">Today</span>
              </div>
              {memo && (
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-500">Memo</span>
                  <span className="text-gray-900 font-medium truncate max-w-[150px]">{memo}</span>
                </div>
              )}
            </div>

            <button 
              onClick={handleDone}
              className="w-full max-w-sm bg-[#0b5cba] hover:bg-[#0a4b98] text-white font-medium text-[16px] py-3.5 rounded-sm transition-colors"
            >
              Done
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}