/**
 * JFT-Basic pilot program data.
 * STATUS: draft content — official exam facts must be re-verified from
 * https://www.jpf.go.jp/jft-basic/e/about/index.html before publication,
 * and all questions require Japanese SME review (see docs/IMPLEMENTATION_REQUIREMENTS.md).
 */

export type DiagnosticQuestion = {
  id: string;
  topic: "Script and Vocabulary" | "Conversation and Expression" | "Listening Comprehension" | "Reading Comprehension";
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctId: string;
  explanation: string;
  /** Nudge without revealing the answer — shown on demand, never auto-revealed. */
  hint: string;
  audioTextJp?: string; // spoken via browser TTS in the player; transcript always shown
  /** Curriculum skill id (content/curriculum/jft-basic taxonomy) — powers the skill gap map. */
  skill: string;
  /** Authoritative reference the item was researched from (content-schema rule 3). */
  source: string;
  /** Always "draft-pending-sme-review" until a human expert reviews. */
  status: string;
  /** Content version of the item (content-schema rule 4: attempts reference this). */
  version: number;
  /** Deliberate interleaved presentation order — never re-sort by unit. */
  order: number;
};

import diagScriptVocab from "@/content/curriculum/jft-basic/units/script-vocabulary/questions-diagnostic-v1.json";
import diagConversation from "@/content/curriculum/jft-basic/units/conversation-expression/questions-diagnostic-v1.json";
import diagListening from "@/content/curriculum/jft-basic/units/listening-comprehension/questions-diagnostic-v1.json";
import diagReading from "@/content/curriculum/jft-basic/units/reading-comprehension/questions-diagnostic-v1.json";
import { UNIT_META, validateCurriculumQuestions, type CurriculumUnitId } from "@/lib/curriculum";

/**
 * The 10-question diagnostic, LOADED FROM CURRICULUM DATA (portal-doctrine
 * move 9: content as versioned data). Same JSON the practice bank uses —
 * one source of truth, build-time validated.
 *
 * Order is deliberate: questions interleave topics (Script → Conversation →
 * Reading → Conversation → Script → Listening → …). Do NOT re-sort by unit —
 * the `order` field in each JSON preserves the interleave.
 *
 * STATUS: every question ships draft — pending Japanese SME review.
 */
const DIAGNOSTIC_BATCHES: { unitId: CurriculumUnitId; raw: unknown }[] = [
  { unitId: "script-vocabulary", raw: diagScriptVocab },
  { unitId: "conversation-expression", raw: diagConversation },
  { unitId: "listening-comprehension", raw: diagListening },
  { unitId: "reading-comprehension", raw: diagReading },
];

function loadDiagnosticQuestions(): DiagnosticQuestion[] {
  const out: DiagnosticQuestion[] = [];
  for (const batch of DIAGNOSTIC_BATCHES) {
    const topic = UNIT_META[batch.unitId].title as DiagnosticQuestion["topic"];
    for (const q of validateCurriculumQuestions(batch.raw, {
      unitId: batch.unitId,
      requireOrder: true,
    })) {
      out.push({
        id: q.id,
        topic,
        skill: q.skill,
        stem: q.stem,
        stemJp: q.stemJp,
        options: q.options,
        correctId: q.options[q.correctIndex].id,
        explanation: q.explanation,
        hint: q.hint,
        audioTextJp: q.audioTextJp,
        source: q.source,
        status: q.status,
        version: q.version,
        order: q.order as number,
      });
    }
  }
  out.sort((a, b) => a.order - b.order);
  const orders = out.map((q) => q.order);
  if (new Set(orders).size !== orders.length)
    throw new Error("[exams] duplicate diagnostic order values across batches");
  if (out.length !== 10)
    throw new Error(`[exams] expected 10 diagnostic questions, got ${out.length}`);
  return out;
}

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = loadDiagnosticQuestions();

/**
 * The ONE deliberately disclosed demo question for the landing page
 * (app/exams/jft-basic/page.tsx). The public question API withholds answer
 * keys; this projection keeps the other 9 questions' keys OUT of the
 * landing-page bundle while the sample card keeps its "Show answer" demo.
 */
export const DIAGNOSTIC_SAMPLE_QUESTION: DiagnosticQuestion =
  DIAGNOSTIC_QUESTIONS.find((q) => q.id === "jft-d10") ?? DIAGNOSTIC_QUESTIONS[0];

