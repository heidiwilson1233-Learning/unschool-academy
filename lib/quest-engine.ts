/**
 * Unschool Kids — quest engine (data schema v2 + validator SSOT).
 *
 * Quests are the atomic learning unit of Unschool Kids. Each quest is one JSON
 * file under `content/kids/quests/<id>.json`, rendered by `/kids/quest/[id]`.
 *
 * Blueprint: docs/03_KIDS_LEARNING_WORLD.md
 *   §6  — every activity declaration must specify the fields below
 *   §7  — the 7-step quest flow (hint ladder, transfer check)
 *   §13 — 15-quest prototype release; 4 reusable templates built FIRST:
 *          selecting objects, sorting, sequencing, distribution
 *   §15 — acceptance checklist (interactions + answer states + reviewer
 *          signoff before anything appears as playable)
 * Portal doctrine: move 9 (content as versioned data), move 2 (practice engine:
 * hints before answers, transfer checks).
 *
 * Honesty: every quest ships `review_status: "draft-pending-educator-review"`
 * until a human educator reviews it. `published_version: 0` means unpublished.
 * The prebuild gate `scripts/validate-kids-quests.mjs` enforces this file.
 *
 * DESIGN DECISION — answer keys ship client-side deliberately: kids quests are
 * ungraded instant-feedback play with no auth and no server session, so the
 * player judges answers locally (portal move 2). Do NOT apply the adult
 * question bank's server-side answer-stripping pattern here; it would break
 * instant feedback for zero secrecy gain (there is nothing to game).
 *
 * DEPENDENCY-FREE MODULE: no `@/` alias, no JSON imports, no Node APIs, no
 * Next.js imports, and no imports from other lib modules — plain node must be
 * able to import it with type-stripping (see lib/curriculum-rules.ts
 * precedent). The slug literals below mirror lib/kids.ts; the prebuild gate
 * cross-checks them against lib/kids.ts on every build, so drift fails loudly.
 */

/** Mirrors lib/kids.ts KID_SUBJECTS slugs. */
export const ENGINE_SUBJECT_SLUGS = ["words", "numbers", "world", "values", "create"];
/** Mirrors lib/kids.ts AGE_TRACKS slugs. */
export const ENGINE_TRACK_SLUGS = [
  "school-starters",
  "adventure-club",
  "quest-makers",
  "young-explorers",
];
/** Mirrors lib/kids.ts BOOK_QUEST_TYPES. */
export const ENGINE_QUEST_TYPE_IDS = [
  "read-aloud",
  "vocabulary",
  "comprehension",
  "value-quest",
  "math-in-story",
  "wonder-quest",
  "create-quest",
];

/* ------------------------------------------------------------------ */
/* Reusable interaction templates (doc 03 §13: build these FIRST)        */
/* ------------------------------------------------------------------ */

export type QuestTemplateId = "select-objects" | "sort" | "sequence" | "distribute";

export type QuestTemplate = {
  id: QuestTemplateId;
  name: string;
  /** Which player interaction widgets exercise this template today. */
  widgets: string[];
  /** The authoring contract: fields an interaction must carry. */
  contract: string;
  blurb: string;
};

export const QUEST_TEMPLATES: QuestTemplate[] = [
  {
    id: "select-objects",
    name: "Selecting objects",
    widgets: ["tap-choice", "count-tap"],
    contract: "tap-choice: options[2..4] + correct index · count-tap: target_count + options + correct index",
    blurb:
      "The child picks the right thing from a set — a picture, a word, a quantity. The workhorse: vocabulary, comprehension, observation, counting.",
  },
  {
    id: "sort",
    name: "Sorting",
    widgets: ["tap-choice (classify-one-question)", "sort widget — wave 2"],
    contract: "classify-one: options are candidate groups + correct group index · full sort widget: groups[] + items[{label, group}]",
    blurb:
      "The child puts things into the right groups — shapes, habitats, kinds. Today exercised one question at a time; the drag-free multi-sort widget ships in wave 2.",
  },
  {
    id: "sequence",
    name: "Sequencing",
    widgets: ["order"],
    contract: "options[] listed in the correct order (renderer shuffles at display), ≥2 cards",
    blurb:
      "The child puts cards or events in the right order — story order, life cycles, steps of a process.",
  },
  {
    id: "distribute",
    name: "Distribution",
    widgets: ["count-tap (share variant) — dedicated share widget wave 2"],
    contract: "target_count = total shared; prompt names the groups; transfer names a new total",
    blurb:
      "The child shares a set fairly into groups — division as equal groups, tens and ones, area as tiles.",
  },
];

