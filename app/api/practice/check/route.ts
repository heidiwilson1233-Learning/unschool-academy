import { NextResponse } from "next/server";
import { getExamBank } from "@/lib/exam-banks";

/**
 * POST /api/practice/check  { exam?, questionId, optionId }
 * Practice mode: check ONE answer, reveal explanation immediately.
 * (Mock mode never uses this endpoint — answers stay hidden until submit.)
 *
 * Exam-agnostic (run 65): the question is looked up in the bank for `exam`
 * (defaults to "jft-basic"). An exam-scoped lookup means a question id from
 * one exam can never be checked against another exam's key.
 */
export async function POST(req: Request) {
  let body: { exam?: string; questionId?: string; optionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const exam = (body.exam ?? "jft-basic").trim();
  const bank = getExamBank(exam);
  if (!bank) {
    return NextResponse.json({ error: "Unknown exam." }, { status: 404 });
  }
  const q = bank.byId(body.questionId ?? "");
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
