"use client";

import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useChatbot } from "./ChatbotProvider";
import ChatbotPanel from "./ChatbotPanel";

// Floating launcher (bottom-right) plus the panel it toggles. Mounted once,
// globally, in the root layout so Asisten is available on every page. Hidden
// on the dedicated /asisten page to avoid two overlapping chat interfaces.
export default function ChatbotLauncher() {
  const { isOpen, toggle } = useChatbot();
  const pathname = usePathname();

  if (pathname === "/asisten") return null;

  return (
    <>
      <ChatbotPanel />

      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Tutup Asisten" : "Buka Asisten"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-navyCore px-4 py-3 text-sm font-semibold text-white shadow-panel transition-transform hover:scale-[1.03] hover:bg-navyDeep focus-visible:ring-offset-0 sm:bottom-6 sm:right-6"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        )}
        <span>Asisten</span>
      </button>
    </>
  );
}
