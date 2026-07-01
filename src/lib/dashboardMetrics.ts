import type { InteractionRecord } from "@/types/interactions";
import {
  isSameWitaDay,
  isSameWitaMonth,
  isSameWitaYear,
} from "@/lib/timezone";

export type Bucket = { label: string; value: number };

export type DashboardKpis = {
  totalInteraksi: number;
  totalTahunIni: number;
  totalBulanIni: number;
  totalHariIni: number;
  kategoriTerbanyak: string;
  lokasiTerpantau: string;
  diLuarKewenanganBi: number;
  diarahkanKeBiBicara: number;
};

export function getFormulirRecords(
  records: InteractionRecord[]
): InteractionRecord[] {
  return records.filter(
    (record) =>
      record.channel === "Formulir" &&
      (Boolean(record.consumerName?.trim()) ||
        Boolean(record.answers && record.answers.length > 0))
  );
}

function isOutsideBiAuthority(record: InteractionRecord): boolean {
  if (record.outsideBiAuthority) return true;
  if (record.resultKey === "B") return true;
  return (record.recommendation ?? "").includes("Di Luar Kewenangan BI");
}

function isDirectedToBiBicara(record: InteractionRecord): boolean {
  if (!record.isCompleted) return false;
  if (record.directedToBiBicara) return true;
  if (record.resultKey === "A" || record.resultKey === "J") return true;
  return (record.recommendation ?? "").includes("BI Bicara");
}

function tally(
  records: InteractionRecord[],
  keyFn: (record: InteractionRecord) => string | undefined
): Bucket[] {
  const map = new Map<string, number>();
  for (const record of records) {
    const key = keyFn(record)?.trim();
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export function computeDashboardKpis(
  records: InteractionRecord[],
  reference: Date = new Date()
): DashboardKpis {
  const formulir = getFormulirRecords(records);

  const categoryBuckets = tally(formulir, (record) => record.category);
  const provinces = new Set(
    formulir
      .map((record) => record.province?.trim())
      .filter((value): value is string => Boolean(value))
  );

  return {
    totalInteraksi: formulir.length,
    totalTahunIni: formulir.filter((record) =>
      isSameWitaYear(record.createdAt, reference)
    ).length,
    totalBulanIni: formulir.filter((record) =>
      isSameWitaMonth(record.createdAt, reference)
    ).length,
    totalHariIni: formulir.filter((record) =>
      isSameWitaDay(record.createdAt, reference)
    ).length,
    kategoriTerbanyak:
      categoryBuckets.length > 0 ? categoryBuckets[0].label : "Belum ada data",
    lokasiTerpantau:
      provinces.size > 0 ? String(provinces.size) : "Belum ada data",
    diLuarKewenanganBi: formulir.filter(isOutsideBiAuthority).length,
    diarahkanKeBiBicara: formulir.filter(isDirectedToBiBicara).length,
  };
}

export function categoryDistribution(records: InteractionRecord[]): Bucket[] {
  return tally(getFormulirRecords(records), (record) => record.category);
}

export function provinceDistribution(records: InteractionRecord[]): Bucket[] {
  return tally(getFormulirRecords(records), (record) => record.province);
}
