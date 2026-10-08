import { NextResponse } from "next/server";
import { practiceByTopic, PRACTICE_TOPICS } from "@/lib/practice";

/**
 * GET /api/practice/questions?topic=<topic>
 * Practice-mode questions WITHOUT answer keys or explanations.
 * Hints are included (practice mode). Explanations only via /check after an attempt.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") ?? "";
  if (!(PRACTICE_TOPICS as readonly string[]).includes(topic)) {
    return NextResponse.json(
      { error: "Unknown topic.", topics: PRACTICE_TOPICS },
      { status: 400 }
    );
  }
  const questions = practiceByTopic(topic).map((q) => ({
    id: q.id,
    topic: q.topic,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
    hint: q.hint,
  }));
  return NextResponse.json({
    version: "practice-v1-draft",
    reviewStatus: "draft — pending Japanese SME review",
    topic,
    total: questions.length,
    questions,
  });
}
