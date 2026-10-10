import { NextResponse } from "next/server";
import { mockFullQuestions } from "@/lib/practice";

/**
 * Mock 2 — the full-length JFT-Basic mock: 50 questions, 60 minutes,
 * official section order (Script and Vocabulary → Conversation and
 * Expression → Listening Comprehension → Reading Comprehension), skills
 * interleaved inside each section.
 *
 * The set is CURATED and frozen in lib/practice.ts (MOCK2_QUESTION_IDS).
 * Practice content batches never change it. Every question is an original
 * draft, pending Japanese SME review — the version string says so, and the
 * score endpoint repeats it.
 */
const MOCK_SET = mockFullQuestions();

export const MOCK2_TIME_LIMIT_SEC = 60 * 60; // 60 minutes
const GRACE_SEC = 60;

const REVIEW_STATUS = "draft — pending Japanese SME review";

/**
 * GET /api/mock/full — full mock set WITHOUT answer keys.
 * Returns a server timestamp; the score endpoint enforces the time limit.
 */
export async function GET() {
  const questions = MOCK_SET.map((q) => ({
    id: q.id,
    topic: q.topic,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
  }));
  return NextResponse.json({
    mockId: "jft-mock-2",
    version: "mock-v2-draft",
    reviewStatus: REVIEW_STATUS,
    total: questions.length,
    timeLimitSec: MOCK2_TIME_LIMIT_SEC,
    startedAt: Date.now(),
    questions,
  });
}

/**
 * POST /api/mock/full/score — deterministic scoring with server-side time
 * enforcement, plus per-section analytics (accuracy + pace per section) so
 * the results page can show where time and marks actually went.
 *
 * Late-submit contract: a manual submit past the limit is still rejected
 * (422). But if the AUTO-submit's own request failed on the network, the
 * learner's retry must not strand them — scoring proceeds with
 * `overTime: true` so the player can label it honestly (review only, not a
 * timed attempt) instead of dead-ending on an unreachable results page.
 */
export async function POST(req: Request) {
  let body: { answers?: Record<string, string>; startedAt?: number; times?: Record<string, number>; auto?: boolean };
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
  const overTime = elapsedSec > MOCK2_TIME_LIMIT_SEC + GRACE_SEC;
  if (overTime && !body.auto) {
    return NextResponse.json(
      { error: "Time limit exceeded. This attempt cannot be scored.", elapsedSec: Math.round(elapsedSec) },
      { status: 422 }
    );
  }

  const answers = body.answers ?? {};
  const times = body.times ?? {};
  const details = MOCK_SET.map((q) => {
    const pickedId = answers[q.id] ?? null;
    const correct = pickedId === q.correctId;
    const correctOption = q.options.find((o) => o.id === q.correctId)!;
    return {
      id: q.id,
      topic: q.topic,
      correct,
      correctId: q.correctId,
      correctLabel: correctOption.text,
      correctLabelJp: correctOption.textJp ?? null,
      explanation: q.explanation,
    };
  });
  const score = details.filter((d) => d.correct).length;

  // Per-section analytics: section order follows first appearance (official order).
  // Pace averages only over questions the learner actually viewed (time > 0),
  // so skipped questions don't dilute "about Ns a question" into a lie.
  const sectionStats: { topic: string; total: number; correct: number; timeSec: number; timed: number; avgSec: number }[] = [];
  for (const q of MOCK_SET) {
    let s = sectionStats.find((x) => x.topic === q.topic);
    if (!s) {
      s = { topic: q.topic, total: 0, correct: 0, timeSec: 0, timed: 0, avgSec: 0 };
      sectionStats.push(s);
    }
    s.total += 1;
    if (answers[q.id] === q.correctId) s.correct += 1;
    const t = Number(times[q.id]);
    if (Number.isFinite(t) && t > 0) {
      s.timeSec += Math.round(t);
      s.timed += 1;
    }
  }
  for (const s of sectionStats) s.avgSec = s.timed > 0 ? Math.round(s.timeSec / s.timed) : 0;

  return NextResponse.json({
    mockId: "jft-mock-2",
    version: "mock-v2-draft",
    reviewStatus: REVIEW_STATUS,
    score,
    total: details.length,
    percent: Math.round((score / details.length) * 100),
    elapsedSec: Math.round(elapsedSec),
    overTime,
    details,
    sectionStats: sectionStats.map(({ timed: _timed, ...s }) => s),
    disclaimer:
      "Unofficial practice score. It measures performance on these original practice questions and cannot predict an official JFT-Basic result.",
  });
}
