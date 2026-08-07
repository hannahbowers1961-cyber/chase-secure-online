"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareStack, RefreshCcw, DollarSign, Shield, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // 1. Add any paths here where the nav bar should NOT appear
  const hiddenPaths = [
    "/",          // Hide on the pre-login lock screen
    "/transfers/bills", // Hide on the Pay Bills page
    "/transfers/contacts",
    "/transfers/schedule",
    "/dashboard/deposit",
    "/dashboard/checking",
    "/dashboard/savings",
    "/dashboard/credit-card",
    "/dashboard/freedom",
    "/dashboard/creditwise",
    "/dashboard/loans",
    "/transfers/external",
    "/transfers/wire",
  ];

  // 2. Check if the current route matches any of our hidden paths
  const shouldHide = hiddenPaths.some(path => 
    path === "/" ? pathname === "/" : pathname.startsWith(path)
  );

  // 3. If it's a hidden path, return null to render nothing
  if (shouldHide) return null;

  const navItems = [
    { name: "Accounts", href: "/dashboard", id: "accounts" },
    { name: "Pay & transfer", href: "/transfers", id: "pay" },
    { name: "Security", href: "/security", id: "security" },
    { name: "Profile", href: "/profile", id: "profile" },
  ];

  return (
    <div className="bg-white border-t border-gray-200 px-2 py-1.5 flex justify-between items-center z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        
        // Active state uses the deep blue, inactive uses the subtle gray
        const colorClass = isActive ? "text-[#0b5cba]" : "text-[#71767c] hover:text-gray-900";
        const stroke = isActive ? 2.5 : 1.5;

        return (
          <Link 
            key={item.name} 
            href={item.href}
            className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-colors ${colorClass}`}
          >
            {/* Custom Icon Engine */}
            <div className="relative flex items-center justify-center h-6 w-6">
              
              {item.id === "accounts" && (
                <Wallet className={`w-5 h-5 ${isActive ? "fill-[#0b5cba]/10" : ""}`} strokeWidth={stroke} />
              )}
              
              {item.id === "pay" && (
                <>
                  <RefreshCcw className="w-5 h-5" strokeWidth={stroke} />
                  <DollarSign className="w-2.5 h-2.5 absolute" strokeWidth={stroke + 1} />
                </>
              )}
              
              {item.id === "security" && (
                <Shield className={`w-5 h-5 ${isActive ? "fill-[#0b5cba]/10" : ""}`} strokeWidth={stroke} />
              )}
              
              {item.id === "profile" && (
                <User className={`w-5 h-5 ${isActive ? "fill-[#0b5cba]/10" : ""}`} strokeWidth={stroke} />
              )}
              
            </div>
            
            <span className={`text-[10px] tracking-tight ${isActive ? "font-semibold" : "font-medium"}`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}