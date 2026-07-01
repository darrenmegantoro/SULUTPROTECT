import type { InteractionRecord } from "@/types/interactions";
import { getInteractionLocation } from "@/types/interactions";
import { formatInteractionChannel } from "@/data/apis";
import {
  formatWitaChartDay,
  getWitaDayKey,
  isSameWitaDay,
  shiftDays,
} from "@/lib/timezone";

export type Bucket = { label: string; value: number };

function tally(
  records: InteractionRecord[],
  keyFn: (r: InteractionRecord) => string | undefined
): Bucket[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const key = keyFn(r);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function byCategory(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.category);
}

export function byChannel(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.channel).map((bucket) => ({
    ...bucket,
    label: formatInteractionChannel(bucket.label),
  }));
}

export function byLocation(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => getInteractionLocation(r));
}

export function byResult(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.recommendation);
}

export function byOrganizerField(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.organizerField);
}

export function reroutingByUnit(records: InteractionRecord[]): Bucket[] {
  return tally(
    records.filter((r) => r.reroutingUnit),
    (r) => r.reroutingUnit
  );
}

export function dailyTrend(records: InteractionRecord[], days = 14): Bucket[] {
  const out: Bucket[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i -= 1) {
    const ref = shiftDays(today, -i);
    const dayKey = getWitaDayKey(ref.toISOString());
    const value = records.filter(
      (r) => getWitaDayKey(r.createdAt) === dayKey
    ).length;
    out.push({ label: formatWitaChartDay(ref), value });
  }

  return out;
}

export function unansweredQuestions(records: InteractionRecord[]): Bucket[] {
  return tally(
    records.filter(
      (r) =>
        r.channel === "APIS" &&
        (r.recommendation === "Tidak ditemukan di FAQ" ||
          r.apisSource === "CLARIFICATION")
    ),
    (r) => r.query
  );
}

export function topQuestions(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.query).slice(0, 6);
}

export type DashboardSummary = {
  total: number;
  today: number;
  topCategory: string;
  needRerouting: number;
  biBicara: number;
  lapsSjk: number;
  outsideBI: number;
};

export function summarize(records: InteractionRecord[]): DashboardSummary {
  const cat = byCategory(records);
  return {
    total: records.length,
    today: records.filter((r) => isSameWitaDay(r.createdAt)).length,
    topCategory: cat[0]?.label ?? "-",
    needRerouting: records.filter(
      (r) => r.status === "Baru" || r.status === "Perlu Tindak Lanjut"
    ).length,
    biBicara: records.filter((r) => r.directedToBiBicara).length,
    lapsSjk: records.filter((r) =>
      (r.recommendation ?? "").includes("LAPS SJK")
    ).length,
    outsideBI: records.filter((r) => r.outsideBiAuthority).length,
  };
}

export function summarizeFormulir(
  records: InteractionRecord[]
): DashboardSummary {
  return summarize(records.filter((r) => r.channel === "Formulir"));
}
