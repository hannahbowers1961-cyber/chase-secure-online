"use client";

import Link from "next/link";
import { ArrowLeft, Camera, HelpCircle, ChevronRight, Zap } from "lucide-react";

export default function MobileDeposit() {
  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard" className="text-[#0b5cba] font-medium">Cancel</Link>
        <span className="font-semibold text-lg text-gray-900">Deposit Check</span>
        <HelpCircle className="w-6 h-6 text-[#0b5cba]" />
      </div>

      <div className="px-4 space-y-6 pt-6">
        
        {/* Deposit To & Amount */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <div className="p-4 flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wider font-semibold">Deposit To</p>
              <p className="text-sm font-semibold text-gray-900">TOTAL CHECKING (...8853)</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Amount</p>
            <div className="flex items-center text-3xl font-light text-gray-900">
              <span className="text-gray-400 mr-1">$</span>
              <input 
                type="number"
                placeholder="0.00"
                className="bg-transparent border-none outline-none w-full placeholder:text-gray-300 focus:ring-0 p-0"
              />
            </div>
          </div>
        </div>

        {/* Camera Viewfinders */}
        <div className="space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold px-1">Check Images</p>
          
          {/* Front of Check */}
          <button className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-400 hover:border-[#0b5cba] transition-colors group">
            <div className="absolute inset-4 border border-white/30 rounded-lg pointer-events-none"></div>
            <Camera className="w-8 h-8 text-white group-hover:text-[#0b5cba] transition-colors" />
            <span className="text-white font-medium text-sm">Take photo of FRONT</span>
          </button>

          {/* Back of Check */}
          <button className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-400 hover:border-[#0b5cba] transition-colors group">
            <div className="absolute inset-4 border border-white/30 rounded-lg pointer-events-none"></div>
            <Camera className="w-8 h-8 text-white group-hover:text-[#0b5cba] transition-colors" />
            <span className="text-white font-medium text-sm">Take photo of BACK</span>
            <span className="text-xs text-gray-400">Remember to endorse</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <Zap className="w-4 h-4 text-orange-500" />
          Deposits before 11 PM ET process same day.
        </div>

        <button className="w-full bg-[#0b5cba] text-white font-semibold py-4 rounded-xl shadow-md hover:bg-[#094a96] transition-colors">
          Deposit
        </button>

      </div>
    </div>
  );
}