"use client";

import { X } from "lucide-react";
import type { InteractionRecord } from "@/types/interactions";
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wide text-navyCore">
        {title}
      </h3>
      <div className="mt-2 divide-y divide-hairlineDivider rounded-lg border border-hairlineDivider bg-offWhiteSection/40 px-3">
        {children}
      </div>
    </div>
  );
}

export default function InteractionDetail({
  record,
  onClose,
}: {
  record: InteractionRecord;
  onClose: () => void;
}) {
  const waktu =
    record.createdAtWita ?? formatWitaDateTime(record.createdAt);

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

        <div className="space-y-5 px-5 py-4">
          {record.channel === "Formulir" ? (
            <>
              <Section title="Data Konsumen">
                <Row label="Nama" value={record.consumerName} />
                <Row label="Nomor Telepon" value={record.phone} />
                <Row label="Email" value={record.email} />
                <Row label="Provinsi" value={record.province} />
                <Row label="Kota/Kabupaten" value={record.cityOrRegency} />
              </Section>

              <Section title="Ringkasan Interaksi">
                <Row label="ID" value={record.id} />
                <Row label="Waktu WITA" value={waktu} />
                <Row
                  label="Kanal"
                  value={formatInteractionChannel(record.channel)}
                />
                <Row label="Kategori" value={record.category} />
                <Row
                  label="Bidang Penyelenggara / Pelaku terkait"
                  value={record.organizerField}
                />
                <Row
                  label="Rekomendasi / Result"
                  value={record.recommendation}
                />
                <Row label="Status" value={record.status} />
                <Row
                  label="Rerouting"
                  value={
                    record.reroutingStatus ??
                    (record.reroutingUnit
                      ? `Rerouting ke ${record.reroutingUnit}`
                      : undefined)
                  }
                />
              </Section>

              {record.answers && record.answers.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-navyCore">
                    Jawaban Formulir
                  </h3>
                  <ul className="mt-2 space-y-3 text-sm text-bodyTextGray">
                    {record.answers.map((entry) => (
                      <li
                        key={entry.questionId}
                        className="rounded-lg border border-hairlineDivider bg-offWhiteSection/40 p-3"
                      >
                        <p className="font-medium text-headlineBlack">
                          {entry.questionText}
                        </p>
                        <p className="mt-1">{entry.answer}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          {record.channel === "FAQ" ? (
            <Section title="Interaksi FAQ">
              <Row label="ID" value={record.id} />
              <Row label="Waktu WITA" value={waktu} />
              <Row label="Kanal" value="FAQ" />
              <Row label="Query / Pencarian" value={record.query} />
              <Row
                label="FAQ Dibuka / Cocok"
                value={record.matchedFaqQuestion}
              />
              <Row
                label="Kategori"
                value={record.faqCategory ?? record.category}
              />
              <Row label="Status" value={record.status} />
            </Section>
          ) : null}

          {record.channel === "APIS" ? (
            <Section title="Interaksi APIS">
              <Row label="ID" value={record.id} />
              <Row label="Waktu WITA" value={waktu} />
              <Row label="Kanal" value="APIS" />
              <Row label="Pertanyaan Pengguna" value={record.query} />
              <Row label="Sumber Jawaban" value={record.apisSource} />
              <Row label="FAQ Cocok" value={record.matchedFaqQuestion} />
              <Row
                label="Rute Kewenangan"
                value={record.matchedAuthorityRouteId}
              />
              <Row
                label="Perlu Review KB"
                value={record.needsKnowledgeReview ? "Ya" : "Tidak"}
              />
              <Row label="Status" value={record.status} />
            </Section>
          ) : null}

          {record.analystNote ? (
            <Section title="Catatan Analis">
              <p className="px-1 py-2 text-sm text-bodyTextGray">
                {record.analystNote}
              </p>
            </Section>
          ) : null}
        </div>

        <div className="flex justify-end border-t border-hairlineDivider px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-subtle border border-hairlineDivider px-4 py-2 text-sm font-semibold text-bodyTextGray hover:bg-offWhiteSection"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
