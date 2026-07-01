export type InteractionChannel = "Formulir" | "FAQ" | "APIS";

export type ApisAnswerSource =
  | "FAQ_BLOOM"
  | "FAQ_PARTIAL_WITH_ROUTING"
  | "AUTHORITY_ROUTING"
  | "CLARIFICATION";

export type InteractionStatus = "Baru" | "Selesai" | "Perlu Tindak Lanjut";

export type ReroutingUnit =
  | "FPKP"
  | "FDSEK"
  | "FPPUKIS"
  | "UK"
  | "FIKSP"
  | "PUR"
  | "MI"
  | "ICO"
  | "PM";

export const REROUTING_UNITS: ReroutingUnit[] = [
  "FPKP",
  "FDSEK",
  "FPPUKIS",
  "UK",
  "FIKSP",
  "PUR",
  "MI",
  "ICO",
  "PM",
];

export const INTERACTION_STATUSES: InteractionStatus[] = [
  "Baru",
  "Perlu Tindak Lanjut",
  "Selesai",
];

export type InteractionAnswer = {
  questionId: string;
  questionText: string;
  answer: string;
};

export type InteractionRecord = {
  id: string;
  channel: InteractionChannel;
  createdAt: string;
  createdAtWita?: string;
  yearWita?: number;
  monthWita?: number;
  dayWita?: string;

  consumerName?: string;
  phone?: string;
  email?: string;
  province?: string;
  cityOrRegency?: string;

  category?: string;
  organizerField?: string;
  answers?: InteractionAnswer[];
  answerSummary?: string[];

  recommendation?: string;
  resultKey?: string;
  isCompleted?: boolean;
  isWithinBiAuthority?: boolean;
  directedToBiBicara?: boolean;
  outsideBiAuthority?: boolean;

  query?: string;
  matchedFaqId?: string;
  matchedFaqQuestion?: string;
  apisSource?: ApisAnswerSource;
  matchedAuthorityRouteId?: string;
  needsKnowledgeReview?: boolean;

  status?: InteractionStatus;
  reroutingUnit?: ReroutingUnit;
  reroutingStatus?: string;
  analystNote?: string;
};

/** Payload from public website before persistence adds id and WITA timestamps. */
export type InteractionCapturePayload = Omit<
  InteractionRecord,
  "id" | "createdAt" | "createdAtWita" | "yearWita" | "monthWita" | "dayWita"
>;

export const INTERACTION_STORAGE_KEY = "sp_admin_interactions";
export const INTERACTION_STORE_VERSION_KEY = "sp_interaction_store_version";
export const INTERACTION_STORE_VERSION = 4;

export const MOCK_INTERACTION_ID_PATTERN = /^INT-\d{4}$/;

const REROUTING_UNIT_SET = new Set<string>(REROUTING_UNITS);

export function isReroutingUnit(value: string): value is ReroutingUnit {
  return REROUTING_UNIT_SET.has(value);
}

export function isMockInteraction(record: InteractionRecord): boolean {
  return MOCK_INTERACTION_ID_PATTERN.test(record.id);
}

export function isLiveInteraction(record: InteractionRecord): boolean {
  return !isMockInteraction(record);
}

export function isFormulirInteraction(record: InteractionRecord): boolean {
  return record.channel === "Formulir";
}

export function getInteractionLocation(
  record: InteractionRecord
): string | undefined {
  if (record.cityOrRegency && record.province) {
    return `${record.cityOrRegency}, ${record.province}`;
  }
  return record.province ?? record.cityOrRegency;
}

export function normalizeInteractionChannel(
  channel: string
): InteractionChannel {
  if (channel === "Asisten") return "APIS";
  if (channel === "Formulir" || channel === "FAQ" || channel === "APIS") {
    return channel;
  }
  return "FAQ";
}
