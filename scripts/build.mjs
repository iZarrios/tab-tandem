import * as esbuild from "esbuild";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const dist = resolve(root, "dist");

const common = {
  bundle: true,
  platform: "browser",
  target: "chrome100",
};

await esbuild.build({
  ...common,
  entryPoints: [resolve(root, "src/background.ts")],
  outfile: resolve(dist, "background.js"),
  format: "esm",
});

await esbuild.build({
  ...common,
  entryPoints: [resolve(root, "src/content.ts")],
  outfile: resolve(dist, "content.js"),
  format: "iife",
});

await esbuild.build({
  ...common,
  entryPoints: [resolve(root, "src/theme-init.ts")],
  outfile: resolve(dist, "theme-init.js"),
  format: "iife",
});

await esbuild.build({
  ...common,
  entryPoints: [resolve(root, "src/popup.ts")],
  outfile: resolve(dist, "popup.js"),
  format: "esm",
});

mkdirSync(dist, { recursive: true });

cpSync(resolve(root, "icons"), resolve(dist, "icons"), { recursive: true });
cpSync(resolve(root, "popup.css"), resolve(dist, "popup.css"));

const popupHtml = readFileSync(resolve(root, "popup.html"), "utf8")
  .replace('src="dist/popup.js"', 'src="popup.js"')
  .replace('src="dist/theme-init.js"', 'src="theme-init.js"');
writeFileSync(resolve(dist, "popup.html"), popupHtml);

const manifest = JSON.parse(
  readFileSync(resolve(root, "manifest.json"), "utf8"),
);

manifest.background.service_worker = "background.js";
manifest.action.default_popup = "popup.html";

if (Array.isArray(manifest.content_scripts)) {
  for (const script of manifest.content_scripts) {
    if (Array.isArray(script.js)) {
      script.js = script.js.map((path) => path.replace(/^dist\//, ""));
    }
  }
}

writeFileSync(
  resolve(dist, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

console.log("Built extension into dist/");
