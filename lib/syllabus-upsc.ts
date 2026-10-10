/**
 * UPSC CSE syllabus-map delivery layer — LEAF module (imports JSON data only,
 * no local code beyond the rules).
 *
 * Portal-doctrine move 9 (content as versioned data): the official UPSC Civil
 * Services Examination structure (3 stages, 11 papers, marks and qualifying
 * rules) broken into our curriculum units and skills, with the L1-L4
 * beginner-to-advanced study sequence as ours.
 *
 * Anti-drift guard: the validator cross-checks every skill id AND level
 * against the unit.json (the taxonomy source of truth — `suggested_level`
 * must match). Renaming a skill or moving it across levels in one place
 * without updating the other fails the build, never the learner.
 *
 * Official exam facts (marks, qualifying percentages, negative marking) are
 * NOT re-encoded here — they live in `content/curriculum/upsc-cse/syllabus.json`
 * with the source line, and the page imports them from here. One source,
 * no drift.
 */

import syllabusRaw from "@/content/curriculum/upsc-cse/syllabus.json";
import unitPolity from "@/content/curriculum/upsc-cse/units/polity-fundamentals/unit.json";

/* Explicit unit registry: a unit.json import must exist for every unit id
   the syllabus map references. Adding a second UPSC unit = add its import
   and one line here. */
const UNIT_JSON: Record<string, { title: string; skills: { id: string; suggested_level?: string }[] }> = {
  "polity-fundamentals": unitPolity,
};

const LEVEL_NAMES: Record<string, string> = {
  L1: "Foundation",
  L2: "Intermediate",
  L3: "Advanced",
  L4: "Exam mastery",
};

const OFFICIAL_STAGE_ORDER = [
  "Preliminary Examination",
  "Main Examination",
  "Personality Test (Interview)",
];

/** Learner-facing skill labels (unit.json titles carry wave-agent "(L2 preview)" shorthand). */
const LABEL_OVERRIDES: Record<string, string> = {
  "constitution-making": "Making of the Indian Constitution",
  preamble: "Preamble of the Constitution",
  "fundamental-rights": "Fundamental Rights",
  dpsp: "Directive Principles of State Policy",
  "union-government-basics": "Union Government Basics",
};

/** Explicit stage keys — units declare which stages they feed; the page matches exactly, never by substring. */
const STAGE_KEYS = ["prelims", "mains", "interview"] as const;

export type SyllabusUpscSkill = {
  id: string;
  label: string;
  level: string;
  levelName: string;
  sequence: number;
  why: string;
};

export type SyllabusUpscPaper = {
  name: string;
  marks: string;
  detail: string;
  coverage?: string;
  scoring?: string;
};

export type SyllabusUpscStage = {
  stage: string;
  /** "prelims" | "mains" | "interview" — the exact key units reference in stageKeys. */
  stageKey: (typeof STAGE_KEYS)[number];
  order: number;
  role: string;
  papers: SyllabusUpscPaper[];
  syllabusTopics?: string[];
};

export type SyllabusUpscUnit = {
  unit: string;
  unitTitle: string;
  order: number;
  mapsTo: string[];
  /** Which stages this unit feeds — validated against STAGE_KEYS. */
  stageKeys: (typeof STAGE_KEYS)[number][];
  skills: SyllabusUpscSkill[];
};

export type SyllabusUpsc = {
  exam: string;
  source: string;
  sourceNote: string;
  status: string;
  version: number;
  stages: SyllabusUpscStage[];
  units: SyllabusUpscUnit[];
  /** All skills in study sequence (1..N) — drives the study-order trail. */
  studyOrder: SyllabusUpscSkill[];
};

function fail(where: string, msg: string): never {
  throw new Error(`[syllabus-upsc] ${where}: ${msg}`);
}

