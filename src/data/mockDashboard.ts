import type { InteractionRecord } from "@/types/admin";

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

function isSameDay(iso: string, ref: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function byCategory(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.category);
}

export function byChannel(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.channel);
}

export function byLocation(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.location);
}

export function byResult(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.resultRecommendation);
}

export function byAgeRange(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.demographic?.ageRange).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function byGender(records: InteractionRecord[]): Bucket[] {
  return tally(records, (r) => r.demographic?.gender);
}

export function reroutingByUnit(records: InteractionRecord[]): Bucket[] {
  return tally(
    records.filter((r) => r.assignedUnit),
    (r) => r.assignedUnit
  );
}

// Daily interaction trend for the last `days` days (oldest -> newest).
export function dailyTrend(records: InteractionRecord[], days = 14): Bucket[] {
  const out: Bucket[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const ref = new Date(today);
    ref.setDate(today.getDate() - i);
    const value = records.filter((r) => isSameDay(r.createdAt, ref)).length;
    const label = `${ref.getDate()}/${ref.getMonth() + 1}`;
    out.push({ label, value });
  }
  return out;
}

// Most frequent chatbot questions that could not be answered from FAQ.
export function unansweredQuestions(records: InteractionRecord[]): Bucket[] {
  return tally(
    records.filter(
      (r) =>
        r.channel === "Asisten" &&
        r.resultRecommendation === "Tidak ditemukan di FAQ"
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
  const today = new Date();
  const cat = byCategory(records);
  const countResult = (needle: string) =>
    records.filter((r) => (r.resultRecommendation ?? "").includes(needle))
      .length;

  return {
    total: records.length,
    today: records.filter((r) => isSameDay(r.createdAt, today)).length,
    topCategory: cat[0]?.label ?? "-",
    needRerouting: records.filter(
      (r) =>
        r.reroutingStatus === "Baru" || r.reroutingStatus === "Perlu Review"
    ).length,
    biBicara: countResult("BI Bicara"),
    lapsSjk: countResult("LAPS SJK"),
    outsideBI: countResult("Di Luar Kewenangan BI"),
  };
}
