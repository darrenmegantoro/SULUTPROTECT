import type { FAQItem } from "@/types/faq";
import type { FaqBloomItem } from "@/types/faqBloom";
import { faqBloomItems } from "@/data/faqBloom";

export const FAQ_KATEGORI_FILTERS: { value: string; label: string }[] = [
  { value: "Semua", label: "Semua" },
  { value: "Ketidakpahaman Konsumen", label: "Membutuhkan Penjelasan" },
  {
    value: "Sengketa dengan Lembaga Keuangan",
    label: "Sengketa dengan Lembaga Keuangan",
  },
  { value: "Pelanggaran Ketentuan", label: "Dugaan Pelanggaran Ketentuan" },
  { value: "Kerugian Konsumen", label: "Kerugian Konsumen" },
];

export const FAQ_BLOOM_FILTERS: { value: string; label: string }[] = [
  { value: "Semua", label: "Semua Level" },
  { value: "Remember", label: "Remember" },
  { value: "Understand", label: "Understand" },
  { value: "Apply", label: "Apply" },
  { value: "Analyze", label: "Analyze" },
  { value: "Evaluate", label: "Evaluate" },
  { value: "Create", label: "Create" },
];

function bloomToLegacy(item: FaqBloomItem): FAQItem {
  return {
    id: `faq-${String(item.id).padStart(3, "0")}`,
    no: item.id,
    source: item.basisHukumUtama,
    focus: item.kategori,
    question: item.pertanyaan,
    answer: item.jawaban,
    reference: item.basisHukumUtama,
    keywords: [
      item.kategori,
      item.kompetensiInti,
      item.bloomTaxonomy,
      item.levelKemahiran,
      item.indikatorPerilaku,
    ],
    bloom: item,
  };
}

/** Legacy adapter over the Bloom FAQ dataset (76 items). */
export const FAQ_ITEMS: FAQItem[] = faqBloomItems.map(bloomToLegacy);

/** @deprecated Use FAQ_KATEGORI_FILTERS */
export const FAQ_FOCUS_FILTERS = FAQ_KATEGORI_FILTERS;

export function focusLabel(focus: string): string {
  const match = FAQ_KATEGORI_FILTERS.find((f) => f.value === focus);
  return match?.label ?? focus;
}

export const kategoriLabel = focusLabel;

export function getFaqById(id: string): FAQItem | undefined {
  return FAQ_ITEMS.find((item) => item.id === id);
}

export function getBloomItemById(id: number): FaqBloomItem | undefined {
  return faqBloomItems.find((item) => item.id === id);
}

export { faqBloomItems };
