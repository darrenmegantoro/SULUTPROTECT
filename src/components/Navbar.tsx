"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { APIS_NAME } from "@/data/apis";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  {
    label: "Mulai Formulir Panduan Pengaduan",
    href: "/formulir-panduan-pengaduan",
  },
  { label: "FAQ", href: "/faq" },
  { label: APIS_NAME, href: "/asisten" },
  { label: "Login Admin", href: "/login" },
];

const BRAND_SUBTITLE =
  "Systemic Upgrade for Literacy & Unified Tracking: Process Transformation & Enhanced Consumer Triage";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-hairlineDivider bg-white">
      <nav className="container-bi flex min-h-[72px] items-center justify-between gap-4 py-2">
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMobile}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navyCore text-white">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-navyCore">
              SULUT PROTECT
            </span>
            <span className="block max-w-[420px] text-[10px] leading-snug text-captionGray">
              {BRAND_SUBTITLE}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 xl:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-subtle border px-3 py-2 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "border-navyCore bg-navyCore text-white"
                  : "border-navyCore/30 bg-white text-navyCore hover:border-navyCore hover:bg-offWhiteSection"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-navyCore xl:hidden"
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      <div className={cn("xl:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="container-bi flex flex-col gap-2 border-t border-hairlineDivider py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMobile}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-subtle border px-4 py-2 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "border-navyCore bg-navyCore text-white"
                  : "border-navyCore/30 bg-white text-navyCore hover:border-navyCore hover:bg-offWhiteSection"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
