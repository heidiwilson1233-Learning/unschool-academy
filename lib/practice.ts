/**
 * Practice question bank — LOADED FROM CURRICULUM DATA, not hardcoded.
 *
 * Questions live as skill-tagged JSON under
 * `content/curriculum/jft-basic/units/<unit>/questions-*.json`
 * (portal-doctrine move 9: content as versioned data).
 *
 * This module is the delivery layer: it statically imports the curriculum
 * batches (static imports bundle correctly everywhere — fs discovery would
 * break edge routes and Vercel output tracing), validates them once at
 * load, and normalizes them to the player-facing PracticeQuestion shape.
 *
 * Adding a new batch = drop the JSON file + add one import line below.
 * Validation runs at build time: bad content fails the build, never the learner.
 *
 * STATUS: every question ships draft — pending Japanese SME review.
 * Nothing here is presented as official JFT-Basic material.
 */

import { DIAGNOSTIC_SKILL_INFO } from "@/lib/exams";

import unitScriptVocab from "@/content/curriculum/jft-basic/units/script-vocabulary/unit.json";
import unitConversation from "@/content/curriculum/jft-basic/units/conversation-expression/unit.json";
import unitListening from "@/content/curriculum/jft-basic/units/listening-comprehension/unit.json";
import unitReading from "@/content/curriculum/jft-basic/units/reading-comprehension/unit.json";

import svBatch0 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-script-vocabulary-batch0.json";
import svKanjiBatch1 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-kanji-reading-batch1.json";
import ceBatch0 from "@/content/curriculum/jft-basic/units/conversation-expression/questions-conversation-expression-batch0.json";
import lcBatch0 from "@/content/curriculum/jft-basic/units/listening-comprehension/questions-listening-comprehension-batch0.json";
import rcBatch0 from "@/content/curriculum/jft-basic/units/reading-comprehension/questions-reading-comprehension-batch0.json";

type RawQuestion = {
  id: string;
  skill: string;
  type: string;
  difficulty: number;
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  answer: number;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  source: string;
  status: string;
  version: number;
};

type Batch = { unitId: string; questions: RawQuestion[] };

const UNIT_META: Record<string, { title: PracticeTopic; skills: string[] }> = {
  "script-vocabulary": { title: unitScriptVocab.title as PracticeTopic, skills: unitScriptVocab.skills },
  "conversation-expression": { title: unitConversation.title as PracticeTopic, skills: unitConversation.skills },
  "listening-comprehension": { title: unitListening.title as PracticeTopic, skills: unitListening.skills },
  "reading-comprehension": { title: unitReading.title as PracticeTopic, skills: unitReading.skills },
};

const BATCHES: Batch[] = [
  { unitId: "script-vocabulary", questions: svBatch0 as RawQuestion[] },
  { unitId: "script-vocabulary", questions: svKanjiBatch1 as RawQuestion[] },
  { unitId: "conversation-expression", questions: ceBatch0 as RawQuestion[] },
  { unitId: "listening-comprehension", questions: lcBatch0 as RawQuestion[] },
  { unitId: "reading-comprehension", questions: rcBatch0 as RawQuestion[] },
];

function validateAndNormalize(): PracticeQuestion[] {
  const seen = new Set<string>();
  const out: PracticeQuestion[] = [];
  for (const batch of BATCHES) {
    const meta = UNIT_META[batch.unitId];
    if (!meta) throw new Error(`[practice] unknown unit "${batch.unitId}" in batch import`);
    for (const q of batch.questions) {
      if (!q.id || typeof q.id !== "string") throw new Error("[practice] question missing id");
      if (seen.has(q.id)) throw new Error(`[practice] duplicate question id "${q.id}"`);
      seen.add(q.id);
      if (!q.stem) throw new Error(`[practice] question "${q.id}" missing stem`);
      if (!Array.isArray(q.options) || q.options.length < 2)
        throw new Error(`[practice] question "${q.id}" needs at least 2 options`);
      const optIds = new Set(q.options.map((o) => o.id));
      if (optIds.size !== q.options.length)
        throw new Error(`[practice] question "${q.id}" has duplicate option ids`);
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
        throw new Error(`[practice] question "${q.id}" has out-of-range answer index`);
      if (!q.explanation || !q.hint)
        throw new Error(`[practice] question "${q.id}" missing explanation or hint`);
      if (!meta.skills.includes(q.skill))
        throw new Error(
          `[practice] question "${q.id}" skill "${q.skill}" not in unit "${batch.unitId}" skills`
        );
      const correctId = q.options[q.answer].id;
      out.push({
        id: q.id,
        topic: meta.title,
        skill: q.skill,
        skillLabel: DIAGNOSTIC_SKILL_INFO[q.skill]?.label ?? q.skill,
        stem: q.stem,
        stemJp: q.stemJp,
        options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp })),
        correctId,
        explanation: q.explanation,
        hint: q.hint,
        audioTextJp: q.audioTextJp,
        version: q.version,
        status: q.status,
        source: q.source,
      });
    }
  }
  return out;
}

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

/** The full practice bank, normalized from curriculum JSON. */
export const PRACTICE_QUESTIONS: PracticeQuestion[] = validateAndNormalize();

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
