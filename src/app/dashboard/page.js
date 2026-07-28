"use client";

import SessionTimeout from "@/components/SessionTimeout";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext";
import { 
  Plus, MoreHorizontal, ChevronRight, Check, UserCircle, MessageSquare, 
  Search, Car, Gauge, Landmark, X, Send, ArrowRight, ArrowLeft
} from "lucide-react";
import BankLogo from "@/components/BankLogo";

export default function Dashboard() {
  const router = useRouter();
  const { db, formatMoney } = useBank();
  
  const [greeting, setGreeting] = useState("Good morning");
  const [currentDate, setCurrentDate] = useState("");
  
  // New Interactive States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'Hi there! I am your virtual assistant. How can I help you today?' }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");
    
    setCurrentDate(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  }, []);

  // Search Data for App Functions
  const searchLinks = [
    { name: "Checking Account", path: "/dashboard/checking" },
    { name: "Savings Account", path: "/dashboard/savings" },
    { name: "Transfer Funds (Internal)", path: "/transfers/internal" },
    { name: "Send money with Zelle®", path: "/transfers/zelle" },
    { name: "Pay Bills", path: "/transfers/bills" },
    { name: "Deposit Checks", path: "/dashboard/deposit" },
    { name: "Credit Journey", path: "/dashboard/creditwise" },
    { name: "Profile & Settings", path: "/dashboard/profile" },
  ];

  const filteredSearch = searchLinks.filter(link => 
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setChatHistory(prev => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage("");
    
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        sender: 'bot', 
        text: "I can help with that! However, my live chat features are currently in beta. Please use the app navigation to find what you need." 
      }]);
    }, 1000);
  };

  if (!db) return null;

  // --- DYNAMIC CALCULATIONS ---
  // Get first name for greeting
  const userName = db.user?.firstName || (db.user?.name ? db.user.name.split(' ')[0] : "");
  
  // Calculate dynamic account counts based on what actually exists in the DB
  const bankAccountsCount = [!!db.accounts?.checking, !!db.accounts?.savings].filter(Boolean).length;
  const creditCardsCount = [!!db.accounts?.freedom, !!db.accounts?.freedomUnlimited].filter(Boolean).length;
  const loansCount = [!!db.accounts?.autoLoan].filter(Boolean).length;

  return (
    <div className="w-full h-full bg-[#f4f5f9] overflow-y-auto pb-24 font-sans relative">
      <SessionTimeout />
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f4f5f9] sticky top-0 z-20">
        <div className="flex gap-4">
          <button onClick={() => setIsChatOpen(true)} className="hover:bg-blue-50 p-1.5 -ml-1.5 rounded-full transition-colors">
            <MessageSquare className="w-6 h-6 text-[#0b5cba]" />
          </button>
          <button onClick={() => setIsSearchOpen(true)} className="hover:bg-blue-50 p-1.5 rounded-full transition-colors">
            <Search className="w-6 h-6 text-[#0b5cba]" />
          </button>
        </div>
        <BankLogo className="w-8 h-8 text-[#0b5cba]" />
        
        <Link href="/dashboard/profile" className="hover:bg-blue-50 p-1 -mr-1 rounded-full transition-colors">
          <UserCircle className="w-8 h-8 text-[#0b5cba]" />
        </Link>
      </div>

      <div className="px-4 pt-2">
        {/* Dynamic Header */}
        <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight leading-tight">
          {greeting}{userName ? `, ${userName}` : ""}
        </h1>
        <p className="text-sm text-gray-600 mt-1 mb-5">{currentDate}</p>

        {/* Quick Action Pills */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 scroll-smooth">
          <button className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-[#0b5cba] hover:bg-gray-50"><Plus className="w-5 h-5" /></button>
          <Link href="/transfers/zelle" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba] hover:bg-gray-50">Send | Zelle®</Link>
          <Link href="/dashboard/deposit" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba] hover:bg-gray-50">Deposit checks</Link>
          <Link href="/transfers/bills" className="flex-shrink-0 flex items-center px-4 h-10 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-[#0b5cba] hover:bg-gray-50">Pay bills</Link>
        </div>

        {/* Today's Snapshot */}
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
              <p className="text-sm text-gray-600 mt-0.5">Your money in this month is <span className="font-semibold text-gray-900">{formatMoney(db.user?.snapshotAmount || 0).split('.')[0]}.</span></p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* --- ACCOUNTS SECTION HEADER --- */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-900">Accounts</h2>
          <MoreHorizontal className="w-6 h-6 text-gray-600" />
        </div>

        {/* 1. BANK ACCOUNTS BLOCK (Conditionally Rendered) */}
        {bankAccountsCount > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="bg-[#0b5cba] px-4 py-3.5">
              <h3 className="text-white font-semibold text-[15px]">Bank accounts ({bankAccountsCount})</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {db.accounts.checking && (
                <Link href="/dashboard/checking" className="block p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-[15px] text-gray-800 mb-1">
                    {db.accounts.checking.name} (...{db.accounts.checking.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                      {formatMoney(db.accounts.checking.balance || 0)}
                    </div>
                    <div className="text-[13px] text-gray-500 font-medium">Available balance</div>
                  </div>
                </Link>
              )}

              {db.accounts.savings && (
                <Link href="/dashboard/savings" className="block p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center text-[15px] text-gray-800 mb-1">
                    {db.accounts.savings.name} (...{db.accounts.savings.mask}) <ChevronRight className="w-4 h-4 ml-0.5 text-gray-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-[28px] font-light text-gray-900 tracking-tight leading-none mb-1">
                      {formatMoney(db.accounts.savings.balance || 0)}
                    </div>
                    <div className="text-[13px] text-gray-500 font-medium">Available balance</div>
                  </div>
                </Link>
              )}

              <Link href="/transfers/external" className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 text-[15px]">Link external accounts</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. CREDIT CARDS BLOCK (Conditionally Rendered) */}
        {creditCardsCount > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="bg-[#0b5cba] px-4 py-3.5">
              <h3 className="text-white font-semibold text-[15px]">Credit cards ({creditCardsCount})</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {db.accounts.freedom && (
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
                        {formatMoney(Math.abs(db.accounts.freedom.balance || 0))}
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium">Current balance</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-[#1e8b4e] font-medium">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    You don't have a payment due right now.
                  </div>
                </Link>
              )}

              {db.accounts.freedomUnlimited && (
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
                        {formatMoney(Math.abs(db.accounts.freedomUnlimited.balance || 0))}
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium">Current balance</div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 3. AUTO / HOME LOANS BLOCK (Conditionally Rendered) */}
        {loansCount > 0 && (
          <div className="bg-white border border-gray-300 rounded-xl overflow-hidden mb-6 shadow-sm">
            <div className="bg-[#0b5cba] px-4 py-3.5">
              <h3 className="text-white font-semibold text-[15px]">Auto / Home Loans ({loansCount})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {db.accounts.autoLoan && (
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
                        {formatMoney(Math.abs(db.accounts.autoLoan.balance || 0))}
                      </div>
                      <div className="text-[13px] text-gray-500 font-medium">Remaining balance</div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* 4. CREDITWISE (CREDIT JOURNEY) BLOCK */}
        {db.user?.creditScore && (
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
        )}
      </div>

      {/* --- SEARCH OVERLAY MODAL --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white pt-6">
            <button 
              onClick={() => {setIsSearchOpen(false); setSearchQuery("");}} 
              className="p-1.5 -ml-1.5 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-gray-400 absolute left-3" />
              <input 
                autoFocus
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..." 
                className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-10 text-[15px] focus:outline-none focus:ring-1 focus:ring-[#0b5cba] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white">
            {searchQuery && filteredSearch.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-12 px-4 text-center">
                <Search className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-gray-900 font-medium">No results found</p>
                <p className="text-gray-500 text-sm mt-1">We couldn't find anything for "{searchQuery}"</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {!searchQuery && (
                  <div className="px-4 py-3 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Suggested
                  </div>
                )}
                {filteredSearch.map((link, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      router.push(link.path);
                    }}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 text-[15px]">{link.name}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CHAT ASSISTANT MODAL --- */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-white sm:max-w-md sm:mx-auto sm:my-10 sm:rounded-2xl sm:shadow-2xl sm:border border-gray-200 animate-in slide-in-from-bottom duration-300 overflow-hidden">
          <div className="bg-[#0b5cba] text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <BankLogo className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Virtual Assistant</h3>
                <p className="text-xs text-blue-100">Typically replies instantly</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-[15px] shadow-sm ${msg.sender === 'user' ? 'bg-[#0b5cba] text-white rounded-tr-sm' : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-gray-100 border border-transparent rounded-full py-2.5 px-4 focus:outline-none focus:bg-white focus:border-[#0b5cba] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!chatMessage.trim()}
              className={`p-2.5 rounded-full flex-shrink-0 transition-colors ${chatMessage.trim() ? 'bg-[#0b5cba] text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}