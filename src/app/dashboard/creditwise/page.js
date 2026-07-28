"use client";

import Link from "next/link";
import { useBank } from "@/context/BankContext";
import { ArrowLeft, ShieldCheck, TrendingUp, AlertTriangle, Eye, Lock } from "lucide-react";

export default function CreditHealth() {
  const { db } = useBank();

  // Safe fallback while DB is loading
  if (!db) return null;

  // Pull live score from the DB
  const creditScore = db.user?.creditScore || 0;

  // Dynamically calculate the score tier and colors
  let scoreCategory = "Needs Work";
  let scoreColor = "text-red-500";
  let borderColor = "border-red-500";

  if (creditScore >= 740) {
    scoreCategory = "Excellent";
    scoreColor = "text-[#1e8b4e]"; // Green
    borderColor = "border-[#1e8b4e]";
  } else if (creditScore >= 670) {
    scoreCategory = "Good";
    scoreColor = "text-[#0b5cba]"; // Blue
    borderColor = "border-[#0b5cba]";
  } else if (creditScore >= 580) {
    scoreCategory = "Fair";
    scoreColor = "text-orange-500"; // Orange
    borderColor = "border-orange-500";
  }

  // Get today's date dynamically
  const todayDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-4 px-4 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </Link>
        <span className="font-semibold text-lg text-gray-900">Credit Journey®</span>
        <div className="w-10"></div>
      </div>

      <div className="px-4 space-y-4 pt-6">
        
        {/* Dynamic Score Gauge Widget */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
          <div className={`w-48 h-48 rounded-full border-[12px] ${borderColor} border-t-gray-100 flex flex-col items-center justify-center relative rotate-45 transition-colors duration-500`}>
            <div className="flex flex-col items-center justify-center -rotate-45 mt-4">
              <span className="text-5xl font-light text-gray-900">{creditScore}</span>
              <span className={`${scoreColor} font-bold text-lg mt-1 tracking-wide uppercase transition-colors duration-500`}>
                {scoreCategory}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">Powered by <strong>TransUnion®</strong></p>
          <p className="text-xs text-gray-400 mt-1">Updated on {todayDate}</p>
        </div>

        {/* Tools & Simulators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-t-xl">
            Score Tools
          </div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Score Simulator</span>
                <span className="text-xs text-gray-500 block">See how choices affect your score</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Credit Alerts</span>
                <span className="text-xs text-gray-500 block">1 new alert on your report</span>
              </div>
            </div>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          </button>
        </div>

        {/* Identity Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <div className="px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-t-xl">
            Identity Monitoring
          </div>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Dark Web Surveillance</span>
                <span className="text-xs text-gray-500 block">Your info is currently secure</span>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-[#1e8b4e]" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">SSN Tracker</span>
                <span className="text-xs text-gray-500 block">Monitor names linked to your SSN</span>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
}