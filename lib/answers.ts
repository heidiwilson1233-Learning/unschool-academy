/**
 * Answers Portal data layer — SERVER ONLY.
 *
 * The full explanation index for JFT-Basic practice questions: id, stem,
 * options, correct answer, explanation, hint, source, review status.
 * Answer keys and explanations must never reach the client bundle —
 * the client-safe subset lives in `lib/answers-meta.ts`.
 *
 * Source of truth: the curriculum JSON under
 * `content/curriculum/jft-basic/units/* /questions-*.json`, normalized by the
 * question-bank factory (see `lib/practice.ts` for the batch registry).
 * Diagnostic questions are excluded — they belong to the diagnostic bank
 * (`lib/exams.ts`), not the practice bank.
 *
 * STATUS: every explanation ships draft — pending Japanese SME review.
 * Nothing here is presented as official JFT-Basic material.
 */

import { PRACTICE_QUESTIONS } from "@/lib/practice";

export type AnswerOption = {
  id: string;
  text: string;
  textJp: string | null;
  /** True for the correct option. */
  correct: boolean;
};

export type AnswerEntry = {
  id: string;
  skill: string;
  skillLabel: string;
  /** Practice topic (unit title), e.g. "Script and Vocabulary". */
  topic: string;
  /** Question-type widget, e.g. "mcq". */
  type: string;
  stem: string;
  stemJp: string | null;
  options: AnswerOption[];
  explanation: string;
  hint: string;
  source: string;
  status: "draft-pending-sme-review";
};

function toAnswerEntry(q: (typeof PRACTICE_QUESTIONS)[number]): AnswerEntry {
  return {
    id: q.id,
    skill: q.skill,
    skillLabel: q.skillLabel,
    topic: q.topic,
    type: q.type,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      textJp: o.textJp ?? null,
      correct: o.id === q.correctId,
    })),
    explanation: q.explanation,
    hint: q.hint,
    source: q.source,
    status: "draft-pending-sme-review",
  };
}

/** All 95 practice explanations, in bank order. */
export const ANSWERS: AnswerEntry[] = PRACTICE_QUESTIONS.map(toAnswerEntry);

export const ANSWER_COUNT = ANSWERS.length;

export function getAnswer(id: string): AnswerEntry | undefined {
  return ANSWERS.find((a) => a.id === id);
}

export function answerIds(): string[] {
  return ANSWERS.map((a) => a.id);
}

function norm(s: string): string {
  return s.toLowerCase();
}

/**
 * Plain substring match over stem, Japanese stem, explanation, skill label
 * and topic. No libraries — deterministic and honest about what it covers.
 */
export function searchAnswers(query: string): AnswerEntry[] {
  const q = norm(query.trim());
  if (!q) return ANSWERS;
  return ANSWERS.filter(
    (a) =>
      norm(a.stem).includes(q) ||
      norm(a.stemJp ?? "").includes(q) ||
      norm(a.explanation).includes(q) ||
      norm(a.skillLabel).includes(q) ||
      norm(a.topic).includes(q) ||
      norm(a.id).includes(q),
  );
}

export type SkillGroup = {
  skill: string;
  skillLabel: string;
  count: number;
};

/** Skills present in the bank, with live counts, bank order. */
export function answerSkills(): SkillGroup[] {
  const map = new Map<string, SkillGroup>();
  for (const a of ANSWERS) {
    const g = map.get(a.skill) ?? { skill: a.skill, skillLabel: a.skillLabel, count: 0 };
    g.count += 1;
    map.set(a.skill, g);
  }
  return [...map.values()];
}

/**
 * "Try similar" queue — same-skill questions first, falling back to the same
 * topic when a skill has no siblings (e.g. single-question listening skills).
 * Never empty: the build gate (scripts/validate-answers.mjs) asserts every
 * question has at least one candidate.
 */
export function trySimilar(id: string, n = 4): AnswerEntry[] {
  const me = getAnswer(id);
  if (!me) return [];
  const sameSkill = ANSWERS.filter((a) => a.id !== id && a.skill === me.skill);
  const pool = sameSkill.length > 0
    ? sameSkill
    : ANSWERS.filter((a) => a.id !== id && a.topic === me.topic);
  return pool.slice(0, n);
}

/* ------------------------------------------------------------------ */
/* Client-safe projection — passes through server components as props. */
/* Never add `explanation`, `hint`, or any correct-answer signal here. */
/* ------------------------------------------------------------------ */

export type AnswerMeta = {
  id: string;
  skill: string;
  skillLabel: string;
  topic: string;
  stem: string;
  type: string;
};

/**
 * Minimal client-safe projection for the error-log review deck.
 * Consumed by a server component and passed to the client deck as props —
 * this is the ONLY way question data reaches the browser. The full
 * AnswerEntry (answer keys, explanations) never leaves the server.
 */
export function answerMetaList(): AnswerMeta[] {
  return ANSWERS.map((a) => ({
    id: a.id,
    skill: a.skill,
    skillLabel: a.skillLabel,
    topic: a.topic,
    stem: a.stem,
    type: a.type,
  }));
}
