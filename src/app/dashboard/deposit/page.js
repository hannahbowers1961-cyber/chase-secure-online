"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, HelpCircle, ChevronRight, Zap, Check, Trash2, Loader2 } from "lucide-react";

export default function MobileDeposit() {
  const [amount, setAmount] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  // Handle capturing/selecting the image for Front/Back
  const handleImageCapture = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "front") {
          setFrontImage(reader.result);
        } else {
          setBackImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeposit = () => {
    if (!amount || !frontImage || !backImage) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Deposit Successful!</h2>
        <p className="text-sm text-gray-500 mb-6">Your check of ${amount} has been submitted for processing.</p>
        <Link href="/dashboard" className="w-full max-w-xs bg-[#0b5cba] text-white font-semibold py-3.5 rounded-xl shadow-md hover:bg-[#094a96] transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f4f5f9] text-gray-900 overflow-y-auto pb-24 font-sans flex flex-col">
      
      {/* Hidden File Inputs that trigger device camera */}
      <input 
        type="file" 
        ref={frontInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={(e) => handleImageCapture(e, "front")} 
      />
      <input 
        type="file" 
        ref={backInputRef} 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={(e) => handleImageCapture(e, "back")} 
      />

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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
          {frontImage ? (
            <div className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-green-500 group">
              <img src={frontImage} alt="Front of Check" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => frontInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-semibold shadow"
                >
                  Retake
                </button>
                <button 
                  onClick={() => setFrontImage(null)}
                  className="p-1.5 bg-red-600 text-white rounded-lg shadow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => frontInputRef.current?.click()}
              className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-400 hover:border-[#0b5cba] transition-colors group"
            >
              <div className="absolute inset-4 border border-white/30 rounded-lg pointer-events-none"></div>
              <Camera className="w-8 h-8 text-white group-hover:text-[#0b5cba] transition-colors" />
              <span className="text-white font-medium text-sm">Take photo of FRONT</span>
            </button>
          )}

          {/* Back of Check */}
          {backImage ? (
            <div className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-green-500 group">
              <img src={backImage} alt="Back of Check" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => backInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-semibold shadow"
                >
                  Retake
                </button>
                <button 
                  onClick={() => setBackImage(null)}
                  className="p-1.5 bg-red-600 text-white rounded-lg shadow"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => backInputRef.current?.click()}
              className="w-full h-32 bg-gray-900 rounded-xl relative overflow-hidden flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-400 hover:border-[#0b5cba] transition-colors group"
            >
              <div className="absolute inset-4 border border-white/30 rounded-lg pointer-events-none"></div>
              <Camera className="w-8 h-8 text-white group-hover:text-[#0b5cba] transition-colors" />
              <span className="text-white font-medium text-sm">Take photo of BACK</span>
              <span className="text-xs text-gray-400">Remember to endorse</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
          <Zap className="w-4 h-4 text-orange-500" />
          Deposits before 11 PM ET process same day.
        </div>

        <button 
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0 || !frontImage || !backImage || isSubmitting}
          className="w-full bg-[#0b5cba] text-white font-semibold py-4 rounded-xl shadow-md hover:bg-[#094a96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing Deposit...
            </>
          ) : (
            "Deposit"
          )}
        </button>

      </div>
    </div>
  );
}