export const TEMPLATE_IDS = QUEST_TEMPLATES.map((t) => t.id);

export function templateById(id: string): QuestTemplate | undefined {
  return QUEST_TEMPLATES.find((t) => t.id === id);
}

/* ------------------------------------------------------------------ */
/* Quest data model (schema v2)                                        */
/* ------------------------------------------------------------------ */

export type InteractionType = "tap-choice" | "count-tap" | "order" | "speak-repeat" | "draw";

export type AnswerRuleKind = "single-choice" | "count-match" | "sequence-exact" | "open";

export type QuestInteraction = {
  type: InteractionType;
  /** Which reusable template this interaction exercises (doc 03 §13). Null only for open creation. */
  template: QuestTemplateId | null;
  prompt: string;
  options?: string[];
  correct?: number;
  target_count?: number;
  /** How the answer is judged. No fail states — see lib/kids.ts SMART_LEARNING. */
  answer_rule: { kind: AnswerRuleKind };
};

export type ReviewStatus = "draft-pending-educator-review" | "in-educator-review" | "reviewed";

export type KidQuest = {
  id: string;
  book_id: string | null;
  quest_type: string;
  subject: string;
  /** Age track slug (doc 03 §6 `age_track`). */
  track: string;
  character: "momo" | "tara" | "bobo";
  title: string;
  /** Skill-objective code, e.g. "numbers.counting.to20" (doc 03 §6 `objective_id`). */
  objective_id: string;
  objective: string;
  difficulty: 1 | 2 | 3;
  /** Quest ids that should come first. Empty = entry quest. */
  prerequisites: string[];
  /** Production assets. Empty until art/audio are produced and reviewed. */
  assets: { art: string[]; audio: string[] };
  primary_language: "en";
  /** Null until a second language version is authored and reviewed. */
  secondary_language: string | null;
  /**
   * Narration source. `live-tts` = browser speech synthesis at play time
   * (NOT reviewed audio). `cached-audio` = reviewed voice clips.
   */
  narration: { mode: "live-tts" | "cached-audio"; voice_reviewed: boolean };
  story_beats: { text: string; art_note?: string }[];
  interactions: QuestInteraction[];
  /** Layered help, weakest-first (doc 03 §7 step 5): repeat → point → partial example. */
  hint_sequence: string[];
  /** The changed-example check (doc 03 §7 step 6). */
  transfer_question: string;
  feedback: { correct: string; retry: string };
  /** The off-screen invitation (doc 03 §6 `offscreen_activity`). */
  off_screen: string;
  parent_note: string;
  /** Minutes. A target, not a measurement. */
  duration_target: number;
  /** Null until a human educator reviews. Never invent a name. */
  content_reviewer: { name: string; role: string; date: string } | null;
  review_status: ReviewStatus;
  /** Immutable content version (portal move 9). 0 = unpublished draft. */
  published_version: number;
};

/* ------------------------------------------------------------------ */
/* Validation (SSOT — the prebuild gate imports this)                  */
/* ------------------------------------------------------------------ */

const SUBJECT_SLUGS: string[] = ENGINE_SUBJECT_SLUGS;
const TRACK_SLUGS: string[] = ENGINE_TRACK_SLUGS;
const QUEST_TYPE_IDS: string[] = ENGINE_QUEST_TYPE_IDS;

