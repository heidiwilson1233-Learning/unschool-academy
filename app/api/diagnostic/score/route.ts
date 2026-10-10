import { NextResponse } from "next/server";
import {
  DIAGNOSTIC_QUESTIONS,
  DIAGNOSTIC_SKILL_INFO,
  DIAGNOSTIC_SKILL_ORDER,
  TOPIC_INFO,
} from "@/lib/exams";

type ScoreRequest = {
  answers: Record<string, string>; // questionId -> optionId
};

type SkillRow = {
  skill: string;
  label: string;
  topic: string;
  practiceSlug: string;
  correct: number;
  total: number;
  /** Sampled skills get a measurement; a single-question skill is still thin — UI says so. */
  status: "can-do" | "needs-help";
};

/**
 * POST /api/diagnostic/score
 * Deterministic server-side scoring. Each option counts equally (1 point).
 * Returns per-topic AND per-skill breakdowns (the skill gap map), plus draft
 * explanations pending SME review. Same honesty contract as the page: unofficial
 * practice score.
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
  const bySkill: Record<string, { correct: number; total: number }> = {};
  const details = DIAGNOSTIC_QUESTIONS.map((q) => {
    const pickedId = body.answers[q.id] ?? null;
    const pickedOption = q.options.find((o) => o.id === pickedId) ?? null;
    const correctOption = q.options.find((o) => o.id === q.correctId)!;
    const correct = pickedId === q.correctId;

    if (!byTopic[q.topic]) byTopic[q.topic] = { correct: 0, total: 0 };
    byTopic[q.topic].total += 1;
    if (correct) byTopic[q.topic].correct += 1;

    if (!bySkill[q.skill]) bySkill[q.skill] = { correct: 0, total: 0 };
    bySkill[q.skill].total += 1;
    if (correct) bySkill[q.skill].correct += 1;

    return {
      id: q.id,
      topic: q.topic,
      skill: q.skill,
      skillLabel: DIAGNOSTIC_SKILL_INFO[q.skill]?.label ?? q.skill,
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

  // Skill gap map, in curriculum order. Skills the 10-question diagnostic does
  // NOT sample are listed separately as "not sampled" — never invented.
  const skills: SkillRow[] = DIAGNOSTIC_SKILL_ORDER.filter((sk) => bySkill[sk]).map(
    (sk) => {
      const s = bySkill[sk];
      const info = DIAGNOSTIC_SKILL_INFO[sk];
      return {
        skill: sk,
        label: info.label,
        topic: info.topic,
        practiceSlug: info.practiceSlug,
        correct: s.correct,
        total: s.total,
        status: s.correct / s.total >= 0.6 ? "can-do" : "needs-help",
      };
    }
  );
  const unsampledSkills: string[] = DIAGNOSTIC_SKILL_ORDER.filter((sk) => !bySkill[sk]).map(
    (sk) => DIAGNOSTIC_SKILL_INFO[sk].label
  );

  const needsHelp = skills.filter((s) => s.status === "needs-help").sort(
    (a, b) => a.correct / a.total - b.correct / b.total
  );
  const weakestSkill = needsHelp[0] ?? [...skills].sort((a, b) => a.correct / a.total - b.correct / b.total)[0];

  return NextResponse.json({
    version: "diagnostic-v3-curriculum",
    score,
    total,
    percent: Math.round((score / total) * 100),
    topics,
    skills,
    unsampledSkills,
    details,
    recommendation:
      score >= 8
        ? "Strong everyday foundation. Next: timed mixed practice to build speed and confidence."
        : score >= 5
          ? `Solid start. Focus next on “${weakestSkill.label}”. Short daily practice beats long cramming.`
          : `Good first step. Every learner starts here. Begin with short practice in “${weakestSkill.label}”, then re-take this diagnostic.`,
    disclaimer:
      "This is an unofficial practice score. It measures your performance on these 10 original practice questions and cannot predict an official JFT-Basic result.",
    reviewStatus: "Questions are original drafts pending Japanese SME review.",
  });
}