/** Build-time validation. Throws on the first defect. */
function validateSyllabusUpsc(raw: unknown): SyllabusUpsc {
  const where = "upsc-cse/syllabus.json";
  if (!raw || typeof raw !== "object") fail(where, "not an object");
  const r = raw as Record<string, unknown>;
  if (r.exam !== "upsc-cse") fail(where, 'exam must be "upsc-cse"');
  if (typeof r.source !== "string" || !r.source)
    fail(where, "missing source (content-schema rule 3)");
  if (typeof r.sourceNote !== "string" || !r.sourceNote)
    fail(where, "missing sourceNote (what is official vs ours)");

  if (!Array.isArray(r.stages)) fail(where, "stages is not an array");
  const stages = r.stages as Record<string, unknown>[];
  if (stages.length !== OFFICIAL_STAGE_ORDER.length)
    fail(where, `expected ${OFFICIAL_STAGE_ORDER.length} stages, got ${stages.length}`);
  const parsedStages: SyllabusUpscStage[] = stages.map((s, i) => {
    const sw = `stage #${i}`;
    if (s.stage !== OFFICIAL_STAGE_ORDER[i])
      fail(sw, `expected "${OFFICIAL_STAGE_ORDER[i]}", got "${s.stage}"`);
    if (s.order !== i + 1) fail(sw, `order must be ${i + 1}`);
    if (typeof s.role !== "string" || !s.role) fail(sw, "missing role");
    if (!Array.isArray(s.papers) || s.papers.length === 0)
      fail(sw, "papers must be a non-empty array");
    const papers = (s.papers as Record<string, unknown>[]).map((p, j) => {
      const pw = `${sw} paper #${j}`;
      if (typeof p.name !== "string" || !p.name) fail(pw, "missing name");
      if (typeof p.marks !== "string" || !p.marks) fail(pw, "missing marks");
      if (typeof p.detail !== "string" || !p.detail) fail(pw, "missing detail");
      return {
        name: p.name,
        marks: p.marks,
        detail: p.detail,
        coverage: typeof p.coverage === "string" ? p.coverage : undefined,
        scoring: typeof p.scoring === "string" ? p.scoring : undefined,
      };
    });
    const topics = Array.isArray(s.syllabusTopics)
      ? (s.syllabusTopics as unknown[]).filter((t): t is string => typeof t === "string")
      : undefined;
    return {
      stage: s.stage as string,
      stageKey: STAGE_KEYS[i],
      order: s.order as number,
      role: s.role as string,
      papers,
      syllabusTopics: topics,
    };
  });

  if (!Array.isArray(r.units)) fail(where, "units is not an array");
  const units = r.units as Record<string, unknown>[];
  const seenSeq = new Set<number>();
  const studyOrder: SyllabusUpscSkill[] = [];
  const parsedUnits: SyllabusUpscUnit[] = units.map((u, i) => {
    const uw = `unit #${i}`;
    const unitId = u.unit as string;
    const meta = UNIT_JSON[unitId];
    if (!meta) fail(uw, `unknown unit "${unitId}" (add its unit.json import)`);
    if (u.order !== i + 1) fail(uw, `order must be ${i + 1}`);
    if (!Array.isArray(u.mapsTo) || u.mapsTo.length === 0)
      fail(uw, "mapsTo must be a non-empty array (which official papers this unit feeds)");
    if (!Array.isArray(u.stageKeys) || u.stageKeys.length === 0)
      fail(uw, "stageKeys must be a non-empty array of stage keys");
    for (const k of u.stageKeys) {
      if (!(STAGE_KEYS as readonly string[]).includes(k as string))
        fail(uw, `unknown stageKey "${k}"`);
    }
    if (!Array.isArray(u.skills) || u.skills.length === 0)
      fail(uw, "skills must be a non-empty array");
    const unitSkills = meta.skills;
    const skills = (u.skills as Record<string, unknown>[]).map((k) => {
      const id = k.id as string;
      const kw = `skill "${id}"`;
      const skillMeta = unitSkills.find((s) => s.id === id);
      if (!skillMeta)
        fail(kw, `not in unit "${unitId}" skills (unit.json is the source of truth)`);
      const level = k.level as string;
      if (!LEVEL_NAMES[level]) fail(kw, `unknown level "${level}"`);
      if (skillMeta.suggested_level && skillMeta.suggested_level !== level)
        fail(kw, `level "${level}" disagrees with unit.json suggested_level "${skillMeta.suggested_level}"`);
      const seq = k.sequence as number;
      if (!Number.isInteger(seq) || seq < 1)
        fail(kw, "sequence must be a positive integer");
      if (seenSeq.has(seq)) fail(kw, `duplicate study sequence ${seq}`);
      seenSeq.add(seq);
      if (typeof k.why !== "string" || !k.why) fail(kw, "missing why");
      if (!LABEL_OVERRIDES[id])
        fail(kw, "missing LABEL_OVERRIDES entry (raw kebab-case ids must never render)");
      const skill: SyllabusUpscSkill = {
        id,
        label: LABEL_OVERRIDES[id] ?? id,
        level,
        levelName: LEVEL_NAMES[level],
        sequence: seq,
        why: k.why as string,
      };
      studyOrder.push(skill);
      return skill;
    });
    return {
      unit: unitId,
      unitTitle: meta.title,
      order: u.order as number,
      mapsTo: (u.mapsTo as string[]).slice(),
      stageKeys: (u.stageKeys as (typeof STAGE_KEYS)[number][]).slice(),
      skills,
    };
  });
  studyOrder.sort((a, b) => a.sequence - b.sequence);
  const n = studyOrder.length;
  for (let i = 0; i < n; i++) {
    if (studyOrder[i].sequence !== i + 1)
      fail(where, `study sequences must run 1..${n} with no gaps`);
  }

  return {
    exam: r.exam as string,
    source: r.source as string,
    sourceNote: r.sourceNote as string,
    status: r.status as string,
    version: r.version as number,
    stages: parsedStages,
    units: parsedUnits,
    studyOrder,
  };
}

export const SYLLABUS_UPSC: SyllabusUpsc = validateSyllabusUpsc(syllabusRaw);
