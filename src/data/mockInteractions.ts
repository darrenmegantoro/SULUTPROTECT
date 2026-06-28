import type {
  InteractionChannel,
  InteractionRecord,
  ReroutingStatus,
} from "@/types/admin";
import {
  ADMIN_CATEGORIES,
  ADMIN_UNITS,
  AGE_RANGES,
  GENDERS,
  SULUT_LOCATIONS,
} from "@/data/adminConfig";

// Deterministic PRNG (mulberry32) so the seeded mock data is stable across
// reloads and does not cause hydration mismatches.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHANNELS: InteractionChannel[] = ["FAQ", "Asisten", "Formulir"];

const RESULTS_BY_CATEGORY: Record<string, string[]> = {
  "Membutuhkan Penjelasan": [
    "Diarahkan ke BI Bicara",
    "Edukasi BI Bicara",
  ],
  "Sengketa dengan Lembaga Keuangan": [
    "Perlu disampaikan ke Penyelenggara",
    "Diarahkan ke LAPS SJK",
  ],
  "Dugaan Pelanggaran Ketentuan": [
    "Di Luar Kewenangan BI",
    "Perlu penelaahan awal",
  ],
  "Kerugian Konsumen": [
    "Diarahkan ke BI Bicara",
    "Diarahkan ke LAPS SJK",
    "Di Luar Kewenangan BI",
  ],
};

const SAMPLE_QUERIES: Record<InteractionChannel, string[]> = {
  FAQ: [
    "batas waktu pengaduan",
    "dokumen yang perlu disiapkan",
    "apa itu fasilitasi",
    "kanal LAPS SJK",
    "korban fraud transfer dana",
    "biaya layanan",
  ],
  Asisten: [
    "Apakah harus mengadu ke Penyelenggara dulu?",
    "Berapa batas waktu pengaduan ke BI?",
    "Dokumen apa yang perlu disiapkan?",
    "Kapan diarahkan ke LAPS SJK?",
    "Apa yang harus dilakukan jika menjadi korban fraud?",
    "Bagaimana cara investasi emas?",
  ],
  Formulir: [
    "Pengaduan kerugian finansial",
    "Sengketa dengan penyelenggara",
    "Dugaan pelanggaran ketentuan",
    "Membutuhkan penjelasan layanan",
  ],
};

const REROUTING_STATUSES: ReroutingStatus[] = [
  "Baru",
  "Perlu Review",
  "Diteruskan ke Unit",
  "Dalam Tindak Lanjut",
  "Selesai",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Generate a stable set of mock interaction records over the last ~30 days.
export function generateMockInteractions(count = 64): InteractionRecord[] {
  const rng = mulberry32(20260628);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const records: InteractionRecord[] = [];

  for (let i = 0; i < count; i += 1) {
    const channel = pick(rng, CHANNELS);
    const category = pick(rng, ADMIN_CATEGORIES);
    const dayOffset = Math.floor(rng() * 30);
    const createdAt = new Date(
      now - dayOffset * dayMs - Math.floor(rng() * dayMs)
    ).toISOString();

    // Chatbot occasionally fails to find an answer (low-confidence/unanswered).
    const unanswered = channel === "Asisten" && rng() < 0.18;
    const resultRecommendation = unanswered
      ? "Tidak ditemukan di FAQ"
      : pick(rng, RESULTS_BY_CATEGORY[category]);

    const needsRerouting = resultRecommendation === "Di Luar Kewenangan BI";
    const reroutingStatus: ReroutingStatus = needsRerouting
      ? pick(rng, REROUTING_STATUSES)
      : "Selesai";

    const assignedUnit =
      reroutingStatus === "Diteruskan ke Unit" ||
      reroutingStatus === "Dalam Tindak Lanjut" ||
      reroutingStatus === "Selesai"
        ? pick(rng, ADMIN_UNITS)
        : undefined;

    records.push({
      id: `INT-${String(1000 + i)}`,
      createdAt,
      channel,
      category,
      query: pick(rng, SAMPLE_QUERIES[channel]),
      answerSummary:
        channel === "Formulir"
          ? [category, resultRecommendation]
          : undefined,
      resultRecommendation,
      location: pick(rng, SULUT_LOCATIONS),
      demographic: {
        ageRange: pick(rng, AGE_RANGES),
        gender: pick(rng, GENDERS),
      },
      assignedUnit,
      reroutingStatus,
      reviewed: rng() < 0.5,
      notes: undefined,
    });
  }

  // Newest first.
  return records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
