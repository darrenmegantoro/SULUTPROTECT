// localStorage-backed prototype store for the Integrated Dashboard.
// Pure functions; SSR-safe (returns seeds when window is unavailable).
// Structured so the persistence layer can later be replaced by a real API.

import type {
  AdminFAQItem,
  AdminFormQuestion,
  AdminSettings,
  AuditEntry,
} from "@/types/admin";
import type { InteractionRecord } from "@/types/interactions";
import { FAQ_ITEMS, kategoriLabel } from "@/data/faq";
import { GUIDED_QUESTIONS } from "@/data/guidedForm";
import { DEFAULT_ADMIN_SETTINGS } from "@/data/adminConfig";
import {
  ensureInteractionStore,
  listInteractions,
  saveInteractions as persistInteractions,
  updateInteractionRecord,
} from "@/lib/interactionStore";
import { uid } from "@/lib/utils";

const KEYS = {
  faq: "sp_admin_faq",
  form: "sp_admin_form_questions",
  interactions: "sp_admin_interactions",
  settings: "sp_admin_settings",
  audit: "sp_admin_audit",
} as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("sp-admin-change"));
  } catch {
    // Ignore quota/serialization errors in the prototype.
  }
}

// ----- Seeds -------------------------------------------------------------

function seedFaq(): AdminFAQItem[] {
  const now = new Date().toISOString();
  return FAQ_ITEMS.map((item) => ({
    id: item.id,
    focus: item.focus,
    category: kategoriLabel(item.focus),
    question: item.question,
    answer: item.answer,
    keywords: item.keywords ?? [],
    source: item.source,
    reference: item.reference,
    status: "Published",
    active: true,
    updatedAt: now,
  }));
}

function seedFormQuestions(): AdminFormQuestion[] {
  const now = new Date().toISOString();
  return GUIDED_QUESTIONS.map((q) => ({
    id: q.id,
    stepNumber: q.step,
    questionText: q.question,
    helperText: q.helper,
    options: q.options?.map((o) => ({
      label: o.label,
      description: o.description,
      value: o.value,
    })),
    logicKey: q.id,
    status: "Published",
    active: true,
    updatedAt: now,
  }));
}

// ----- Ensure seeded -----------------------------------------------------

export function ensureSeeded(): void {
  if (!isBrowser()) return;
  ensureInteractionStore();
  if (!window.localStorage.getItem(KEYS.faq)) write(KEYS.faq, seedFaq());
  if (!window.localStorage.getItem(KEYS.form))
    write(KEYS.form, seedFormQuestions());
  if (!window.localStorage.getItem(KEYS.settings))
    write(KEYS.settings, DEFAULT_ADMIN_SETTINGS);
  if (!window.localStorage.getItem(KEYS.audit)) write(KEYS.audit, []);
}

// ----- Audit -------------------------------------------------------------

export function getAudit(): AuditEntry[] {
  return read<AuditEntry[]>(KEYS.audit, []);
}

export function addAudit(entry: Omit<AuditEntry, "id" | "at">): void {
  const list = getAudit();
  const next: AuditEntry = {
    id: uid("audit"),
    at: new Date().toISOString(),
    ...entry,
  };
  write(KEYS.audit, [next, ...list].slice(0, 200));
}

// ----- FAQ ---------------------------------------------------------------

export function getFaqs(): AdminFAQItem[] {
  return read<AdminFAQItem[]>(KEYS.faq, []);
}

export function saveFaqs(list: AdminFAQItem[]): void {
  write(KEYS.faq, list);
}

export function upsertFaq(item: AdminFAQItem, actor: string): void {
  const list = getFaqs();
  const idx = list.findIndex((f) => f.id === item.id);
  const stamped = { ...item, updatedAt: new Date().toISOString() };
  if (idx >= 0) {
    list[idx] = stamped;
    addAudit({ actor, action: "FAQ diperbarui", target: item.question });
  } else {
    list.unshift(stamped);
    addAudit({ actor, action: "FAQ dibuat", target: item.question });
  }
  saveFaqs(list);
}

export function deleteFaq(id: string, actor: string): void {
  const list = getFaqs();
  const item = list.find((f) => f.id === id);
  saveFaqs(list.filter((f) => f.id !== id));
  if (item) addAudit({ actor, action: "FAQ dihapus", target: item.question });
}

// ----- Form questions ----------------------------------------------------

export function getFormQuestions(): AdminFormQuestion[] {
  return read<AdminFormQuestion[]>(KEYS.form, []).sort(
    (a, b) => a.stepNumber - b.stepNumber
  );
}

export function saveFormQuestions(list: AdminFormQuestion[]): void {
  write(KEYS.form, list);
}

export function updateFormQuestion(
  item: AdminFormQuestion,
  actor: string
): void {
  const list = getFormQuestions();
  const idx = list.findIndex((q) => q.id === item.id);
  if (idx >= 0) {
    list[idx] = { ...item, updatedAt: new Date().toISOString() };
    saveFormQuestions(list);
    addAudit({
      actor,
      action: "Pertanyaan formulir diperbarui",
      target: `Langkah ${item.stepNumber}`,
      detail: item.versionNote,
    });
  }
}

// ----- Interactions ------------------------------------------------------

export function getInteractions(): InteractionRecord[] {
  ensureSeeded();
  return listInteractions();
}

export function saveInteractions(list: InteractionRecord[]): void {
  persistInteractions(list);
}

export function updateInteraction(
  id: string,
  patch: Partial<InteractionRecord>,
  actor?: string,
  auditAction?: string
): void {
  const updated = updateInteractionRecord(id, patch);
  if (updated && actor && auditAction) {
    addAudit({ actor, action: auditAction, target: id });
  }
}

// ----- Settings ----------------------------------------------------------

export function getSettings(): AdminSettings {
  return read<AdminSettings>(KEYS.settings, DEFAULT_ADMIN_SETTINGS);
}

export function saveSettings(settings: AdminSettings, actor: string): void {
  write(KEYS.settings, settings);
  addAudit({ actor, action: "Pengaturan diperbarui", target: "Settings" });
}

// ----- Reset (utility) ---------------------------------------------------

export function resetStore(): void {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
  ensureSeeded();
}
