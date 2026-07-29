"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBank } from "@/context/BankContext";
import { 
  ArrowLeft, ShieldCheck, TrendingUp, AlertTriangle, 
  Eye, Lock, X, Sliders, ChevronRight, CheckCircle2, 
  History, AlertCircle, Fingerprint, ShieldAlert,
  CreditCard, Home, RefreshCw
} from "lucide-react";

export default function CreditHealth() {
  const { db } = useBank();

  // Modal State
  const [activeModal, setActiveModal] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Safe fallback while DB is loading
  const creditScore = db?.user?.creditScore || 680;

  // Simulator State
  const [simulatedScore, setSimulatedScore] = useState(creditScore);
  const [simulatorActions, setSimulatorActions] = useState([]);

  // Dynamically calculate the score tier and colors
  const getScoreDetails = (score) => {
    if (score >= 740) return { category: "Excellent", color: "text-[#1e8b4e]", border: "border-[#1e8b4e]", bg: "bg-[#eef8f2]" };
    if (score >= 670) return { category: "Good", color: "text-[#0b5cba]", border: "border-[#0b5cba]", bg: "bg-[#eef4fb]" };
    if (score >= 580) return { category: "Fair", color: "text-orange-500", border: "border-orange-500", bg: "bg-orange-50" };
    return { category: "Needs Work", color: "text-red-500", border: "border-red-500", bg: "bg-red-50" };
  };

  const currentStatus = getScoreDetails(creditScore);
  const simStatus = getScoreDetails(simulatedScore);
  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Simulator Logic
  const handleSimulate = (action, pointChange) => {
    if (simulatorActions.includes(action)) return;
    setSimulatedScore(prev => Math.min(850, Math.max(300, prev + pointChange)));
    setSimulatorActions([...simulatorActions, action]);
  };

  const resetSimulator = () => {
    setSimulatedScore(creditScore);
    setSimulatorActions([]);
  };

  // Fake Scan Logic for Dark Web
  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  // Render specific modal content based on what was clicked
  const renderModalContent = () => {
    switch (activeModal) {
      case "simulator":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-2">Simulated Score</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-6xl font-light text-gray-900 transition-all">{simulatedScore}</span>
                <div className={`px-3 py-1 rounded-full text-sm font-bold uppercase transition-colors ${simStatus.bg} ${simStatus.color}`}>
                  {simStatus.category}
                </div>
              </div>
              <p className={`text-sm mt-2 font-medium ${simulatedScore > creditScore ? 'text-green-600' : simulatedScore < creditScore ? 'text-red-600' : 'text-gray-400'}`}>
                {simulatedScore > creditScore ? `+${simulatedScore - creditScore} Points` : simulatedScore < creditScore ? `${simulatedScore - creditScore} Points` : 'No Change'}
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Take Action</p>
              
              <button 
                onClick={() => handleSimulate("pay_debt", 24)}
                disabled={simulatorActions.includes("pay_debt")}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Pay off $1,000 in credit card debt</span>
                </div>
                <span className="text-sm font-bold text-green-600">+24 pts</span>
              </button>

              <button 
                onClick={() => handleSimulate("new_loan", -12)}
                disabled={simulatorActions.includes("new_loan")}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Apply for a new auto loan</span>
                </div>
                <span className="text-sm font-bold text-red-500">-12 pts</span>
              </button>

              <button 
                onClick={() => handleSimulate("miss_payment", -65)}
                disabled={simulatorActions.includes("miss_payment")}
                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Miss a payment by 30 days</span>
                </div>
                <span className="text-sm font-bold text-red-500">-65 pts</span>
              </button>
            </div>

            {simulatorActions.length > 0 && (
              <button onClick={resetSimulator} className="w-full py-3 text-[#0b5cba] font-semibold text-sm hover:underline flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Reset Simulator
              </button>
            )}
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3 mb-6">
              <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-orange-900">Action Required</p>
                <p className="text-xs text-orange-700 mt-1">Review the recent inquiry below. If you did not authorize this, you can file a dispute instantly.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded">New Inquiry</span>
                  <span className="text-xs text-gray-500">July 22, 2026</span>
                </div>
                <h4 className="font-semibold text-gray-900">Chase Auto Finance</h4>
                <p className="text-sm text-gray-500 mt-1">A hard inquiry was placed on your TransUnion report.</p>
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">Acknowledge</button>
                  <button className="flex-1 bg-white border border-[#0b5cba] text-[#0b5cba] py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">Dispute</button>
                </div>
              </div>
            </div>
          </div>
        );

      case "darkweb":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center py-4">
              <div className="relative w-20 h-20 mx-auto mb-4">
                {isScanning ? (
                  <div className="absolute inset-0 border-4 border-[#0b5cba] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="absolute inset-0 bg-green-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-green-600" />
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{isScanning ? "Scanning Dark Web..." : "No New Breaches Found"}</h3>
              <p className="text-sm text-gray-500 mt-1">{isScanning ? "Checking 14.2 billion records" : "Your monitored email addresses are currently secure."}</p>
            </div>

            {!isScanning && (
              <>
                <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Emails Monitored</p>
                      <p className="text-xs text-gray-500">2 Active Addresses</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Passwords Exposed</p>
                      <p className="text-xs text-gray-500">0 Known Breaches</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                </div>

                <button onClick={triggerScan} className="w-full bg-[#0b5cba] text-white font-semibold py-4 rounded-xl hover:bg-[#094a96] transition-colors">
                  Run Manual Scan
                </button>
              </>
            )}
          </div>
        );

      case "ssn":
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-[#eef4fb] border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0b5cba] rounded-full flex items-center justify-center text-white">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">SSN Lock Status</p>
                  <p className="text-xs text-[#0b5cba] font-medium">Currently Unlocked</p>
                </div>
              </div>
              {/* Fake Toggle Switch */}
              <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Verified Aliases</p>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900">{db?.user?.firstName} {db?.user?.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">Reported: 2018 - Present</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Verified Addresses</p>
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">123 Main St, Apt 4B, New York, NY</p>
                  <p className="text-xs text-gray-500 mt-0.5">Current Primary</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-600">844 Sunset Blvd, Los Angeles, CA</p>
                  <p className="text-xs text-gray-400 mt-0.5">Previous (2020-2023)</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col relative">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-4 px-4 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <span className="font-semibold text-lg text-gray-900 tracking-tight">Credit Journey®</span>
        <div className="w-10"></div>
      </div>

      <div className="px-4 space-y-6 pt-6">
        
        {/* Dynamic Score Gauge Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center relative overflow-hidden">
          {/* Background decoration */}
          <div className={`absolute top-0 w-full h-32 ${currentStatus.bg} opacity-50 -z-10`}></div>
          
          <div className={`w-52 h-52 rounded-full border-[14px] ${currentStatus.border} border-t-gray-100 flex flex-col items-center justify-center relative rotate-45 transition-colors duration-500`}>
            <div className="flex flex-col items-center justify-center -rotate-45 mt-4">
              <span className="text-6xl font-light text-gray-900 tracking-tighter">{creditScore}</span>
              <span className={`${currentStatus.color} font-bold text-sm mt-1 tracking-widest uppercase transition-colors duration-500`}>
                {currentStatus.category}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8 text-center">Powered by <strong className="text-gray-700">TransUnion®</strong></p>
          <p className="text-xs text-gray-400 mt-1">Updated on {todayDate}</p>
        </div>

        {/* Tools & Simulators */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Score Tools
          </div>
          <button 
            onClick={() => setActiveModal("simulator")}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center">
                <Sliders className="w-5 h-5 text-[#0b5cba]" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-gray-900 block">Score Simulator</span>
                <span className="text-xs text-gray-500 block mt-0.5">See how choices affect your score</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button 
            onClick={() => setActiveModal("alerts")}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-gray-900 block">Credit Alerts</span>
                <span className="text-xs text-gray-500 block mt-0.5">1 new alert on your report</span>
              </div>
            </div>
            <div className="w-2.5 h-2.5 bg-orange-500 rounded-full ring-4 ring-orange-50 animate-pulse"></div>
          </button>
        </div>

        {/* Identity Security */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 divide-y divide-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest">
            Identity Monitoring
          </div>
          <button 
            onClick={() => setActiveModal("darkweb")}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-gray-900 block">Dark Web Surveillance</span>
                <span className="text-xs text-gray-500 block mt-0.5">Your info is currently secure</span>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#1e8b4e]" />
          </button>
          
          <button 
            onClick={() => setActiveModal("ssn")}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#0b5cba]" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-gray-900 block">SSN Tracker</span>
                <span className="text-xs text-gray-500 block mt-0.5">Monitor names linked to your SSN</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Dynamic Bottom Sheet Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => {
              setActiveModal(null);
              resetSimulator(); // Reset simulator if closed
            }}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl min-h-[60vh] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-50">
              <h3 className="font-semibold text-xl text-gray-900 capitalize">
                {activeModal === 'simulator' ? 'Score Simulator' : activeModal === 'alerts' ? 'Credit Alerts' : activeModal === 'darkweb' ? 'Dark Web Scan' : 'SSN Tracker'}
              </h3>
              <button 
                onClick={() => {
                  setActiveModal(null);
                  resetSimulator();
                }} 
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
  );
}