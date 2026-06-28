"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { getAuth, logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "./adminNav";

export default function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = getAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairlineDivider bg-white">
      <div className="flex items-center justify-between gap-4 px-5 py-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-headlineBlack">
            Dashboard Monitoring Terintegrasi
          </p>
          <p className="truncate text-xs text-captionGray">
            KPwBI Sulawesi Utara
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-right text-xs leading-tight text-bodyTextGray sm:block">
            <span className="block font-semibold text-headlineBlack">
              {auth?.email ?? "Administrator"}
            </span>
            <span className="text-captionGray">Admin KPwBI Sulut</span>
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-subtle border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore transition-colors hover:bg-offWhiteSection"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Keluar
          </button>
        </div>
      </div>

      {/* Mobile nav (sidebar is hidden below md) */}
      <div className="flex gap-2 overflow-x-auto border-t border-hairlineDivider px-3 py-2 md:hidden">
        {ADMIN_NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                active
                  ? "border-navyCore bg-navyCore text-white"
                  : "border-hairlineDivider bg-white text-navyCore"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
