// FAQ domain types. The FAQ dataset is the single source of truth used by the

// FAQ accordion, FAQ search, chatbot retrieval, and Guided Form related links.



import type { FaqBloomItem, StructuredApisAnswer } from "@/types/faqBloom";
import type { AuthorityStructuredAnswer } from "@/lib/apisRouting";
import type { AuthorityAction } from "@/data/authorityRouting";
import type { ApisAnswerSource } from "@/lib/apisRouting";



export type FAQFocus =

  | "Ketidakpahaman Konsumen"

  | "Sengketa dengan Lembaga Keuangan"

  | "Pelanggaran Ketentuan"

  | "Kerugian Konsumen";



export type FAQSource =

  | "Ketentuan ASPI"

  | "PADG Nomor 20 Tahun 2023"

  | "PADGI Nomor 19 Tahun 2024";



export type FAQItem = {

  id: string;

  no: number;

  source: string;

  focus: string;

  question: string;

  answer: string;

  reference?: string;

  keywords?: string[];

  bloom?: FaqBloomItem;

};



// Related CTA that can be attached to chatbot answers or FAQ items.

export type RelatedCTA = {

  label: string;

  href: string;

};



// Message shape used by the Asisten chatbot.

export type ChatRole = "user" | "assistant";



export type ChatMessage = {

  id: string;

  role: ChatRole;

  content: string;

  source?: string;

  reference?: string;

  relatedCTA?: RelatedCTA;

  relatedQuestions?: string[];

  structuredAnswer?: StructuredApisAnswer;

  authorityAnswer?: AuthorityStructuredAnswer;

  answerSource?: ApisAnswerSource;

  suggestedActions?: AuthorityAction[];

  // "fallback" lets the UI render the helper actions for unmatched questions.

  variant?: "answer" | "authority" | "mixed" | "clarification" | "fallback" | "welcome";

};


