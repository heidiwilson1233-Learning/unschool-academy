/**
 * JFT-Basic question bank — the JFT-Basic INSTANCE of the exam-agnostic
 * question-bank factory (`lib/question-bank.ts`).
 *
 * This module is pure CONFIG: which batches belong to JFT-Basic, which
 * skill labels to show, and the curated mock set. All validation and
 * normalization live in the factory and `lib/curriculum.ts`; nothing
 * exam-specific is hardcoded in the delivery layer anymore.
 *
 * NOTE on layering: this module deliberately does NOT import `lib/exams`.
 * `lib/exams` loads the diagnostic bank at module scope, and this module is
 * imported (transitively) by a client component — importing `lib/exams`
 * here would ship the diagnostic answer keys into the client bundle.
 * The diagnostic↔practice id-collision guard lives in the prebuild gate
 * (`scripts/validate-curriculum.mjs`), which scans both banks globally.
 *
 * Questions live as skill-tagged JSON under
 * `content/curriculum/jft-basic/units/<unit>/questions-*.json`
 * (portal-doctrine move 9: content as versioned data). Adding a new batch =
 * drop the JSON file + add one entry to JFT_BATCHES below. Validation runs
 * at build time: bad content fails the build, never the learner.
 *
 * STATUS: every question ships draft — pending Japanese SME review.
 * Nothing here is presented as official JFT-Basic material.
 */

import {
  bankUnitFromJson,
  createQuestionBank,
  type BankBatchInput,
  type BankQuestion,
  type QuestionBank,
} from "@/lib/question-bank";
import { JFT_SKILL_LABELS, PRACTICE_TOPICS, type PracticeTopic } from "@/lib/practice-meta";

import unitScriptVocab from "@/content/curriculum/jft-basic/units/script-vocabulary/unit.json";
import unitConversation from "@/content/curriculum/jft-basic/units/conversation-expression/unit.json";
import unitListening from "@/content/curriculum/jft-basic/units/listening-comprehension/unit.json";
import unitReading from "@/content/curriculum/jft-basic/units/reading-comprehension/unit.json";

import svBatch0 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-script-vocabulary-batch0.json";
import svKanjiBatch1 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-kanji-reading-batch1.json";
import svWordBatch1 from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-word-meaning-usage-batch1.json";
import ceBatch0 from "@/content/curriculum/jft-basic/units/conversation-expression/questions-conversation-expression-batch0.json";
import ceBatch1 from "@/content/curriculum/jft-basic/units/conversation-expression/questions-conversation-expression-batch1.json";
import lcBatch0 from "@/content/curriculum/jft-basic/units/listening-comprehension/questions-listening-comprehension-batch0.json";
import lcBatch1 from "@/content/curriculum/jft-basic/units/listening-comprehension/questions-listening-comprehension-batch1.json";
import rcBatch0 from "@/content/curriculum/jft-basic/units/reading-comprehension/questions-reading-comprehension-batch0.json";
import rcBatch1 from "@/content/curriculum/jft-basic/units/reading-comprehension/questions-reading-comprehension-batch1.json";

export type PracticeQuestion = BankQuestion;
export type { PracticeTopic };
export { PRACTICE_TOPICS };

const JFT_BATCHES: BankBatchInput[] = [
  { unit: bankUnitFromJson(unitScriptVocab), raw: svBatch0 },
  { unit: bankUnitFromJson(unitScriptVocab), raw: svKanjiBatch1 },
  { unit: bankUnitFromJson(unitScriptVocab), raw: svWordBatch1 },
  { unit: bankUnitFromJson(unitConversation), raw: ceBatch0 },
  { unit: bankUnitFromJson(unitConversation), raw: ceBatch1 },
  { unit: bankUnitFromJson(unitListening), raw: lcBatch0 },
  { unit: bankUnitFromJson(unitListening), raw: lcBatch1 },
  { unit: bankUnitFromJson(unitReading), raw: rcBatch0 },
  { unit: bankUnitFromJson(unitReading), raw: rcBatch1 },
];

