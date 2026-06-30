import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mdPath =
  process.env.FAQ_MD ||
  path.join(root, "scripts", "faq-bloom-source.md");

const md = fs.readFileSync(mdPath, "utf8");
const start = md.indexOf("export const faqBloomItems");
const end = md.indexOf("];", start) + 2;
if (start < 0 || end < 2) {
  console.error("Could not find faqBloomItems array in markdown");
  process.exit(1);
}

const arrayLiteral = md
  .slice(start)
  .replace(/^export const faqBloomItems[^=]*=\s*/, "");
const items = Function(`"use strict"; return (${arrayLiteral})`)();

const dataDir = path.join(root, "src", "data");
const chunks = [
  items.slice(0, 19),
  items.slice(19, 42),
  items.slice(42, 52),
  items.slice(52),
];

chunks.forEach((chunk, index) => {
  const out = path.join(dataDir, `faqBloom.part${index + 1}.json`);
  fs.writeFileSync(out, JSON.stringify(chunk, null, 2) + "\n", "utf8");
});

console.log(`Wrote ${items.length} items across ${chunks.length} JSON parts`);
