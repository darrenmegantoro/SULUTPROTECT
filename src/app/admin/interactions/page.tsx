"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Eye, Share2 } from "lucide-react";
import type { InteractionRecord } from "@/types/interactions";
import { getInteractions, subscribeToInteractionChanges } from "@/lib/interactionStore";
import { exportToCsv } from "@/lib/csv";
import { ADMIN_CATEGORIES } from "@/data/adminConfig";
import { cn } from "@/lib/utils";
import InteractionDetail from "@/components/admin/InteractionDetail";
import ReroutingModal from "@/components/admin/ReroutingModal";
import { APIS_NAME, formatInteractionChannel } from "@/data/apis";
import { formatWitaDateTime, getWitaDateKey } from "@/lib/timezone";

const CHANNELS = ["FAQ", "APIS", "Formulir"];

function isWithinWitaDateRange(
  createdAt: string,
  from?: string,
  to?: string
): boolean {
  const key = getWitaDateKey(createdAt);
  if (from && key < from) return false;
  if (to && key > to) return false;
  return true;
}

export default function AdminInteractionsPage() {
  const [records, setRecords] = useState<InteractionRecord[]>([]);
  const [detail, setDetail] = useState<InteractionRecord | null>(null);
  const [rerouting, setRerouting] = useState<InteractionRecord | null>(null);
  const [search, setSearch] = useState("");

  const [channel, setChannel] = useState("");
  const [category, setCategory] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    const load = () => setRecords(getInteractions());
    load();
    return subscribeToInteractionChanges(load);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((record) => {
      if (channel && record.channel !== channel) return false;
      if (category && record.category !== category) return false;
      if (!isWithinWitaDateRange(record.createdAt, dateFrom || undefined, dateTo || undefined)) {
        return false;
      }
      if (!q) return true;
      return (
        record.id.toLowerCase().includes(q) ||
        (record.consumerName ?? "").toLowerCase().includes(q) ||
        (record.query ?? "").toLowerCase().includes(q) ||
        (record.category ?? "").toLowerCase().includes(q) ||
        (record.province ?? "").toLowerCase().includes(q) ||
        (record.cityOrRegency ?? "").toLowerCase().includes(q) ||
        (record.recommendation ?? "").toLowerCase().includes(q)
      );
    });
  }, [records, channel, category, dateFrom, dateTo, search]);

  const handleExport = () => {
    if (filtered.length === 0) {
      window.alert("Belum ada data interaksi untuk diekspor.");
      return;
    }

    exportToCsv(
      "interaksi-sulut-protect.csv",
      filtered.map((record) => ({
        ID: record.id,
        "Waktu WITA":
          record.createdAtWita ?? formatWitaDateTime(record.createdAt),
        Kanal: formatInteractionChannel(record.channel),
        Kategori: record.category ?? "",
        Rekomendasi: record.recommendation ?? "",
        Provinsi: record.province ?? "",
        "Kota/Kabupaten": record.cityOrRegency ?? "",
        Status: record.reroutingStatus ?? record.status ?? "",
        "Rerouting Unit": record.reroutingUnit ?? "",
        Query: record.query ?? "",
        "Consumer Name": record.consumerName ?? "",
        Phone: record.phone ?? "",
        Email: record.email ?? "",
      }))
    );
  };

  const resetFilters = () => {
    setChannel("");
    setCategory("");
    setDateFrom("");
    setDateTo("");
    setSearch("");
  };

  const handleReroutingSaved = (updated: InteractionRecord) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === updated.id ? updated : record))
    );
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
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Cari
            </label>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ID, nama, query, lokasi…"
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Dari Tanggal (WITA)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Sampai Tanggal (WITA)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
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
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="border-b border-hairlineDivider bg-offWhiteSection text-xs uppercase tracking-wide text-captionGray">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Waktu</th>
              <th className="px-4 py-3">Kanal</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Rekomendasi</th>
              <th className="px-4 py-3">Provinsi</th>
              <th className="px-4 py-3">Kota/Kabupaten</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairlineDivider">
            {filtered.map((record) => (
              <tr key={record.id} className="hover:bg-offWhiteSection/60">
                <td className="px-4 py-3 font-mono text-xs text-bodyTextGray">
                  {record.id}
                </td>
                <td className="px-4 py-3 text-xs text-bodyTextGray">
                  {record.createdAtWita ?? formatWitaDateTime(record.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {formatInteractionChannel(record.channel)}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {record.category ?? record.faqCategory ?? "-"}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {record.recommendation ?? "-"}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {record.province ?? "-"}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {record.cityOrRegency ?? "-"}
                </td>
                <td className="px-4 py-3 text-bodyTextGray">
                  {record.reroutingStatus ?? record.status ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDetail(record)}
                      className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Detail
                    </button>
                    {record.channel === "Formulir" ? (
                      <button
                        type="button"
                        onClick={() => setRerouting(record)}
                        className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-offWhiteSection"
                      >
                        <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Rerouting
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-captionGray"
                >
                  {records.length === 0
                    ? "Belum ada data interaksi."
                    : "Tidak ada interaksi yang cocok dengan filter."}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {detail ? (
        <InteractionDetail record={detail} onClose={() => setDetail(null)} />
      ) : null}

      {rerouting ? (
        <ReroutingModal
          record={rerouting}
          onClose={() => setRerouting(null)}
          onSaved={handleReroutingSaved}
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
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-captionGray">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-subtle border border-hairlineDivider bg-white px-3 py-2 text-sm"
      >
        <option value="">Semua</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatInteractionChannel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}
