"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "./adminNav";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navyDeep/40 bg-navyDeep text-white md:flex">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-bold">SULUT PROTECT</p>
          <p className="text-[10px] text-white/70">Integrated Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-navyDeep"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] leading-relaxed text-white/60">
        Kantor Perwakilan Bank Indonesia Provinsi Sulawesi Utara
      </div>
    </aside>
  );
}
