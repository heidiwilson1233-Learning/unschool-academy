/**
 * Curriculum content delivery layer — TypeScript wrapper around the shared
 * rule core in `lib/curriculum-rules.ts` (the single source of truth; the
 * prebuild script imports the rules directly, so there is exactly one
 * implementation of validation).
 *
 * LEAF module: imports JSON data only, no local code beyond the rules.
 * `lib/practice.ts` (practice bank) and `lib/exams.ts` (diagnostic bank)
 * load through here, so content files get identical build-time validation
 * no matter which surface consumes them.
 *
 * Portal-doctrine move 9 (content as versioned data): questions live in
 * skill-tagged JSON under `content/curriculum/<exam-id>/units/<unit>/`,
 * never hardcoded in components. Adding a batch = drop the JSON file and
 * register it in the consuming module. Bad content fails the build,
 * never the learner.
 *
 * EXAM-AGNOSTIC: the validator is generic over exams. Pass `skills`
 * explicitly for every exam — there are no implicit per-exam defaults.
 * `UNIT_META` / `CurriculumUnitId` below are the JFT-Basic legacy taxonomy,
 * kept for the JFT diagnostic loader (lib/exams.ts) and syllabus page.
 */

import unitScriptVocab from "@/content/curriculum/jft-basic/units/script-vocabulary/unit.json";
import unitConversation from "@/content/curriculum/jft-basic/units/conversation-expression/unit.json";
import unitListening from "@/content/curriculum/jft-basic/units/listening-comprehension/unit.json";
import unitReading from "@/content/curriculum/jft-basic/units/reading-comprehension/unit.json";

import {
  validateBatch,
  type NormalizedQuestion,
  type RawQuestion,
  type UnitSkill,
  type ValidateBatchOpts,
} from "./curriculum-rules";

export { KNOWN_TYPES, LOADABLE_STATUSES, normalizeUnitMeta } from "./curriculum-rules";
export type { NormalizedQuestion, RawQuestion, UnitSkill, ValidateBatchOpts };

/**
 * JFT-Basic unit ids. Kept for the JFT-specific consumers (lib/exams.ts,
 * lib/syllabus.ts). New exams use plain strings.
 */
export type CurriculumUnitId =
  | "script-vocabulary"
  | "conversation-expression"
  | "listening-comprehension"
  | "reading-comprehension";

/**
 * JFT-Basic unit titles + skill taxonomy, straight from the unit.json files.
 * LEGACY — new exams pass their own skills explicitly to
 * `validateCurriculumQuestions`; nothing generic should read this.
 */
export const UNIT_META: Record<CurriculumUnitId, { title: string; skills: string[] }> = {
  "script-vocabulary": { title: unitScriptVocab.title, skills: unitScriptVocab.skills },
  "conversation-expression": { title: unitConversation.title, skills: unitConversation.skills },
  "listening-comprehension": { title: unitListening.title, skills: unitListening.skills },
  "reading-comprehension": { title: unitReading.title, skills: unitReading.skills },
};

/** Legacy aliases — prefer the `curriculum-rules.ts` names in new code. */
export type RawCurriculumQuestion = RawQuestion;
export type NormalizedCurriculumQuestion = NormalizedQuestion;

/**
 * Validate one curriculum batch at module load. Throws on the first defect —
 * this runs during `next build`, so broken content blocks deployment.
 * (Thin wrapper: the rules live in `lib/curriculum-rules.ts`.)
 */
export function validateCurriculumQuestions(
  raw: unknown,
  opts: ValidateBatchOpts
): NormalizedCurriculumQuestion[] {
  return validateBatch(raw, opts);
}