/** template allowed per interaction widget */
const TEMPLATE_FOR_WIDGET: Record<InteractionType, (QuestTemplateId | null)[]> = {
  "tap-choice": ["select-objects", "sort"],
  "count-tap": ["select-objects", "distribute"],
  order: ["sequence"],
  "speak-repeat": [null],
  draw: [null],
};

const RULE_FOR_WIDGET: Record<InteractionType, AnswerRuleKind> = {
  "tap-choice": "single-choice",
  "count-tap": "count-match",
  order: "sequence-exact",
  "speak-repeat": "open",
  draw: "open",
};

export function validateQuest(id: string, q: unknown, bookIds: Set<string>): string[] {
  const errs: string[] = [];
  const at = (f: string) => `${id}.${f}`;
  if (typeof q !== "object" || q === null) return [`${id}: not an object`];
  const d = q as Record<string, unknown>;

  const req = (f: string) => {
    if (d[f] === undefined || d[f] === null || d[f] === "") errs.push(`${at(f)}: required`);
  };
  [
    "id", "quest_type", "subject", "track", "character", "title",
    "objective_id", "objective", "difficulty", "prerequisites", "assets",
    "primary_language", "narration", "story_beats", "interactions",
    "hint_sequence", "transfer_question", "feedback", "off_screen",
    "parent_note", "duration_target", "review_status", "published_version",
  ].forEach(req);
  if (errs.length > 0) return errs;

  if (d.id !== id) errs.push(`${at("id")}: must equal filename (${id})`);
  if (typeof d.book_id === "string" && !bookIds.has(d.book_id))
    errs.push(`${at("book_id")}: unknown book ${d.book_id}`);
  if (!QUEST_TYPE_IDS.includes(d.quest_type as string))
    errs.push(`${at("quest_type")}: must be one of ${QUEST_TYPE_IDS.join(", ")}`);
  if (!SUBJECT_SLUGS.includes(d.subject as string))
    errs.push(`${at("subject")}: must be one of ${SUBJECT_SLUGS.join(", ")}`);
  if (!TRACK_SLUGS.includes(d.track as string))
    errs.push(`${at("track")}: must be one of ${TRACK_SLUGS.join(", ")}`);
  if (!["momo", "tara", "bobo"].includes(d.character as string))
    errs.push(`${at("character")}: must be momo | tara | bobo`);
  if (![1, 2, 3].includes(d.difficulty as number)) errs.push(`${at("difficulty")}: must be 1 | 2 | 3`);
  if (!Array.isArray(d.prerequisites)) errs.push(`${at("prerequisites")}: must be an array`);
  const assets = d.assets as Record<string, unknown>;
  if (typeof assets !== "object" || !Array.isArray(assets.art) || !Array.isArray(assets.audio))
    errs.push(`${at("assets")}: must be { art: string[], audio: string[] }`);
  if (d.primary_language !== "en") errs.push(`${at("primary_language")}: must be "en"`);
  const narration = d.narration as Record<string, unknown>;
  if (
    typeof narration !== "object" ||
    !["live-tts", "cached-audio"].includes(narration.mode as string) ||
    typeof narration.voice_reviewed !== "boolean"
  )
    errs.push(`${at("narration")}: must be { mode: "live-tts" | "cached-audio", voice_reviewed: boolean }`);
  if (narration.mode === "cached-audio" && narration.voice_reviewed !== true)
    errs.push(`${at("narration")}: cached-audio must be voice_reviewed`);
  if (d.secondary_language !== null && typeof d.secondary_language !== "string")
    errs.push(`${at("secondary_language")}: must be a language code or null`);

  const beats = d.story_beats as unknown[];
  if (!Array.isArray(beats) || beats.length === 0) errs.push(`${at("story_beats")}: need ≥1`);
  else if (beats.some((b) => typeof (b as Record<string, unknown>).text !== "string" || !(b as Record<string, unknown>).text))
    errs.push(`${at("story_beats")}: every beat needs non-empty text`);

  const hints = d.hint_sequence as unknown[];
  if (!Array.isArray(hints) || hints.length === 0) errs.push(`${at("hint_sequence")}: need ≥1 hint (doc 03 §7 step 5)`);
  if (typeof d.transfer_question !== "string" || !(d.transfer_question as string).trim())
    errs.push(`${at("transfer_question")}: required (doc 03 §7 step 6)`);

  const fb = d.feedback as Record<string, unknown>;
  if (typeof fb !== "object" || typeof fb.correct !== "string" || typeof fb.retry !== "string")
    errs.push(`${at("feedback")}: must be { correct: string, retry: string }`);

  const dt = d.duration_target as number;
  if (typeof dt !== "number" || dt < 1 || dt > 20)
    errs.push(`${at("duration_target")}: must be 1–20 minutes`);

  const rs = d.review_status as string;
  if (!["draft-pending-educator-review", "in-educator-review", "reviewed"].includes(rs))
    errs.push(`${at("review_status")}: invalid`);
  if (rs === "reviewed" && (d.content_reviewer === null || d.content_reviewer === undefined))
    errs.push(`${at("content_reviewer")}: reviewed quests must name their reviewer`);
  if (rs !== "reviewed" && d.content_reviewer !== null && d.content_reviewer !== undefined)
    errs.push(`${at("content_reviewer")}: only reviewed quests may name a reviewer`);
  if (typeof d.published_version !== "number" || (d.published_version as number) < 0)
    errs.push(`${at("published_version")}: must be ≥ 0`);
  if ((d.published_version as number) > 0 && rs !== "reviewed")
    errs.push(`${at("published_version")}: only reviewed quests may publish (v>0)`);

  const interactions = d.interactions as QuestInteraction[];
  if (!Array.isArray(interactions) || interactions.length === 0)
    errs.push(`${at("interactions")}: need ≥1`);
  else
    interactions.forEach((ix, n) => {
      const p = `${at(`interactions[${n}]`)}`;
      const allowed = TEMPLATE_FOR_WIDGET[ix.type];
      if (!allowed) {
        errs.push(`${p}.type: unknown interaction type ${ix.type}`);
        return;
      }
      if (!allowed.includes(ix.template))
        errs.push(`${p}.template: ${ix.template} not allowed for ${ix.type} (allowed: ${allowed.map(String).join(", ")})`);
      if (!ix.prompt || typeof ix.prompt !== "string") errs.push(`${p}.prompt: required`);
      if (ix.answer_rule?.kind !== RULE_FOR_WIDGET[ix.type])
        errs.push(`${p}.answer_rule.kind: must be ${RULE_FOR_WIDGET[ix.type]} for ${ix.type}`);
      if (ix.type === "tap-choice") {
        if (!Array.isArray(ix.options) || ix.options.length < 2 || ix.options.length > 4)
          errs.push(`${p}.options: tap-choice needs 2–4 options`);
        if (typeof ix.correct !== "number" || ix.correct < 0 || ix.correct >= (ix.options?.length ?? 0))
          errs.push(`${p}.correct: must index options`);
      }
      if (ix.type === "count-tap") {
        if (typeof ix.target_count !== "number" || ix.target_count < 1)
          errs.push(`${p}.target_count: required ≥1`);
        if (!Array.isArray(ix.options) || ix.options.length < 2)
          errs.push(`${p}.options: count-tap needs ≥2 options`);
        if (typeof ix.correct !== "number") errs.push(`${p}.correct: must index options`);
      }
      if (ix.type === "order") {
        if (!Array.isArray(ix.options) || ix.options.length < 2)
          errs.push(`${p}.options: order needs ≥2 cards (listed in correct order)`);
      }
    });

  return errs;
}
