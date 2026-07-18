"use client";

import Link from "next/link";
import { ArrowLeft, Car, Calendar, FileText, ChevronRight, CheckCircle2 } from "lucide-react";

export default function AutoLoan() {
  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col">
      
      {/* Header */}
      <div className="bg-[#0b5cba] text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="font-semibold text-lg uppercase">Auto Loan</span>
          <div className="w-10"></div>
        </div>
        
        <div className="text-center pb-2">
          <p className="text-4xl font-light tracking-tight mb-1">$18,450.00</p>
          <p className="text-sm text-blue-100">Remaining Principal Balance</p>
        </div>
      </div>

      <div className="px-4 space-y-4 -mt-2 relative z-20">
        
        {/* Next Payment */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-end mb-4 pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Next payment due</p>
              <p className="text-sm font-semibold text-gray-900">Oct 24, 2023</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-light text-gray-900">$455.20</p>
            </div>
          </div>
          
          <button className="w-full bg-[#0b5cba] text-white font-semibold py-3 rounded-xl hover:bg-[#094a96] transition-colors">
            Make a Payment
          </button>
        </div>

        {/* Loan Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Vehicle Details</span>
                <span className="text-xs text-gray-500 block">2021 Toyota Camry</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#0b5cba]" />
              <div className="text-left">
                <span className="text-sm font-medium text-gray-900 block">Request Payoff Quote</span>
                <span className="text-xs text-gray-500 block">Valid through today</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Payments</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1e8b4e]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Sep 24, 2023</p>
                  <p className="text-xs text-gray-500">AutoPay</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">-$455.20</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#1e8b4e]" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Aug 24, 2023</p>
                  <p className="text-xs text-gray-500">AutoPay</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">-$455.20</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}