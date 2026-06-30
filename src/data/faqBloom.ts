import type { FaqBloomItem } from "@/types/faqBloom";
import { FAQ_BLOOM_KERUGIAN } from "./faqBloom/kerugian";
import { FAQ_BLOOM_KETIDAKPAHAMAN } from "./faqBloom/ketidakpahaman";
import { FAQ_BLOOM_PELANGGARAN } from "./faqBloom/pelanggaran";
import { FAQ_BLOOM_SENGKETA } from "./faqBloom/sengketa";

export const faqBloomItems: FaqBloomItem[] = [
  ...FAQ_BLOOM_KERUGIAN,
  ...FAQ_BLOOM_KETIDAKPAHAMAN,
  ...FAQ_BLOOM_PELANGGARAN,
  ...FAQ_BLOOM_SENGKETA,
];