const JFT_BANK: QuestionBank = createQuestionBank("jft-basic", JFT_BATCHES, {
  skillLabels: JFT_SKILL_LABELS,
});

/** The full JFT-Basic practice bank, normalized from curriculum JSON. */
export const PRACTICE_QUESTIONS: PracticeQuestion[] = JFT_BANK.questions;

export function practiceByTopic(topic: string): PracticeQuestion[] {
  return JFT_BANK.byTopic(topic);
}

export function practiceQuestionById(id: string): PracticeQuestion | undefined {
  return JFT_BANK.byId(id);
}

/**
 * The 30-minute mock is a CURATED, frozen set — the 20 original pilot questions.
 * New content batches grow practice, never the timed mock.
 */
export const MOCK_QUESTION_IDS: readonly string[] = [
  "jft-p01", "jft-p02", "jft-p03", "jft-p04", "jft-p05",
  "jft-p06", "jft-p07", "jft-p08", "jft-p09", "jft-p10",
  "jft-p11", "jft-p12", "jft-p13", "jft-p14", "jft-p15",
  "jft-p16", "jft-p17", "jft-p18", "jft-p19", "jft-p20",
];

/**
 * Mock 2 — the full-length mock, CURATED and frozen: 50 questions, 60 minutes,
 * ordered by official section (Script and Vocabulary → Conversation and
 * Expression → Listening Comprehension → Reading Comprehension) with skills
 * interleaved inside each section (retrieval-practice rule: never block one
 * skill). Section sizes 12/12/13/13 mirror the official "around 12 per
 * section, ~50 total" weights.
 *
 * Honesty notes: the Script and Vocabulary block draws only from the 3 banked
 * skills (word-meaning, kanji-reading, word-usage); kanji-meaning-usage has
 * no banked questions yet, so it is absent — disclosed on the landing page.
 * The listening and reading blocks reuse 10 questions from Mock 1 (the bank
 * has exactly 13 + 13 of each) — also disclosed. The set never changes once
 * published; future batches grow practice, not this mock.
 */
export const MOCK2_QUESTION_IDS: readonly string[] = [
  "jft-sv-wm-001", "jft-sv-kr-001", "jft-sv-wu-011", "jft-sv-wm-008", "jft-sv-kr-002",
  "jft-sv-wu-012", "jft-sv-wm-002", "jft-sv-kr-003", "jft-sv-wu-014", "jft-sv-wm-005",
  "jft-sv-kr-004", "jft-sv-wu-015", "jft-ce-gr-001", "jft-ce-ex-001", "jft-ce-gr-002",
  "jft-ce-ex-004", "jft-ce-gr-003", "jft-ce-ex-002", "jft-ce-gr-004", "jft-ce-ex-005",
  "jft-ce-gr-005", "jft-ce-ex-003", "jft-ce-gr-006", "jft-ce-ex-008", "jft-lc-001",
  "jft-lc-004", "jft-lc-007", "jft-lc-003", "jft-lc-005", "jft-lc-002",
  "jft-lc-006", "jft-lc-008", "jft-p11", "jft-p12", "jft-p13",
  "jft-p14", "jft-p15", "jft-rc-002", "jft-rc-001", "jft-rc-006",
  "jft-rc-004", "jft-rc-003", "jft-rc-007", "jft-rc-005", "jft-p16",
  "jft-rc-008", "jft-p17", "jft-p18", "jft-p20", "jft-p19",
];

export function mockQuestions(): PracticeQuestion[] {
  return MOCK_QUESTION_IDS.map((id) => {
    const q = JFT_BANK.byId(id);
    if (!q) throw new Error(`[practice] mock question "${id}" missing from curriculum bank`);
    return q;
  });
}

/** The frozen 50-question full mock set (Mock 2). */
export function mockFullQuestions(): PracticeQuestion[] {
  return MOCK2_QUESTION_IDS.map((id) => {
    const q = JFT_BANK.byId(id);
    if (!q) throw new Error(`[practice] full-mock question "${id}" missing from curriculum bank`);
    return q;
  });
}
