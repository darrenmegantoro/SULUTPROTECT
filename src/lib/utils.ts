// Small, dependency-free utilities shared across the app.

// Lightweight className combiner (avoids pulling in clsx/tailwind-merge).
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

// Format a numeric Rupiah value for display, e.g. 1500000 -> "Rp1.500.000".
export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Parse a user-entered Rupiah string (digits only) into a number.
export function parseRupiah(input: string): number {
  const digits = input.replace(/[^0-9]/g, "");
  return digits ? Number.parseInt(digits, 10) : 0;
}

// Difference in calendar days between today and a given ISO date string.
// Returns a positive number when the date is in the past.
export function calendarDaysSince(isoDate: string): number {
  const start = new Date(isoDate);
  if (Number.isNaN(start.getTime())) return 0;
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  // Normalize to midnight to avoid partial-day rounding noise.
  const startMid = Date.UTC(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const nowMid = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((nowMid - startMid) / msPerDay);
}

// Parse a user-entered "dd/mm/yyyy" string into a Date (or null when invalid).
// Validates real calendar dates (e.g. rejects 31/02/2026).
export function parseDmyToDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function isValidDmy(value: string): boolean {
  return parseDmyToDate(value) !== null;
}

// Auto-format digits into a "dd/mm/yyyy" mask as the user types.
export function maskDmy(input: string): string {
  const digits = input.replace(/[^0-9]/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  return parts.filter(Boolean).join("/");
}

// Calendar days between today and a "dd/mm/yyyy" date (positive when in past).
export function calendarDaysSinceDmy(value: string): number {
  const date = parseDmyToDate(value);
  if (!date) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const startMid = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const nowMid = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((nowMid - startMid) / msPerDay);
}

// Summarize a long FAQ answer into at most two short paragraphs for the
// chatbot, preserving meaning by truncating at sentence boundaries.
export function summarizeAnswer(answer: string, maxChars = 320): string {
  const trimmed = answer.trim();
  if (trimmed.length <= maxChars) return trimmed;

  // Keep whole sentences up to the limit.
  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) ?? [trimmed];
  let out = "";
  for (const sentence of sentences) {
    if ((out + sentence).length > maxChars) break;
    out += sentence;
  }
  if (!out) out = trimmed.slice(0, maxChars).trimEnd();
  return out.trim() + (out.length < trimmed.length ? " …" : "");
}

let idCounter = 0;
// Stable-ish unique id generator for client-side messages.
export function uid(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}
