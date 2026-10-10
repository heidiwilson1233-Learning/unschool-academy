/**
 * Syllabus-map delivery layer — LEAF module (imports JSON data only, no local code).
 *
 * Portal-doctrine move 9 (content as versioned data) + move 10 (discovery):
 * the official JFT-Basic test structure (sections + per-section question
 * counts from the Japan Foundation) broken into our curriculum units and
 * skills, with the L1-L4 beginner-to-advanced study sequence as ours.
 *
 * Anti-drift guard: the validator cross-checks every skill id against
 * `UNIT_META` (unit.json files, the taxonomy source of truth) and
 * `DIAGNOSTIC_SKILL_INFO` (lib/exams.ts). Renaming a skill id in one place
 * without updating the others fails the build, never the learner.
 *
 * Official exam facts (duration, scoring, section rules) are NOT re-encoded
 * here — they live in `JFT_PROGRAM.officialFacts` (lib/exams.ts) and the page
 * imports them from there. One source, no drift.
 */

import syllabusRaw from "@/content/curriculum/jft-basic/syllabus.json";
import { UNIT_META, type CurriculumUnitId } from "@/lib/curriculum";
import { DIAGNOSTIC_SKILL_INFO } from "@/lib/exams";

const LEVEL_NAMES: Record<string, string> = {
  L1: "Foundation",
  L2: "Intermediate",
  L3: "Advanced",
  L4: "Exam mastery",
};

const OFFICIAL_SECTION_ORDER = [
  "Script and Vocabulary",
  "Conversation and Expression",
  "Listening Comprehension",
  "Reading Comprehension",
];

export type SyllabusSkill = {
  id: string;
  label: string;
  practiceSlug: string;
  purpose: string;
  level: string;
  levelName: string;
  sequence: number;
  why: string;
};

export type SyllabusSection = {
  section: string;
  unit: CurriculumUnitId;
  officialQuestions: string;
  order: number;
  purpose: string;
  ruleNote?: string;
  example?: { jp: string; en: string };
  skills: SyllabusSkill[];
};

export type Syllabus = {
  exam: string;
  source: string;
  sourceNote: string;
  status: string;
  version: number;
  sections: SyllabusSection[];
  /** All skills in study sequence (1..N) — drives the study-order trail. */
  studyOrder: SyllabusSkill[];
};

/**
 * Skill labels the page uses. Defaults to DIAGNOSTIC_SKILL_INFO; overridden
 * here only where the diagnostic shorthand would narrow the official scope.
 */
const LABEL_OVERRIDES: Record<string, string> = {
  "listening-shops": "Shops and public places",
};

const SKILL_PURPOSES: Record<string, string> = {
  "word-meaning": "Meanings of everyday words.",
  "kanji-reading": "Hiragana readings of kanji words.",
  "word-usage": "Choosing the word that fits the sentence.",
  "kanji-meaning-usage": "Meanings and uses of kanji words.",
  "grammar": "Grammar that fits the context.",
  "expression": "What to say in everyday situations.",
  "listening-conversation": "Everyday conversations and exchanges.",
  "listening-shops": "Shops and public places.",
  "listening-announcements": "Instructions and announcements.",
  "reading-messages": "Short letters and messages.",
  "information-search": "Finding information in notices.",
};

function fail(where: string, msg: string): never {
  throw new Error(`[syllabus] ${where}: ${msg}`);
}

/** Build-time validation. Throws on the first defect. */
function validateSyllabus(raw: unknown): Syllabus {
  const where = "syllabus.json";
  if (!raw || typeof raw !== "object") fail(where, "not an object");
  const r = raw as Record<string, unknown>;
  if (r.exam !== "jft-basic") fail(where, 'exam must be "jft-basic"');
  if (typeof r.source !== "string" || !r.source)
    fail(where, "missing source (content-schema rule 3)");
  if (typeof r.sourceNote !== "string" || !r.sourceNote)
    fail(where, "missing sourceNote (what is official vs ours)");
  if (!Array.isArray(r.sections)) fail(where, "sections is not an array");
  const sections = r.sections as Record<string, unknown>[];
  if (sections.length !== 4)
    fail(where, `expected 4 sections, got ${sections.length}`);
  sections.forEach((s, i) => {
    const sw = `section #${i}`;
    if (s.section !== OFFICIAL_SECTION_ORDER[i])
      fail(sw, `expected "${OFFICIAL_SECTION_ORDER[i]}", got "${s.section}"`);
    if (s.order !== i + 1) fail(sw, `order must be ${i + 1}`);
    const unit = s.unit as string;
    if (!(unit in UNIT_META)) fail(sw, `unknown unit "${unit}"`);
    if (typeof s.officialQuestions !== "string" || !s.officialQuestions)
      fail(sw, "missing officialQuestions");
    if (typeof s.purpose !== "string" || !s.purpose)
      fail(sw, "missing purpose");
    if (!Array.isArray(s.skills)) fail(sw, "skills is not an array");
  });

  const seenSeq = new Set<number>();
  const studyOrder: SyllabusSkill[] = [];
  const parsed: SyllabusSection[] = sections.map((s, i) => {
    const unit = s.unit as CurriculumUnitId;
    const unitSkills = UNIT_META[unit].skills;
    const skills = (s.skills as Record<string, unknown>[]).map((k) => {
      const id = k.id as string;
      const kw = `skill "${id}"`;
      if (!unitSkills.includes(id))
        fail(kw, `not in unit "${unit}" skills (unit.json is the source of truth)`);
      if (!DIAGNOSTIC_SKILL_INFO[id])
        fail(kw, "missing from DIAGNOSTIC_SKILL_INFO (lib/exams.ts)");
      const level = k.level as string;
      if (!LEVEL_NAMES[level]) fail(kw, `unknown level "${level}"`);
      const seq = k.sequence as number;
      if (!Number.isInteger(seq) || seq < 1)
        fail(kw, "sequence must be a positive integer");
      if (seenSeq.has(seq)) fail(kw, `duplicate study sequence ${seq}`);
      seenSeq.add(seq);
      if (typeof k.why !== "string" || !k.why) fail(kw, "missing why");
      const skill: SyllabusSkill = {
        id,
        label: LABEL_OVERRIDES[id] ?? DIAGNOSTIC_SKILL_INFO[id].label,
        practiceSlug: DIAGNOSTIC_SKILL_INFO[id].practiceSlug,
        purpose: SKILL_PURPOSES[id] ?? DIAGNOSTIC_SKILL_INFO[id].label,
        level,
        levelName: LEVEL_NAMES[level],
        sequence: seq,
        why: k.why as string,
      };
      studyOrder.push(skill);
      return skill;
    });
    return {
      section: s.section as string,
      unit,
      officialQuestions: s.officialQuestions as string,
      order: s.order as number,
      purpose: s.purpose as string,
      ruleNote: typeof s.ruleNote === "string" ? s.ruleNote : undefined,
      example:
        s.example && typeof s.example === "object"
          ? (s.example as { jp: string; en: string })
          : undefined,
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
    sections: parsed,
    studyOrder,
  };
}

export const SYLLABUS: Syllabus = validateSyllabus(syllabusRaw);
