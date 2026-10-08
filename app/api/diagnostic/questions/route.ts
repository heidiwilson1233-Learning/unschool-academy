import { NextResponse } from "next/server";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/exams";

/**
 * GET /api/diagnostic/questions
 * Returns the 10 diagnostic questions WITHOUT answer keys or explanations.
 * Correctness is only ever revealed via the /score endpoint after submission.
 */
export async function GET() {
  const publicQuestions = DIAGNOSTIC_QUESTIONS.map((q) => ({
    id: q.id,
    topic: q.topic,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
  }));
  return NextResponse.json({
    version: "diagnostic-v1-draft",
    reviewStatus: "draft — pending Japanese SME review",
    total: publicQuestions.length,
    questions: publicQuestions,
  });
}
