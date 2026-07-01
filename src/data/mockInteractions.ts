import type { InteractionChannel, InteractionRecord } from "@/types/interactions";
import { REROUTING_UNITS } from "@/types/interactions";
import { ADMIN_CATEGORIES, SULUT_LOCATIONS } from "@/data/adminConfig";
import { deriveRoutingFlags } from "@/lib/interactionNormalize";
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHANNELS: InteractionChannel[] = ["FAQ", "APIS", "Formulir"];

const SAMPLE_QUERIES: Record<InteractionChannel, string[]> = {
  FAQ: [
    "batas waktu pengaduan",
    "dokumen yang perlu disiapkan",
    "apa itu fasilitasi",
  ],
  APIS: [
    "Apakah harus mengadu ke Penyelenggara dulu?",
    "Berapa batas waktu pengaduan ke BI?",
    "Dokumen apa yang perlu disiapkan?",
  ],
  Formulir: [
    "Pengaduan kerugian finansial",
    "Sengketa dengan penyelenggara",
    "Dugaan pelanggaran ketentuan",
  ],
};

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** @deprecated Manual testing only — not auto-seeded in production flow. */
export function generateMockInteractions(count = 64): InteractionRecord[] {
  const rng = mulberry32(20260628);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const records: InteractionRecord[] = [];

  for (let i = 0; i < count; i += 1) {
    const channel = pick(rng, CHANNELS);
    const category = pick(rng, ADMIN_CATEGORIES);
    const createdAt = new Date(
      now - Math.floor(rng() * 30) * dayMs - Math.floor(rng() * dayMs)
    ).toISOString();
    const recommendation =
      channel === "APIS" && rng() < 0.18
        ? "Tidak ditemukan di FAQ"
        : "Diarahkan ke BI Bicara";
    const routing = deriveRoutingFlags(recommendation);
    const location = pick(rng, SULUT_LOCATIONS).split(", ");

    records.push({
      id: `INT-${String(1000 + i)}`,
      createdAt,
      channel,
      category,
      query: pick(rng, SAMPLE_QUERIES[channel]),
      recommendation,
      province: location[1],
      cityOrRegency: location[0],
      isCompleted: true,
      status: routing.outsideBiAuthority ? "Baru" : "Selesai",
      reroutingUnit: rng() < 0.4 ? pick(rng, REROUTING_UNITS) : undefined,
      ...routing,
    });
  }

  return records.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
