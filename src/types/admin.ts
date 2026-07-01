// Domain types for the Integrated Dashboard Monitoring Terintegrasi prototype.
// Interaction data is persisted in localStorage via interactionStore; structured
// so it can later be swapped for a real database/API.

export type {
  InteractionChannel,
  InteractionRecord,
  InteractionStatus,
  ApisAnswerSource,
  InteractionAnswer,
  ReroutingUnit,
  InteractionCapturePayload,
} from "@/types/interactions";

export type ContentStatus = "Draft" | "Published" | "Archived";

export type AdminFAQItem = {
  id: string;
  focus: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  source?: string;
  reference?: string;
  status: ContentStatus;
  active: boolean;
  updatedAt: string;
};

export type AdminFormOption = {
  label: string;
  description?: string;
  value: string;
};

export type AdminFormQuestion = {
  id: string;
  stepNumber: number;
  questionText: string;
  helperText?: string;
  options?: AdminFormOption[];
  logicKey: string;
  status: ContentStatus;
  active: boolean;
  versionNote?: string;
  updatedAt: string;
};

export type AuditEntry = {
  id: string;
  at: string; // ISO timestamp
  actor: string;
  action: string;
  target: string;
  detail?: string;
};

export type AdminSettings = {
  profileName: string;
  profileEmail: string;
  units: string[];
  categories: string[];
  links: {
    biBicara: string;
    lapsSjk: string;
    cekPenyelenggara: string;
  };
  heroBackgroundPath: string;
  contact: {
    officeName: string;
    address: string;
    cityPostal: string;
    phone: string;
    fax: string;
  };
};

export type AuthState = {
  email: string;
  loggedInAt: string;
};
