"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { InteractionRecord, InteractionStatus, ReroutingUnit } from "@/types/interactions";
import {
  getInteractionLocation,
  INTERACTION_STATUSES,
  REROUTING_UNITS,
} from "@/types/interactions";
import { updateInteraction } from "@/lib/adminStore";
import { formatInteractionChannel } from "@/data/apis";
import { formatWitaDateTime } from "@/lib/timezone";

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
  const [unit, setUnit] = useState(record.reroutingUnit ?? "");
  const [status, setStatus] = useState<InteractionStatus>(
    record.status ?? "Baru"
  );
  const [reroutingStatus, setReroutingStatus] = useState(
    record.reroutingStatus ?? ""
  );
  const [notes, setNotes] = useState(record.analystNote ?? "");

  const handleSave = () => {
    updateInteraction(
      record.id,
      {
        reroutingUnit: unit ? (unit as ReroutingUnit) : undefined,
        status,
        reroutingStatus: reroutingStatus || undefined,
        analystNote: notes || undefined,
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
            <Row
              label="Waktu (WITA)"
              value={record.createdAtWita ?? formatWitaDateTime(record.createdAt)}
            />
            <Row label="Kanal" value={formatInteractionChannel(record.channel)} />
            <Row label="Kategori" value={record.category} />
            <Row label="Query / Pertanyaan" value={record.query} />
            <Row label="Rekomendasi" value={record.recommendation} />
            <Row label="Hasil Formulir" value={record.resultKey} />
            <Row label="Bidang Penyelenggara" value={record.organizerField} />
            <Row label="Nama Konsumen" value={record.consumerName} />
            <Row label="Telepon" value={record.phone} />
            <Row label="Email" value={record.email} />
            <Row label="Provinsi" value={record.province} />
            <Row label="Kota/Kabupaten" value={record.cityOrRegency} />
            <Row label="Lokasi" value={getInteractionLocation(record)} />
            <Row label="FAQ Cocok" value={record.matchedFaqQuestion} />
            <Row label="Sumber APIS" value={record.apisSource} />
            <Row label="Rute Kewenangan" value={record.matchedAuthorityRouteId} />
            <Row
              label="Perlu Review KB"
              value={record.needsKnowledgeReview ? "Ya" : "Tidak"}
            />
          </div>

          {record.answers && record.answers.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-captionGray">
                Jawaban Formulir
              </p>
              <ul className="mt-1 space-y-2 text-sm text-bodyTextGray">
                {record.answers.map((entry) => (
                  <li key={entry.questionId}>
                    <span className="font-medium text-headlineBlack">
                      {entry.questionText}
                    </span>
                    <br />
                    {entry.answer}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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
                {REROUTING_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-captionGray">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as InteractionStatus)
                }
                className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
              >
                {INTERACTION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Status Rerouting (detail)
            </label>
            <input
              type="text"
              value={reroutingStatus}
              onChange={(e) => setReroutingStatus(e.target.value)}
              placeholder="Contoh: Diteruskan ke Unit"
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-captionGray">
              Catatan Analis
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
