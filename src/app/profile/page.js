import { 
  User, 
  Shield, 
  Bell, 
  FileText, 
  HelpCircle, 
  LogOut, 
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function Profile() {
  return (
    <div className="w-full h-full bg-white text-gray-900 overflow-y-auto pb-24 font-sans">
      
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Profile & Settings</h1>
      </div>

      {/* User Avatar Block */}
      <div className="px-4 py-6 flex items-center gap-4 border-b border-gray-100">
        <div className="w-16 h-16 rounded-full bg-[#0b5cba] flex items-center justify-center text-white text-2xl font-semibold">
          AM
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">Alex Morgan</h2>
          <p className="text-gray-500 text-sm mt-0.5">Customer since 2021</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      {/* Edge-to-Edge List Items */}
      <div className="flex flex-col">
        
        {/* Section 1 */}
        <div className="px-4 py-3 bg-[#f4f5f9] border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Account Settings
        </div>
        
        <button className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Personal details</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#0b5cba]" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Security center</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
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

        <button className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Statements & documents</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <button className="w-full flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            <span className="text-base text-gray-900 font-medium">Help & support</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Sign Out */}
        <Link href="/" className="w-full flex items-center px-4 py-5 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors text-[#e53e3e]">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-base font-semibold">Sign out</span>
          </div>
        </Link>
        
      </div>
    </div>
  );
}