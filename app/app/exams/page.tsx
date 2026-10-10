"use client";

import { useEffect, useRef, useState } from "react";
import { Section, Button, Card, Badge, Breadcrumbs } from "@/components/ui";
import { PRACTICE_TOPICS } from "@/lib/practice-meta";

type Attempt = {
  kind: string;
  topic?: string;
  score: number;
  total: number;
  at: string;
  misses?: string[];
  cleared?: string[];
};

const SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const pct = (a: Attempt) => (a.total > 0 ? a.score / a.total : 0);
const parsedAt = (a: Attempt) => {
  const d = new Date(a.at);
  return isNaN(d.getTime()) ? null : d;
};
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const fmtDate = (d: Date) => d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function kindLabel(a: Attempt) {
  if (a.kind === "diagnostic") return "Diagnostic";
  if (a.kind.startsWith("mock")) return "Timed mock";
  return `Practice${a.topic ? ` · ${a.topic}` : ""}`;
}

export default function ExamsDashboard() {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [manualCleared, setManualCleared] = useState<string[]>([]);
  const [confirming, setConfirming] = useState(false);
  const clearBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const emptyHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      setAttempts(Array.isArray(raw) ? raw : []);
    } catch {
      setAttempts([]);
    }
    try {
      const clearedRaw = JSON.parse(localStorage.getItem("ua-answers-cleared") ?? "[]");
      setManualCleared(Array.isArray(clearedRaw) ? clearedRaw.filter((x) => typeof x === "string") : []);
    } catch {
      setManualCleared([]);
    }
  }, []);

  const clear = () => {
    localStorage.removeItem("ua-attempts");
    setAttempts([]);
    setConfirming(false);
    // Move focus to the new state so screen-reader users hear the change.
    requestAnimationFrame(() => emptyHeadingRef.current?.focus());
  };

  const hero = (
    <div className="relative overflow-hidden border-b border-border bg-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-16">
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "My exam progress" }]} />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
          Learner dashboard · JFT-Basic
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight text-ink text-balance">
          My exam progress
        </h1>
        <p className="mt-4 text-slate max-w-2xl leading-relaxed">
          Every session you finish is logged here on this device. No account, no sign-in.
          Scores, weakest topics, and full history stay private on this browser.
        </p>
      </div>
    </div>
  );

  /* Skeleton: hero renders in both states; blocks mirror the bento shape. No pulse. */
  if (attempts === null) {
    return (
      <>
        {hero}
        <Section>
          <div aria-busy="true" className="mx-auto max-w-6xl">
            <p className="sr-only">Loading your progress</p>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 md:col-span-4 h-44 rounded-2xl bg-border/40" />
              <div className="col-span-6 md:col-span-2 h-44 rounded-2xl bg-border/40" />
              <div className="col-span-6 md:col-span-4 h-64 rounded-2xl bg-border/40" />
              <div className="col-span-6 md:col-span-2 h-64 rounded-2xl bg-border/40" />
            </div>
          </div>
        </Section>
      </>
    );
  }

  const valid = attempts.filter((a) => parsedAt(a) !== null);
  const totalSessions = valid.length;

  /* Headline accuracy: recent practice + mock sessions only. Diagnostics are
     cold-start baselines and would deflate the figure dishonestly. */
  const scored = valid.filter((a) => a.kind !== "diagnostic");
  const recent = scored.slice(-10);
  const accuracy = recent.length
    ? Math.round((recent.reduce((s, a) => s + pct(a), 0) / recent.length) * 100)
    : null;
  const diagnostics = valid.filter((a) => a.kind === "diagnostic");
  const mocks = valid.filter((a) => a.kind.startsWith("mock"));
  const baseline = diagnostics.length ? diagnostics[diagnostics.length - 1] : null;

  /* Day streak from local calendar days with at least one session. */
  const days = new Set(valid.map((a) => dayKey(parsedAt(a)!)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const lastAt = valid.length ? parsedAt(valid[valid.length - 1]) : null;
  const lastWasToday = lastAt ? dayKey(lastAt) === dayKey(new Date()) : false;

  /* Per-topic mastery from practice attempts (verified topic names). */
  const mastery = PRACTICE_TOPICS.map((t) => {
    const rows = valid.filter((a) => a.kind === "practice" && a.topic === t);
    const n = rows.length;
    const score = n ? Math.round((rows.reduce((s, a) => s + pct(a), 0) / n) * 100) : null;
    return { topic: t, slug: SLUGS[t], n, score };
  });
  const practiced = mastery.filter((m) => m.score !== null);
  const weakest = practiced.length
    ? practiced.reduce((a, b) => (a.score! < b.score! ? a : b))
    : null;

  /* Per-session delta vs the previous session of the same kind + topic. */
  const deltas: Record<number, number> = {};
  valid.forEach((a, i) => {
    for (let j = i - 1; j >= 0; j--) {
      const p = valid[j];
      if (p.kind === a.kind && p.topic === a.topic) {
        deltas[i] = Math.round((pct(a) - pct(p)) * 100);
        break;
      }
    }
  });

  /* Error-log review deck: missed ids not yet cleared (answers portal). */
  const clearedIds = new Set<string>(manualCleared);
  for (const a of valid) for (const id of a.cleared ?? []) clearedIds.add(id);
  const openMisses = new Set<string>();
  for (const a of valid) for (const id of a.misses ?? []) if (!clearedIds.has(id)) openMisses.add(id);

  const studyPlan =
    weakest && weakest.score! < 80 ? (
      <>
        <Badge tone="warning">Practice this first</Badge>
        <h3 className="mt-3 font-bold text-ink text-lg">{weakest.topic}</h3>
        <p className="text-slate text-[15px] mt-1 leading-relaxed">
          Weakest topic: {weakest.score}% across {weakest.n} practice{" "}
          {weakest.n === 1 ? "session" : "sessions"}. One focused session here, then
          re-test with a timed mock.
        </p>
        <div className="mt-4">
          <Button href={`/exams/jft-basic/practice/${weakest.slug}`}>
            Resume studying · {weakest.topic.split(" ")[0]}
          </Button>
        </div>
      </>
    ) : diagnostics.length === 0 ? (
      <>
        <Badge tone="info">Start here</Badge>
        <h3 className="mt-3 font-bold text-ink text-lg">Take the free diagnostic</h3>
        <p className="text-slate text-[15px] mt-1 leading-relaxed">
          Ten questions across all four topics. Five minutes, no preparation needed.
        </p>
        <div className="mt-4">
          <Button href="/exams/jft-basic/diagnostic">Start the diagnostic</Button>
        </div>
      </>
    ) : (
      <>
        <Badge tone="success">On track</Badge>
        <h3 className="mt-3 font-bold text-ink text-lg">Try a timed mock</h3>
        <p className="text-slate text-[15px] mt-1 leading-relaxed">
          Topics are holding. Test them under timed conditions with Mock 1.
        </p>
        <div className="mt-4">
          <Button href="/exams/jft-basic/mock-tests">Take mock 1</Button>
        </div>
      </>
    );

  return (
    <>
      {hero}
      <Section>
        <div className="mx-auto max-w-6xl">
          {totalSessions === 0 ? (
            <Card className="max-w-2xl mx-auto !shadow-none">
              <div className="text-center py-16 px-6">
                <div
                  aria-hidden
                  className="mx-auto w-16 h-16 rounded-2xl bg-academy-blue/10 flex items-center justify-center text-3xl mb-6"
                >
                  ○
                </div>
                <h2 ref={emptyHeadingRef} tabIndex={-1} className="text-xl font-bold text-ink mb-2">
                  Start with the diagnostic
                </h2>
                <p className="text-slate max-w-md mx-auto">
                  Ten questions, five minutes. They set your baseline across all four topics, so
                  your next sessions target the right ones.
                </p>
                <div className="mt-6">
                  <Button href="/exams/jft-basic/diagnostic">Start the diagnostic</Button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-6 gap-4 md:gap-5">
                {/* Accuracy: the type hero of the page */}
                <Card className="col-span-6 md:col-span-4 !shadow-none">
                  <dl>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                      Practice accuracy
                    </dt>
                    <dd
                      className="mt-2 font-extrabold tracking-[-0.03em] text-ink leading-none"
                      style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}
                      aria-label={`Practice accuracy ${accuracy ?? "not available"} percent`}
                    >
                      {accuracy === null ? "—" : `${accuracy}%`}
                    </dd>
                  </dl>
                  <p className="mt-4 text-sm text-slate leading-relaxed">
                    {accuracy === null
                      ? "No practice sessions yet. Take the diagnostic to set your baseline."
                      : `Across your last ${recent.length} practice and mock sessions. Diagnostics are excluded, so one cold start cannot drag this down.`}
                  </p>
                  {baseline && (
                    <p className="mt-2 text-sm text-slate">
                      Diagnostic baseline: {Math.round(pct(baseline) * 100)}% on{" "}
                      {fmtDate(parsedAt(baseline)!)}.
                    </p>
                  )}
                </Card>

                {/* Streak */}
                <Card className="col-span-6 md:col-span-2 !shadow-none">
                  <dl>
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
                      Day streak
                    </dt>
                    <dd
                      className="mt-2 text-6xl font-extrabold tracking-[-0.03em] text-ink leading-none"
                      aria-label={`${streak} day streak`}
                    >
                      {streak}
                    </dd>
                  </dl>
                  <p className="mt-4 text-sm text-slate leading-relaxed">
                    Days in a row with at least one session.
                  </p>
                  {lastAt && (
                    <p className="mt-2 text-sm text-slate leading-relaxed">
                      {lastWasToday
                        ? "You practised today. Come back tomorrow to keep it going."
                        : `Last session ${fmtDate(lastAt)}. One session today keeps the streak alive.`}
                    </p>
                  )}
                </Card>

                {/* Review deck — only when there are open misses */}
                {openMisses.size > 0 && (
                  <div className="col-span-6 border border-academy-teal/30 bg-academy-teal/5 rounded-2xl px-6 py-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <p className="flex-1 min-w-52 text-[15px] text-ink leading-relaxed">
                      <span className="font-bold">Review your misses ({openMisses.size})</span>
                      <span className="text-slate">
                        {" "}— questions waiting for a second look in your review deck.
                      </span>
                    </p>
                    <Button href="/exams/jft-basic/answers/review" variant="secondary">
                      Open review deck
                    </Button>
                  </div>
                )}

                {/* Topic mastery */}
                <Card className="col-span-6 md:col-span-4 !shadow-none">
                  <h2 className="text-xl font-extrabold text-ink">Topic mastery</h2>
                  <p className="mt-1 text-sm text-slate">
                    Accuracy across your practice attempts per topic. Draft questions, pending
                    expert review.
                  </p>
                  <ul className="mt-6 space-y-5">
                    {mastery.map((m) => (
                      <li key={m.topic}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-semibold text-ink text-[15px]">
                            {m.topic}
                            {weakest?.topic === m.topic && (
                              <span className="ml-2 align-middle">
                                <Badge tone="warning">Practice this first</Badge>
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-slate shrink-0">
                            {m.score === null
                              ? "Not practised yet"
                              : `${m.score}% · ${m.n} ${m.n === 1 ? "session" : "sessions"}`}
                          </p>
                        </div>
                        <div
                          className="mt-2 h-2 rounded-full bg-border/60"
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={m.score ?? 0}
                          aria-label={`${m.topic}: ${
                            m.score === null
                              ? "not practised yet"
                              : `${m.score} percent across ${m.n} practice sessions`
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-academy-teal"
                            style={{ width: `${m.score ?? 0}%` }}
                          />
                        </div>
                        <a
                          href={`/exams/jft-basic/practice/${m.slug}`}
                          className="mt-1.5 inline-block text-sm font-semibold text-academy-teal-dark hover:underline"
                        >
                          Practise {m.topic.split(" ")[0].toLowerCase()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Study plan */}
                <div className="col-span-6 md:col-span-2">
                  <h2 className="text-xl font-extrabold text-ink mb-4">Study plan</h2>
                  <Card className="!shadow-none">{studyPlan}</Card>
                </div>

                {/* Session history */}
                <Card className="col-span-6 !shadow-none">
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <h2 className="text-xl font-extrabold text-ink">Session history</h2>
                    {confirming ? (
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">Clear all sessions?</span>
                        <button
                          ref={confirmBtnRef}
                          onClick={clear}
                          className="text-sm font-bold text-red-700 hover:text-red-800 underline"
                        >
                          Yes, clear
                        </button>
                        <button
                          onClick={() => {
                            setConfirming(false);
                            clearBtnRef.current?.focus();
                          }}
                          className="text-sm font-semibold text-slate hover:text-ink underline"
                        >
                          Keep
                        </button>
                      </span>
                    ) : (
                      <button
                        ref={clearBtnRef}
                        onClick={() => {
                          setConfirming(true);
                          requestAnimationFrame(() => confirmBtnRef.current?.focus());
                        }}
                        className="text-sm font-semibold text-slate hover:text-red-700 underline"
                      >
                        Clear history
                      </button>
                    )}
                  </div>
                  <ul className="divide-y divide-border">
                    {[...valid].reverse().map((a, r) => {
                      const i = valid.length - 1 - r;
                      const d = parsedAt(a)!;
                      const delta = deltas[i];
                      const label = kindLabel(a);
                      const scorePct = Math.round(pct(a) * 100);
                      return (
                        <li key={`${a.at}-${i}`} className="flex items-center justify-between gap-4 py-3.5">
                          <div>
                            <p className="font-bold text-ink text-[15px]">{label}</p>
                            <p className="text-xs text-slate mt-0.5">
                              {fmtDate(d)}
                              {delta !== undefined && (
                                <span
                                  className={`ml-2 font-semibold ${
                                    delta > 0
                                      ? "text-academy-teal-dark"
                                      : delta < 0
                                        ? "text-red-700"
                                        : "text-slate"
                                  }`}
                                >
                                  {delta > 0 ? `+${delta}%` : delta < 0 ? `${delta}%` : "±0%"}{" "}
                                  vs previous
                                </span>
                              )}
                            </p>
                          </div>
                          <p
                            className={`text-xl font-extrabold shrink-0 ${
                              scorePct >= 70
                                ? "text-academy-teal-dark"
                                : scorePct >= 40
                                  ? "text-amber-700"
                                  : "text-slate"
                            }`}
                            aria-label={`${label}: score ${a.score} out of ${a.total}`}
                          >
                            {a.score}/{a.total}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-xs text-slate mt-4">
                    Stored only in this browser. Never sent anywhere. Clearing is permanent.
                  </p>
                </Card>
              </div>

              {/* Continue practising */}
              <div className="mt-10">
                <h2 className="text-xl font-extrabold text-ink mb-4">Continue practising</h2>
                <div className="flex flex-wrap gap-3">
                  <Button href="/exams/jft-basic/topics" variant="secondary" size="sm">
                    Practice by topic
                  </Button>
                  <Button href="/exams/jft-basic/mock-tests" variant="secondary" size="sm">
                    Mock tests
                  </Button>
                  <Button href="/exams/jft-basic" variant="ghost" size="sm">
                    JFT-Basic program
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
