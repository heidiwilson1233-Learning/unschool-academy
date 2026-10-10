import { NextResponse } from "next/server";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

/**
 * POST /api/practice/check
 * Practice mode: check ONE answer, reveal explanation immediately.
 * (Mock mode never uses this endpoint — answers stay hidden until submit.)
 */
export async function POST(req: Request) {
  let body: { questionId?: string; optionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const q = PRACTICE_QUESTIONS.find((x) => x.id === body.questionId);
  if (!q) {
    return NextResponse.json({ error: "Unknown question." }, { status: 404 });
  }
  const picked = q.options.find((o) => o.id === body.optionId) ?? null;
  const correctOption = q.options.find((o) => o.id === q.correctId)!;
  const correct = body.optionId === q.correctId;

  return NextResponse.json({
    questionId: q.id,
    correct,
    pickedLabel: picked ? picked.text : "No answer",
    correctLabel: correctOption.text,
    correctLabelJp: correctOption.textJp ?? null,
    explanation: q.explanation,
    version: q.version,
    status: q.status,
  });
}
