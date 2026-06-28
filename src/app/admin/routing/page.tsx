"use client";

import { useEffect, useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import type {
  AuditEntry,
  InteractionRecord,
  ReroutingStatus,
} from "@/types/admin";
import { getAudit, getInteractions } from "@/lib/adminStore";
import { getAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import InteractionDetail from "@/components/admin/InteractionDetail";
import AuditTrail from "@/components/admin/AuditTrail";

const ACTIVE_STATUSES: ReroutingStatus[] = [
  "Baru",
  "Perlu Review",
  "Diteruskan ke Unit",
  "Dalam Tindak Lanjut",
];

const STATUS_STYLE: Record<ReroutingStatus, string> = {
  Baru: "bg-accentRed/10 text-accentRed",
  "Perlu Review": "bg-amber-100 text-amber-700",
  "Diteruskan ke Unit": "bg-navyCore/10 text-navyCore",
  "Dalam Tindak Lanjut": "bg-blue-100 text-blue-700",
  Selesai: "bg-emerald-100 text-emerald-700",
};

export default function AdminRoutingPage() {
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [detail, setDetail] = useState<InteractionRecord | null>(null);
  const actor = getAuth()?.email ?? "admin";

  useEffect(() => {
    const load = () => {
      setRecords(getInteractions());
      setAudit(getAudit());
    };
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  const queue = useMemo(
    () => records.filter((r) => ACTIVE_STATUSES.includes(r.reroutingStatus)),
    [records]
  );

  const history = useMemo(
    () => audit.filter((a) => a.action.toLowerCase().includes("rerouting") || a.action.includes("diperbarui")),
    [audit]
  );

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-headlineBlack">
          Rerouting Unit
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-bodyTextGray">
          Tindak lanjuti interaksi yang tidak terkait sistem pembayaran atau
          memerlukan penanganan unit lain di KPwBI Sulawesi Utara.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-xl border border-hairlineDivider bg-white shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-hairlineDivider bg-offWhiteSection text-xs uppercase tracking-wide text-captionGray">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Rekomendasi</th>
                  <th className="px-4 py-3">Unit</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairlineDivider">
                {queue.map((r) => (
                  <tr key={r.id} className="hover:bg-offWhiteSection/60">
                    <td className="px-4 py-3 font-mono text-xs text-bodyTextGray">
                      {r.id}
                    </td>
                    <td className="px-4 py-3 text-bodyTextGray">
                      {r.category ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-bodyTextGray">
                      {r.resultRecommendation ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-bodyTextGray">
                      {r.assignedUnit ?? "Belum ditugaskan"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          STATUS_STYLE[r.reroutingStatus]
                        )}
                      >
                        {r.reroutingStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDetail(r)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-navyCore px-3 py-1.5 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
                      >
                        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Tugaskan
                      </button>
                    </td>
                  </tr>
                ))}
                {queue.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-sm text-captionGray"
                    >
                      Tidak ada interaksi yang menunggu rerouting.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-hairlineDivider bg-white p-5 shadow-card">
          <h3 className="text-sm font-bold text-headlineBlack">
            Riwayat Rerouting
          </h3>
          <div className="mt-3">
            <AuditTrail entries={history} limit={12} />
          </div>
        </div>
      </div>

      {detail ? (
        <InteractionDetail
          record={detail}
          actor={actor}
          onClose={() => setDetail(null)}
        />
      ) : null}
    </div>
  );
}
