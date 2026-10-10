#!/usr/bin/env node
// Build gate: validates EVERY exam's curriculum question batches, not just
// JFT-Basic's. Runs on every build via the "prebuild" hook (chained after
// write-images.mjs).
//
// SINGLE SOURCE OF TRUTH: the validation rules live in
// `lib/curriculum-rules.ts` (imported directly below — Node ≥22 strips types
// natively). This script only handles file discovery, cross-file checks,
// and reporting. There is exactly one implementation of the rules.
//
// Why a plain node script instead of the TS module graph? This gate must
// catch defects in exams whose banks are not yet wired into any page or API
// route (queue item "practice-engine: wire content/curriculum JSON into
// practice API" does the wiring later). Nothing in the module graph imports
// those batches yet, so a module-load check would never see them. This
// script scans the files directly — zero bundle impact.
//
// Checks:
//  1. Every questions-*.json parses as a non-empty array and passes the
//     shared validator (skill membership against its own unit.json, honesty
//     gate, schema rules).
//  2. Question ids are globally unique across ALL exams AND the diagnostic
//     bank (ids feed attempts/bookmarks/analytics keyed by id).
//  3. Every id is namespaced to its exam (starts with the exam dir's first
//     segment, e.g. "jft-basic" -> "jft-...") — catches copy-paste of one
//     exam's batch into another's folder.
//  4. Diagnostic files (questions-diagnostic-*.json) get requireOrder.
//  5. Warnings (non-failing): duplicate option texts within a question.
//
// Exit 0 = all valid; exit 1 = any defect, or zero batch files found (a
// silent pass is worse than a loud failure).
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  normalizeUnitMeta,
  validateBatch,
} from "../lib/curriculum-rules.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const curriculumDir = join(root, "content", "curriculum");

const errors = [];
const warnings = [];
let fileCount = 0;
let questionCount = 0;
const seenIds = new Map(); // id -> file path

function fail(where, msg) {
  errors.push(`${where}: ${msg}`);
}

function warn(where, msg) {
  warnings.push(`${where}: ${msg}`);
}

function checkBatch(path, examId, unitSkills, isDiagnostic) {
  let raw;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (e) {
    fail(path, `invalid JSON: ${e.message}`);
    return;
  }
  if (!Array.isArray(raw) || raw.length === 0) {
    fail(path, "not a non-empty array");
    return;
  }
  const expectedPrefix = examId.split("-")[0];
  let qs;
  try {
    qs = validateBatch(raw, {
      unitId: `${examId}`,
      skills: unitSkills,
      requireOrder: isDiagnostic,
    });
  } catch (e) {
    fail(path, e.message);
    return;
  }
  for (const q of qs) {
    questionCount++;
    if (seenIds.has(q.id)) {
      fail(path, `duplicate question id "${q.id}" (also in ${seenIds.get(q.id)})`);
    } else {
      seenIds.set(q.id, path);
    }
    if (q.id !== expectedPrefix && !q.id.startsWith(expectedPrefix + "-")) {
      fail(path, `question id "${q.id}" is not namespaced to exam "${examId}" (expected "${expectedPrefix}-...")`);
    }
    const texts = q.options.map((o) => o.text.trim().toLowerCase());
    if (new Set(texts).size !== texts.length) {
      warn(path, `question "${q.id}" has duplicate option texts`);
    }
  }
}

if (!existsSync(curriculumDir)) {
  console.error(`[validate-curriculum] missing directory: ${curriculumDir}`);
  process.exit(1);
}

for (const exam of readdirSync(curriculumDir, { withFileTypes: true })) {
  if (!exam.isDirectory()) continue;
  const unitsDir = join(curriculumDir, exam.name, "units");
  if (!existsSync(unitsDir)) continue;
  for (const unit of readdirSync(unitsDir, { withFileTypes: true })) {
    if (!unit.isDirectory()) continue;
    const unitDir = join(unitsDir, unit.name);
    const unitJsonPath = join(unitDir, "unit.json");
    if (!existsSync(unitJsonPath)) {
      fail(unitDir, "missing unit.json");
      continue;
    }
    let unitMeta;
    try {
      unitMeta = normalizeUnitMeta(JSON.parse(readFileSync(unitJsonPath, "utf8")));
    } catch (e) {
      fail(unitJsonPath, e.message);
      continue;
    }
    const unitSkills = unitMeta.skills.map((s) => s.id);
    for (const f of readdirSync(unitDir)) {
      if (!f.startsWith("questions-") || !f.endsWith(".json")) continue;
      fileCount++;
      checkBatch(join(unitDir, f), exam.name, unitSkills, f.startsWith("questions-diagnostic-"));
    }
  }
}

if (fileCount === 0) {
  console.error("[validate-curriculum] no question batch files found — refusing silent pass");
  process.exit(1);
}

for (const w of warnings) console.warn(`[validate-curriculum:warning] ${w}`);

if (errors.length > 0) {
  console.error(`[validate-curriculum] ${errors.length} defect(s) in ${fileCount} files:`);
  for (const e of errors.slice(0, 40)) console.error(`  - ${e}`);
  if (errors.length > 40) console.error(`  ... and ${errors.length - 40} more`);
  process.exit(1);
}

console.log(
  `[validate-curriculum] OK — ${questionCount} questions in ${fileCount} batch files across curriculum exams`
);
