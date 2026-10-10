/**
 * Practice question bank — LOADED FROM CURRICULUM DATA, not hardcoded.
 *
 * Questions live as skill-tagged JSON under
 * `content/curriculum/jft-basic/units/<unit>/questions-*.json`
 * (portal-doctrine move 9: content as versioned data).
 *
 * This module is the delivery layer: it statically imports the curriculum
 * batches (static imports bundle correctly everywhere — fs discovery would
 * break edge routes and Vercel output tracing) and validates them through
 * the shared `lib/curriculum.ts` loader. Validation runs at build time:
 * bad content fails the build, never the learner.
 *
 * Adding a new batch = drop the JSON file + add one entry to BATCHES below.
 *
 * STATUS: every question ships draft — pending Japanese SME review.
 * Nothing here is presented as official JFT-Basic material.
 */

import { DIAGNOSTIC_QUESTIONS, DIAGNOSTIC_SKILL_INFO } from "@/lib/exams";
import {
  UNIT_META,
  validateCurriculumQuestions,
  type CurriculumUnitId,
} from "@/lib/curriculum";

import svBatch0 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-script-vocabulary-batch0.json";
import svKanjiBatch1 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-kanji-reading-batch1.json";
import svWordBatch1 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-word-meaning-usage-batch1.json";
import ceBatch0 from "@/content/curriculum/jft-basic/units/conversation-expression/questions-conversation-expression-batch0.json";
import ceBatch1 from "@/content/curriculum/jft-basic/units/conversation-expression/questions-conversation-expression-batch1.json";
import lcBatch0 from "@/content/curriculum/jft-basic/units/listening-comprehension/questions-listening-comprehension-batch0.json";
import rcBatch0 from "@/content/curriculum/jft-basic/units/reading-comprehension/questions-reading-comprehension-batch0.json";

export type PracticeQuestion = {
  id: string;
  topic: "Script and Vocabulary" | "Conversation and Expression" | "Listening Comprehension" | "Reading Comprehension";
  /** Curriculum skill id (mirrors unit.json `skills`, shared with the diagnostic taxonomy). */
  skill: string;
  /** Human-readable skill label. */
  skillLabel: string;
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctId: string;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  /** Content version of the item the learner saw (schema rule: attempts reference this). */
  version: number;
  status: string;
  source: string;
};

export const PRACTICE_TOPICS = [
  "Script and Vocabulary",
  "Conversation and Expression",
  "Listening Comprehension",
  "Reading Comprehension",
] as const;

export type PracticeTopic = (typeof PRACTICE_TOPICS)[number];

const BATCHES: { unitId: CurriculumUnitId; raw: unknown }[] = [
  { unitId: "script-vocabulary", raw: svBatch0 },
  { unitId: "script-vocabulary", raw: svKanjiBatch1 },
  { unitId: "script-vocabulary", raw: svWordBatch1 },
  { unitId: "conversation-expression", raw: ceBatch0 },
  { unitId: "conversation-expression", raw: ceBatch1 },
  { unitId: "listening-comprehension", raw: lcBatch0 },
  { unitId: "reading-comprehension", raw: rcBatch0 },
];

/** The full practice bank, normalized from curriculum JSON. */
export const PRACTICE_QUESTIONS: PracticeQuestion[] = (() => {
  const seen = new Set<string>();
  const out: PracticeQuestion[] = [];
  for (const batch of BATCHES) {
    for (const q of validateCurriculumQuestions(batch.raw, { unitId: batch.unitId })) {
      if (seen.has(q.id))
        throw new Error(`[practice] duplicate question id "${q.id}" across batches`);
      seen.add(q.id);
      out.push({
        id: q.id,
        topic: UNIT_META[batch.unitId].title as PracticeTopic,
        skill: q.skill,
        skillLabel: DIAGNOSTIC_SKILL_INFO[q.skill]?.label ?? q.skill,
        stem: q.stem,
        stemJp: q.stemJp,
        options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp })),
        correctId: q.options[q.correctIndex].id,
        explanation: q.explanation,
        hint: q.hint,
        audioTextJp: q.audioTextJp,
        version: q.version,
        status: q.status,
        source: q.source,
      });
    }
  }
  // Cross-bank guard: the diagnostic bank (lib/exams) loads through the same
  // JSON pipeline — ids must never collide across the two banks.
  const diagIds = new Set(DIAGNOSTIC_QUESTIONS.map((d) => d.id));
  for (const q of out) {
    if (diagIds.has(q.id))
      throw new Error(`[practice] question id "${q.id}" collides with a diagnostic question id`);
  }
  return out;
})();

export function practiceByTopic(topic: string): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.topic === topic);
}

export function practiceQuestionById(id: string): PracticeQuestion | undefined {
  return PRACTICE_QUESTIONS.find((q) => q.id === id);
}

/**
 * The 30-minute mock is a CURATED, frozen set — the 20 original pilot questions.
 * New content batches grow practice, never the timed mock. (The full 50q/60min
 * mock with real section weights is a later portal-queue item.)
 */
export const MOCK_QUESTION_IDS: readonly string[] = [
  "jft-p01", "jft-p02", "jft-p03", "jft-p04", "jft-p05",
  "jft-p06", "jft-p07", "jft-p08", "jft-p09", "jft-p10",
  "jft-p11", "jft-p12", "jft-p13", "jft-p14", "jft-p15",
  "jft-p16", "jft-p17", "jft-p18", "jft-p19", "jft-p20",
];

export function mockQuestions(): PracticeQuestion[] {
  const byId = new Map(PRACTICE_QUESTIONS.map((q) => [q.id, q]));
  return MOCK_QUESTION_IDS.map((id) => {
    const q = byId.get(id);
    if (!q) throw new Error(`[practice] mock question "${id}" missing from curriculum bank`);
    return q;
  });
}
