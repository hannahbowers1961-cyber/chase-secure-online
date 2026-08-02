"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useBank } from "@/context/BankContext";
import { 
  User, Shield, Bell, FileText, HelpCircle, LogOut, 
  ChevronRight, X, Mail, Phone, Lock, Fingerprint, 
  Smartphone, MessageSquare, Headset, DownloadCloud, Camera,
  Loader2
} from "lucide-react";

export default function Profile() {
  const { db } = useBank();

  // Modal State
  const [activeModal, setActiveModal] = useState(null);
  
  // Profile Image State
  const [profileImage, setProfileImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Security Toggles & Device Info
  const [useFaceId, setUseFaceId] = useState(true);
  const [use2FA, setUse2FA] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState({ name: "Loading...", browser: "", time: "" });

  // Detect Device Info on Client Side
  useEffect(() => {
    const ua = navigator.userAgent;
    let deviceName = "Unknown Device";
    if (/iPhone/.test(ua)) deviceName = "iPhone";
    else if (/iPad/.test(ua)) deviceName = "iPad";
    else if (/Android/.test(ua)) deviceName = "Android Device";
    else if (/Windows/.test(ua)) deviceName = "Windows PC";
    else if (/Macintosh/.test(ua)) deviceName = "Mac";

    let browserName = "Unknown Browser";
    if (/Chrome/.test(ua)) browserName = "Chrome";
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browserName = "Safari";
    else if (/Firefox/.test(ua)) browserName = "Firefox";

    setDeviceInfo({
      name: deviceName,
      browser: browserName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }, []);

  // Set the profile image instantly when the DB loads
  useEffect(() => {
    if (db?.user?.profileImage) {
      setProfileImage(db.user.profileImage);
    }
  }, [db?.user]);

  // 1. STRICT DATABASE ENFORCEMENT
  if (!db || !db.user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white pb-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#0b5cba]" />
      </div>
    );
  }

  const user = db.user;
  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();

// 2. Handle Image Upload & Database Sync
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onloadend = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        
        img.onload = async () => {
          // 1. Create a canvas to resize the image
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 256; // Standard profile picture size
          let width = img.width;
          let height = img.height;

          // Maintain aspect ratio
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          
          // 2. Draw and compress the image
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to an optimized JPEG (Quality: 0.7)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          // 3. Optimistic UI Update (Shows instantly)
          setProfileImage(compressedBase64); 

          // 4. Safely upload the tiny string to the database via API
          if (user.id) {
            try {
              const res = await fetch('/api/user/profile-image', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: user.id,
                  base64Image: compressedBase64,
                }),
              });

              const response = await res.json();
              
              if (!response.success) {
                alert("Failed to sync profile picture to servers.");
              }
            } catch (error) {
              console.error("Network error syncing image:", error);
              alert("Network error. Could not sync profile picture.");
            }
          } else {
            console.error("User ID missing from BankContext. Cannot sync image.");
          }
          
          setIsUploading(false);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const resetModalState = () => {
    setActiveModal(null);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "personal":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#0b5cba] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900">Secure Information</p>
                <p className="text-xs text-blue-700 mt-1">For your protection, personal details can only be changed by contacting support or visiting a branch.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="opacity-75">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Legal Name</label>
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 flex justify-between items-center cursor-not-allowed">
                  <span className="text-gray-700 font-medium">{user.firstName} {user.lastName}</span>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="opacity-75">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Residential Address</label>
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 flex justify-between items-center cursor-not-allowed">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{user.address || "Address not on file"}</span>
                    {(user.city || user.state || user.zipCode) && (
                      <span className="text-xs text-gray-500">{user.city}, {user.state} {user.zipCode}</span>
                    )}
                  </div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="opacity-75">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Email Address</label>
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 flex justify-between items-center cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{user.email || "Not provided"}</span>
                  </div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div className="opacity-75">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-3 flex justify-between items-center cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-medium">{user.phoneNumber || "Not provided"}</span>
                  </div>
                  <Lock className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-[#0b5cba]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Biometrics</p>
                    <p className="text-xs text-gray-500">Log in without a password</p>
                  </div>
                </div>
                <div onClick={() => setUseFaceId(!useFaceId)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${useFaceId ? 'bg-[#1e8b4e]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${useFaceId ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#0b5cba]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Two-Factor Auth</p>
                    <p className="text-xs text-gray-500">Require an SMS code to login</p>
                  </div>
                </div>
                <div onClick={() => setUse2FA(!use2FA)} className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${use2FA ? 'bg-[#1e8b4e]' : 'bg-gray-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${use2FA ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Devices</p>
              <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{deviceInfo.name}</p>
                  <p className="text-xs text-green-600 font-medium mt-0.5">
                    Logged in via {deviceInfo.browser} at {deviceInfo.time}
                  </p>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">Active</span>
              </div>
            </div>

            <button className="w-full border border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors">
              Change Password
            </button>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {['Large Transactions (>$500)', 'Low Balance (<$50)', 'Account Login Alerts', 'Monthly Statements'].map((alert, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{alert}</span>
                  <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><Mail className="w-4 h-4 text-[#0b5cba]" /></button>
                    <button className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><Smartphone className="w-4 h-4 text-[#0b5cba]" /></button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-500 pt-2">Highlighted icons indicate active notification channels.</p>
          </div>
        );

      case "statements":
        return (
          <div className="divide-y divide-gray-100 -mx-6 px-6 animate-in fade-in duration-300">
            <div className="pb-4">
              <div className="bg-gray-100 p-1 rounded-lg flex text-sm font-medium text-gray-600">
                <button className="flex-1 bg-white shadow-sm rounded py-1.5 text-gray-900">Tax Docs</button>
                <button className="flex-1 rounded py-1.5 hover:text-gray-900 transition-colors">Checking</button>
                <button className="flex-1 rounded py-1.5 hover:text-gray-900 transition-colors">Credit Card</button>
              </div>
            </div>
            {['2025 Form 1099-INT', '2024 Form 1099-INT', '2023 Form 1099-INT'].map((doc, i) => (
              <div key={i} className="py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block">{doc}</span>
                    <span className="text-xs text-gray-500">PDF Document</span>
                  </div>
                </div>
                <DownloadCloud className="w-5 h-5 text-[#0b5cba]" />
              </div>
            ))}
          </div>
        );

      case "support":
        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-[#0b5cba] hover:shadow-sm transition-all text-center group">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-[#0b5cba]" />
                </div>
                <span className="font-semibold text-gray-900">Live Chat</span>
                <span className="text-xs text-gray-500 mt-1">Wait time: ~2 mins</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-2xl hover:border-[#0b5cba] hover:shadow-sm transition-all text-center group">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Headset className="w-6 h-6 text-[#0b5cba]" />
                </div>
                <span className="font-semibold text-gray-900">Call Us</span>
                <span className="text-xs text-gray-500 mt-1">Available 24/7</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular FAQs</p>
              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0b5cba] hover:underline cursor-pointer">How do I dispute a credit card charge?</p>
                <p className="text-sm font-medium text-[#0b5cba] hover:underline cursor-pointer">What is the daily wire transfer limit?</p>
                <p className="text-sm font-medium text-[#0b5cba] hover:underline cursor-pointer">How do I order replacement checks?</p>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-white text-gray-900 overflow-y-auto pb-24 font-sans relative">
      
      {/* Hidden File Input for Profile Photo */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Profile & Settings</h1>
      </div>

      {/* User Avatar Block */}
      <div className="px-4 py-6 flex items-center gap-4 border-b border-gray-100">
        
        {/* Interactive Avatar */}
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-16 h-16 rounded-full bg-[#0b5cba] flex items-center justify-center text-white text-2xl font-semibold shadow-sm relative overflow-hidden group shrink-0 ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
          
          {/* Active Upload Spinner */}
          {isUploading && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
               <Loader2 className="w-6 h-6 text-white animate-spin" />
             </div>
          )}

          {/* Hover Overlay for Camera Icon */}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 truncate">{user.firstName} {user.lastName}</h2>
          <p className="text-gray-500 text-sm mt-0.5 truncate">Customer since 2021</p>
        </div>
      </div>

      {/* Edge-to-Edge List Items */}
      <div className="flex flex-col">
        
        {/* Section 1 */}
        <div className="px-4 py-3 bg-[#f4f5f9] border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Account Settings
        </div>
        
        <button onClick={() => setActiveModal("personal")} className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Personal details</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button onClick={() => setActiveModal("security")} className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Security center</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button onClick={() => setActiveModal("alerts")} className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Alerts & notifications</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Section 2 */}
        <div className="px-4 py-3 bg-[#f4f5f9] border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">
          Support & Access
        </div>

        <button onClick={() => setActiveModal("statements")} className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Statements & documents</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button onClick={() => setActiveModal("support")} className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Help & support</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Sign Out */}
        <Link href="/" className="w-full flex items-center px-4 py-5 bg-white border-b border-gray-100 hover:bg-red-50 transition-colors text-[#e53e3e]">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="text-base font-bold">Sign out</span>
          </div>
        </Link>
        
      </div>

      {/* Dynamic Bottom Sheet Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={resetModalState}
          ></div>
          <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-28 animate-in slide-in-from-bottom duration-300 shadow-2xl min-h-[60vh] max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-gray-50">
              <h3 className="font-semibold text-xl text-gray-900 capitalize">
                {activeModal === 'personal' ? 'Personal Details' : activeModal === 'security' ? 'Security Center' : activeModal === 'alerts' ? 'Notifications' : activeModal === 'statements' ? 'Documents' : 'Help & Support'}
              </h3>
              <button 
                onClick={resetModalState}
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