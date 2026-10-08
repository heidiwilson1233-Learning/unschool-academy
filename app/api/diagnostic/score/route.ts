import { NextResponse } from "next/server";
import { DIAGNOSTIC_QUESTIONS, TOPIC_INFO } from "@/lib/exams";

type ScoreRequest = {
  answers: Record<string, string>; // questionId -> optionId
};

/**
 * POST /api/diagnostic/score
 * Deterministic server-side scoring. Each option counts equally (1 point).
 * Returns per-topic breakdown and reviewed explanations.
 */
export async function POST(req: Request) {
  let body: ScoreRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json({ error: "Missing 'answers' object." }, { status: 400 });
  }

  const byTopic: Record<string, { correct: number; total: number }> = {};
  const details = DIAGNOSTIC_QUESTIONS.map((q) => {
    const pickedId = body.answers[q.id] ?? null;
    const pickedOption = q.options.find((o) => o.id === pickedId) ?? null;
    const correctOption = q.options.find((o) => o.id === q.correctId)!;
    const correct = pickedId === q.correctId;

    if (!byTopic[q.topic]) byTopic[q.topic] = { correct: 0, total: 0 };
    byTopic[q.topic].total += 1;
    if (correct) byTopic[q.topic].correct += 1;

    return {
      id: q.id,
      topic: q.topic,
      correct,
      pickedLabel: pickedOption ? pickedOption.text : "No answer",
      pickedLabelJp: pickedOption?.textJp ?? null,
      correctLabel: correctOption.text,
      correctLabelJp: correctOption.textJp ?? null,
      explanation: q.explanation,
    };
  });

  const score = details.filter((d) => d.correct).length;
  const total = DIAGNOSTIC_QUESTIONS.length;

  const topics = Object.entries(byTopic).map(([topic, s]) => ({
    topic,
    description: TOPIC_INFO[topic as keyof typeof TOPIC_INFO],
    correct: s.correct,
    total: s.total,
    needsWork: s.correct / s.total < 0.6,
  }));

  const weakest = [...topics].sort((a, b) => a.correct / a.total - b.correct / b.total)[0];

  return NextResponse.json({
    version: "diagnostic-v1-draft",
    score,
    total,
    percent: Math.round((score / total) * 100),
    topics,
    details,
    recommendation:
      score >= 8
        ? "Strong everyday foundation. Next: timed mixed practice to build speed and confidence."
        : score >= 5
          ? `Solid start. Focus next on “${weakest.topic}” — short daily practice beats long cramming.`
          : "Good first step — every learner starts here. Begin with the Conversation and Expression basics, then re-take this diagnostic.",
    disclaimer:
      "This is an unofficial practice score. It measures your performance on these 10 original practice questions and cannot predict an official JFT-Basic result.",
    reviewStatus: "Questions are original drafts pending Japanese SME review.",
  });
}
