"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, ShieldCheck, Landmark, Lock } from "lucide-react";
import { useBank } from "@/context/BankContext"; 

export default function LinkExternal() {
  const router = useRouter();
  const { db } = useBank();

  // --- RESTRICTION LOGIC ---
  const canLink = db?.user?.canLink ?? true;

  return (
    <div className="flex flex-col w-full h-full bg-[#f4f5f9] overflow-y-auto font-sans relative">
      
      {/* 1. Deep Blue Header Block */}
      <div className="bg-[#0b5cba] text-white pt-6 pb-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <span className="font-semibold text-lg">External Accounts</span>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col items-center pt-10">
        
        {/* Plaid-style hero graphic */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
            <Landmark className="w-8 h-8 text-[#0b5cba]" />
          </div>
          <div className="flex space-x-1.5">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-[#0b5cba] rounded-full animate-pulse delay-150"></div>
          </div>
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-md border border-blue-100">
            <Building2 className="w-8 h-8 text-[#0b5cba]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Connect an Institution</h2>
          <p className="text-gray-500 text-sm px-4">
            Securely link your accounts at other banks to transfer funds seamlessly.
          </p>
        </div>

        <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 mt-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <ShieldCheck className="w-6 h-6 text-[#1e8b4e]" />
            <p className="text-[15px] font-semibold text-gray-900">Bank-level Security</p>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0b5cba] mt-1.5"></div>
              Your credentials are never stored.
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0b5cba] mt-1.5"></div>
              Transfers typically take 1-3 business days.
            </li>
          </ul>
        </div>

        <div className="mt-auto pt-6 w-full space-y-3">
          <button className="w-full bg-[#0b5cba] hover:bg-[#094a96] text-white font-semibold text-[17px] py-4 rounded-xl transition-colors shadow-sm">
            Continue
          </button>
          <Link href="/dashboard" className="w-full block text-center text-[#0b5cba] font-medium py-3 hover:bg-blue-50 rounded-xl transition-colors">
            Cancel
          </Link>
        </div>

      </div>

      {/* --- CHASE-STYLE MODAL OVERLAY --- */}
      {!canLink && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
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
  );
}