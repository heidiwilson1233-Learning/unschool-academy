// Decodes the base64 image blobs in image-blobs/ into public/img/*.webp.
// Runs on every build via the "prebuild" hook, because the GitHub push
// transport is text-only and cannot carry binary files.
// Each image is exactly one <stem>.b64 file (base64 of the .webp bytes).
// Files named <stem>.b64.partN are legacy chunk fragments and are ignored.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blobsDir = join(root, "image-blobs");
const outDir = join(root, "public", "img");

const STEMS = [
  "card-exams",
  "card-jft",
  "card-kids",
  "char-bobo",
  "char-momo",
  "char-tara",
  "discovery-pond",
  "hero-home",
  "how-practice",
  "japanese-hub",
  "jft-hero",
  "kids-world",
  "mango-garden",
  "mock-tests",
  "resources",
  "story-tree",
];

mkdirSync(outDir, { recursive: true });

// The GitHub push transport is text-only, so image blobs arrive in batches.
// Intermediate commits may not have image-blobs/ yet (or only partially) —
// skip gracefully instead of crashing the build (Vercel runs `npm run build`
// on every push, and a throw here exits 1 and reds the deployment).
if (!existsSync(blobsDir)) {
  console.log("[write-images] no image-blobs/ dir yet, skipping");
  process.exit(0);
}

let ok = 0;
let skipped = 0;
for (const stem of STEMS) {
  const p = join(blobsDir, `${stem}.b64`);
  if (!existsSync(p)) {
    console.log(`[write-images] missing blob for ${stem}, skipping`);
    skipped++;
    continue;
  }
  const b64 = readFileSync(p, "utf8").replace(/\s+/g, "");
  const bytes = Buffer.from(b64, "base64");
  // sanity: valid WebP starts with RIFF....WEBP
  if (bytes.subarray(0, 4).toString() !== "RIFF" || bytes.subarray(8, 12).toString() !== "WEBP") {
    throw new Error(`image-blobs/${stem}.b64 did not decode to valid WebP`);
  }
  writeFileSync(join(outDir, `${stem}.webp`), bytes);
  ok++;
}
console.log(`[write-images] decoded ${ok}/${STEMS.length} images to public/img/${skipped ? ` (${skipped} missing, skipped)` : ""}`);
