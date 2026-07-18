import Link from "next/link";
import { Fingerprint, Lock } from "lucide-react";

export default function PreLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-8 mt-12">
      
      {/* App Logo & Welcome */}
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">ApexBank</h1>
        <p className="text-slate-400 mt-2">Welcome back</p>
      </div>

      {/* Quick Balance Widget */}
      <div className="w-full bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center">
        <p className="text-sm text-slate-400 mb-1">Quick Balance</p>
        <p className="text-3xl font-bold text-white">$45,231.89</p>
      </div>

      {/* Login Actions */}
      <div className="w-full space-y-4">
        <Link href="/dashboard" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center transition-colors">
          Log In
        </Link>
        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Fingerprint className="w-5 h-5" />
          Passkey / FaceID
        </button>
      </div>
      
    </div>
  );
}