import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sources = [
  join(
    process.env.USERPROFILE ?? "",
    ".cursor",
    "projects",
    "C-Users-Darren-AppData-Local-Temp-53031d33-3864-4bb4-b6a4-e36b925afdcd",
    "assets",
    "apis-avatar.png"
  ),
  join(root, "apis-avatar.png"),
];

const dest = join(root, "public", "images", "apis-avatar.png");
mkdirSync(dirname(dest), { recursive: true });

const source = sources.find((path) => existsSync(path));
if (!source) {
  console.error("APIS avatar source not found. Place apis-avatar.png in project root.");
  process.exit(1);
}

copyFileSync(source, dest);
console.log(`Copied ${source} -> ${dest}`);
