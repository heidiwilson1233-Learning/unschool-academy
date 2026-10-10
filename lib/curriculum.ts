/**
 * Curriculum content delivery layer — LEAF module (imports JSON data only, no
 * local code). Both `lib/practice.ts` (practice bank) and `lib/exams.ts`
 * (diagnostic bank) load through here, so content files get identical
 * build-time validation no matter which surface consumes them.
 *
 * Portal-doctrine move 9 (content as versioned data): questions live in
 * skill-tagged JSON under `content/curriculum/jft-basic/units/<unit>/`,
 * never hardcoded in components. Adding a batch = drop the JSON file and
 * register it in the consuming module. Bad content fails the build,
 * never the learner.
 *
 * HONESTY GATE: `status` must be "draft-pending-sme-review" — the validator
 * refuses to load any other status until a real SME review pipeline exists.
 * Nothing here may be presented as official or reviewed material.
 */

import unitScriptVocab from "@/content/curriculum/jft-basic/units/script-vocabulary/unit.json";
import unitConversation from "@/content/curriculum/jft-basic/units/conversation-expression/unit.json";
import unitListening from "@/content/curriculum/jft-basic/units/listening-comprehension/unit.json";
import unitReading from "@/content/curriculum/jft-basic/units/reading-comprehension/unit.json";

export type CurriculumUnitId =
  | "script-vocabulary"
  | "conversation-expression"
  | "listening-comprehension"
  | "reading-comprehension";

/** Unit titles + skill taxonomy, straight from the unit.json files. */
export const UNIT_META: Record<CurriculumUnitId, { title: string; skills: string[] }> = {
  "script-vocabulary": { title: unitScriptVocab.title, skills: unitScriptVocab.skills },
  "conversation-expression": { title: unitConversation.title, skills: unitConversation.skills },
  "listening-comprehension": { title: unitListening.title, skills: unitListening.skills },
  "reading-comprehension": { title: unitReading.title, skills: unitReading.skills },
};

/** Raw shape of one question JSON object (matches references/content-schema.md). */
export type RawCurriculumQuestion = {
  id: string;
  skill: string;
  type: string;
  difficulty: number;
  /** Presentation order across units (diagnostic interleave). Optional for practice batches. */
  order?: number;
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  /** Index into `options` — converted to a stable option id by consumers. */
  answer: number;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  source: string;
  status: string;
  version: number;
};

export type NormalizedCurriculumQuestion = {
  id: string;
  unitId: CurriculumUnitId;
  skill: string;
  type: string;
  difficulty: number;
  order?: number;
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctIndex: number;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  source: string;
  status: string;
  version: number;
};

/** Question types the players know how to render (content-schema.md widget registry). */
const KNOWN_TYPES = new Set(["mcq", "fill-blank", "numeric", "match", "ordering", "true-false"]);

/**
 * Validate one curriculum batch at module load. Throws on the first defect —
 * this runs during `next build`, so broken content blocks deployment.
 */
export function validateCurriculumQuestions(
  raw: unknown,
  opts: {
    unitId: CurriculumUnitId;
    /**
     * When true, every question must carry an integer `order` and orders must
     * be unique within the batch — guards the diagnostic's deliberate
     * interleaved topic order (portal-doctrine learning-science: interleave
     * problem types, don't block-practice one skill).
     */
    requireOrder?: boolean;
  }
): NormalizedCurriculumQuestion[] {
  const meta = UNIT_META[opts.unitId];
  if (!meta) throw new Error(`[curriculum] unknown unit "${opts.unitId}"`);
  if (!Array.isArray(raw))
    throw new Error(`[curriculum] batch for unit "${opts.unitId}" is not an array`);

  const seen = new Set<string>();
  const seenOrder = new Set<number>();

  return (raw as RawCurriculumQuestion[]).map((q, i) => {
    const where = `[curriculum] unit "${opts.unitId}" entry #${i}`;
    if (!q || typeof q !== "object") throw new Error(`${where}: not an object`);
    if (typeof q.id !== "string" || !q.id) throw new Error(`${where}: missing id`);
    if (seen.has(q.id)) throw new Error(`[curriculum] duplicate question id "${q.id}"`);
    seen.add(q.id);
    if (typeof q.stem !== "string" || !q.stem)
      throw new Error(`[curriculum] question "${q.id}" missing stem`);
    if (!Array.isArray(q.options) || q.options.length < 2)
      throw new Error(`[curriculum] question "${q.id}" needs at least 2 options`);
    const optIds = new Set<string>();
    for (const o of q.options) {
      if (!o || typeof o.id !== "string" || !o.id || typeof o.text !== "string" || !o.text)
        throw new Error(`[curriculum] question "${q.id}" has a malformed option`);
      if (optIds.has(o.id))
        throw new Error(`[curriculum] question "${q.id}" has duplicate option id "${o.id}"`);
      optIds.add(o.id);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
      throw new Error(`[curriculum] question "${q.id}" has out-of-range answer index`);
    if (typeof q.explanation !== "string" || !q.explanation || typeof q.hint !== "string" || !q.hint)
      throw new Error(`[curriculum] question "${q.id}" missing explanation or hint`);
    if (typeof q.type !== "string" || !KNOWN_TYPES.has(q.type))
      throw new Error(`[curriculum] question "${q.id}" has unknown type "${q.type}"`);
    if (!Number.isInteger(q.difficulty) || q.difficulty < 1)
      throw new Error(`[curriculum] question "${q.id}" has invalid difficulty`);
    if (typeof q.skill !== "string" || !meta.skills.includes(q.skill))
      throw new Error(
        `[curriculum] question "${q.id}" skill "${q.skill}" not in unit "${opts.unitId}" skills`
      );
    if (typeof q.source !== "string" || !q.source)
      throw new Error(`[curriculum] question "${q.id}" missing source (content-schema rule 3)`);
    if (q.status !== "draft-pending-sme-review")
      throw new Error(
        `[curriculum] question "${q.id}" status is "${q.status}" — only draft-pending-sme-review may load until SME review exists`
      );
    if (!Number.isInteger(q.version) || q.version < 1)
      throw new Error(`[curriculum] question "${q.id}" has invalid version`);

    let order: number | undefined;
    if (opts.requireOrder) {
      if (!Number.isInteger(q.order))
        throw new Error(`[curriculum] question "${q.id}" missing integer order`);
      if (seenOrder.has(q.order as number))
        throw new Error(`[curriculum] duplicate order ${q.order} in unit "${opts.unitId}"`);
      seenOrder.add(q.order as number);
      order = q.order as number;
    }

    return {
      id: q.id,
      unitId: opts.unitId,
      skill: q.skill,
      type: q.type,
      difficulty: q.difficulty,
      order,
      stem: q.stem,
      stemJp: q.stemJp,
      options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp })),
      correctIndex: q.answer,
      explanation: q.explanation,
      hint: q.hint,
      audioTextJp: q.audioTextJp,
      source: q.source,
      status: q.status,
      version: q.version,
    };
  });
}
