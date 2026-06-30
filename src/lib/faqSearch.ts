import Fuse from "fuse.js";
import { faqBloomItems } from "@/data/faqBloom";
import { EXTERNAL_LINKS } from "@/data/links";
import type { FaqBloomItem, StructuredApisAnswer } from "@/types/faqBloom";
import type { RelatedCTA } from "@/types/faq";

const fuse = new Fuse<FaqBloomItem>(faqBloomItems, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.42,
  minMatchCharLength: 2,
  keys: [
    { name: "pertanyaan", weight: 0.28 },
    { name: "jawaban", weight: 0.22 },
    { name: "kategori", weight: 0.12 },
    { name: "kompetensiInti", weight: 0.12 },
    { name: "bloomTaxonomy", weight: 0.08 },
    { name: "levelKemahiran", weight: 0.06 },
    { name: "indikatorPerilaku", weight: 0.06 },
    { name: "basisHukumUtama", weight: 0.06 },
  ],
});

const CONFIDENT_SCORE = 0.35;

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^[^.!?\n]+[.!?]?/);
  return (match?.[0] ?? trimmed).trim();
}

function suggestNextStep(item: FaqBloomItem): string {
  const haystack =
    `${item.pertanyaan} ${item.jawaban} ${item.kategori} ${item.indikatorPerilaku}`.toLowerCase();

  if (
    haystack.includes("penipuan") ||
    haystack.includes("penggelapan") ||
    haystack.includes("pidana") ||
    haystack.includes("kepolisian")
  ) {
    return "Pisahkan aspek perlindungan konsumen/regulator dengan dugaan pidana. Untuk dugaan tindak pidana, sampaikan laporan ke kepolisian. Untuk aspek layanan atau pengaduan konsumen, gunakan Formulir Panduan Pengaduan, FAQ, atau kanal BI Bicara sesuai kewenangan.";
  }
  if (haystack.includes("laps")) {
    return "Pertimbangkan penyelesaian melalui Lembaga Alternatif Penyelesaian Sengketa Sektor Jasa Keuangan (LAPS SJK) apabila memenuhi persyaratan, atau gunakan Formulir Panduan Pengaduan untuk memeriksa jalur yang sesuai.";
  }
  if (haystack.includes("dokumen") || haystack.includes("fasilitasi")) {
    return "Siapkan dokumen pendukung yang disebutkan, lalu gunakan Formulir Panduan Pengaduan atau hubungi BI Bicara untuk memastikan kelengkapan sebelum melanjutkan.";
  }
  if (haystack.includes("penyelenggara") && haystack.includes("terlebih")) {
    return "Sampaikan pengaduan kepada Penyelenggara terlebih dahulu, simpan bukti dan hasil penyelesaian tertulis, lalu gunakan Formulir Panduan Pengaduan jika perlu diarahkan ke Bank Indonesia.";
  }
  if (haystack.includes("ojk") || haystack.includes("bank") || haystack.includes("asuransi")) {
    return "Pastikan lembaga yang diadukan berada dalam kewenangan yang tepat (BI atau OJK). Gunakan Formulir Panduan Pengaduan atau buka FAQ untuk memeriksa arahan kanal.";
  }
  return "Gunakan Formulir Panduan Pengaduan untuk memeriksa jalur pengaduan yang sesuai, buka FAQ terkait, atau hubungi BI Bicara bila memerlukan panduan lebih lanjut.";
}

export function buildStructuredApisAnswer(item: FaqBloomItem): StructuredApisAnswer {
  const dasarPengetahuan = [
    `Kategori: ${item.kategori}`,
    `Level: ${item.bloomTaxonomy} / ${item.levelKemahiran}`,
    `Basis hukum utama: ${item.basisHukumUtama}`,
  ].join("\n");

  return {
    jawabanSingkat: firstSentence(item.jawaban),
    penjelasan: item.jawaban,
    langkah: suggestNextStep(item),
    dasarPengetahuan,
  };
}

export function formatStructuredApisAnswer(answer: StructuredApisAnswer): string {
  return [
    `Jawaban singkat:\n${answer.jawabanSingkat}`,
    `Penjelasan:\n${answer.penjelasan}`,
    `Langkah yang dapat dilakukan:\n${answer.langkah}`,
    `Dasar pengetahuan:\n${answer.dasarPengetahuan}`,
  ].join("\n\n");
}

export function searchFaqBloom(query: string): FaqBloomItem[] {
  const q = query.trim();
  if (!q) return faqBloomItems;
  return fuse.search(q).map((r) => r.item);
}

/** @deprecated Use searchFaqBloom */
export function searchFaq(query: string) {
  return searchFaqBloom(query).map((item) => ({
    id: `faq-${String(item.id).padStart(3, "0")}`,
    no: item.id,
    source: item.basisHukumUtama,
    focus: item.kategori,
    question: item.pertanyaan,
    answer: item.jawaban,
    reference: item.basisHukumUtama,
    bloom: item,
  }));
}

export function getRelatedCTA(item: FaqBloomItem): RelatedCTA | undefined {
  const haystack = `${item.pertanyaan} ${item.jawaban}`.toLowerCase();
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
  | {
      type: "answer";
      item: FaqBloomItem;
      structured: StructuredApisAnswer;
      cta?: RelatedCTA;
    }
  | { type: "clarification"; relatedQuestions: string[] }
  | { type: "fallback" };

export function getChatbotResponse(query: string): ChatbotResult {
  const q = query.trim();
  if (!q) return { type: "fallback" };

  const matches = fuse.search(q);
  const best = matches[0];

  if (best && best.score !== undefined && best.score <= CONFIDENT_SCORE) {
    return {
      type: "answer",
      item: best.item,
      structured: buildStructuredApisAnswer(best.item),
      cta: getRelatedCTA(best.item),
    };
  }

  if (matches.length > 0) {
    return {
      type: "clarification",
      relatedQuestions: matches.slice(0, 3).map((m) => m.item.pertanyaan),
    };
  }

  return { type: "fallback" };
}

export function findBloomItemByQuestion(
  question: string
): FaqBloomItem | undefined {
  return faqBloomItems.find((item) => item.pertanyaan === question);
}

/** @deprecated Use findBloomItemByQuestion */
export function findItemByQuestion(question: string) {
  const item = findBloomItemByQuestion(question);
  if (!item) return undefined;
  return searchFaq(item.pertanyaan)[0];
}
