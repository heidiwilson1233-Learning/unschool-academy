/**
 * write-images.mjs — rebuilds binary site imagery from committed base64 blobs.
 *
 * Why this exists: the project's GitHub push route (MCP push_files) only
 * carries text files, so binary WebP illustrations cannot be pushed directly.
 * The originals live as base64 text in image-blobs/ (committed). Blobs larger
 * than the push transport's per-call limit are split into numbered
 * <name>.b64.partN chunks; this script reassembles them in order and decodes
 * each image into public/img/<name>.webp before every build — locally, on CI,
 * and on Vercel (via the `prebuild` npm hook).
 *
 * The blobs are the source of truth. To replace an illustration, drop the new
 * .webp into public/img/, re-encode it into image-blobs/<name>.b64 (splitting
 * into .partN chunks if over ~100KB of text), and commit.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blobsDir = join(root, "image-blobs");
const outDir = join(root, "public", "img");

mkdirSync(outDir, { recursive: true });

const files = readdirSync(blobsDir).filter((f) => f.includes(".b64"));
// Group chunk files by image stem: "<stem>.b64" or "<stem>.b64.partN".
const groups = new Map();
for (const f of files) {
  const m = f.match(/^(.+)\.b64(\.part(\d+))?$/);
  if (!m) continue;
  const stem = m[1];
  if (!groups.has(stem)) groups.set(stem, []);
  groups.get(stem).push({ file: f, part: m[3] ? parseInt(m[3], 10) : 0 });
}
if (groups.size === 0) {
  console.log("[write-images] no blobs found, skipping");
  process.exit(0);
}

let bytes = 0;
for (const [stem, parts] of [...groups.entries()].sort()) {
  parts.sort((a, b) => a.part - b.part);
  const b64 = parts.map((p) => readFileSync(join(blobsDir, p.file), "utf8")).join("").replace(/\s+/g, "");
  const data = Buffer.from(b64, "base64");
  const out = join(outDir, stem + ".webp");
  // Skip rewrite when the on-disk file already matches (keeps local builds fast).
  if (existsSync(out) && readFileSync(out).equals(data)) {
    bytes += data.length;
    continue;
  }
  writeFileSync(out, data);
  bytes += data.length;
  console.log(`[write-images] wrote public/img/${stem}.webp`);
}
console.log(`[write-images] done: ${groups.size} images, ${(bytes / 1024).toFixed(0)}KB total`);
