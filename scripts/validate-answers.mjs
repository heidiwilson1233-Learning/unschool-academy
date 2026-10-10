/**
 * Answers Portal build gate (prebuild).
 *
 * Reads the same curriculum JSON the question-bank factory consumes
 * (content/curriculum/jft-basic/units/<unit>/questions-<batch>.json, excluding the
 * diagnostic bank) and asserts the invariants the answers pages depend on:
 *
 *  1. Every question id is unique (stable page slugs).
 *  2. Every question has a non-empty explanation and hint (hint-before-answer).
 *  3. Every question has at least one "try similar" candidate (same skill,
 *     falling back to same topic) — no dead-end explanation pages.
 *  4. Generated page titles are unique across all 95 pages (SEO: no dupes).
 *  5. Generated meta descriptions are unique across all 95 pages.
 *
 * The title/description templates here MUST match the ones in
 * app/exams/jft-basic/answers/[id]/page.tsx exactly — if you change the
 * template there, change it here too.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const UNITS = join(ROOT, "content/curriculum/jft-basic/units");

function* questionFiles() {
  for (const unit of readdirSync(UNITS, { withFileTypes: true })) {
    if (!unit.isDirectory()) continue;
    for (const f of readdirSync(join(UNITS, unit.name))) {
      if (f.startsWith("questions-") && f.endsWith(".json") && !f.includes("diagnostic")) {
        yield join(UNITS, unit.name, f);
      }
    }
  }
}

const questions = [];
for (const f of questionFiles()) {
  const qs = JSON.parse(readFileSync(f, "utf8"));
  for (const q of qs) questions.push({ ...q, file: f.split("units/")[1] });
}

const failures = [];
const fail = (msg) => failures.push(msg);

/* 1 — unique ids */
const seen = new Map();
for (const q of questions) {
  if (seen.has(q.id)) fail(`duplicate id ${q.id} (${seen.get(q.id)} and ${q.file})`);
  seen.set(q.id, q.file);
}

/* 2 — explanation + hint present */
for (const q of questions) {
  if (!q.explanation || !String(q.explanation).trim()) fail(`${q.id}: empty explanation`);
  if (!q.hint || !String(q.hint).trim()) fail(`${q.id}: empty hint (hint-before-answer)`);
}

/* 3 — try-similar non-empty (same skill, fallback same topic) */
for (const q of questions) {
  const sameSkill = questions.filter((o) => o.id !== q.id && o.skill === q.skill);
  const pool = sameSkill.length > 0
    ? sameSkill
    : questions.filter((o) => o.id !== q.id && (o.topic ?? "") === (q.topic ?? ""));
  if (pool.length === 0) fail(`${q.id}: no try-similar candidates (skill ${q.skill}, topic ${q.topic})`);
}

/* Title/description templates — keep in sync with [id]/page.tsx */
const shortStem = (stem) => String(stem).split(/\s+/).slice(0, 7).join(" ");
const pageTitle = (q) => `Q: ${shortStem(q.stem)} — JFT-Basic explained`;
const firstSentence = (t) => String(t).split(/(?<=[.!?])\s/)[0].slice(0, 140);
const pageDescription = (q) => `${firstSentence(q.explanation)} — draft pending SME review`;

const titles = new Map();
const descriptions = new Map();
for (const q of questions) {
  const t = pageTitle(q);
  if (titles.has(t)) fail(`duplicate title "${t}" (${titles.get(t)} and ${q.id})`);
  titles.set(t, q.id);
  const d = pageDescription(q);
  if (descriptions.has(d)) fail(`duplicate description for ${q.id} (also ${descriptions.get(d)})`);
  descriptions.set(d, q.id);
}

console.log(`[validate-answers] checked ${questions.length} questions`);
if (failures.length > 0) {
  for (const f of failures) console.error(`[validate-answers] FAIL: ${f}`);
  process.exit(1);
}
console.log("[validate-answers] OK — ids unique, explanations+hints present, try-similar non-empty, titles+descriptions unique");
