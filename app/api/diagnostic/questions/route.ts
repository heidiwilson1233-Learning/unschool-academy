import { NextResponse } from "next/server";
import { DIAGNOSTIC_QUESTIONS, DIAGNOSTIC_SKILL_INFO } from "@/lib/exams";

/**
 * GET /api/diagnostic/questions
 * Returns the 10 diagnostic questions WITHOUT answer keys or explanations.
 * Skill ids and labels are public (topic names already are) — they feed the
 * skill gap map and let learners see what each question measures.
 * Correctness is only ever revealed via the /score endpoint after submission.
 */
export async function GET() {
  const publicQuestions = DIAGNOSTIC_QUESTIONS.map((q) => ({
    id: q.id,
    topic: q.topic,
    skill: q.skill,
    skillLabel: DIAGNOSTIC_SKILL_INFO[q.skill]?.label ?? q.skill,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
  }));
  return NextResponse.json({
    version: "diagnostic-v3-curriculum",
    reviewStatus: "draft — pending Japanese SME review",
    total: publicQuestions.length,
    questions: publicQuestions,
  });
}
