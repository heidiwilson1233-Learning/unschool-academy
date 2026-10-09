/**
 * write-images.mjs — rebuilds binary site imagery from committed base64 blobs.
 *
 * Why this exists: the project's GitHub push route (MCP push_files) only
 * carries text files, so binary WebP illustrations cannot be pushed directly.
 * The originals live as base64 text in image-blobs/*.b64 (committed), and this
 * script decodes them into public/img/*.webp before every build — locally,
 * on CI, and on Vercel (via the `prebuild` npm hook).
 *
 * The blobs are the source of truth. To replace an illustration, drop the new
 * .webp into public/img/, re-encode it into image-blobs/<name>.b64, and commit.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const blobsDir = join(root, "image-blobs");
const outDir = join(root, "public", "img");

mkdirSync(outDir, { recursive: true });

const blobs = readdirSync(blobsDir).filter((f) => f.endsWith(".b64"));
if (blobs.length === 0) {
  console.log("[write-images] no blobs found, skipping");
  process.exit(0);
}

let bytes = 0;
for (const blob of blobs) {
  const name = basename(blob, ".b64") + ".webp";
  const data = Buffer.from(readFileSync(join(blobsDir, blob), "utf8").trim(), "base64");
  const out = join(outDir, name);
  // Skip rewrite when the on-disk file already matches (keeps local builds fast).
  if (existsSync(out) && readFileSync(out).equals(data)) {
    bytes += data.length;
    continue;
  }
  writeFileSync(out, data);
  bytes += data.length;
  console.log(`[write-images] wrote public/img/${name}`);
}
console.log(`[write-images] done: ${blobs.length} images, ${(bytes / 1024).toFixed(0)}KB total`);
