// Guided Form domain types. The flow is a linear wizard (Q1-Q9) that can branch
// to one of eleven educational result cards (A-K).

export type ResultKey =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K";

export type QuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9";

export type ConsumerData = {
  nama: string;
  telepon: string;
  provinsi: string;
  kotaKabupaten: string;
  email: string;
};

export type QuestionKind = "choice" | "date" | "number";

export type GuidedOption = {
  value: string;
  label: string;
  description?: string;
};

export type GuidedQuestion = {
  id: QuestionId;
  step: number;
  kind: QuestionKind;
  question: string;
  helper?: string;
  note?: string;
  options?: GuidedOption[];
  // Free-form input metadata.
  placeholder?: string;
};

export type ResultBadgeTone =
  | "positive"
  | "warning"
  | "neutral"
  | "redirect";

export type ResultCTA = {
  label: string;
  // External URL (opens in a new tab).
  href?: string;
  // Internal route target (e.g. "/faq"), navigated with next/link.
  to?: string;
  // When true, this CTA opens the Asisten chatbot.
  askAsisten?: boolean;
};

export type ChecklistItem = {
  label: string;
  cta?: { label: string; href: string };
};

export type GuidedResult = {
  key: ResultKey;
  statusBadge: string;
  badgeTone: ResultBadgeTone;
  title: string;
  description: string;
  checklist?: ChecklistItem[];
  infoBadge?: string;
  note?: string;
  referralList?: { label: string; description: string }[];
  ctas: ResultCTA[];
  // Question sent to Asisten when the helper "Tanya Asisten" button is used.
  askQuestion: string;
  // Focus category used to pre-filter "Buka FAQ Terkait".
  relatedFocus?: string;
};

// The answer map keyed by question id.
export type GuidedAnswers = Partial<Record<QuestionId, string>>;
