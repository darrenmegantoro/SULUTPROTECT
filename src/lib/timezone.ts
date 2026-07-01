/** WITA (Waktu Indonesia Tengah) — UTC+8, zona waktu operasional KPwBI Sulut. */
export const WITA_TIMEZONE = "Asia/Makassar";

type WitaDateParts = {
  year: number;
  month: number;
  day: number;
};

function getWitaDateParts(date: Date): WitaDateParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: WITA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
  };
}

/** Format ISO timestamp for display in WITA. */
export function formatWitaDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    timeZone: WITA_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** Whether an ISO timestamp falls on the same calendar day as `ref` in WITA. */
export function isSameWitaDay(iso: string, ref: Date = new Date()): boolean {
  const a = getWitaDateParts(new Date(iso));
  const b = getWitaDateParts(ref);
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/** Calendar day key `YYYY-MM-DD` in WITA for grouping. */
export function getWitaDayKey(iso: string): string {
  const { year, month, day } = getWitaDateParts(new Date(iso));
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Label `d/m` for chart axis in WITA. */
export function formatWitaChartDay(date: Date): string {
  const { day, month } = getWitaDateParts(date);
  return `${day}/${month}`;
}

/** Shift a reference date by `days` (calendar days in local JS Date; chart buckets use WITA keys). */
export function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getWitaTimestampFields(iso: string = new Date().toISOString()) {
  const date = new Date(iso);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: WITA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);
  const year = read("year");
  const month = read("month");
  const day = read("day");

  return {
    createdAt: iso,
    createdAtWita: formatWitaDateTime(iso),
    yearWita: year,
    monthWita: month,
    dayWita: String(day).padStart(2, "0"),
  };
}
