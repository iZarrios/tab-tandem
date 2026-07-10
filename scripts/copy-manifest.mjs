import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const manifest = JSON.parse(
  readFileSync(resolve(root, "manifest.json"), "utf8"),
);

// When loaded from dist/, the service worker is a sibling, not under dist/.
manifest.background.service_worker = "background.js";

mkdirSync(resolve(root, "dist"), { recursive: true });
writeFileSync(
  resolve(root, "dist", "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log("Copied loadable manifest.json into dist/");
