#!/usr/bin/env node
// Build gate: validates EVERY kids quest JSON against the schema v2 SSOT in
// `lib/quest-engine.ts`, plus the 15-quest prototype plan. Runs on every build
// via the "prebuild" hook (chained after validate-curriculum.mjs).
//
// SINGLE SOURCE OF TRUTH: the rules live in `lib/quest-engine.ts` (imported
// directly below — Node ≥22 strips types natively). This script only handles
// file discovery, cross-file checks, and reporting. There is exactly one
// implementation of the rules.
//
// Checks:
//  1. Every content/kids/quests/*.json parses and passes validateQuest
//     (required doc-03-§6 fields, template contracts, answer rules, review
//     lifecycle honesty: reviewed ⇒ named reviewer; published ⇒ reviewed).
//  2. Quest ids are globally unique and match their filenames.
//  3. book_id references exist in content/kids/books-500.json.
//  4. content/kids/prototype-plan.json is well-formed: exactly 15 briefs,
//     template/track/subject/character refs valid, retired quests documented.
//  5. Warnings (non-failing): quests still on live-tts narration.
//
// Exit 0 = all valid; exit 1 = any defect, or zero quest files found (a
// silent pass is worse than a loud failure).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { validateQuest, TEMPLATE_IDS } from "../lib/quest-engine.ts";
import {
  ENGINE_SUBJECT_SLUGS,
  ENGINE_TRACK_SLUGS,
  ENGINE_QUEST_TYPE_IDS,
} from "../lib/quest-engine.ts";
import { KID_SUBJECTS, AGE_TRACKS, BOOK_QUEST_TYPES } from "../lib/kids.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const questsDir = join(root, "content", "kids", "quests");
const planPath = join(root, "content", "kids", "prototype-plan.json");
const booksPath = join(root, "content", "kids", "books-500.json");

const errors = [];
const warnings = [];
const seenIds = new Map();

function fail(where, msg) {
  errors.push(`${where}: ${msg}`);
}
function warn(where, msg) {
  warnings.push(`${where}: ${msg}`);
}

/* ---- drift cross-check: engine literals must mirror lib/kids.ts ---- */
function sameSet(a, b) {
  return a.length === b.length && a.every((x) => b.includes(x));
}
if (!sameSet(ENGINE_SUBJECT_SLUGS, KID_SUBJECTS.map((s) => s.slug)))
  fail("lib/quest-engine.ts", "ENGINE_SUBJECT_SLUGS drifted from lib/kids.ts KID_SUBJECTS");
if (!sameSet(ENGINE_TRACK_SLUGS, AGE_TRACKS.map((t) => t.slug)))
  fail("lib/quest-engine.ts", "ENGINE_TRACK_SLUGS drifted from lib/kids.ts AGE_TRACKS");
if (!sameSet(ENGINE_QUEST_TYPE_IDS, BOOK_QUEST_TYPES.map((q) => q.type)))
  fail("lib/quest-engine.ts", "ENGINE_QUEST_TYPE_IDS drifted from lib/kids.ts BOOK_QUEST_TYPES");

/* ---- books ---- */
let bookIds = new Set();
try {
  const books = JSON.parse(readFileSync(booksPath, "utf-8"));
  bookIds = new Set((books.books ?? []).map((b) => b.id));
} catch (e) {
  fail("books-500.json", `unreadable: ${e.message}`);
}

/* ---- quests ---- */
let files = [];
try {
  files = readdirSync(questsDir).filter((f) => f.endsWith(".json"));
} catch (e) {
  fail("quests/", `unreadable: ${e.message}`);
}
if (files.length === 0) fail("quests/", "no quest files found — refusing silent pass");

for (const f of files) {
  const id = f.replace(/\.json$/, "");
  const p = join(questsDir, f);
  let q;
  try {
    q = JSON.parse(readFileSync(p, "utf-8"));
  } catch (e) {
    fail(f, `invalid JSON: ${e.message}`);
    continue;
  }
  if (seenIds.has(q.id)) fail(f, `duplicate quest id ${q.id} (also in ${seenIds.get(q.id)})`);
  else seenIds.set(q.id, f);
  for (const e of validateQuest(id, q, bookIds)) fail(f, e);
  if (q?.narration?.mode === "live-tts")
    warn(f, "narration is live-tts (browser speech synthesis), not reviewed audio");
}

