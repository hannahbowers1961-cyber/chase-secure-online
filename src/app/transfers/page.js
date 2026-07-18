"use client";

import BankLogo from "@/components/BankLogo";
import Link from "next/link";
import { 
  CreditCard, 
  Send, 
  Landmark, 
  ArrowRightLeft, 
  MessageSquareShare, 
  Camera,
  Users,
  CalendarClock,
  Building2,
  ChevronRight
} from "lucide-react";

export default function Transfers() {
  return (
    <div className="w-full h-full bg-[#f4f5f9] overflow-y-auto pb-24 font-sans relative">
      
      {/* 1. Deep Blue Header Block (Matches Image) */}
      <div className="bg-[#0b5cba] w-full pt-12 pb-24 flex flex-col items-center">
        {/* Authentic CSS Bank Logo (Octagon with square cutout) */}
        {/* NEW PERFECT LOGO */}
        <BankLogo className="w-11 h-11 text-white mb-4" />
        <h1 className="text-3xl font-semibold text-white tracking-wide">Pay & Transfer</h1>
      </div>

      {/* 2. Overlapping White Grid Card */}
      <div className="relative z-10 mx-4 -mt-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 pt-8 mb-6">
        <div className="grid grid-cols-3 gap-y-8 gap-x-2">
          
          {/* Row 1, Item 1: Pay Bills */}
          <Link href="/transfers/bills" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <CreditCard className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">Pay bills</span>
          </Link>

          {/* Row 1, Item 2: Send money with Zelle */}
          <Link href="/transfers/zelle" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#741eed] transition-colors">
              <Send className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">
              Send money<br/>
              with <span className="text-[#741eed] font-bold">Zelle<sup className="text-[8px] font-normal">®</sup></span>
            </span>
          </Link>

          {/* Row 1, Item 3: Wires & global */}
          <Link href="/transfers/wire" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <Landmark className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">
              Wires & global<br/>transfers
            </span>
          </Link>

          {/* Row 2, Item 1: Transfer */}
          <Link href="/dashboard/checking" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <ArrowRightLeft className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">Transfer</span>
          </Link>

          {/* Row 2, Item 2: Request/Split with Zelle */}
          <Link href="/transfers/zelle" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#741eed] transition-colors">
              <MessageSquareShare className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">
              Request/Split<br/>
              with <span className="text-[#741eed] font-bold">Zelle<sup className="text-[8px] font-normal">®</sup></span>
            </span>
          </Link>

          {/* Row 2, Item 3: Deposit checks */}
          <Link href="/dashboard/deposit" className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <Camera className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">
              Deposit<br/>checks
            </span>
          </Link>

        </div>
      </div>

      {/* 3. Restored Existing Features (Secondary List) */}
      <div className="px-4 space-y-2 relative z-20">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1 mb-2">More Transfer Options</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <Link href="/transfers/contacts" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Manage Zelle® Contacts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/transfers/schedule" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <CalendarClock className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Schedule Payments</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link href="/transfers/external" className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Link External Accounts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>

    </div>
  );
}