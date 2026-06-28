import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { ChatbotProvider } from "@/components/chatbot/ChatbotProvider";

export const metadata: Metadata = {
  title: "SULUT PROTECT — Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Utara",
  description:
    "Portal edukasi pengaduan Konsumen. Mulai dari FAQ, lalu gunakan Formulir Panduan Pengaduan untuk mengetahui kanal tindak lanjut yang sesuai.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-white">
        <ChatbotProvider>
          <SiteChrome>{children}</SiteChrome>
        </ChatbotProvider>
      </body>
    </html>
  );
}
