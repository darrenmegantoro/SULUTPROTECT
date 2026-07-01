"use client";

import { useState } from "react";
import type { InteractionRecord, ReroutingUnit } from "@/types/interactions";
import { REROUTING_UNITS } from "@/types/interactions";
import { rerouteInteraction } from "@/lib/interactionStore";

export default function ReroutingModal({
  record,
  onClose,
  onSaved,
}: {
  record: InteractionRecord;
  onClose: () => void;
  onSaved: (updated: InteractionRecord) => void;
}) {
  const [unit, setUnit] = useState<ReroutingUnit | "">(
    record.reroutingUnit ?? ""
  );
  const [analystNote, setAnalystNote] = useState(record.analystNote ?? "");

  const handleConfirm = () => {
    if (!unit) return;
    const updated = rerouteInteraction(record.id, unit, analystNote);
    if (updated) onSaved(updated);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="rerouting-title"
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-panel">
        <div className="border-b border-hairlineDivider px-5 py-4">
          <h2
            id="rerouting-title"
            className="text-base font-bold text-headlineBlack"
          >
            Mau di Rerouting ke Unit Mana?
          </h2>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-captionGray">
              Pilih unit
            </label>
            <div className="grid grid-cols-3 gap-2">
              {REROUTING_UNITS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setUnit(option)}
                  className={`rounded-subtle border px-2 py-2 text-xs font-semibold transition-colors ${
                    unit === option
                      ? "border-navyCore bg-navyCore text-white"
                      : "border-hairlineDivider text-bodyTextGray hover:bg-offWhiteSection"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="analyst-note"
              className="mb-1 block text-xs font-semibold text-captionGray"
            >
              Catatan analis (opsional)
            </label>
            <textarea
              id="analyst-note"
              value={analystNote}
              onChange={(event) => setAnalystNote(event.target.value)}
              rows={3}
              className="w-full rounded-subtle border border-hairlineDivider px-3 py-2 text-sm"
              placeholder="Catatan untuk monitoring dan pengambilan keputusan antarunit…"
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
            onClick={handleConfirm}
            disabled={!unit}
            className="rounded-subtle bg-navyCore px-4 py-2 text-sm font-semibold text-white hover:bg-navyDeep disabled:cursor-not-allowed disabled:opacity-50"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