/* ---- prerequisites: referential integrity (two passes) ---- */
const questById = new Map();
for (const f of files) {
  try {
    const q = JSON.parse(readFileSync(join(questsDir, f), "utf-8"));
    questById.set(q.id, q);
  } catch {
    /* parse errors already reported above */
  }
}
for (const [id, q] of questById) {
  for (const pre of q.prerequisites ?? []) {
    if (!questById.has(pre))
      fail(`${id}.json`, `prerequisites: unknown quest id "${pre}" — dead learning-path link`);
    if (pre === id) fail(`${id}.json`, "prerequisites: quest cannot require itself");
  }
}

/* ---- prototype plan ---- */
if (!existsSync(planPath)) {
  fail("prototype-plan.json", "missing — the 15-quest prototype plan is required (doc 03 §13)");
} else {
  let plan;
  try {
    plan = JSON.parse(readFileSync(planPath, "utf-8"));
  } catch (e) {
    fail("prototype-plan.json", `invalid JSON: ${e.message}`);
  }
  if (plan) {
    const briefs = (plan.tracks ?? []).flatMap((t) => (t.briefs ?? []).map((b) => ({ ...b, track: t.slug })));
    if (briefs.length !== 15)
      fail("prototype-plan.json", `must contain exactly 15 prototype briefs (found ${briefs.length})`);
    const trackSlugs = new Set(AGE_TRACKS.map((t) => t.slug));
    const subjectSlugs = new Set(KID_SUBJECTS.map((s) => s.slug));
    const briefIds = new Set();
    for (const b of briefs) {
      const tag = `brief ${b.id ?? "?"}`;
      if (!b.id || briefIds.has(b.id)) fail("prototype-plan.json", `${tag}: duplicate or missing id`);
      briefIds.add(b.id);
      if (!trackSlugs.has(b.track)) fail("prototype-plan.json", `${tag}: unknown track ${b.track}`);
      if (!subjectSlugs.has(b.subject)) fail("prototype-plan.json", `${tag}: unknown subject ${b.subject}`);
      if (!["momo", "tara", "bobo"].includes(b.character))
        fail("prototype-plan.json", `${tag}: unknown character ${b.character}`);
      if (!TEMPLATE_IDS.includes(b.template))
        fail("prototype-plan.json", `${tag}: unknown template ${b.template} (doc 03 §13)`);
      if (!b.objective || !b.competency_evidence)
        fail("prototype-plan.json", `${tag}: objective + competency_evidence required`);
      if (!["brief", "authored-draft", "in-educator-review", "playable"].includes(b.status))
        fail("prototype-plan.json", `${tag}: invalid status ${b.status}`);
      if (b.status === "playable") {
        // The happy path, defined before it is needed (doc 03 §15): a brief may
        // go playable only when its quest file exists AND is reviewed, named,
        // and published. See content/kids/quest-schema.md "Review honesty".
        if (!b.quest_id || !questById.has(b.quest_id))
          fail("prototype-plan.json", `${tag}: playable requires quest_id pointing at an existing quest file`);
        else {
          const q = questById.get(b.quest_id);
          if (q.review_status !== "reviewed")
            fail("prototype-plan.json", `${tag}: quest ${b.quest_id} is not reviewed`);
          if (!q.content_reviewer)
            fail("prototype-plan.json", `${tag}: quest ${b.quest_id} names no reviewer`);
          if (!(q.published_version > 0))
            fail("prototype-plan.json", `${tag}: quest ${b.quest_id} is not published (v>0)`);
        }
      }
    }
    for (const t of plan.templates ?? []) {
      if (!TEMPLATE_IDS.includes(t.id))
        fail("prototype-plan.json", `template ${t.id}: must match a doc-03-§13 template id`);
    }
  }
}

/* ---- report ---- */
for (const w of warnings) console.warn(`  WARN ${w}`);
if (errors.length > 0) {
  console.error(`\nvalidate-kids-quests: ${errors.length} error(s) in ${files.length} quest file(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(
  `validate-kids-quests: OK — ${files.length} quests, prototype plan valid` +
    (warnings.length ? ` (${warnings.length} warnings)` : "")
);
