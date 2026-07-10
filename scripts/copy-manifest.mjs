import { readFileSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const manifest = JSON.parse(
  readFileSync(resolve(root, "manifest.json"), "utf8"),
);

// When loaded from dist/, these files are siblings, not under dist/.
manifest.background.service_worker = "background.js";

if (Array.isArray(manifest.content_scripts)) {
  for (const script of manifest.content_scripts) {
    if (Array.isArray(script.js)) {
      script.js = script.js.map((path) => path.replace(/^dist\//, ""));
    }
  }
}

mkdirSync(resolve(root, "dist"), { recursive: true });

// Copy static assets (icons) into dist/ so it is self-contained.
cpSync(resolve(root, "icons"), resolve(root, "dist", "icons"), {
  recursive: true,
});

writeFileSync(
  resolve(root, "dist", "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log("Copied loadable manifest.json into dist/");
