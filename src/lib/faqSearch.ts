import Fuse from "fuse.js";
import { FAQ_ITEMS } from "@/data/faq";
import { EXTERNAL_LINKS } from "@/data/links";
import type { FAQItem, RelatedCTA } from "@/types/faq";

// Fuse.js configuration. Lower score == better match.
const fuse = new Fuse<FAQItem>(FAQ_ITEMS, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.45,
  minMatchCharLength: 2,
  keys: [
    { name: "question", weight: 0.4 },
    { name: "keywords", weight: 0.25 },
    { name: "answer", weight: 0.2 },
    { name: "focus", weight: 0.05 },
    { name: "source", weight: 0.05 },
    { name: "reference", weight: 0.05 },
  ],
});

// Confidence threshold for returning a single confident answer (section 17).
const CONFIDENT_SCORE = 0.35;

export function searchFaq(query: string): FAQItem[] {
  const q = query.trim();
  if (!q) return FAQ_ITEMS;
  return fuse.search(q).map((r) => r.item);
}

// Derive an optional related CTA for an FAQ item based on its content.
export function getRelatedCTA(item: FAQItem): RelatedCTA | undefined {
  const haystack = `${item.question} ${item.answer}`.toLowerCase();
  if (haystack.includes("laps")) {
    return { label: "Lihat LAPS SJK", href: EXTERNAL_LINKS.lapsSjk };
  }
  if (
    haystack.includes("bi bicara") ||
    haystack.includes("131") ||
    haystack.includes("call center")
  ) {
    return { label: "Hubungi BI Bicara", href: EXTERNAL_LINKS.biBicara };
  }
  return undefined;
}

export type ChatbotResult =
  | { type: "answer"; item: FAQItem; cta?: RelatedCTA }
  | { type: "clarification"; relatedQuestions: string[] }
  | { type: "fallback" };

// Retrieval-based chatbot logic (no generation/hallucination).
export function getChatbotResponse(query: string): ChatbotResult {
  const q = query.trim();
  if (!q) return { type: "fallback" };

  const matches = fuse.search(q);
  const best = matches[0];

  if (best && best.score !== undefined && best.score <= CONFIDENT_SCORE) {
    return { type: "answer", item: best.item, cta: getRelatedCTA(best.item) };
  }

  if (matches.length > 0) {
    return {
      type: "clarification",
      relatedQuestions: matches.slice(0, 3).map((m) => m.item.question),
    };
  }

  return { type: "fallback" };
}

// Resolve a suggested-question chip (or clarification chip) back to its item.
export function findItemByQuestion(question: string): FAQItem | undefined {
  return FAQ_ITEMS.find((item) => item.question === question);
}
