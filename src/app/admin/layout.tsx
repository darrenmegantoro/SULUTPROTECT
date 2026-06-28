"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ensureSeeded } from "@/lib/adminStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Client-side route guard: redirect to /login when not authenticated.
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    ensureSeeded();
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offWhiteSection text-sm text-bodyTextGray">
        Memuat dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-offWhiteSection">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 px-5 py-6">{children}</main>
      </div>
    </div>
  );
}
