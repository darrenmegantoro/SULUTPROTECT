"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminFAQItem, ContentStatus } from "@/types/admin";
import { upsertFaq } from "@/lib/adminStore";
import { ADMIN_CATEGORIES } from "@/data/adminConfig";
import { uid } from "@/lib/utils";

const STATUSES: ContentStatus[] = ["Draft", "Published", "Archived"];
const INPUT_CLS =
  "w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm text-headlineBlack focus-visible:border-navyCore";

function emptyFaq(): AdminFAQItem {
  return {
    id: uid("faq"),
    focus: "Ketidakpahaman Konsumen",
    category: ADMIN_CATEGORIES[0],
    question: "",
    answer: "",
    keywords: [],
    source: "",
    reference: "",
    status: "Draft",
    active: true,
    updatedAt: new Date().toISOString(),
  };
}

export default function FaqEditor({
  item,
  actor,
  onClose,
}: {
  item: AdminFAQItem | null;
  actor: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<AdminFAQItem>(item ?? emptyFaq());
  const [keywordsText, setKeywordsText] = useState(
    (item?.keywords ?? []).join(", ")
  );

  const set = <K extends keyof AdminFAQItem>(key: K, value: AdminFAQItem[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = () => {
    if (!draft.question.trim() || !draft.answer.trim()) return;
    upsertFaq(
      {
        ...draft,
        keywords: keywordsText
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
      },
      actor
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-hairlineDivider px-5 py-4">
          <h2 className="text-base font-bold text-headlineBlack">
            {item ? "Edit FAQ" : "Tambah FAQ"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md p-1.5 text-bodyTextGray hover:bg-offWhiteSection"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <Field label="Fokus Edukasi Pengaduan">
            <input
              value={draft.focus}
              onChange={(e) => set("focus", e.target.value)}
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Pertanyaan">
            <input
              value={draft.question}
              onChange={(e) => set("question", e.target.value)}
              className={INPUT_CLS}
            />
          </Field>
          <Field label="Jawaban">
            <textarea
              value={draft.answer}
              onChange={(e) => set("answer", e.target.value)}
              rows={5}
              className={INPUT_CLS}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kategori">
              <select
                value={draft.category}
                onChange={(e) => set("category", e.target.value)}
                className={INPUT_CLS}
              >
                {ADMIN_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={draft.status}
                onChange={(e) => set("status", e.target.value as ContentStatus)}
                className={INPUT_CLS}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Keywords (pisahkan dengan koma)">
            <input
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              className={INPUT_CLS}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Source (internal)">
              <input
                value={draft.source ?? ""}
                onChange={(e) => set("source", e.target.value)}
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Reference (internal)">
              <input
                value={draft.reference ?? ""}
                onChange={(e) => set("reference", e.target.value)}
                className={INPUT_CLS}
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-headlineBlack">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4"
            />
            Aktif (tampil ke publik bila berstatus Published)
          </label>
        </div>

        <div className="flex justify-end gap-2 border-t border-hairlineDivider px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-subtle border border-hairlineDivider px-4 py-2 text-sm font-semibold text-bodyTextGray hover:bg-offWhiteSection"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white hover:bg-navyDeep"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-captionGray">
        {label}
      </label>
      {children}
    </div>
  );
}
