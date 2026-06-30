import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const mdPath =
  process.argv[2] ||
  "C:\\Users\\Darren\\Downloads\\prompt_cursor_revisi_lanjutan_sulut_protect_faq_bloom (1).md";

const md = readFileSync(mdPath, "utf8");
const start = md.indexOf("export const faqBloomItems");
const arrayStart = md.indexOf("[", start);
const arrayEnd = md.indexOf("];", arrayStart);
const items = JSON.parse(md.slice(arrayStart, arrayEnd + 1)).filter(
  (item) => item.id >= 53
);

const header = `import type { FaqBloomItem } from "@/types/faqBloom";

export const FAQ_BLOOM_SENGKETA: FaqBloomItem[] = `;

const body = JSON.stringify(items, null, 2)
  .replace(/"([^"]+)":/g, "$1:")
  .replace(/"/g, '"');

// Keep JSON-compatible TS object literals (quoted keys are fine in TS)
const tsBody = JSON.stringify(items, null, 2);

writeFileSync(
  join(root, "src/data/faqBloom/sengketa.ts"),
  `${header}${tsBody} as FaqBloomItem[];\n`,
  "utf8"
);

console.log(`Wrote ${items.length} sengketa items`);
