"use client";

import Link from "next/link";
import { ArrowLeft, Search, Plus, UserPlus, MoreVertical } from "lucide-react";

export default function ZelleContacts() {
  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-y-auto">
      <div className="flex items-center gap-3 pt-6 pb-4 px-4 border-b border-[#741eed]/10 bg-gradient-to-b from-[#741eed]/10 to-transparent">
        <Link href="/transfers" className="p-2 -ml-2 bg-slate-900/80 hover:bg-slate-800 rounded-full transition-colors border border-slate-700">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h1 className="text-xl font-bold text-white tracking-tight">Zelle® Contacts</h1>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        {/* Search & Add New */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search contacts"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-[#741eed] transition-all"
            />
          </div>
          <button className="bg-[#741eed] hover:bg-[#6015c9] text-white p-3 rounded-xl transition-colors flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Contacts List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/50">
          <div className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#741eed]/20 flex items-center justify-center border border-[#741eed]/30">
                <span className="text-[#741eed] font-bold text-sm">JS</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">John Smith</p>
                <p className="text-xs text-slate-500">john.smith@example.com</p>
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-slate-500" />
          </div>
          <div className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <span className="text-slate-400 font-bold text-sm">MS</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">Maria Silva</p>
                <p className="text-xs text-slate-500">555-019-8372</p>
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-slate-500" />
          </div>
        </div>

        {/* Import Phone Contacts Banner */}
        <div className="mt-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-8 h-8 text-[#741eed] p-1.5 bg-[#741eed]/10 rounded-full" />
            <div>
              <p className="text-sm font-medium text-white">Sync Device Contacts</p>
              <p className="text-xs text-slate-400">Find friends already on Zelle</p>
            </div>
          </div>
          <button className="text-sm font-bold text-[#741eed]">Sync</button>
        </div>
      </div>
    </div>
  );
}