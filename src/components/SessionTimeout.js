"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const warningTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  
  const WARNING_TIME = 14 * 60 * 1000; // 14 minutes
  const LOGOUT_TIME = 60; // 60 seconds

  const resetTimer = useCallback(() => {
    if (showWarning) return; 

    clearTimeout(warningTimeoutRef.current);
    clearInterval(countdownIntervalRef.current);
    setTimeLeft(LOGOUT_TIME);

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      
      countdownIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            window.location.href = "/";
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, WARNING_TIME);
  }, [showWarning]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(warningTimeoutRef.current);
      clearInterval(countdownIntervalRef.current);
    };
  }, [resetTimer]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">Session Expiring</h3>
        <p className="text-center text-gray-600 mb-6">
          For your security, you will be automatically logged out in <span className="font-bold text-red-600">{timeLeft} seconds</span> due to inactivity.
        </p>
        <div className="flex gap-3">
          <button onClick={() => window.location.href = "/"} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 font-medium transition-colors">
            Log out
          </button>
          <button onClick={() => { setShowWarning(false); resetTimer(); }} className="flex-1 px-4 py-2 text-white bg-[#0b5cba] rounded hover:bg-[#094a96] font-medium transition-colors">
            Stay logged in
          </button>
        </div>
      </div>
    </div>
  );
}