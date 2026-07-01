"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Check } from "lucide-react";
import type { InteractionRecord, InteractionStatus } from "@/types/interactions";
import {
  getInteractionLocation,
  INTERACTION_STATUSES,
  REROUTING_UNITS,
} from "@/types/interactions";
import { getInteractions, updateInteraction } from "@/lib/adminStore";
import { getAuth } from "@/lib/auth";
import { exportToCsv } from "@/lib/csv";
import { ADMIN_CATEGORIES } from "@/data/adminConfig";
import { cn } from "@/lib/utils";
import InteractionDetail from "@/components/admin/InteractionDetail";
import { APIS_NAME, formatInteractionChannel } from "@/data/apis";
import { formatWitaDateTime } from "@/lib/timezone";

const CHANNELS = ["FAQ", "APIS", "Formulir"];

const STATUS_STYLE: Record<InteractionStatus, string> = {
  Baru: "bg-accentRed/10 text-accentRed",
  "Perlu Tindak Lanjut": "bg-amber-100 text-amber-700",
  Selesai: "bg-emerald-100 text-emerald-700",
};

export default function AdminInteractionsPage() {
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [detail, setDetail] = useState<InteractionRecord | null>(null);

  const [channel, setChannel] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const actor = getAuth()?.email ?? "admin";

  useEffect(() => {
    const load = () => setRecords(getInteractions());
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (channel && r.channel !== channel) return false;
      if (category && r.category !== category) return false;
      if (unit && r.reroutingUnit !== unit) return false;
      if (status && r.status !== status) return false;
      if (dateFrom && r.createdAt < new Date(dateFrom).toISOString())
        return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (r.createdAt > end.toISOString()) return false;
      }
      return true;
    });
  }, [records, channel, category, unit, status, dateFrom, dateTo]);

  const markReviewed = (id: string) => {
    updateInteraction(
      id,
      { status: "Selesai" },
      actor,
      "Interaksi ditandai sudah direview"
    );
  };

  const handleExport = () => {
    exportToCsv(
      "interaksi-sulut-protect.csv",
      filtered.map((r) => ({
        ID: r.id,
        Waktu: r.createdAtWita ?? formatWitaDateTime(r.createdAt),
        Kanal: formatInteractionChannel(r.channel),
        Kategori: r.category ?? "",
        Query: r.query ?? "",
        Rekomendasi: r.recommendation ?? "",
        Provinsi: r.province ?? "",
        "Kota/Kabupaten": r.cityOrRegency ?? "",
        Lokasi: getInteractionLocation(r) ?? "",
        Nama: r.consumerName ?? "",
        Telepon: r.phone ?? "",
        Email: r.email ?? "",
        "Bidang Penyelenggara": r.organizerField ?? "",
        "Hasil Formulir": r.resultKey ?? "",
        "Sumber APIS": r.apisSource ?? "",
        "Rute Kewenangan": r.matchedAuthorityRouteId ?? "",
        "Perlu Review KB": r.needsKnowledgeReview ? "Ya" : "Tidak",
        Unit: r.reroutingUnit ?? "",
        Status: r.status ?? "",
        "Status Rerouting": r.reroutingStatus ?? "",
        Catatan: r.analystNote ?? "",
      }))
    );
  };

  const resetFilters = () => {
    setChannel("");
    setCategory("");
    setUnit("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-headlineBlack">
            Interaksi Pengaduan
          </h1>
          <p className="mt-1 text-sm text-bodyTextGray">
            Pantau interaksi dari FAQ, {APIS_NAME}, dan Formulir Panduan
            Pengaduan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Export CSV
        </button>
      </header>

      <div className="rounded-xl border border-hairlineDivider bg-white p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Select label="Kanal" value={channel} onChange={setChannel} options={CHANNELS} />
          <Select
            label="Kategori"
            value={category}
            onChange={setCategory}
            options={ADMIN_CATEGORIES}
          />
          <Select label="Unit" value={unit} onChange={setUnit} options={REROUTING_UNITS} />
          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={INTERACTION_STATUSES}
          />
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-captionGray">
            Menampilkan {filtered.length} dari {records.length} interaksi.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-linkBlue hover:underline"
          >
            Reset filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-hairlineDivider bg-white shadow-card">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-hairlineDivider bg-offWhiteSection text-xs uppercase tracking-wide text-captionGray">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Waktu (WITA)</th>
              <th className="px-4 py-3">Kanal</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Rekomendasi</th>
              <th className="px-4 py-3">Lokasi</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairlineDivider">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-offWhiteSection/60">
                <td className="px-4 py-3 font-mono text-xs text-bodyTextGray">
                  {r.id}
                </td>
                <td className="px-4 py-3 text-xs text-bodyTextGray">
                  {r.createdAtWita ?? formatWitaDateTime(r.createdAt)}
                </td>
                <td className="px-4 py-3">{formatInteractionChannel(r.channel)}</td>
                <td className="px-4 py-3 text-bodyTextGray">{r.category ?? "-"}</td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {r.recommendation ?? "-"}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {getInteractionLocation(r) ?? "-"}
                </td>
                <td className="px-4 py-3">
                  {r.status ? (
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        STATUS_STYLE[r.status]
                      )}
                    >
                      {r.status}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDetail(r)}
                      className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Detail
                    </button>
                    {r.status !== "Selesai" ? (
                      <button
                        type="button"
                        onClick={() => markReviewed(r.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-offWhiteSection"
                      >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        Review
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600">
                        Direview
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-captionGray"
                >
                  Tidak ada interaksi yang cocok dengan filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-captionGray">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-subtle border border-hairlineDivider bg-white px-3 py-2 text-sm"
      >
        <option value="">Semua</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {formatInteractionChannel(o)}
          </option>
        ))}
      </select>
    </div>
  );
}
