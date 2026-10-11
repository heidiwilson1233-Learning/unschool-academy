import { NextResponse } from "next/server";
import { getExamBank, getExamPracticeMeta, listPracticeExams } from "@/lib/exam-banks";
import { safePracticeQuestion } from "@/lib/practice-dto";

/**
 * GET /api/practice/questions?exam=<exam-id>&topic=<unit-id | unit title>
 * Practice-mode questions WITHOUT answer keys or explanations.
 * Hints are included (practice mode). Explanations only via /check after an attempt.
 *
 * Exam-agnostic (run 65): the bank is loaded from
 * content/curriculum/<exam-id>/units/** at request time and validated by the
 * shared question-bank factory. `exam` defaults to "jft-basic" so every
 * existing caller keeps working. `topic` accepts a unit id
 * ("polity-fundamentals") or a unit title ("Script and Vocabulary" — the
 * legacy JFT form).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exam = (searchParams.get("exam") ?? "jft-basic").trim();
  const topicParam = (searchParams.get("topic") ?? "").trim();

  const bank = getExamBank(exam);
  if (!bank) {
    return NextResponse.json(
      { error: "Unknown exam.", exams: listPracticeExams() },
      { status: 404 }
    );
  }
  const units = Object.values(bank.units);
  const unit =
    units.find((u) => u.id === topicParam) ?? units.find((u) => u.title === topicParam);
  if (!unit) {
    return NextResponse.json(
      { error: "Unknown topic.", topics: bank.topics },
      { status: 400 }
    );
  }

  const meta = getExamPracticeMeta(exam);
  const questions = bank.byTopic(unit.title).map(safePracticeQuestion);
  return NextResponse.json({
    version: "practice-v2-curriculum",
    exam,
    examTitle: meta?.examTitle ?? exam,
    reviewStatus: meta?.reviewStatus ?? "draft — pending SME review",
    topic: unit.title,
    unitId: unit.id,
    total: questions.length,
    questions,
  });
}
