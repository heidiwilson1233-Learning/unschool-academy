/**
 * JFT-Basic practice metadata — DATA-FREE leaf module.
 *
 * Pure constants only: no JSON imports, no `lib/exams` import, no validation
 * IIFE. This module exists so client components (e.g. `app/app/exams/page.tsx`,
 * which is `"use client"`) can import topic lists and skill labels WITHOUT
 * executing the question-bank module — whose static JSON imports and
 * module-scope validation would otherwise ship the full bank (including
 * answer keys) into the client bundle.
 *
 * The skill labels mirror `DIAGNOSTIC_SKILL_INFO` in `lib/exams.ts` so the
 * practice player and the diagnostic gap map speak the same language. If you
 * change a label here, change it there too.
 */

export const PRACTICE_TOPICS = [
  "Script and Vocabulary",
  "Conversation and Expression",
  "Listening Comprehension",
  "Reading Comprehension",
] as const;

export type PracticeTopic = (typeof PRACTICE_TOPICS)[number];

/** Skill-id -> human label. Mirrors DIAGNOSTIC_SKILL_INFO labels (lib/exams.ts). */
export const JFT_SKILL_LABELS: Record<string, string> = {
  "kanji-reading": "Kanji readings",
  "word-meaning": "Word meanings",
  "word-usage": "Using words in sentences",
  "kanji-meaning-usage": "Kanji meanings",
  grammar: "Grammar",
  expression: "Everyday expressions",
  "listening-conversation": "Everyday conversations",
  "listening-shops": "Shop exchanges",
  "listening-announcements": "Instructions and announcements",
  "reading-messages": "Short messages",
  "information-search": "Finding information",
};
