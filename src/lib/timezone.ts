/** WITA (Waktu Indonesia Tengah) — UTC+8, zona waktu operasional KPwBI Sulut. */
export const WITA_TIMEZONE = "Asia/Makassar";

const WITA_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

function toDate(date: string | Date): Date {
  return typeof date === "string" ? new Date(date) : date;
}

function readWitaParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: WITA_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

/** WITA calendar parts and compact date key `YYYY-MM-DD`. */
export function getWitaParts(date: string | Date): {
  year: number;
  month: number;
  day: number;
  dateKey: string;
} {
  const { year, month, day } = readWitaParts(toDate(date));
  const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return { year, month, day, dateKey };
}

/** Calendar day key `YYYY-MM-DD` in WITA for grouping and filters. */
export function getWitaDateKey(date: string | Date): string {
  return getWitaParts(date).dateKey;
}

/** Compact `YYYYMMDD` in WITA for interaction IDs. */
export function getWitaCompactDateKey(date: string | Date = new Date()): string {
  const { year, month, day } = getWitaParts(date);
  return `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
}

/** Display: `02 Jul 2026, 14.30 WITA` */
export function formatWitaDateTime(date: string | Date): string {
  const d = toDate(date);
  const { year, month, day, hour, minute } = readWitaParts(d);
  const monthLabel = WITA_MONTHS[month - 1] ?? String(month);
  const dayLabel = String(day).padStart(2, "0");
  const hourLabel = String(hour).padStart(2, "0");
  const minuteLabel = String(minute).padStart(2, "0");
  return `${dayLabel} ${monthLabel} ${year}, ${hourLabel}.${minuteLabel} WITA`;
}

export function isSameWitaDay(
  date: string | Date,
  reference: Date = new Date()
): boolean {
  return getWitaDateKey(date) === getWitaDateKey(reference);
}

export function isSameWitaMonth(
  date: string | Date,
  reference: Date = new Date()
): boolean {
  const a = getWitaParts(date);
  const b = getWitaParts(reference);
  return a.year === b.year && a.month === b.month;
}

export function isSameWitaYear(
  date: string | Date,
  reference: Date = new Date()
): boolean {
  return getWitaParts(date).year === getWitaParts(reference).year;
}

/** @deprecated Use getWitaDateKey */
export function getWitaDayKey(iso: string): string {
  return getWitaDateKey(iso);
}

/** Label `d/m` for chart axis in WITA. */
export function formatWitaChartDay(date: Date): string {
  const { day, month } = getWitaParts(date);
  return `${day}/${month}`;
}

/** Shift a reference date by `days` (calendar days in local JS Date). */
export function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getWitaTimestampFields(iso: string = new Date().toISOString()) {
  const { year, month, day } = getWitaParts(iso);
  return {
    createdAt: iso,
    createdAtWita: formatWitaDateTime(iso),
    yearWita: year,
    monthWita: month,
    dayWita: String(day).padStart(2, "0"),
  };
}
