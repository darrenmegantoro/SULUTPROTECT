"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotLauncher from "@/components/chatbot/ChatbotLauncher";

// Renders the public site chrome (navbar, footer, floating Asisten) for public
// routes, and nothing extra for the admin area and login page, which provide
// their own layout/chrome.
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAppArea =
    pathname === "/login" || pathname.startsWith("/admin");

  if (isAppArea) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-navyCore focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama" className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatbotLauncher />
    </>
  );
}
