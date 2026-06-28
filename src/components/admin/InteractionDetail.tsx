"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { InteractionRecord, ReroutingStatus } from "@/types/admin";
import { updateInteraction } from "@/lib/adminStore";
import { ADMIN_UNITS } from "@/data/adminConfig";

const REROUTING: ReroutingStatus[] = [
  "Baru",
  "Perlu Review",
  "Diteruskan ke Unit",
  "Dalam Tindak Lanjut",
  "Selesai",
];

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <span className="text-captionGray">{label}</span>
      <span className="text-right font-medium text-headlineBlack">
        {value || "-"}
      </span>
    </div>
  );
}

export default function InteractionDetail({
  record,
  actor,
  onClose,
}: {
  record: InteractionRecord;
  actor: string;
  onClose: () => void;
}) {
  const [unit, setUnit] = useState(record.assignedUnit ?? "");
  const [status, setStatus] = useState<ReroutingStatus>(record.reroutingStatus);
  const [notes, setNotes] = useState(record.notes ?? "");

  const handleSave = () => {
    updateInteraction(
      record.id,
      {
        assignedUnit: unit || undefined,
        reroutingStatus: status,
        notes: notes || undefined,
      },
      actor,
      "Interaksi diperbarui (rerouting/catatan)"
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-panel">
        <div className="flex items-center justify-between border-b border-hairlineDivider px-5 py-4">
          <h2 className="text-base font-bold text-headlineBlack">
            Detail Interaksi · {record.id}
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
          <div className="divide-y divide-hairlineDivider">
            <Row label="Kanal" value={record.channel} />
            <Row label="Kategori" value={record.category} />
            <Row label="Query / Pertanyaan" value={record.query} />
            <Row
              label="Rekomendasi"
              value={record.resultRecommendation}
            />
            <Row label="Lokasi" value={record.location} />
            <Row label="Usia" value={record.demographic?.ageRange} />
            <Row label="Jenis Kelamin" value={record.demographic?.gender} />
          </div>

          {record.answerSummary && record.answerSummary.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-captionGray">
                Ringkasan Jawaban
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-bodyTextGray">
                {record.answerSummary.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Rerouting controls */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-captionGray">
                Tugaskan ke Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
              >
                <option value="">Belum ditugaskan</option>
                {ADMIN_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-captionGray">
                Status Rerouting
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ReroutingStatus)}
                className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
              >
                {REROUTING.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Catatan Internal (Decision Support)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Catatan untuk monitoring dan pengambilan keputusan antarunit…"
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
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
