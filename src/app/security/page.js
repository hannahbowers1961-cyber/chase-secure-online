"use client";

import BankLogo from "@/components/BankLogo";
import { useState } from "react";
import { useBank } from "@/context/BankContext";
import { 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Key, 
  Bell, 
  Plane, 
  Smartphone,
  AlertTriangle,
  ChevronRight,
  EyeOff,
  X,
  Unlock,
  CheckCircle2
} from "lucide-react";

export default function Security() {
  const { db } = useBank();
  
  // UI States
  const [activeAction, setActiveAction] = useState(null); // Controls the slide-up modals
  
  // Simulated Interactive States for the Prototype
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [lockedCards, setLockedCards] = useState({ freedomUnlimited: false, freedom: false });

  const toggleCardLock = (cardKey) => {
    setLockedCards(prev => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  const renderModalContent = () => {
    switch (activeAction) {
      case "Card Locks":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">Instantly lock your cards if they are misplaced. This prevents new purchases and cash advances.</p>
            
            {/* Freedom Unlimited Lock Toggle */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-semibold text-gray-900">{db.accounts.freedomUnlimited.name}</p>
                <p className="text-xs text-gray-500">...{db.accounts.freedomUnlimited.mask}</p>
              </div>
              <button 
                onClick={() => toggleCardLock('freedomUnlimited')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${lockedCards.freedomUnlimited ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${lockedCards.freedomUnlimited ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Freedom Lock Toggle */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-semibold text-gray-900">{db.accounts.freedom.name}</p>
                <p className="text-xs text-gray-500">...{db.accounts.freedom.mask}</p>
              </div>
              <button 
                onClick={() => toggleCardLock('freedom')}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${lockedCards.freedom ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${lockedCards.freedom ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {Object.values(lockedCards).some(isLocked => isLocked) && (
              <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>Locked cards will decline new charges, but recurring payments may still process.</p>
              </div>
            )}
          </div>
        );
      
      case "Biometrics":
        return (
          <div className="space-y-6">
            <div className="flex justify-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${biometricsEnabled ? 'bg-[#eef4fb] text-[#0b5cba]' : 'bg-gray-100 text-gray-400'}`}>
                <Fingerprint className="w-10 h-10" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-semibold text-gray-900">Sign in with Biometrics</p>
                <p className="text-xs text-gray-500">Use Face ID or Touch ID to log in securely.</p>
              </div>
              <button 
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${biometricsEnabled ? 'bg-[#0b5cba]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${biometricsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        );

      case "Travel Plans":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-900">
              <Plane className="w-5 h-5 shrink-0 text-[#0b5cba]" />
              <p className="text-sm">Setting up a travel notice helps us prevent your cards from being blocked while you're away.</p>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                <label className="text-xs text-gray-500 font-semibold uppercase block">Destination</label>
                <input type="text" placeholder="City or Country" className="w-full bg-transparent outline-none text-gray-900 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                  <label className="text-xs text-gray-500 font-semibold uppercase block">Departure</label>
                  <input type="date" className="w-full bg-transparent outline-none text-gray-900 mt-1" />
                </div>
                <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                  <label className="text-xs text-gray-500 font-semibold uppercase block">Return</label>
                  <input type="date" className="w-full bg-transparent outline-none text-gray-900 mt-1" />
                </div>
              </div>
            </div>
            <button onClick={() => setActiveAction(null)} className="w-full bg-[#0b5cba] text-white font-semibold py-3.5 rounded-xl mt-2">Save Travel Notice</button>
          </div>
        );

      case "Password & Security":
        return (
          <div className="space-y-4">
            <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors text-left">
              <div>
                <p className="font-semibold text-gray-900">Change Password</p>
                <p className="text-xs text-gray-500">Update your account password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors text-left">
              <div>
                <p className="font-semibold text-gray-900">Update Security Questions</p>
                <p className="text-xs text-gray-500">Manage account recovery questions</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-[#f4f5f9] overflow-y-auto pb-24 font-sans relative">
      
      {/* 1. Deep Blue Header Block */}
      <div className="bg-[#0b5cba] w-full pt-12 pb-24 flex flex-col items-center">
        {/* Authentic CSS Bank Logo */}
        {/* NEW PERFECT LOGO */}
        <BankLogo className="w-11 h-11 text-white mb-4" />
        <h1 className="text-3xl font-semibold text-white tracking-wide">Security Center</h1>
      </div>

      {/* 2. Overlapping White Grid Card */}
      <div className="relative z-10 mx-4 -mt-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 pt-8 mb-6">
        <div className="grid grid-cols-3 gap-y-8 gap-x-2">
          
          <button onClick={() => setActiveAction("Card Locks")} className="flex flex-col items-center text-center group">
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-3 transition-colors ${lockedCards.freedom || lockedCards.freedomUnlimited ? 'border-red-500 bg-red-50' : 'border-gray-200 group-hover:border-[#0b5cba]'}`}>
              {lockedCards.freedom || lockedCards.freedomUnlimited ? <Lock className="w-6 h-6 text-red-500" strokeWidth={1.5} /> : <Unlock className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />}
            </div>
            <span className={`text-[12px] leading-snug font-medium ${lockedCards.freedom || lockedCards.freedomUnlimited ? 'text-red-500' : 'text-[#0b5cba]'}`}>Card locks</span>
          </button>

          <button onClick={() => setActiveAction("Biometrics")} className="flex flex-col items-center text-center group">
            <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-3 transition-colors ${biometricsEnabled ? 'border-[#0b5cba] bg-[#eef4fb]' : 'border-gray-200 group-hover:border-[#0b5cba]'}`}>
              <Fingerprint className={`w-6 h-6 ${biometricsEnabled ? 'text-[#0b5cba]' : 'text-gray-400'}`} strokeWidth={1.5} />
            </div>
            <span className={`text-[12px] leading-snug font-medium ${biometricsEnabled ? 'text-[#0b5cba]' : 'text-gray-500'}`}>
              Biometrics<br/>
              <span className="text-[10px]">{biometricsEnabled ? '(On)' : '(Off)'}</span>
            </span>
          </button>

          <button onClick={() => setActiveAction("Password & Security")} className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <Key className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">Password</span>
          </button>

          <button className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <Bell className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">Alerts</span>
          </button>

          <button onClick={() => setActiveAction("Travel Plans")} className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-[#0b5cba] transition-colors">
              <Plane className="w-6 h-6 text-[#0b5cba]" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-[#0b5cba]">Travel plans</span>
          </button>

          <button className="flex flex-col items-center text-center group">
            <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center mb-3 group-hover:border-red-500 transition-colors">
              <AlertTriangle className="w-6 h-6 text-red-500" strokeWidth={1.5} />
            </div>
            <span className="text-[12px] leading-snug font-medium text-red-500">Fraud center</span>
          </button>

        </div>
      </div>

      {/* 3. Secondary Settings List */}
      <div className="px-4 space-y-2 relative z-20">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pl-1 mb-2">Device Control & Privacy</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Manage linked devices</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Two-factor authentication</span>
            </div>
            <div className="flex items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded border border-green-200 mr-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> On
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Privacy settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* --- SLIDE-UP MODAL ENGINE --- */}
      {activeAction && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setActiveAction(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-100">
              <h3 className="font-semibold text-xl text-gray-900">{activeAction}</h3>
              <button onClick={() => setActiveAction(null)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
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