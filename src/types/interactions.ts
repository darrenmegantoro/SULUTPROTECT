export type InteractionChannel = "Formulir" | "FAQ" | "APIS";

export type ApisAnswerSource =
  | "FAQ_BLOOM"
  | "FAQ_PARTIAL_WITH_ROUTING"
  | "AUTHORITY_ROUTING"
  | "CLARIFICATION";

export type InteractionStatus =
  | "Baru"
  | "Selesai"
  | "Perlu Tindak Lanjut";

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
  faqCategory?: string;
  apisSource?: ApisAnswerSource;
  matchedAuthorityRouteId?: string;
  needsKnowledgeReview?: boolean;

  status?: InteractionStatus;
  reroutingUnit?: ReroutingUnit;
  reroutingStatus?: string;
  analystNote?: string;
  updatedAt?: string;
};

/** Payload before persistence adds id and WITA timestamps. */
export type InteractionCapturePayload = Omit<
  InteractionRecord,
  "id" | "createdAt" | "createdAtWita" | "yearWita" | "monthWita" | "dayWita"
>;

export const INTERACTION_STORAGE_KEY = "sulutProtectInteractions";
export const DASHBOARD_DATA_VERSION_KEY = "sulutProtectDashboardDataVersion";
export const DASHBOARD_DATA_VERSION = "v2-real-localstorage-clean-start";

export const INTERACTION_CHANGE_EVENT = "sulutProtectInteractionsChanged";

/** Legacy and mock keys cleared during one-time migration. */
export const LEGACY_INTERACTION_KEYS = [
  INTERACTION_STORAGE_KEY,
  "sp_admin_interactions",
  "sulutProtectMockInteractions",
  "sulutProtectDashboardMockData",
  "dashboardInteractions",
  "mockInteractions",
  "adminInteractions",
  "sulutProtectAdminInteractions",
  "faqInteractions",
  "apisInteractions",
  "formInteractions",
  "sp_interaction_store_version",
] as const;

const REROUTING_UNIT_SET = new Set<string>(REROUTING_UNITS);

export function isReroutingUnit(value: string): value is ReroutingUnit {
  return REROUTING_UNIT_SET.has(value);
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
