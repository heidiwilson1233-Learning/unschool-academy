import { NextResponse } from "next/server";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

export const MOCK_TIME_LIMIT_SEC = 30 * 60; // 30 minutes
const GRACE_SEC = 60;

/**
 * GET /api/mock/questions — mock exam set WITHOUT answer keys.
 * Returns a server timestamp; the score endpoint enforces the time limit.
 */
export async function GET() {
  const questions = PRACTICE_QUESTIONS.map((q) => ({
    id: q.id,
    topic: q.topic,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
  }));
  return NextResponse.json({
    mockId: "jft-mock-1",
    version: "mock-v1-draft",
    reviewStatus: "draft — pending Japanese SME review",
    total: questions.length,
    timeLimitSec: MOCK_TIME_LIMIT_SEC,
    startedAt: Date.now(),
    questions,
  });
}

/**
 * POST /api/mock/score — deterministic scoring with server-side time enforcement.
 */
export async function POST(req: Request) {
  let body: { answers?: Record<string, string>; startedAt?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const startedAt = Number(body.startedAt);
  if (!startedAt || Number.isNaN(startedAt)) {
    return NextResponse.json({ error: "Missing mock start timestamp." }, { status: 400 });
  }
  const elapsedSec = (Date.now() - startedAt) / 1000;
  if (elapsedSec > MOCK_TIME_LIMIT_SEC + GRACE_SEC) {
    return NextResponse.json(
      { error: "Time limit exceeded. This attempt cannot be scored.", elapsedSec: Math.round(elapsedSec) },
      { status: 422 }
    );
  }

  const answers = body.answers ?? {};
  const details = PRACTICE_QUESTIONS.map((q) => {
    const pickedId = answers[q.id] ?? null;
    const correct = pickedId === q.correctId;
    const correctOption = q.options.find((o) => o.id === q.correctId)!;
    return {
      id: q.id,
      topic: q.topic,
      correct,
      correctLabel: correctOption.text,
      correctLabelJp: correctOption.textJp ?? null,
      explanation: q.explanation,
    };
  });
  const score = details.filter((d) => d.correct).length;

  return NextResponse.json({
    mockId: "jft-mock-1",
    version: "mock-v1-draft",
    score,
    total: details.length,
    percent: Math.round((score / details.length) * 100),
    elapsedSec: Math.round(elapsedSec),
    details,
    disclaimer:
      "Unofficial practice score. It measures performance on these original practice questions and cannot predict an official JFT-Basic result.",
  });
}
