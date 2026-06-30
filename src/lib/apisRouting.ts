import { faqBloomItems } from "@/data/faqBloom";
import {
  AUTHORITY_ROUTES,
  type AuthorityRoute,
  biDomainKeywords,
  criminalIndicators,
  GENERIC_FRAUD_CHIP_QUESTIONS,
  GENERIC_FRAUD_CLARIFICATION,
  outsideBiDomainKeywords,
} from "@/data/authorityRouting";
import type { FaqBloomItem } from "@/types/faqBloom";

export type AuthorityStructuredAnswer = {
  ringkasan: string;
  kewenangan: string;
  mengapa: string;
  langkah: string;
  catatan: string;
};

export type QueryDomainSignals = {
  normalized: string;
  hasBiDomain: boolean;
  hasOutsideBiDomain: boolean;
  outsideDomainGroups: string[];
  hasCriminal: boolean;
  matchedBiKeywords: string[];
  matchedOutsideKeywords: string[];
  matchedCriminalKeywords: string[];
  isGenericFraudOnly: boolean;
};

export type ApisAnswerSource = "faq" | "authority" | "mixed" | "clarification";

function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s@./-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter((keyword) => {
    const k = keyword.toLowerCase();
    if (k === "bi") {
      return /\bbi\b/.test(text);
    }
    return text.includes(k);
  });
}

function allOutsideKeywords(): string[] {
  return Object.values(outsideBiDomainKeywords).flat();
}

function hasProductOrDomainContext(text: string): boolean {
  const hints = [
    ...allOutsideKeywords(),
    ...biDomainKeywords,
    "transfer",
    "toko",
    "merchant",
    "beli",
    "jual",
    "bank",
    "e-wallet",
    "dompet",
  ];
  return containsKeywords(text, hints).length > 0;
}

const BI_PAYMENT_DOMAIN_KEYWORDS = biDomainKeywords.filter(
  (keyword) => !["bi", "bank indonesia"].includes(keyword)
);

export function analyzeQuery(query: string): QueryDomainSignals {
  const normalized = normalizeQuery(query);
  const matchedBiKeywords = containsKeywords(
    normalized,
    BI_PAYMENT_DOMAIN_KEYWORDS
  );
  const matchedOutsideKeywords = containsKeywords(
    normalized,
    allOutsideKeywords()
  );
  const matchedCriminalKeywords = containsKeywords(
    normalized,
    criminalIndicators
  );

  const outsideDomainGroups = Object.entries(outsideBiDomainKeywords)
    .filter(([, keywords]) => containsKeywords(normalized, [...keywords]).length > 0)
    .map(([group]) => group);

  const hasBiDomain = matchedBiKeywords.length > 0;
  const hasOutsideBiDomain = matchedOutsideKeywords.length > 0;
  const hasCriminal = matchedCriminalKeywords.length > 0;

  const genericPatterns = [
    /^saya (terkena |kena )?(penipuan|ditipu|scam)\.?$/,
    /^saya ditipu\.?$/,
    /^saya kena (penipuan|scam)\.?$/,
    /^terkena penipuan\.?$/,
  ];
  const matchesGenericPattern = genericPatterns.some((pattern) =>
    pattern.test(normalized)
  );

  const isGenericFraudOnly =
    hasCriminal &&
    !hasBiDomain &&
    !hasOutsideBiDomain &&
    (matchesGenericPattern ||
      (!hasProductOrDomainContext(normalized) &&
        normalized.split(" ").length <= 8));

  return {
    normalized,
    hasBiDomain,
    hasOutsideBiDomain,
    outsideDomainGroups,
    hasCriminal,
    matchedBiKeywords,
    matchedOutsideKeywords,
    matchedCriminalKeywords,
    isGenericFraudOnly,
  };
}

export function resolveAuthorityRoute(
  signals: QueryDomainSignals
): AuthorityRoute | undefined {
  for (const route of AUTHORITY_ROUTES) {
    if (containsKeywords(signals.normalized, route.keywords).length > 0) {
      return route;
    }
  }
  return undefined;
}

const BI_PAYMENT_FAQ_MARKERS = [
  "transfer dana",
  "alat pembayaran",
  "penundaan transaksi",
  "rekening/akun penerima",
  "indikasi fraud",
  "korban transfer",
  "aspi",
  "hilang atau dicuri",
  "penipuan transfer",
];

const AUTHORITY_FAQ_MARKERS = [
  "salah alamat",
  "mengadu ke bi, ojk",
  "ruang lingkup pengaduan",
  "di luar pengawasan bi",
  "ojk seperti bank, asuransi",
];

export function isBiPaymentOrFraudFaq(item: FaqBloomItem): boolean {
  const haystack = `${item.pertanyaan} ${item.jawaban}`.toLowerCase();
  if (AUTHORITY_FAQ_MARKERS.some((marker) => haystack.includes(marker))) {
    return false;
  }
  return BI_PAYMENT_FAQ_MARKERS.some((marker) => haystack.includes(marker));
}

export function shouldSuppressBiPaymentFaq(
  signals: QueryDomainSignals,
  item: FaqBloomItem
): boolean {
  return (
    signals.hasOutsideBiDomain &&
    !signals.hasBiDomain &&
    isBiPaymentOrFraudFaq(item)
  );
}

function criminalAuthorityNote(signals: QueryDomainSignals): string {
  if (!signals.hasCriminal) return "";
  return "Jika terdapat dugaan tindak pidana seperti penipuan, penggelapan, pemalsuan, atau penyalahgunaan identitas, konsumen juga dapat menyiapkan bukti dan mempertimbangkan pelaporan kepada aparat penegak hukum yang berwenang.";
}

