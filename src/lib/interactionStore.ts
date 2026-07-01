/**
 * Prototype interaction persistence (localStorage).
 * Single key: sulutProtectInteractions
 */

import type {
  InteractionChannel,
  InteractionRecord,
  ReroutingUnit,
} from "@/types/interactions";
import {
  DASHBOARD_DATA_VERSION,
  DASHBOARD_DATA_VERSION_KEY,
  INTERACTION_CHANGE_EVENT,
  INTERACTION_STORAGE_KEY,
  LEGACY_INTERACTION_KEYS,
} from "@/types/interactions";
import { normalizeInteractionRecord } from "@/lib/interactionNormalize";
import {
  formatWitaDateTime,
  getWitaCompactDateKey,
  getWitaTimestampFields,
} from "@/lib/timezone";

const MAX_RECORDS = 500;
const isBrowser = () => typeof window !== "undefined";

let migrationDone = false;

const CHANNEL_ID_PREFIX: Record<InteractionChannel, string> = {
  Formulir: "FORM",
  FAQ: "FAQ",
  APIS: "CHTB",
};

export function generateInteractionId(
  channel: InteractionChannel,
  existingRecords: InteractionRecord[]
): string {
  const prefix = CHANNEL_ID_PREFIX[channel];
  const datePart = getWitaCompactDateKey();
  const sameDay = existingRecords.filter((record) =>
    record.id.startsWith(`${prefix}-${datePart}-`)
  );
  const maxSeq = sameDay.reduce((max, record) => {
    const seq = Number(record.id.split("-").pop() ?? "0");
    return Number.isFinite(seq) ? Math.max(max, seq) : max;
  }, 0);
  return `${prefix}-${datePart}-${String(maxSeq + 1).padStart(4, "0")}`;
}

export function notifyInteractionChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(INTERACTION_CHANGE_EVENT));
  window.dispatchEvent(new Event("sp-admin-change"));
}

export function subscribeToInteractionChanges(
  callback: () => void
): () => void {
  if (!isBrowser()) return () => undefined;

  const onCustom = () => callback();
  const onStorage = (event: StorageEvent) => {
    if (event.key === INTERACTION_STORAGE_KEY) callback();
  };

  window.addEventListener(INTERACTION_CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(INTERACTION_CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function runDashboardDataMigration(): void {
  if (!isBrowser() || migrationDone) return;

  const current = window.localStorage.getItem(DASHBOARD_DATA_VERSION_KEY);
  if (current === DASHBOARD_DATA_VERSION) {
    migrationDone = true;
    return;
  }

  LEGACY_INTERACTION_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
  window.localStorage.setItem(DASHBOARD_DATA_VERSION_KEY, DASHBOARD_DATA_VERSION);
  migrationDone = true;
  notifyInteractionChange();
}

function readRaw(): InteractionRecord[] {
  if (!isBrowser()) return [];
  runDashboardDataMigration();

  try {
    const raw = window.localStorage.getItem(INTERACTION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InteractionRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((record) => normalizeInteractionRecord(record));
  } catch {
    return [];
  }
}

function writeRaw(records: InteractionRecord[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(
      INTERACTION_STORAGE_KEY,
      JSON.stringify(records.slice(0, MAX_RECORDS))
    );
    notifyInteractionChange();
  } catch {
    // Ignore quota errors in the prototype.
  }
}

export function getInteractions(): InteractionRecord[] {
  return readRaw();
}

export function getInteractionById(
  id: string
): InteractionRecord | undefined {
  return readRaw().find((record) => record.id === id);
}

export function createInteraction(
  input: Partial<InteractionRecord> & { channel: InteractionChannel }
): InteractionRecord {
  runDashboardDataMigration();
  const existing = readRaw();
  const createdAt = new Date().toISOString();
  const record = normalizeInteractionRecord({
    status: "Baru",
    ...input,
    id: generateInteractionId(input.channel, existing),
    ...getWitaTimestampFields(createdAt),
  });

  writeRaw([record, ...existing]);
  return record;
}

export function updateInteraction(
  id: string,
  patch: Partial<InteractionRecord>
): InteractionRecord | undefined {
  const list = readRaw();
  const index = list.findIndex((record) => record.id === id);
  if (index < 0) return undefined;

  const updated = normalizeInteractionRecord({
    ...list[index],
    ...patch,
    updatedAt: new Date().toISOString(),
    createdAtWita:
      list[index].createdAtWita ??
      formatWitaDateTime(list[index].createdAt),
  });
  list[index] = updated;
  writeRaw(list);
  return updated;
}

export function rerouteInteraction(
  id: string,
  unit: ReroutingUnit,
  analystNote?: string
): InteractionRecord | undefined {
  return updateInteraction(id, {
    reroutingUnit: unit,
    reroutingStatus: `Rerouting ke ${unit}`,
    status: "Perlu Tindak Lanjut",
    analystNote: analystNote?.trim() || undefined,
  });
}

export function resetInteractions(): void {
  writeRaw([]);
}

export function saveInteractions(records: InteractionRecord[]): void {
  writeRaw(records.map((record) => normalizeInteractionRecord(record)));
}

/** @deprecated Use getInteractions */
export function listInteractions(): InteractionRecord[] {
  return getInteractions();
}

/** @deprecated Use createInteraction */
export function appendInteraction(
  payload: Partial<InteractionRecord> & { channel: InteractionChannel }
): InteractionRecord {
  return createInteraction(payload);
}

/** @deprecated Use resetInteractions */
export function clearAllInteractions(): void {
  resetInteractions();
}

/** @deprecated Use runDashboardDataMigration */
export function ensureInteractionStore(): void {
  runDashboardDataMigration();
}

/** @deprecated Use updateInteraction */
export function updateInteractionRecord(
  id: string,
  patch: Partial<InteractionRecord>
): InteractionRecord | null {
  return updateInteraction(id, patch) ?? null;
}

/** @deprecated Use resetInteractions */
export function migrateInteractionStore(): void {
  runDashboardDataMigration();
}