export const TOPIC_INFO: Record<DiagnosticQuestion["topic"], string> = {
  "Script and Vocabulary": "Reading everyday Japanese texts; basic vocabulary, kanji readings and usage.",
  "Conversation and Expression": "The grammar and expressions needed for everyday conversation.",
  "Listening Comprehension": "Understanding everyday conversations, instructions and announcements.",
  "Reading Comprehension": "Understanding letters, notices, explanations and other everyday texts.",
};

/**
 * Skill taxonomy for the JFT-Basic diagnostic — mirrors the curriculum units in
 * content/curriculum/jft-basic (skill ids match the unit.json `skills` lists).
 * `practiceSlug` routes a skill's "fix it" CTA to the matching practice topic.
 */
export const DIAGNOSTIC_SKILL_INFO: Record<
  string,
  { label: string; topic: DiagnosticQuestion["topic"]; practiceSlug: string }
> = {
  "kanji-reading": { label: "Kanji readings", topic: "Script and Vocabulary", practiceSlug: "vocabulary" },
  "word-meaning": { label: "Word meanings", topic: "Script and Vocabulary", practiceSlug: "vocabulary" },
  "word-usage": { label: "Using words in sentences", topic: "Script and Vocabulary", practiceSlug: "vocabulary" },
  "kanji-meaning-usage": { label: "Kanji meanings", topic: "Script and Vocabulary", practiceSlug: "vocabulary" },
  "grammar": { label: "Grammar", topic: "Conversation and Expression", practiceSlug: "conversation" },
  "expression": { label: "Everyday expressions", topic: "Conversation and Expression", practiceSlug: "conversation" },
  "listening-conversation": { label: "Everyday conversations", topic: "Listening Comprehension", practiceSlug: "listening" },
  "listening-shops": { label: "Shop exchanges", topic: "Listening Comprehension", practiceSlug: "listening" },
  "listening-announcements": { label: "Instructions and announcements", topic: "Listening Comprehension", practiceSlug: "listening" },
  "reading-messages": { label: "Short messages", topic: "Reading Comprehension", practiceSlug: "reading" },
  "information-search": { label: "Finding information", topic: "Reading Comprehension", practiceSlug: "reading" },
};

/** Skills in curriculum order, grouped by topic — the gap-map render order. */
export const DIAGNOSTIC_SKILL_ORDER: string[] = [
  "kanji-reading",
  "word-meaning",
  "word-usage",
  "kanji-meaning-usage",
  "grammar",
  "expression",
  "listening-conversation",
  "listening-shops",
  "listening-announcements",
  "reading-messages",
  "information-search",
];

export const JFT_PROGRAM = {
  slug: "jft-basic",
  name: "JFT-Basic",
  organizer: "The Japan Foundation",
  officialUrl: "https://www.jpf.go.jp/jft-basic/e/about/index.html",
  tagline: "Everyday Japanese for living and working in Japan",
  // Verified 2026-10-08 against the Japan Foundation's official JFT-Basic pages
  // (https://www.jpf.go.jp/jft-basic/e/about/index.html and /e/faq/index.html).
  factsVerified: true,
  lastVerified: "2026-10-08",
  officialFacts: {
    purpose:
      "Measures the Japanese proficiency needed by foreign nationals about to reside in Japan mainly for work, to communicate in everyday life situations.",
    usedFor: ["Specified Skilled Worker (i)", "Employment for Skill Development", "Student (Japanese language institution enrollment)"],
    format: "Computer-based test (CBT)",
    sections: [
      { name: "Script and Vocabulary", detail: "Reading everyday texts; basic vocabulary and kanji use" },
      { name: "Conversation and Expression", detail: "Grammar and expressions for everyday conversation" },
      { name: "Listening Comprehension", detail: "Understanding everyday conversations and instructions" },
      { name: "Reading Comprehension", detail: "Understanding letters, notices and explanations" },
    ],
    questions: "Approximately 50",
    duration: "60 minutes total; no per-section time limit",
    listeningRules: "Audio can be played up to two times; cannot return to earlier questions in the Listening section",
    scoring: "Scaled score from 10 to 250 (not a raw count of correct answers)",
    levels: [
      { range: "145–174", level: "A1" },
      { range: "175–199", level: "A2.1" },
      { range: "200–250", level: "A2.2 (A2)" },
    ],
    noSectionMinimum: true,
    results: "Shown on screen the same day; official notification within 5 business days via Prometric",
    retake: "Allowed with a 45-day interval if the total score is 199 or lower; scores of 200+ cannot retake",
    noOralOrWriting: true,
  },
};