function biPaymentNote(signals: QueryDomainSignals): string {
  if (!signals.hasBiDomain) return "";
  return "Jika terdapat aspek pembayaran melalui QRIS, transfer dana, uang elektronik, PJP, atau layanan yang diawasi BI, gunakan Formulir Panduan Pengaduan untuk mengecek apakah ada bagian yang dapat diarahkan ke Bank Indonesia.";
}

function insuranceLangkah(signals: QueryDomainSignals): string {
  const steps = [
    "Simpan polis, bukti pembayaran premi, bukti klaim, percakapan, brosur/penawaran, dan identitas pihak yang menawarkan produk.",
    "Susun kronologi kejadian secara singkat dan berurutan.",
    "Hubungi kanal pengaduan resmi perusahaan asuransi terlebih dahulu jika tersedia.",
    "Jika tidak selesai atau terdapat indikasi pelanggaran sektor jasa keuangan, pertimbangkan kanal OJK.",
  ];
  if (signals.hasCriminal) {
    steps.push(
      "Jika terdapat dugaan pidana, pertimbangkan pelaporan kepada aparat penegak hukum yang berwenang."
    );
  }
  if (signals.hasBiDomain) {
    steps.push(
      "Jika terdapat aspek pembayaran melalui QRIS, transfer dana, uang elektronik, PJP, atau layanan yang diawasi BI, gunakan Formulir Panduan Pengaduan untuk mengecek apakah ada bagian yang dapat diarahkan ke Bank Indonesia."
    );
  } else {
    steps.push(
      "Jika terdapat aspek pembayaran melalui QRIS, transfer dana, uang elektronik, PJP, atau layanan yang diawasi BI, gunakan Formulir Panduan Pengaduan untuk mengecek apakah ada bagian yang dapat diarahkan ke Bank Indonesia."
    );
  }
  return steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
}

export function buildAuthorityStructuredAnswer(
  route: AuthorityRoute,
  signals: QueryDomainSignals
): AuthorityStructuredAnswer {
  if (route.id === "ojk-asuransi") {
    return {
      ringkasan: `${route.answerTemplate}`,
      kewenangan: `OJK untuk sektor asuransi. ${criminalAuthorityNote(signals)}`.trim(),
      mengapa:
        "Bank Indonesia menangani pengaduan Konsumen yang berkaitan dengan Penyelenggara yang diatur dan diawasi BI, seperti sistem pembayaran, kegiatan layanan uang, KUPVA BB, pasar uang, dan pasar valuta asing. Asuransi tidak termasuk kategori utama Penyelenggara yang diatur dan diawasi BI.",
      langkah: insuranceLangkah(signals),
      catatan: route.disclaimer,
    };
  }

  const criminal = criminalAuthorityNote(signals);
  const biNote = biPaymentNote(signals);

  return {
    ringkasan: route.answerTemplate,
    kewenangan: [route.scope, criminal].filter(Boolean).join(" "),
    mengapa:
      "Bank Indonesia menangani pengaduan Konsumen yang berkaitan dengan Penyelenggara yang diatur dan diawasi BI, seperti sistem pembayaran, kegiatan layanan uang, KUPVA BB, pasar uang, dan pasar valuta asing. Produk di luar ruang lingkup tersebut umumnya lebih relevan dengan OJK atau otoritas lain.",
    langkah: [
      "Simpan bukti transaksi, komunikasi, dokumen produk, dan identitas pihak terkait.",
      "Susun kronologi kejadian secara singkat dan berurutan.",
      "Sampaikan pengaduan kepada pelaku usaha jasa keuangan atau penyelenggara terkait melalui kanal resminya jika tersedia.",
      "Pertimbangkan kanal OJK atau mekanisme penyelesaian sektor jasa keuangan yang berlaku.",
      biNote,
    ]
      .filter(Boolean)
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n"),
    catatan: route.disclaimer,
  };
}

export function formatAuthorityAnswer(answer: AuthorityStructuredAnswer): string {
  return [
    `Ringkasan:\n${answer.ringkasan}`,
    `Kewenangan yang kemungkinan relevan:\n${answer.kewenangan}`,
    `Mengapa:\n${answer.mengapa}`,
    `Langkah awal yang dapat dilakukan:\n${answer.langkah}`,
    `Catatan:\n${answer.catatan}`,
  ].join("\n\n");
}

export function findRelatedAuthorityFaqs(
  route: AuthorityRoute,
  signals: QueryDomainSignals,
  limit = 3
): FaqBloomItem[] {
  const keywords = route.relatedFaqKeywords;
  const scored = faqBloomItems
    .map((item) => {
      const haystack =
        `${item.pertanyaan} ${item.jawaban} ${item.kategori}`.toLowerCase();
      let score = 0;
      for (const keyword of keywords) {
        if (haystack.includes(keyword.toLowerCase())) score += 2;
      }
      if (shouldSuppressBiPaymentFaq(signals, item)) score = -100;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.item);
}

export function getAuthoritySuggestedQuestions(
  route: AuthorityRoute,
  signals: QueryDomainSignals
): string[] {
  if (signals.isGenericFraudOnly) {
    return GENERIC_FRAUD_CHIP_QUESTIONS;
  }
  return route.suggestedChipQuestions;
}

export {
  GENERIC_FRAUD_CLARIFICATION,
  GENERIC_FRAUD_CHIP_QUESTIONS,
};
