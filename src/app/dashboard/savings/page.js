"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "@/context/BankContext";
import { 
  ArrowLeft, Eye, EyeOff, Search, ArrowRightLeft, 
  Download, X, FileText, DownloadCloud, Building2, 
  CheckCircle2, ChevronDown, ChevronUp, Loader2, AlertCircle 
} from "lucide-react";

export default function SavingsAccount() {
  const router = useRouter();
  
  const { db, formatMoney, executeTransfer } = useBank();
  
  // Base UI State
  const [showNumbers, setShowNumbers] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTx, setExpandedTx] = useState(null);
  
  // Modal Specific State
  const [transferAmount, setTransferAmount] = useState("");
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionError, setActionError] = useState(""); // Validation error
  const [isProcessing, setIsProcessing] = useState(false); // Real bank loading feel
  const [downloading, setDownloading] = useState(null);

  // Safe fallback while DB is loading
  if (!db) return null;

  // STRICT DB BINDING: Use live data only
  const account = db.accounts.savings;
  const targetAccount = db.accounts.checking || { name: "Checking", mask: "0000" };
  const liveTransactions = account?.transactions || [];

  // Filter dynamic transactions based on search query
  const filteredTransactions = liveTransactions.filter(tx => 
    (tx.desc && tx.desc.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (tx.cat && tx.cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleTransfer = async () => {
    // 1. FRONTEND VALIDATION
    const amountToTransfer = parseFloat(transferAmount);
    
    if (amountToTransfer > account.balance) {
      setActionError("Insufficient balance for this transfer.");
      return; 
    }

    setActionError("");
    setIsProcessing(true); // Trigger the "real bank" loading spinner

    // 2. Execute Transfer (simulating network delay for authenticity)
    await executeTransfer("savings", "checking", transferAmount);
    
    // Hold the loading state for just a moment longer to feel secure
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
            Successfully transferred ${transferAmount} to {targetAccount.name}.
          </p>
        </div>
      );
    }

    switch (activeAction) {
      case "Transfer Funds":
        return (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">From</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{account?.name} (...{account?.mask})</span>
                <span className="text-sm text-gray-500">{formatMoney(account?.balance || 0)}</span>
              </div>
            </div>
            
            <div className="flex justify-center -my-6 relative z-10 pointer-events-none">
              <div className="bg-white border border-gray-200 p-2 rounded-full shadow-sm">
                <ArrowRightLeft className="w-4 h-4 text-gray-400 rotate-90" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1">To</p>
                <span className="font-semibold text-gray-900">{targetAccount.name} (...{targetAccount.mask})</span>
              </div>
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

            {/* Error Alert */}
            {actionError && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{actionError}</p>
              </div>
            )}
            
            {/* Dynamic Processing Button */}
            <button 
              onClick={handleTransfer}
              disabled={!transferAmount || transferAmount <= 0 || isProcessing}
              className={`w-full font-semibold py-4 rounded-xl mt-4 flex items-center justify-center gap-2 transition-colors ${transferAmount > 0 && !isProcessing ? 'bg-[#0b5cba] text-white hover:bg-[#094a96]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </button>
          </div>
        );
      case "Statements & Docs":
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

  // Prevent rendering if account doesn't exist in the database
  if (!account) return <div className="p-8 text-center">Savings account not found.</div>;

  return (
    <div className="w-full h-full bg-[#f4f5f9] overflow-y-auto text-gray-900 pb-24 font-sans flex flex-col relative">
      {/* 1. Unified Sticky Header: Fixed height of 160px */}
      <div className="bg-[#0b5cba] text-white pt-6 pb-8 px-4 sticky top-0 z-30 shadow-md h-[160px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => router.push('/dashboard')} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="font-semibold text-lg uppercase tracking-wider flex-1 text-center pr-6">{account.name}</span>
        </div>
        <div className="text-center">
          <p className="text-4xl font-light tracking-tight mb-1 leading-none">{formatMoney(account.balance || 0)}</p>
          <p className="text-sm text-blue-100 font-medium leading-tight">Available balance</p>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="px-4 space-y-4 pt-6 relative z-10 flex flex-col">
        
        {/* Account Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Account Details</h3>
            <button 
              onClick={() => setShowNumbers(!showNumbers)} 
              className="text-[#0b5cba] flex items-center gap-1.5 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
            >
              {showNumbers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showNumbers ? "Hide" : "Show"}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Routing Number</p>
              <p className="text-sm font-medium text-gray-900 font-mono tracking-wider">
                {showNumbers ? account.routing : `••••${(account.routing || '0000').toString().slice(-5)}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Account Number</p>
              <p className="text-sm font-medium text-gray-900 font-mono tracking-wider">
                {showNumbers ? account.accountNum : `••••••${account.mask}`}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions (Becomes Sticky below header!) */}
        <div className="sticky top-[160px] z-20 bg-[#f4f5f9] pt-2 pb-4 -mx-4 px-4 shrink-0">
          <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveAction("Transfer Funds")} 
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-[#0b5cba] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center group-hover:bg-[#0b5cba] transition-colors">
              <ArrowRightLeft className="w-5 h-5 text-[#0b5cba] group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Transfer</span>
          </button>
          <button 
            onClick={() => setActiveAction("Statements & Docs")} 
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm hover:border-[#0b5cba] hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center group-hover:bg-[#0b5cba] transition-colors">
              <Download className="w-5 h-5 text-[#0b5cba] group-hover:text-white transition-colors" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Statements</span>
          </button>
        </div>
        
        {/* Transactions List linked directly to DB */}
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
                  {/* Transaction Row */}
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
                  
                  {/* Expanded Details */}
                  {expandedTx === tx.id && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 text-xs text-gray-600 flex justify-between animate-in slide-in-from-top-1 fade-in duration-200">
                      <div className="space-y-1">
                        <p><span className="font-medium text-gray-500">Status:</span> Cleared</p>
                        <p><span className="font-medium text-gray-500">Method:</span> Electronic</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p><span className="font-medium text-gray-500">ID:</span> {tx.id.toString().toUpperCase().substring(0, 12)}</p>
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

      {/* Action Modals */}
      {activeAction && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={resetModalState}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-12 animate-in slide-in-from-bottom-8 duration-300 shadow-2xl min-h-[50vh] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-50">
              <h3 className="font-semibold text-xl text-gray-900">
                {actionSuccess ? "" : activeAction}
              </h3>
              <button 
                onClick={resetModalState} 
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              {renderModalContent()}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}