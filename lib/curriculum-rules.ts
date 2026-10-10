/**
 * Curriculum validation RULES — single source of truth.
 *
 * DEPENDENCY-FREE MODULE: no `@/` alias, no JSON imports, no Node APIs, no
 * Next.js imports, pure functions only. Two consumers share these rules:
 *  - `lib/curriculum.ts` (TypeScript wrapper, runs at module load during
 *    `next build` for statically-imported batches)
 *  - `scripts/validate-curriculum.mjs` (plain node, imports this file
 *    directly via a relative path — Node ≥22 strips types natively — and
 *    scans every exam's batch files at prebuild)
 *
 * If you change a rule here, both gates change together. There is exactly
 * one implementation of the tolerant validation — never a second copy.
 *
 * Design rules (tutor-reviewed):
 * - We coerce METADATA, never CORRECTNESS: `difficulty`/`version` accept
 *   clean integer strings; `answer` must be a true 0-based integer index.
 *   A string "1" might mean 1-based "option 1" to a content agent — coercing
 *   it could silently teach the wrong answer at scale.
 * - HONESTY GATE: only `draft-pending-sme-review` loads, verbatim, in every
 *   exam. Widen LOADABLE_STATUSES only when a human SME review pipeline
 *   exists that records sign-off per item — never per-exam, never on request.
 * - Option ids are the correctness contract: bare-string options get
 *   positional ids a/b/c/...; option ORDER is immutable post-publish —
 *   reordering requires a `version` bump, or bookmarks/error-log references
 *   silently reassign.
 */

export const KNOWN_TYPES = new Set(["mcq", "fill-blank", "numeric", "match", "ordering", "true-false"]);

/** Statuses the engine will load. See HONESTY GATE above. */
export const LOADABLE_STATUSES = ["draft-pending-sme-review"] as const;

export type UnitSkill = { id: string; label: string };

export type RawQuestion = {
  id: string;
  skill: string;
  type: string;
  difficulty: number | string;
  order?: number;
  level?: string;
  stem: string;
  stemJp?: string;
  passage?: string;
  options: ({ id: string; text: string; textJp?: string } | string)[];
  answer: number;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  source: string;
  status: string;
  version: number | string;
};

export type NormalizedQuestion = {
  id: string;
  unitId: string;
  skill: string;
  type: string;
  difficulty: number;
  order?: number;
  level?: string;
  stem: string;
  stemJp?: string;
  passage?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctIndex: number;
  explanation: string;
  hint: string;
  audioTextJp?: string;
  source: string;
  status: string;
  version: number;
};

/**
 * Normalize any exam's unit.json into `{ id, title, skills }`. Handles both
 * shapes in the wild: `skills: string[]` (JFT-Basic) and
 * `skills: [{ id, title, ... }]` (content-agent exams). When a skill object
 * has no title, the label falls back to the raw id — per-exam modules should
 * pass an explicit label map (see lib/question-bank.ts `skillLabels`) so raw
 * kebab-case ids never reach learner-facing UI.
 */
export function normalizeUnitMeta(unitJson: {
  id: string;
  title: string;
  skills: unknown;
}): { id: string; title: string; skills: UnitSkill[] } {
  const skills: UnitSkill[] = [];
  const raw = unitJson.skills;
  if (Array.isArray(raw)) {
    for (const s of raw) {
      if (typeof s === "string" && s) skills.push({ id: s, label: s });
      else if (s && typeof s === "object") {
        const o = s as { id?: unknown; title?: unknown };
        if (typeof o.id === "string" && o.id)
          skills.push({
            id: o.id,
            label: typeof o.title === "string" && o.title ? o.title : o.id,
          });
      }
    }
  }
  if (!unitJson.id || !unitJson.title || skills.length === 0)
    throw new Error(
      `[curriculum] unit.json "${unitJson.id || "?"}" is missing id, title, or a non-empty skills list`
    );
  return { id: unitJson.id, title: unitJson.title, skills };
}

/**
 * Coerce a clean integer (number or numeric string like "2") to int.
 * Anything else — "2a", 1.5, null — throws. Strict on purpose: coercion is
 * for the content agents' JSON-string habit, not for hiding bad data.
 */
function toInt(value: unknown, what: string): number {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) return parseInt(value.trim(), 10);
  throw new Error(`${what} must be an integer, got ${JSON.stringify(value)}`);
}

/** Normalize one option to `{ id, text, textJp? }`. Bare strings get ids a/b/c/.... */
function normalizeOption(o: unknown, index: number, questionId: string) {
  if (typeof o === "string") {
    if (!o) throw new Error(`[curriculum] question "${questionId}" has an empty option`);
    return { id: String.fromCharCode(97 + index), text: o, textJp: undefined as string | undefined };
  }
  if (o && typeof o === "object") {
    const obj = o as { id?: unknown; text?: unknown; textJp?: unknown };
    if (typeof obj.id !== "string" || !obj.id || typeof obj.text !== "string" || !obj.text)
      throw new Error(`[curriculum] question "${questionId}" has a malformed option`);
    return {
      id: obj.id,
      text: obj.text,
      textJp: typeof obj.textJp === "string" ? obj.textJp : undefined,
    };
  }
  throw new Error(`[curriculum] question "${questionId}" has a malformed option`);
}

