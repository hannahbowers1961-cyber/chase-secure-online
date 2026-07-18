import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { BankProvider } from "@/context/BankContext";

// Restoring the Next.js optimized font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Banking App",
  description: "Premium banking prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Re-applying the font class alongside the background color */}
      <body className={`${inter.className} bg-[#f4f5f9]`}>
        <BankProvider>
          <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
            <BottomNav />
          </div>
        </BankProvider>
      </body>
    </html>
  );
}