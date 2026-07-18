"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock, Zap, Wifi } from "lucide-react";

export default function SchedulePayments() {
  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto">
      <div className="flex items-center gap-3 pt-6 pb-4 px-4 border-b border-blue-900/20 bg-gradient-to-b from-blue-900/10 to-transparent">
        <Link href="/transfers" className="p-2 -ml-2 bg-slate-900/80 hover:bg-slate-800 rounded-full transition-colors border border-slate-700">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Scheduled Payments</h1>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upcoming</h2>
          <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">2 Payments</span>
        </div>

        {/* Scheduled Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
          
          <div className="p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-200">Verizon Wireless</p>
                  <p className="text-xs text-slate-500">AutoPay • Ending in 3924</p>
                </div>
              </div>
              <p className="text-lg font-bold text-white">$112.50</p>
            </div>
            <div className="flex items-center gap-2 mt-3 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <CalendarClock className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Processing Tomorrow</span>
            </div>
          </div>

          <div className="p-4 hover:bg-slate-800/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-200">Electric Utility</p>
                  <p className="text-xs text-slate-500">One-Time • Ending in 1002</p>
                </div>
              </div>
              <p className="text-lg font-bold text-white">$84.20</p>
            </div>
            <div className="flex items-center gap-2 mt-3 bg-slate-950/50 p-2 rounded-lg border border-slate-800">
              <CalendarClock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-400">Scheduled for Oct 24</span>
            </div>
          </div>

        </div>

        <button className="w-full mt-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-colors">
          View Past Payments
        </button>
      </div>
    </div>
  );
}