export type ValidateBatchOpts = {
  unitId: string;
  /** Skill ids valid for this unit — REQUIRED, always explicit. No implicit
   *  per-exam defaults: a forgotten opt must fail loudly at the call site,
   *  not silently validate against another exam's taxonomy. */
  skills: string[];
  /**
   * When true, every question must carry an integer `order` and orders must
   * be unique within the batch — guards the diagnostic's deliberate
   * interleaved topic order (portal-doctrine learning-science: interleave
   * problem types, don't block-practice one skill).
   */
  requireOrder?: boolean;
};

/**
 * Validate one curriculum batch. Throws on the first defect — runs during
 * `next build` (via lib/curriculum.ts) and at prebuild (via
 * scripts/validate-curriculum.mjs), so broken content blocks deployment.
 */
export function validateBatch(raw: unknown, opts: ValidateBatchOpts): NormalizedQuestion[] {
  const skills = opts.skills;
  if (!Array.isArray(skills) || skills.length === 0)
    throw new Error(`[curriculum] unit "${opts.unitId}": skills list is required and must be non-empty`);
  if (!Array.isArray(raw))
    throw new Error(`[curriculum] batch for unit "${opts.unitId}" is not an array`);

  const seen = new Set<string>();
  const seenOrder = new Set<number>();

  return (raw as RawQuestion[]).map((q, i) => {
    const where = `[curriculum] unit "${opts.unitId}" entry #${i}`;
    if (!q || typeof q !== "object") throw new Error(`${where}: not an object`);
    if (typeof q.id !== "string" || !q.id) throw new Error(`${where}: missing id`);
    if (seen.has(q.id)) throw new Error(`[curriculum] duplicate question id "${q.id}"`);
    seen.add(q.id);
    if (typeof q.stem !== "string" || !q.stem)
      throw new Error(`[curriculum] question "${q.id}" missing stem`);
    if (typeof q.passage !== "undefined" && typeof q.passage !== "string")
      throw new Error(`[curriculum] question "${q.id}" has a non-string passage`);
    if (typeof q.level !== "undefined" && typeof q.level !== "string")
      throw new Error(`[curriculum] question "${q.id}" has a non-string level`);
    if (!Array.isArray(q.options) || q.options.length < 2)
      throw new Error(`[curriculum] question "${q.id}" needs at least 2 options`);
    if (q.options.length > 26)
      throw new Error(`[curriculum] question "${q.id}" has too many options to letter-label`);
    const hasBare = q.options.some((o) => typeof o === "string");
    const hasObjects = q.options.some((o) => typeof o !== "string");
    if (hasBare && hasObjects)
      throw new Error(
        `[curriculum] question "${q.id}" mixes bare-string and object options — pick one shape`
      );
    const options = q.options.map((o, idx) => normalizeOption(o, idx, q.id));
    const optIds = new Set<string>();
    for (const o of options) {
      if (optIds.has(o.id))
        throw new Error(`[curriculum] question "${q.id}" has duplicate option id "${o.id}"`);
      optIds.add(o.id);
    }
    // `answer` is CORRECTNESS: strict 0-based integer index, never coerced.
    if (typeof q.answer !== "number" || !Number.isInteger(q.answer))
      throw new Error(
        `[curriculum] question "${q.id}" answer must be a 0-based integer index into options, got ${JSON.stringify(q.answer)}`
      );
    if (q.answer < 0 || q.answer >= options.length)
      throw new Error(`[curriculum] question "${q.id}" has out-of-range answer index`);
    if (typeof q.explanation !== "string" || !q.explanation || typeof q.hint !== "string" || !q.hint)
      throw new Error(`[curriculum] question "${q.id}" missing explanation or hint`);
    if (typeof q.type !== "string" || !KNOWN_TYPES.has(q.type))
      throw new Error(`[curriculum] question "${q.id}" has unknown type "${q.type}"`);
    const difficulty = toInt(q.difficulty, `[curriculum] question "${q.id}" difficulty`);
    if (difficulty < 1) throw new Error(`[curriculum] question "${q.id}" has invalid difficulty`);
    if (typeof q.skill !== "string" || !skills.includes(q.skill))
      throw new Error(
        `[curriculum] question "${q.id}" skill "${q.skill}" not in unit "${opts.unitId}" skills [${skills.join(", ")}]`
      );
    if (typeof q.source !== "string" || !q.source)
      throw new Error(`[curriculum] question "${q.id}" missing source (content-schema rule 3)`);
    if (!(LOADABLE_STATUSES as readonly string[]).includes(q.status))
      throw new Error(
        `[curriculum] question "${q.id}" status is "${q.status}" — only ${(LOADABLE_STATUSES as readonly string[]).join(", ")} may load until SME review exists`
      );
    const version = toInt(q.version, `[curriculum] question "${q.id}" version`);
    if (version < 1) throw new Error(`[curriculum] question "${q.id}" has invalid version`);

    let order: number | undefined;
    if (opts.requireOrder) {
      const ord = toInt(q.order, `[curriculum] question "${q.id}" order`);
      if (seenOrder.has(ord))
        throw new Error(`[curriculum] duplicate order ${ord} in unit "${opts.unitId}"`);
      seenOrder.add(ord);
      order = ord;
    }

    return {
      id: q.id,
      unitId: opts.unitId,
      skill: q.skill,
      type: q.type,
      difficulty,
      order,
      level: q.level,
      stem: q.stem,
      stemJp: q.stemJp,
      passage: q.passage,
      options,
      correctIndex: q.answer,
      explanation: q.explanation,
      hint: q.hint,
      audioTextJp: q.audioTextJp,
      source: q.source,
      status: q.status,
      version,
    };
  });
}
