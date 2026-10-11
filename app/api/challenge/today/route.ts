import { NextResponse } from "next/server";
import { practiceByTopic, PRACTICE_TOPICS } from "@/lib/practice";
import { pickDailyChallenge, dayKeyLocal } from "@/lib/habits";

/**
 * GET /api/challenge/today?date=YYYY-MM-DD
 * Today's 5-question challenge set WITHOUT answer keys or explanations.
 * Deterministic: the same local date returns the same set for everyone
 * (date is the learner's local date, passed by the client; the server TZ
 * must not decide midnight rollover). Interleaved across topics.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date");
  const serverKey = dayKeyLocal(new Date());
  // The date is client-controlled (their local midnight decides rollover).
  // Clamp hand-edited values to ±1 day of the server date so ?date= can't
  // preview far-future sets; timezone skew between client and server stays inside the window.
  let dateKey = serverKey;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const [y, m, d] = dateParam.split("-").map(Number);
    const given = new Date(y, m - 1, d);
    const server = new Date();
    const diffDays = Math.round((given.getTime() - new Date(server.getFullYear(), server.getMonth(), server.getDate()).getTime()) / 86400000);
    if (Math.abs(diffDays) <= 1) dateKey = dateParam;
  }

  const pool = PRACTICE_TOPICS.flatMap((t) => practiceByTopic(t));
  const picked = pickDailyChallenge(pool, dateKey);

  const questions = picked.map((q) => ({
    id: q.id,
    topic: q.topic,
    skill: q.skill,
    skillLabel: q.skillLabel,
    version: q.version,
    stem: q.stem,
    stemJp: q.stemJp ?? null,
    options: q.options.map((o) => ({ id: o.id, text: o.text, textJp: o.textJp ?? null })),
    audioTextJp: q.audioTextJp ?? null,
    hint: q.hint,
  }));

  return NextResponse.json(
    {
      version: "practice-v2-curriculum",
      reviewStatus: "draft — pending Japanese SME review",
      date: dateKey,
      total: questions.length,
      questions,
    },
    {
      // Deterministic per ?date= URL, so edge caching is safe: a 1h s-maxage
      // can never serve stale content (midnight rollover = a new URL).
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
