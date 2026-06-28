"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { AdminFormQuestion, ContentStatus } from "@/types/admin";
import { updateFormQuestion } from "@/lib/adminStore";

const STATUSES: ContentStatus[] = ["Draft", "Published", "Archived"];
const INPUT_CLS =
  "w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm text-headlineBlack focus-visible:border-navyCore";

export default function FormQuestionEditor({
  question,
  actor,
  onClose,
}: {
  question: AdminFormQuestion;
  actor: string;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<AdminFormQuestion>(question);
  const [versionNote, setVersionNote] = useState("");

  const setOption = (idx: number, key: "label" | "description", value: string) => {
    setDraft((d) => {
      const options = [...(d.options ?? [])];
      options[idx] = { ...options[idx], [key]: value };
      return { ...d, options };
    });
  };

  const handleSave = () => {
    updateFormQuestion({ ...draft, versionNote: versionNote || undefined }, actor);
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
            Edit Pertanyaan · Langkah {draft.stepNumber}
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
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Perubahan pertanyaan dapat memengaruhi pemahaman Konsumen. Pastikan
            perubahan tetap sesuai ketentuan yang berlaku.
          </div>

          <p className="text-xs text-captionGray">
            Logic key: <span className="font-mono">{draft.logicKey}</span> —
            logika percabangan triase tidak diubah oleh penyuntingan teks.
          </p>

          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Teks Pertanyaan
            </label>
            <textarea
              value={draft.questionText}
              onChange={(e) =>
                setDraft((d) => ({ ...d, questionText: e.target.value }))
              }
              rows={2}
              className={INPUT_CLS}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Teks Bantuan (Helper)
            </label>
            <textarea
              value={draft.helperText ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, helperText: e.target.value }))
              }
              rows={2}
              className={INPUT_CLS}
            />
          </div>

          {draft.options && draft.options.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-captionGray">
                Opsi Jawaban
              </p>
              {draft.options.map((o, idx) => (
                <div
                  key={o.value}
                  className="rounded-lg border border-hairlineDivider p-3"
                >
                  <p className="mb-2 text-[11px] text-captionGray">
                    value: <span className="font-mono">{o.value}</span>
                  </p>
                  <input
                    value={o.label}
                    onChange={(e) => setOption(idx, "label", e.target.value)}
                    placeholder="Label opsi"
                    className={`${INPUT_CLS} mb-2`}
                  />
                  <input
                    value={o.description ?? ""}
                    onChange={(e) =>
                      setOption(idx, "description", e.target.value)
                    }
                    placeholder="Deskripsi opsi (opsional)"
                    className={INPUT_CLS}
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-captionGray">
                Status
              </label>
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value as ContentStatus,
                  }))
                }
                className={INPUT_CLS}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-end gap-2 pb-2 text-sm text-headlineBlack">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, active: e.target.checked }))
                }
                className="h-4 w-4"
              />
              Pertanyaan aktif
            </label>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Catatan Versi
            </label>
            <input
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="Mis. menyederhanakan bahasa, menyesuaikan ketentuan…"
              className={INPUT_CLS}
            />
          </div>
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
