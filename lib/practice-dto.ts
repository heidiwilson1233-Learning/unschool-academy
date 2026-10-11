/**
 * Practice DTO — the ONE client-safe projection of a bank question.
 *
 * SERVER-ONLY: both `/api/practice/questions` and `/api/practice/check`
 * must project through `safePracticeQuestion`. Keeping the strip-mapping in
 * one place means a future field (correctId, explanation, source notes) can
 * never drift into client JSON through one route while the other stays
 * clean. The answer key never leaves the server except via /check, AFTER a
 * learner commits to an answer.
 */

import type { BankQuestion } from "@/lib/question-bank";

export type SafePracticeQuestion = {
  id: string;
  topic: string;
  skill: string;
  skillLabel: string;
  version: number;
  stem: string;
  stemJp: string | null;
  options: { id: string; text: string; textJp: string | null }[];
  audioTextJp: string | null;
  hint: string;
};

export function safePracticeQuestion(q: BankQuestion): SafePracticeQuestion {
  return {
    id: q.id,
    topic: q.topic,
    skill: q.skill,
    skillLabel: q.skillLabel,
    version: q.version,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({
      id: o.id,
      text: o.text,
      textJp: o.textJp ?? null,
    })),
    audioTextJp: q.audioTextJp ?? null,
    hint: q.hint,
  };
}
