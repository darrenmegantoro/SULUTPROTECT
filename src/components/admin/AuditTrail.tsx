"use client";

import type { AuditEntry } from "@/types/admin";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditTrail({
  entries,
  limit,
}: {
  entries: AuditEntry[];
  limit?: number;
}) {
  const list = limit ? entries.slice(0, limit) : entries;

  if (list.length === 0) {
    return (
      <p className="text-sm text-captionGray">Belum ada riwayat perubahan.</p>
    );
  }

  return (
    <ul className="divide-y divide-hairlineDivider">
      {list.map((e) => (
        <li key={e.id} className="flex items-start justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-headlineBlack">
              {e.action}
            </p>
            <p className="truncate text-xs text-bodyTextGray">{e.target}</p>
            {e.detail ? (
              <p className="text-xs text-captionGray">{e.detail}</p>
            ) : null}
          </div>
          <div className="shrink-0 text-right text-[11px] text-captionGray">
            <p>{formatDateTime(e.at)}</p>
            <p>{e.actor}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
