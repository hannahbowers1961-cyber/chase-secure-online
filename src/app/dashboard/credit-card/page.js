"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext";
import { 
  ArrowLeft, DollarSign, Gift, Lock, Unlock, FileText, 
  CheckCircle2, X, ChevronDown, ChevronUp, Search, 
  Building2, Banknote, Loader2, AlertCircle, DownloadCloud 
} from "lucide-react";

export default function FreedomCard() {
  const router = useRouter();
  
  const { db, formatMoney, executeCashAdvance, executeTransfer } = useBank();
  
  // Base UI State
  const [activeAction, setActiveAction] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTx, setExpandedTx] = useState(null);
  
  // Modal Specific State
  const [transferAmount, setTransferAmount] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionError, setActionError] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloading, setDownloading] = useState(null);

  // Safe fallback while DB is loading
  if (!db) return null;

  // STRICT DB BINDING
  const account = db.accounts.freedom;
  const targetAccount = db.accounts.checking || { name: "Checking", mask: "0000" };
  const liveTransactions = account?.transactions || [];
  
  const creditLimit = account?.creditLimit || 5000;
  const availableCredit = creditLimit - (account?.balance || 0);

  // Filter dynamic transactions based on search query
  const filteredTransactions = liveTransactions.filter(tx => 
    (tx.desc && tx.desc.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (tx.cat && tx.cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCashAdvance = async () => {
    const amountToTransfer = parseFloat(transferAmount);
    
    if (amountToTransfer > availableCredit) {
      setActionError("Amount exceeds your available credit limit.");
      return; 
    }

    setActionError("");
    setIsProcessing(true);

    if (executeCashAdvance) {
      await executeCashAdvance("freedom", "checking", transferAmount);
    } else if (executeTransfer) {
      await executeTransfer("freedom", "checking", transferAmount);
    }
    
    setTimeout(() => {
      setIsProcessing(false);
      setActionSuccess(true);
      setTimeout(() => {
        setActionSuccess(false);
        setTransferAmount("");
        setActiveAction(null);
      }, 2000);
    }, 600); 
  };

  const handleDownload = (month) => {
    setDownloading(month);
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  const resetModalState = () => {
    setActiveAction(null);
    setActionSuccess(false);
    setActionError("");
    setIsProcessing(false);
    setTransferAmount("");
  };

  const renderModalContent = () => {
    if (actionSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900">Success!</h4>
          <p className="text-gray-500 text-center">
            Successfully advanced ${transferAmount} to {targetAccount.name}.
          </p>
        </div>
      );
    }

    switch (activeAction) {
      case "Cash Advance":
        return (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Advance From</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{account?.name} (...{account?.mask})</span>
                <span className="text-sm text-gray-500">Avail: {formatMoney(availableCredit)}</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Deposit To</p>
                <span className="font-semibold text-[#0b5cba]">{targetAccount.name} (...{targetAccount.mask})</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className={`bg-white border rounded-xl p-4 transition-all ${actionError ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200 focus-within:border-[#0b5cba] focus-within:ring-1'}`}>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Amount</p>
              <div className="flex items-center text-3xl font-light">
                <span className="text-gray-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={transferAmount}
                  onChange={(e) => {
                    setTransferAmount(e.target.value);
                    if (actionError) setActionError(""); 
                  }}
                  disabled={isProcessing}
                  placeholder="0.00" 
                  className={`w-full outline-none bg-transparent placeholder:text-gray-300 ${actionError ? 'text-red-600' : 'text-gray-900'} ${isProcessing ? 'opacity-50' : ''}`} 
                />
              </div>
            </div>
            
            {actionError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{actionError}</p>
              </div>
            )}
            
            <div>
              <button 
                onClick={handleCashAdvance}
                disabled={!transferAmount || transferAmount <= 0 || isProcessing}
                className={`w-full font-semibold py-4 rounded-xl mt-2 flex items-center justify-center gap-2 transition-colors ${transferAmount > 0 && !isProcessing ? 'bg-[#0b5cba] text-white hover:bg-[#094a96]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Cash Advance"
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-3 px-4">
                By confirming, you agree to the cash advance terms. Higher APR applies immediately with no grace period.
              </p>
            </div>
          </div>
        );
      case "Pay Card":
        return (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 flex items-start gap-3 mb-6">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">No payment required</p>
                <p className="text-sm mt-1">Your balance is {formatMoney(account?.balance || 0)}. You're all caught up.</p>
              </div>
            </div>
            <button onClick={resetModalState} className="w-full bg-gray-200 text-gray-500 font-semibold py-4 rounded-xl mt-4 cursor-not-allowed" disabled>Review Payment</button>
          </div>
        );
      case "Rewards Hub":
        return (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center py-4">
              <p className="text-5xl font-light text-[#0b5cba] tracking-tight">12,400</p>
              <p className="text-gray-500 font-medium mt-2">Available Points</p>
            </div>
          </div>
        );
      case "Statements":
        return (
          <div className="divide-y divide-gray-100 -mx-6 px-6 animate-in fade-in duration-200">
            {['June 2026', 'May 2026', 'April 2026', 'March 2026'].map((month, i) => (
              <div 
                key={i} 
                onClick={() => handleDownload(month)}
                className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#0b5cba]" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block">{month} Statement</span>
                    <span className="text-xs text-gray-500">PDF • 1.2 MB</span>
                  </div>
                </div>
                {downloading === month ? (
                  <Loader2 className="w-5 h-5 text-[#0b5cba] animate-spin" />
                ) : (
                  <DownloadCloud className="w-5 h-5 text-gray-400 group-hover:text-[#0b5cba] transition-colors" />
                )}
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  // Prevent rendering if account doesn't exist
  if (!account) return <div className="p-8 text-center">Credit Card not found.</div>;

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col relative">
      <div className={`pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm transition-colors duration-300 ${isLocked ? 'bg-gray-800' : 'bg-[#0b5cba]'} text-white`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-semibold text-lg uppercase">{account.name}</span>
          <div className="w-10"></div>
        </div>
        <div className="text-center pb-2">
          {isLocked && <div className="text-xs bg-red-500 text-white font-bold px-2 py-1 rounded inline-block mb-2 uppercase tracking-widest animate-pulse">Card Locked</div>}
          <p className="text-4xl font-light tracking-tight mb-1">{formatMoney(account.balance || 0)}</p>
          <p className="text-sm text-blue-100">Current balance</p>
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-2 relative z-20">
        
        <div className="grid grid-cols-5 gap-1.5">
          <button onClick={() => setActiveAction("Pay Card")} disabled={isLocked} className="disabled:opacity-50 bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#eef4fb] flex items-center justify-center"><DollarSign className="w-4 h-4 text-[#0b5cba]" /></div>
            <span className="text-[9px] font-bold text-gray-700 text-center uppercase">Pay</span>
          </button>
          <button onClick={() => setActiveAction("Cash Advance")} disabled={isLocked} className="disabled:opacity-50 bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#eef4fb] flex items-center justify-center"><Banknote className="w-4 h-4 text-[#0b5cba]" /></div>
            <span className="text-[9px] font-bold text-gray-700 text-center uppercase">Get Cash</span>
          </button>
          <button onClick={() => setActiveAction("Rewards Hub")} disabled={isLocked} className="disabled:opacity-50 bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#eef4fb] flex items-center justify-center"><Gift className="w-4 h-4 text-[#0b5cba]" /></div>
            <span className="text-[9px] font-bold text-gray-700 text-center uppercase">Rewards</span>
          </button>
          <button onClick={() => setActiveAction("Statements")} className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-[#eef4fb] flex items-center justify-center"><FileText className="w-4 h-4 text-[#0b5cba]" /></div>
            <span className="text-[9px] font-bold text-gray-700 text-center uppercase">Docs</span>
          </button>
          <button onClick={() => setIsLocked(!isLocked)} className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-colors">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isLocked ? 'bg-red-100' : 'bg-[#eef4fb]'}`}>
              {isLocked ? <Unlock className="w-4 h-4 text-red-600" /> : <Lock className="w-4 h-4 text-[#0b5cba]" />}
            </div>
            <span className={`text-[9px] font-bold text-center uppercase ${isLocked ? 'text-red-600' : 'text-gray-700'}`}>{isLocked ? 'Unlock' : 'Lock'}</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..." 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#0b5cba] focus:ring-1 focus:ring-[#0b5cba] transition-all" 
              />
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No transactions found</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search terms.</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="flex flex-col">
                  <div 
                    onClick={() => setExpandedTx(expandedTx === tx.id ? null : tx.id)}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Building2 className={`w-5 h-5 ${tx.amount > 0 ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tx.desc}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{tx.date} • {tx.cat}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-[#1e8b4e]' : 'text-gray-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                      </span>
                      {expandedTx === tx.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedTx === tx.id && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-xs text-gray-600 flex justify-between animate-in slide-in-from-top-1 fade-in duration-200">
                      <div className="space-y-1">
                        <p><span className="font-medium text-gray-500">Status:</span> Cleared</p>
                        <p><span className="font-medium text-gray-500">Method:</span> Electronic</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p><span className="font-medium text-gray-500">ID:</span> {tx.id ? tx.id.toString().toUpperCase().substring(0, 12) : "TX-PENDING"}</p>
                        <button className="text-[#0b5cba] font-medium hover:underline mt-1 inline-block">Report Issue</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {activeAction && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={resetModalState}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl min-h-[60vh] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-50">
              <h3 className="font-semibold text-xl text-gray-900">{actionSuccess ? "" : activeAction}</h3>
              <button onClick={resetModalState} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"><X className="w-5 h-5" /></button>
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