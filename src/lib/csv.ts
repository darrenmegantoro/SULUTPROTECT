// Minimal CSV export for the prototype (client-side download).

function escapeCell(value: unknown): string {
  const str =
    value === null || value === undefined
      ? ""
      : Array.isArray(value)
        ? value.join(" | ")
        : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportToCsv(
  filename: string,
  rows: Array<Record<string, unknown>>,
  headers?: string[]
): void {
  if (typeof window === "undefined") return;

  const cols = headers ?? (rows[0] ? Object.keys(rows[0]) : []);
  const headerLine = cols.map(escapeCell).join(",");
  const body = rows
    .map((row) => cols.map((c) => escapeCell(row[c])).join(","))
    .join("\n");
  const csv = `${headerLine}\n${body}`;

  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
