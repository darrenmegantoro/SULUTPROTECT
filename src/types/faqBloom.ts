export type BloomLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

export type FaqBloomItem = {
  id: number;
  kategori: string;
  kompetensiInti: string;
  bloomTaxonomy: BloomLevel;
  levelKemahiran: string;
  indikatorPerilaku: string;
  pertanyaan: string;
  jawaban: string;
  basisHukumUtama: string;
  check?: string;
};

export type StructuredApisAnswer = {
  jawabanSingkat: string;
  penjelasan: string;
  langkah: string;
  dasarPengetahuan: string;
};
