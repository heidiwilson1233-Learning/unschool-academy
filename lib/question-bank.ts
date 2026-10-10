/**
 * Question-bank factory — the exam-agnostic content delivery layer.
 *
 * DATA-FREE MODULE: code only — no `node:fs`, no `node:path`, no dynamic
 * `import()` of content paths. Per-exam instance modules own their static
 * JSON imports (static imports bundle correctly everywhere, including future
 * edge routes; fs discovery would break them). Never build a barrel that
 * statically imports all exams' batches into one module.
 *
 * Portal-doctrine move 9 (content as versioned data): questions live as
 * skill-tagged JSON under `content/curriculum/<exam-id>/units/<unit>/`,
 * never hardcoded in components. This module turns any exam's batches into
 * a validated, normalized QuestionBank. Per-exam wiring (which batches,
 * which skill labels) lives in the exam's own module (e.g. `lib/practice.ts`
 * for JFT-Basic), never here.
 *
 * Design notes (distilled from the billion-dollar portals):
 * - Khan Academy's Perseus: exercises are JSON + a widget registry; the
 *   renderer only accepts content whose version it understands. Our
 *   `KNOWN_TYPES` registry + per-item `version` field is the same contract:
 *   the player renders a type iff it is in the registry.
 * - freeCodeCamp: 6,000+ challenges live as plain files in git; CI confirms
 *   the build passes; user progress lives in a database, never the content.
 *   Same split here: content files are versioned data, build-time validated;
 *   attempts/progress live in `lib/attempts.ts` (localStorage), never here.
 * - Duolingo: course -> skill tree -> skills -> lessons -> challenges, with
 *   skill ids stable across courses. Same hierarchy: exam -> units -> skills
 *   -> batches. Question ids are namespaced per exam (e.g. `jee-ma-alg-qe-001`)
 *   so banks never collide.
 *
 * Validation runs at module load: bad content fails `next build`, never the
 * learner.
 *
 * HONESTY GATE: `status` must be "draft-pending-sme-review" — enforced in
 * `lib/curriculum-rules.ts`, so it applies uniformly to every exam with zero
 * per-exam effort. Nothing here may be presented as official or reviewed
 * material.
 */

import {
  normalizeUnitMeta,
  validateCurriculumQuestions,
  type NormalizedCurriculumQuestion,
  type UnitSkill,
} from "@/lib/curriculum";

/** One curriculum unit, exam-agnostic. */
export type BankUnit = {
  id: string;
  title: string;
  skills: UnitSkill[];
};

/** One batch registration: which unit a raw JSON batch belongs to. */
export type BankBatchInput = {
  unit: BankUnit;
  raw: unknown;
};

/**
 * A normalized, learner-ready question. Extends the validator's normalized
 * shape with bank context — one question type across validator -> bank ->
 * player, so no field the player needs (`type`, `difficulty`, `level`,
 * `passage`) is dropped by the mapping.
 */
export type BankQuestion = NormalizedCurriculumQuestion & {
  /** Exam this question belongs to (e.g. "jft-basic"). */
  examId: string;
  /** Unit title — the practice "topic" label shown to learners. */
  topic: string;
  /** Human-readable skill label. */
  skillLabel: string;
  /**
   * Stable option id of the correct answer (resolved from `correctIndex`
   * once, at bank build — downstream code must compare ids, never indexes,
   * so render-time shuffling can never corrupt correctness).
   */
  correctId: string;
};

export type CreateQuestionBankOpts = {
  /**
   * Per-exam skill-id -> human label map. Used first; falls back to the
   * unit.json skill title, then to the raw skill id. (For JFT-Basic this is
   * the JFT_SKILL_LABELS map in lib/practice-meta.ts, shared with the
   * diagnostic taxonomy so the player and the gap map speak one language.)
   */
  skillLabels?: Record<string, string>;
  /**
   * Ids reserved outside this bank (e.g. another bank's ids) — the bank
   * throws if any question id collides with them. Lets future exams reuse
   * the diagnostic-collision guard without reimplementing it.
   */
  reservedIds?: Set<string>;
};

export type QuestionBank = {
  examId: string;
  /** All questions, in registration order. */
  questions: BankQuestion[];
  /** Unit titles in first-seen order (the practice "topics"). */
  topics: string[];
  questionCount: number;
  byTopic: (topic: string) => BankQuestion[];
  byId: (id: string) => BankQuestion | undefined;
  /** Unit id -> BankUnit (taxonomy source of truth for this bank). */
  units: Record<string, BankUnit>;
};

/**
 * Build a validated question bank for one exam. Throws on the first content
 * defect — call at module load so broken content blocks deployment.
 */
export function createQuestionBank(
  examId: string,
  batches: BankBatchInput[],
  opts: CreateQuestionBankOpts = {}
): QuestionBank {
  if (!/^[a-z0-9-]+$/.test(examId))
    throw new Error(`[question-bank] invalid examId "${examId}" (expected lowercase letters, digits, hyphens)`);
  const seen = new Set<string>();
  const questions: BankQuestion[] = [];
  const topics: string[] = [];
  const units: Record<string, BankUnit> = {};
  const skillIds = (u: BankUnit) => u.skills.map((s) => s.id);

  for (const batch of batches) {
    const unit = batch.unit;
    if (!units[unit.id]) {
      units[unit.id] = unit;
      topics.push(unit.title);
    }
    const labelFor = (skill: string): string =>
      opts.skillLabels?.[skill] ??
      unit.skills.find((s) => s.id === skill)?.label ??
      skill;

    for (const q of validateCurriculumQuestions(batch.raw, {
      unitId: unit.id,
      skills: skillIds(unit),
    })) {
      if (seen.has(q.id))
        throw new Error(`[question-bank] duplicate question id "${q.id}" in exam "${examId}"`);
      if (opts.reservedIds?.has(q.id))
        throw new Error(`[question-bank] question id "${q.id}" collides with a reserved id`);
      seen.add(q.id);
      questions.push(toBankQuestion(examId, unit, labelFor(q.skill), q));
    }
  }

  return {
    examId,
    questions,
    topics,
    questionCount: questions.length,
    byTopic: (topic) => questions.filter((q) => q.topic === topic),
    byId: (id) => questions.find((q) => q.id === id),
    units,
  };
}

/**
 * Normalize one curriculum unit.json into a BankUnit. Accepts the two
 * shapes in the wild: JFT-style `skills: string[]` and the richer
 * `skills: [{ id, title, ... }]` written by the content agents.
 */
export function bankUnitFromJson(unitJson: {
  id: string;
  title: string;
  skills: unknown;
}): BankUnit {
  return normalizeUnitMeta(unitJson);
}

function toBankQuestion(
  examId: string,
  unit: BankUnit,
  skillLabel: string,
  q: NormalizedCurriculumQuestion
): BankQuestion {
  return {
    ...q,
    examId,
    topic: unit.title,
    skillLabel,
    correctId: q.options[q.correctIndex].id,
  };
}
