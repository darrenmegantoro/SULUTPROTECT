/**
 * Prototype interaction persistence (localStorage).
 * Replace this module with Supabase / Firebase / Vercel KV / REST API later.
 */

import type { InteractionRecord } from "@/types/interactions";
import type { InteractionCapturePayload } from "@/types/interactions";
import {
  INTERACTION_STORAGE_KEY,
  INTERACTION_STORE_VERSION,
  INTERACTION_STORE_VERSION_KEY,
  isLiveInteraction,
  isMockInteraction,
} from "@/types/interactions";
import { buildCaptureRecord, normalizeInteractionRecord } from "@/lib/interactionNormalize";
import { getWitaTimestampFields } from "@/lib/timezone";
import { uid } from "@/lib/utils";

const MAX_RECORDS = 500;
const isBrowser = () => typeof window !== "undefined";

function notifyChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event("sp-admin-change"));
}

function readRaw(): InteractionRecord[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(INTERACTION_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as InteractionRecord[]) : [];
    return parsed
      .map((record) => normalizeInteractionRecord(record))
      .filter(isLiveInteraction);
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
    notifyChange();
  } catch {
    // Ignore quota errors in the prototype.
  }
}

/** Remove legacy mock rows and normalize schema on upgrade. */
export function migrateInteractionStore(): void {
  if (!isBrowser()) return;

  const version = Number(
    window.localStorage.getItem(INTERACTION_STORE_VERSION_KEY) ?? "0"
  );

  if (version >= INTERACTION_STORE_VERSION) return;

  let records: InteractionRecord[] = [];
  try {
    const raw = window.localStorage.getItem(INTERACTION_STORAGE_KEY);
    records = raw ? (JSON.parse(raw) as InteractionRecord[]) : [];
  } catch {
    records = [];
  }

  const normalized = records
    .filter((record) => !isMockInteraction(record))
    .map((record) => normalizeInteractionRecord(record));

  writeRaw(normalized);
  window.localStorage.setItem(
    INTERACTION_STORE_VERSION_KEY,
    String(INTERACTION_STORE_VERSION)
  );
}

export function ensureInteractionStore(): void {
  if (!isBrowser()) return;

  if (!window.localStorage.getItem(INTERACTION_STORAGE_KEY)) {
    writeRaw([]);
  }

  migrateInteractionStore();
}

export function listInteractions(): InteractionRecord[] {
  ensureInteractionStore();
  return readRaw();
}

export function listFormulirInteractions(): InteractionRecord[] {
  return listInteractions().filter((record) => record.channel === "Formulir");
}

export function appendInteraction(
  payload: InteractionCapturePayload
): InteractionRecord {
  ensureInteractionStore();

  const createdAt = new Date().toISOString();
  const record = buildCaptureRecord(payload, {
    id: uid("INT"),
    ...getWitaTimestampFields(createdAt),
  });

  writeRaw([record, ...readRaw()]);
  return record;
}

export function saveInteractions(records: InteractionRecord[]): void {
  ensureInteractionStore();
  writeRaw(records.map((record) => normalizeInteractionRecord(record)));
}

export function updateInteractionRecord(
  id: string,
  patch: Partial<InteractionRecord>
): InteractionRecord | null {
  const list = readRaw();
  const index = list.findIndex((record) => record.id === id);
  if (index < 0) return null;

  list[index] = normalizeInteractionRecord({ ...list[index], ...patch });
  writeRaw(list);
  return list[index];
}

export function clearAllInteractions(): void {
  writeRaw([]);
}
