import type { ApisAnswerSource as RoutingApisSource } from "@/lib/apisRouting";
import type {
  ApisAnswerSource,
  InteractionCapturePayload,
  InteractionRecord,
  InteractionStatus,
  ReroutingUnit,
} from "@/types/interactions";
import {
  isReroutingUnit,
  normalizeInteractionChannel,
} from "@/types/interactions";

type LegacyInteraction = InteractionRecord & {
  resultRecommendation?: string;
  location?: string;
  assignedUnit?: string;
  notes?: string;
  reviewed?: boolean;
  demographic?: { ageRange?: string; gender?: string };
};

export function mapApisSource(
  source?: RoutingApisSource
): ApisAnswerSource | undefined {
  switch (source) {
    case "faq":
      return "FAQ_BLOOM";
    case "mixed":
      return "FAQ_PARTIAL_WITH_ROUTING";
    case "authority":
      return "AUTHORITY_ROUTING";
    case "clarification":
      return "CLARIFICATION";
    default:
      return undefined;
  }
}

export function deriveRoutingFlags(recommendation?: string) {
  const text = recommendation ?? "";
  return {
    outsideBiAuthority: text.includes("Di Luar Kewenangan BI"),
    directedToBiBicara: text.includes("BI Bicara"),
    isWithinBiAuthority:
      !text.includes("Di Luar Kewenangan BI") &&
      !text.includes("LAPS SJK") &&
      text.length > 0,
  };
}

export function deriveInteractionStatus(
  recommendation?: string,
  reviewed?: boolean
): InteractionStatus {
  if (reviewed) return "Selesai";
  if ((recommendation ?? "").includes("Di Luar Kewenangan BI")) return "Baru";
  return "Selesai";
}

function normalizeReroutingUnit(
  value?: string
): ReroutingUnit | undefined {
  if (!value) return undefined;
  return isReroutingUnit(value) ? value : undefined;
}

export function normalizeInteractionRecord(
  raw: LegacyInteraction
): InteractionRecord {
  const channel = normalizeInteractionChannel(String(raw.channel ?? "FAQ"));
  const recommendation =
    raw.recommendation ?? raw.resultRecommendation ?? undefined;

  const routing = deriveRoutingFlags(recommendation);
  const status =
    raw.status ??
    deriveInteractionStatus(recommendation, raw.reviewed) ??
    (raw.outsideBiAuthority ? "Baru" : "Selesai");

  let province = raw.province;
  let cityOrRegency = raw.cityOrRegency;
  if (!province && !cityOrRegency && raw.location) {
    const parts = raw.location.split(",").map((part) => part.trim());
    if (parts.length >= 2) {
      cityOrRegency = parts[0];
      province = parts.slice(1).join(", ");
    } else {
      province = raw.location;
    }
  }

  return {
    id: raw.id,
    channel,
    createdAt: raw.createdAt,
    createdAtWita: raw.createdAtWita,
    yearWita: raw.yearWita,
    monthWita: raw.monthWita,
    dayWita: raw.dayWita,
    consumerName: raw.consumerName,
    phone: raw.phone,
    email: raw.email,
    province,
    cityOrRegency,
    category: raw.category,
    organizerField: raw.organizerField,
    answers: raw.answers,
    answerSummary: raw.answerSummary,
    recommendation,
    resultKey: raw.resultKey,
    isCompleted: raw.isCompleted ?? Boolean(recommendation || raw.query),
    isWithinBiAuthority: raw.isWithinBiAuthority ?? routing.isWithinBiAuthority,
    directedToBiBicara: raw.directedToBiBicara ?? routing.directedToBiBicara,
    outsideBiAuthority: raw.outsideBiAuthority ?? routing.outsideBiAuthority,
    query: raw.query,
    matchedFaqId: raw.matchedFaqId,
    matchedFaqQuestion: raw.matchedFaqQuestion,
    faqCategory: raw.faqCategory ?? (channel === "FAQ" ? raw.category : undefined),
    apisSource: raw.apisSource,
    matchedAuthorityRouteId: raw.matchedAuthorityRouteId,
    needsKnowledgeReview: raw.needsKnowledgeReview,
    status,
    reroutingUnit:
      normalizeReroutingUnit(raw.reroutingUnit) ??
      normalizeReroutingUnit(raw.assignedUnit),
    reroutingStatus: raw.reroutingStatus,
    analystNote: raw.analystNote ?? raw.notes,
    updatedAt: raw.updatedAt,
  };
}

export function buildCaptureRecord(
  payload: InteractionCapturePayload,
  meta: Pick<
    InteractionRecord,
    | "id"
    | "createdAt"
    | "createdAtWita"
    | "yearWita"
    | "monthWita"
    | "dayWita"
  >
): InteractionRecord {
  const recommendation = payload.recommendation;
  const routing = deriveRoutingFlags(recommendation);

  return normalizeInteractionRecord({
    ...payload,
    ...meta,
    recommendation,
    outsideBiAuthority: payload.outsideBiAuthority ?? routing.outsideBiAuthority,
    directedToBiBicara: payload.directedToBiBicara ?? routing.directedToBiBicara,
    isWithinBiAuthority:
      payload.isWithinBiAuthority ?? routing.isWithinBiAuthority,
    status:
      payload.status ??
      (routing.outsideBiAuthority ? "Baru" : ("Selesai" as const)),
    isCompleted: payload.isCompleted ?? true,
    needsKnowledgeReview:
      payload.needsKnowledgeReview ??
      recommendation === "Tidak ditemukan di FAQ",
  });
}
