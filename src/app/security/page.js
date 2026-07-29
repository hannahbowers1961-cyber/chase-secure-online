"use client";

import { useState, useEffect } from "react";
import BankLogo from "@/components/BankLogo";
import { useBank } from "@/context/BankContext";
import { toggleCardLockInDB } from "@/app/actions"; // Imports the server action we built earlier!
import { 
  ShieldCheck, Lock, Fingerprint, Key, Bell, Plane, 
  Smartphone, AlertTriangle, ChevronRight, EyeOff, X, 
  Unlock, CheckCircle2, MonitorSmartphone, Mail, MessageSquare, 
  ToggleLeft, ToggleRight, Loader2
} from "lucide-react";

export default function Security() {
  const { db } = useBank();
  
  // UI States
  const [activeAction, setActiveAction] = useState(null); 
  
  // Simulated Interactive States
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [use2FA] = useState(true); // Locked to true, setter removed
  const [privacyToggles, setPrivacyToggles] = useState({ marketing: false, dataSharing: false });
  
  // Card Lock State synced with Database
  const [lockedCards, setLockedCards] = useState({ freedomUnlimited: false, freedom: false });

  // Safe Account Fallbacks
  const freedomAccount = db?.accounts?.freedom || db?.accounts?.credit;
  const freedomUnlimitedAccount = db?.accounts?.freedomUnlimited;

  // 1. Sync local state with database on load
  useEffect(() => {
    if (freedomAccount || freedomUnlimitedAccount) {
      setLockedCards({
        freedom: freedomAccount?.isLocked || false,
        freedomUnlimited: freedomUnlimitedAccount?.isLocked || false
      });
    }
  }, [freedomAccount, freedomUnlimitedAccount]);

  // Safe fallback while DB is loading
  if (!db) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f4f5f9]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0b5cba]" />
      </div>
    );
  }

  // 2. Handle Syncing Card Locks with Database
  const handleToggleCardLock = async (cardKey, account) => {
    if (!account) return;
    
    const currentStatus = lockedCards[cardKey];
    const newStatus = !currentStatus;
    
    // Optimistic UI Update (instant visual feedback)
    setLockedCards(prev => ({ ...prev, [cardKey]: newStatus }));
    
    // Database Update
    const response = await toggleCardLockInDB(account.id, newStatus);
    
    if (!response?.success) {
      // Revert if database fails
      setLockedCards(prev => ({ ...prev, [cardKey]: currentStatus }));
      alert("Failed to update card lock status.");
    }
  };

  // --- NEW: Current Device State ---
  const [currentDevice, setCurrentDevice] = useState({
    name: "Loading...",
    browser: "Loading...",
    location: "Detecting location...",
    isMobile: false
  });

  // Detect Device Info & Location on Client Side
  useEffect(() => {
    // 1. Parse User Agent for Device & Browser
    const ua = navigator.userAgent;
    let deviceName = "Unknown Device";
    let isMobile = false;
    
    if (/iPhone/.test(ua)) { deviceName = "iPhone"; isMobile = true; }
    else if (/iPad/.test(ua)) { deviceName = "iPad"; isMobile = true; }
    else if (/Android/.test(ua)) { deviceName = "Android Device"; isMobile = true; }
    else if (/Windows/.test(ua)) { deviceName = "Windows PC"; }
    else if (/Macintosh/.test(ua)) { deviceName = "Mac"; }

    let browserName = "Unknown Browser";
    if (/Chrome/.test(ua)) browserName = "Chrome";
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browserName = "Safari";
    else if (/Firefox/.test(ua)) browserName = "Firefox";

    // 2. Fetch Location silently via IP
    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const locString = data.city && data.region_code 
          ? `${data.city}, ${data.region_code}` 
          : "Unknown Location";
        
        setCurrentDevice({
          name: deviceName,
          browser: browserName,
          location: locString,
          isMobile: isMobile
        });
      } catch (error) {
        setCurrentDevice({
          name: deviceName,
          browser: browserName,
          location: "Location unavailable",
          isMobile: isMobile
        });
      }
    };

    fetchLocation();
  }, []);

  const renderModalContent = () => {
    switch (activeAction) {
      case "Card Locks":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <p className="text-sm text-gray-500 mb-4">Instantly lock your cards if they are misplaced. This prevents new purchases and cash advances.</p>
            
            {/* Freedom Unlimited Lock Toggle */}
            {freedomUnlimitedAccount && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{freedomUnlimitedAccount.name}</p>
                  <p className="text-xs text-gray-500">...{freedomUnlimitedAccount.mask}</p>
                </div>
                <button 
                  onClick={() => handleToggleCardLock('freedomUnlimited', freedomUnlimitedAccount)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${lockedCards.freedomUnlimited ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${lockedCards.freedomUnlimited ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}

            {/* Freedom Lock Toggle */}
            {freedomAccount && (
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div>
                  <p className="font-semibold text-gray-900">{freedomAccount.name}</p>
                  <p className="text-xs text-gray-500">...{freedomAccount.mask}</p>
                </div>
                <button 
                  onClick={() => handleToggleCardLock('freedom', freedomAccount)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${lockedCards.freedom ? 'bg-red-500' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${lockedCards.freedom ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            )}
            
            {Object.values(lockedCards).some(isLocked => isLocked) && (
              <div className="mt-4 bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl flex items-start gap-2 text-xs animate-in slide-in-from-top-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Locked cards will decline new charges, but recurring payments may still process.</p>
              </div>
            )}
          </div>
        );
      
      case "Biometrics":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center py-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500 ${biometricsEnabled ? 'bg-[#eef4fb] text-[#0b5cba] shadow-inner' : 'bg-gray-100 text-gray-400'}`}>
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

      case "Password & Security":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
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

      case "Alerts":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
              {['Fraud Alerts', 'Large Transactions (>$500)', 'New Device Login'].map((alert, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{alert}</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-[#eef4fb] flex items-center justify-center"><Mail className="w-4 h-4 text-[#0b5cba]" /></button>
                    <button className="w-8 h-8 rounded-full bg-[#eef4fb] flex items-center justify-center"><Smartphone className="w-4 h-4 text-[#0b5cba]" /></button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500">Highlighted icons indicate active push and email notifications.</p>
          </div>
        );

      case "Travel Plans":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-blue-900">
              <Plane className="w-5 h-5 shrink-0 text-[#0b5cba]" />
              <p className="text-sm">Setting up a travel notice helps us prevent your cards from being blocked while you're away.</p>
            </div>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-xl p-3 bg-white focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                <label className="text-xs text-gray-500 font-semibold uppercase block">Destination</label>
                <input type="text" placeholder="City or Country" className="w-full bg-transparent outline-none text-gray-900 mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-xl p-3 bg-white focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                  <label className="text-xs text-gray-500 font-semibold uppercase block">Departure</label>
                  <input type="date" className="w-full bg-transparent outline-none text-gray-900 mt-1 text-sm" />
                </div>
                <div className="border border-gray-200 rounded-xl p-3 bg-white focus-within:border-[#0b5cba] focus-within:ring-1 transition-all">
                  <label className="text-xs text-gray-500 font-semibold uppercase block">Return</label>
                  <input type="date" className="w-full bg-transparent outline-none text-gray-900 mt-1 text-sm" />
                </div>
              </div>
            </div>
            <button onClick={() => setActiveAction(null)} className="w-full bg-[#0b5cba] text-white font-semibold py-3.5 rounded-xl mt-2 hover:bg-[#094a96] transition-colors">Save Travel Notice</button>
          </div>
        );

      case "Fraud Center":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 text-sm">Report Suspicious Activity</p>
                <p className="text-xs text-red-700 mt-1">If you notice unauthorized transactions, lock your card immediately and file a report below.</p>
              </div>
            </div>
            
            <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors text-left">
              <div>
                <p className="font-semibold text-gray-900">Report Lost or Stolen Card</p>
                <p className="text-xs text-gray-500">We will cancel it and send a replacement</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors text-left">
              <div>
                <p className="font-semibold text-gray-900">Dispute a Transaction</p>
                <p className="text-xs text-gray-500">File a claim for an unrecognized charge</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        );

      case "Linked Devices":
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Session</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eef4fb] rounded-full flex items-center justify-center">
                  {/* Dynamically show mobile or desktop icon */}
                  {currentDevice.isMobile ? (
                    <Smartphone className="w-5 h-5 text-[#0b5cba]" />
                  ) : (
                    <MonitorSmartphone className="w-5 h-5 text-[#0b5cba]" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {currentDevice.name} ({currentDevice.browser})
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Active Now • {currentDevice.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated "Other Device" to make the UI look populated */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Other Devices</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <MonitorSmartphone className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">MacBook Pro</p>
                  <p className="text-xs text-gray-500">Last active: 2 days ago</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
            </div>
          </div>
        );

      case "Two-Factor Auth":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#eef4fb] flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-[#0b5cba]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">SMS Verification</p>
                  <p className="text-xs text-gray-500">Receive codes via text message</p>
                </div>
              </div>
              <button 
                onClick={() => setUse2FA(!use2FA)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${use2FA ? 'bg-[#1e8b4e]' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${use2FA ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Authenticator App</p>
                  <p className="text-xs text-gray-500">Currently unavailable</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "Privacy Settings":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Targeted Offers</p>
                  <p className="text-xs text-gray-500 w-3/4 mt-0.5">Allow us to use your data to offer personalized financial products.</p>
                </div>
                <button 
                  onClick={() => setPrivacyToggles(prev => ({...prev, marketing: !prev.marketing}))}
                  className="text-gray-400 hover:text-[#0b5cba] transition-colors"
                >
                  {privacyToggles.marketing ? <ToggleRight className="w-8 h-8 text-[#0b5cba]" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Third-Party Data Sharing</p>
                  <p className="text-xs text-gray-500 w-3/4 mt-0.5">Share data with affiliates to enhance your banking experience.</p>
                </div>
                <button 
                  onClick={() => setPrivacyToggles(prev => ({...prev, dataSharing: !prev.dataSharing}))}
                  className="text-gray-400 hover:text-[#0b5cba] transition-colors"
                >
                  {privacyToggles.dataSharing ? <ToggleRight className="w-8 h-8 text-[#0b5cba]" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </div>
            <button className="w-full text-center text-sm font-semibold text-red-500 mt-4 hover:underline">
              Request Data Deletion
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

          <button onClick={() => setActiveAction("Alerts")} className="flex flex-col items-center text-center group">
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

          <button onClick={() => setActiveAction("Fraud Center")} className="flex flex-col items-center text-center group">
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
          <button onClick={() => setActiveAction("Linked Devices")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Manage linked devices</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button onClick={() => setActiveAction("Two-Factor Auth")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
              <span className="text-sm font-medium text-gray-900">Two-factor authentication</span>
            </div>
            <div className="flex items-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border mr-2 flex items-center gap-1 ${use2FA ? 'text-green-700 bg-green-100 border-green-200' : 'text-gray-500 bg-gray-100 border-gray-200'}`}>
                {use2FA ? <><CheckCircle2 className="w-3 h-3" /> On</> : "Off"}
              </span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </button>

          <button onClick={() => setActiveAction("Privacy Settings")} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveAction(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-100">
              <h3 className="font-semibold text-xl text-gray-900">{activeAction}</h3>
              <button onClick={() => setActiveAction(null)} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
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