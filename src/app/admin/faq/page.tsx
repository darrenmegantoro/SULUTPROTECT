"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { AdminFAQItem, ContentStatus } from "@/types/admin";
import { deleteFaq, getFaqs, upsertFaq } from "@/lib/adminStore";
import { getAuth } from "@/lib/auth";
import { ADMIN_CATEGORIES } from "@/data/adminConfig";
import { cn } from "@/lib/utils";
import FaqEditor from "@/components/admin/FaqEditor";

const STATUS_STYLE: Record<ContentStatus, string> = {
  Draft: "bg-amber-100 text-amber-700",
  Published: "bg-emerald-100 text-emerald-700",
  Archived: "bg-offWhiteSection text-bodyTextGray",
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<AdminFAQItem[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState<AdminFAQItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const actor = getAuth()?.email ?? "admin";

  useEffect(() => {
    const load = () => setItems(getFaqs());
    load();
    window.addEventListener("sp-admin-change", load);
    return () => window.removeEventListener("sp-admin-change", load);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [items, query, category]);

  const toggleActive = (item: AdminFAQItem) => {
    upsertFaq({ ...item, active: !item.active }, actor);
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-headlineBlack">Kelola FAQ</h1>
          <p className="mt-1 text-sm text-bodyTextGray">
            Tambah, ubah, hapus, dan kelola status konten FAQ. Hanya FAQ
            berstatus Published dan aktif yang ditujukan untuk publik.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navyDeep"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah FAQ
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-hairlineDivider bg-white p-4 shadow-card">
        <div className="flex flex-1 items-center gap-2 rounded-subtle border border-hairlineDivider px-3 py-2">
          <Search className="h-4 w-4 text-captionGray" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari pertanyaan, jawaban, atau keyword…"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
        >
          <option value="">Semua Kategori</option>
          {ADMIN_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-captionGray">
        Menampilkan {filtered.length} dari {items.length} FAQ.
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-hairlineDivider bg-white shadow-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-hairlineDivider bg-offWhiteSection text-xs uppercase tracking-wide text-captionGray">
            <tr>
              <th className="px-4 py-3">Pertanyaan</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aktif</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairlineDivider">
            {filtered.map((item) => (
              <tr key={item.id} className="align-top hover:bg-offWhiteSection/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-headlineBlack">
                    {item.question}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-captionGray">
                    {item.answer}
                  </p>
                </td>
                <td className="px-4 py-3 text-bodyTextGray">{item.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      STATUS_STYLE[item.status]
                    )}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(item)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      item.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-offWhiteSection text-bodyTextGray"
                    )}
                  >
                    {item.active ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-navyCore hover:bg-offWhiteSection"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(item.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-hairlineDivider px-2 py-1 text-xs font-semibold text-accentRed hover:bg-offWhiteSection"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-captionGray"
                >
                  Tidak ada FAQ yang cocok.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {(editing || creating) ? (
        <FaqEditor
          item={editing}
          actor={actor}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
        />
      ) : null}

      {/* Delete confirm */}
      {confirmId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-panel">
            <h2 className="text-base font-bold text-headlineBlack">
              Hapus FAQ ini?
            </h2>
            <p className="mt-2 text-sm text-bodyTextGray">
              Tindakan ini tidak dapat dibatalkan pada prototipe.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="rounded-subtle border border-hairlineDivider px-4 py-2 text-sm font-semibold text-bodyTextGray hover:bg-offWhiteSection"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteFaq(confirmId, actor);
                  setConfirmId(null);
                }}
                className="rounded-subtle bg-accentRed px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
