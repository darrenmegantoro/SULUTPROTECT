// Lightweight, privacy-safe capture of public interactions into the prototype
// store so the admin dashboard can show sample monitoring data. No personal
// data is collected — only channel, category, query/answer summary, result,
// and randomized mock location/demographic values.

import type { InteractionChannel, InteractionRecord } from "@/types/admin";
import {
  AGE_RANGES,
  GENDERS,
  SULUT_LOCATIONS,
} from "@/data/adminConfig";
import {
  ensureSeeded,
  getInteractions,
  saveInteractions,
} from "@/lib/adminStore";
import { uid } from "@/lib/utils";

type CapturePayload = {
  channel: InteractionChannel;
  category?: string;
  query?: string;
  answerSummary?: string[];
  resultRecommendation?: string;
  location?: string;
};

function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function captureInteraction(payload: CapturePayload): void {
  if (typeof window === "undefined") return;
  ensureSeeded();

  const outsideBI = (payload.resultRecommendation ?? "").includes(
    "Di Luar Kewenangan BI"
  );

  const record: InteractionRecord = {
    id: uid("INT"),
    createdAt: new Date().toISOString(),
    channel: payload.channel,
    category: payload.category,
    query: payload.query,
    answerSummary: payload.answerSummary,
    resultRecommendation: payload.resultRecommendation,
    // Use coarse location from the form when provided; otherwise mock for demo.
    location: payload.location ?? randomOf(SULUT_LOCATIONS),
    demographic: {
      ageRange: randomOf(AGE_RANGES),
      gender: randomOf(GENDERS),
    },
    reroutingStatus: outsideBI ? "Baru" : "Selesai",
    reviewed: false,
  };

  saveInteractions([record, ...getInteractions()].slice(0, 500));
}
