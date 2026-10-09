"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Flag, ArrowRight } from "lucide-react";
import { Button, Badge, Callout, Card } from "@/components/ui";
import { recordAttempt, speakJapanese } from "@/lib/attempts";

type PublicQuestion = {
  id: string;
  topic: string;
  skill: string;
  skillLabel: string;
  stem: string;
  stemJp: string | null;
  options: { id: string; text: string; textJp: string | null }[];
  audioTextJp: string | null;
};

type ScoreDetail = {
  id: string;
  topic: string;
  correct: boolean;
  pickedLabel: string;
  pickedLabelJp: string | null;
  correctLabel: string;
  correctLabelJp: string | null;
  explanation: string;
};

type SkillResult = {
  skill: string;
  label: string;
  topic: string;
  practiceSlug: string;
  correct: number;
  total: number;
  status: "can-do" | "needs-help";
};

type ScoreResult = {
  version: string;
  score: number;
  total: number;
  percent: number;
  topics: { topic: string; description: string; correct: number; total: number; needsWork: boolean }[];
  skills: SkillResult[];
  unsampledSkills: string[];
  details: ScoreDetail[];
  recommendation: string;
  disclaimer: string;
  reviewStatus: string;
};

export default function DiagnosticPlayer() {
  const [questions, setQuestions] = useState<PublicQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [scoreError, setScoreError] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"wrong" | "all">("wrong");

  const resultsRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const keepAnsweringRef = useRef<HTMLButtonElement>(null);
  const cardSeenRef = useRef(false);
  // Entrance animation only on first question mount — not on every navigation.
  const animateCard = !cardSeenRef.current;
  useEffect(() => {
    cardSeenRef.current = true;
  }, []);

  useEffect(() => {
    fetch("/api/diagnostic/questions")
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => setQuestions(d.questions))
      .catch(() => setLoadError(true));
  }, []);

  const pick = useCallback(
    (qid: string, oid: string) => {
      setAnswers((a) => ({ ...a, [qid]: oid }));
    },
    []
  );

  const goTo = useCallback((i: number) => {
    setConfirming(false);
    setIndex(i);
  }, []);

  const submit = useCallback(async () => {
    setScoring(true);
    setScoreError(false);
    try {
      const r = await fetch("/api/diagnostic/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!r.ok) throw new Error("score failed");
      const d = (await r.json()) as ScoreResult;
      setResult(d);
      setReviewFilter(d.details.some((x) => !x.correct) ? "wrong" : "all");
      setConfirming(false);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      recordAttempt({
        kind: "diagnostic",
        score: d.score,
        total: d.total,
        at: new Date().toISOString(),
        skills: d.skills.map((s) => ({ skill: s.skill, correct: s.correct, total: s.total })),
        // Content-schema rule 4: attempts reference the version the learner saw,
        // so retakes stay comparable when the bank is edited.
        contentVersion: d.version,
      });
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      // WCAG 2.4.3: move focus to the new results region (no visible ring — programmatic focus).
      requestAnimationFrame(() => resultsRef.current?.focus({ preventScroll: true }));
    } catch {
      setScoreError(true);
    } finally {
      setScoring(false);
    }
  }, [answers]);

  // Keyboard: 1–4 select option, arrows move between questions.
  useEffect(() => {
    if (!questions || result || confirming) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Scope shortcuts to the player: number/arrow keys are SR navigation
      // keys page-wide, so never hijack keypresses outside the player card.
      if (playerRef.current && target && !playerRef.current.contains(target)) return;
      // Never hijack keys typed into real form controls.
      if (target?.closest?.('input, select, textarea, [contenteditable="true"]')) {
        // Native radios own arrow keys — don't also jump questions (double-trigger).
        if (target.closest("fieldset")) return;
        // Number keys still work when a radio is focused.
        if (e.key !== "1" && e.key !== "2" && e.key !== "3" && e.key !== "4") return;
      }
      const q = questions[index];
      if (e.key >= "1" && e.key <= "4") {
        const opt = q.options[Number(e.key) - 1];
        if (opt) pick(q.id, opt.id);
      } else if (e.key === "ArrowRight") {
        setIndex((i) => Math.min(i + 1, questions.length - 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [questions, index, result, confirming, pick]);

  // Submit-confirm dialog: focus management + Tab trap + Escape.
  useEffect(() => {
    if (!confirming) return;
    keepAnsweringRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConfirming(false);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  if (loadError) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-ink mb-2">Couldn&apos;t load the diagnostic</h2>
        <p className="text-slate">Please check your connection and reload the page.</p>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </Card>
    );
  }

  if (!questions) {
    return (
      <div aria-live="polite" className="space-y-3 min-h-[520px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-border/40" />
        ))}
        <p className="text-slate text-sm">Loading your 10 questions…</p>
      </div>
    );
  }

  /* ---------- RESULTS ---------- */
  if (result) {
    const sortedSkills = [...result.skills].sort(
      (a, b) => a.correct / a.total - b.correct / b.total
    );
    const needsHelpSkills = sortedSkills.filter((s) => s.status === "needs-help");
    const canDoSkills = result.skills.filter((s) => s.status === "can-do");
    const weakestSkill = sortedSkills[0];
    const secondWeakestSkill = sortedSkills[1];
    const wrongDetails = result.details.filter((d) => !d.correct);
    const shownDetails =
      reviewFilter === "wrong" && wrongDetails.length > 0
        ? [...wrongDetails, ...result.details.filter((d) => d.correct)]
        : result.details;
    const placementLine =
      result.percent >= 80
        ? "Strong start on this sample: time to build speed"
        : `Your starting line: ${weakestSkill.label}`;

    return (
      <div className="guide-reveal" ref={resultsRef} tabIndex={-1}>
        {/* Score hero — growth frame leads, the number follows */}
        <section aria-labelledby="diag-score">
          <h2 id="diag-score" className="sr-only">Your diagnostic results</h2>
          <Card className="text-center !p-10">
            <Badge tone="info">Diagnostic complete · unofficial practice score</Badge>
            <p className="mt-6 text-2xl font-extrabold text-ink">{placementLine}</p>
            <p className="mt-3 text-4xl font-extrabold text-ink">
              {result.score}<span className="text-xl text-slate font-semibold">/{result.total}</span>
            </p>
            <p className="mt-2 text-slate">{result.recommendation}</p>
            <p className="mt-3 text-sm text-slate">
              This measures 10 practice questions, not your ability. Practice a topic,
              then retake the diagnostic to see your progress.
            </p>
            <Callout title="Honest scoring" tone="info">
              <p>{result.disclaimer}</p>
              <p className="mt-2 text-xs">{result.reviewStatus}</p>
            </Callout>
          </Card>
        </section>

        {/* Skill gap map — Can Do vs Needs Help, weakest first (portal doctrine move 1). */}
        <section aria-labelledby="diag-gapmap">
          <h2 id="diag-gapmap" className="text-2xl font-extrabold text-ink mt-10 mb-2">Your skill map</h2>
          <p className="text-slate mb-6 max-w-2xl">
            Ten questions is a thin sample. Treat this as a first pass, not a verdict.
            Each row is one skill the JFT-Basic tests; practice fixes them weakest-first.
          </p>
          <div className="grid lg:grid-cols-6 gap-6">
            {/* Needs help — the dossier cell (action zone) */}
            <div className="lg:col-span-4 bg-paper border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-baseline justify-between border-b-2 border-ink pb-3">
                <h3 className="font-extrabold text-ink">Needs help</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {needsHelpSkills.length} skill{needsHelpSkills.length === 1 ? "" : "s"} to fix first
                </p>
              </div>
              {needsHelpSkills.length === 0 ? (
                <p className="py-6 text-slate">
                  Nothing needs help at this sample size. Every skill you tried came back strong.
                  The unsampled skills below are still worth a look.
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {needsHelpSkills.map((s, i) => (
                    <li key={s.skill} className="py-4 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate">{String(i + 1).padStart(2, "0")} · {s.topic}</p>
                        <p className="font-bold text-ink mt-1">{s.label}</p>
                        <p className="text-xs text-slate mt-1">
                          {s.correct} of {s.total} right{s.total === 1 ? " (one question: first pass only)" : ""}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-2xl font-extrabold text-amber-700 tabular-nums">{s.correct}/{s.total}</span>
                        <a
                          href={`/exams/jft-basic/practice/${s.practiceSlug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-academy-blue hover:underline"
                          aria-label={`Practice ${s.label}`}
                        >
                          Practice <ArrowRight size={14} aria-hidden="true" />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Can do — the quiet rail */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-paper border border-border rounded-2xl p-6">
                <h3 className="font-extrabold text-ink border-b border-border pb-3">Can do</h3>
                {canDoSkills.length === 0 ? (
                  <p className="py-4 text-sm text-slate">Not this time. That is what the diagnostic is for.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {canDoSkills.map((s) => (
                      <li key={s.skill} className="py-3">
                        <p className="font-bold text-ink text-[15px]">{s.label}</p>
                        <p className="text-xs text-slate mt-0.5">
                          {s.correct}/{s.total} · {s.topic}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {result.unsampledSkills.length > 0 && (
                <div className="bg-canvas border border-border rounded-2xl p-6">
                  <h3 className="font-extrabold text-ink border-b border-border pb-3">Not sampled today</h3>
                  <ul className="mt-3 space-y-1.5">
                    {result.unsampledSkills.map((label) => (
                      <li key={label} className="text-sm text-slate">· {label}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-slate">
                    Ten questions can&apos;t cover every skill. Topic practice does — it is free.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Review — wrong answers first, correct answers collapsed */}
        <section aria-labelledby="diag-review">
          <div className="flex flex-wrap items-center justify-between gap-3 mt-10 mb-2">
            <h2 id="diag-review" className="text-2xl font-extrabold text-ink">Review every question</h2>
            {wrongDetails.length > 0 && (
              <div className="flex rounded-xl border border-border overflow-hidden" role="group" aria-label="Filter review questions">
                {(["wrong", "all"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setReviewFilter(f)}
                    aria-pressed={reviewFilter === f}
                    className={`px-4 py-2 text-sm font-bold ${reviewFilter === f ? "bg-academy-blue text-white" : "text-slate hover:text-ink"}`}
                  >
                    {f === "wrong" ? `Missed (${wrongDetails.length})` : "Show all"}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Honesty, stated once here so the per-row tag below can stay compact —
              screen readers hear this sentence once, not ten times. */}
          <p className="text-xs text-slate mb-4">
            Every explanation below is a draft pending expert review.
          </p>
          {wrongDetails.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4" aria-label="Jump to a missed question">
              {wrongDetails.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    document.getElementById(`review-${d.id}`)?.scrollIntoView({ behavior: rm ? "auto" : "smooth", block: "start" });
                  }}
                  className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-sm font-bold text-red-700 hover:bg-red-100"
                >
                  Q{result.details.indexOf(d) + 1}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-4">
            {shownDetails.map((d) => {
              const q = questions.find((qq) => qq.id === d.id)!;
              const num = result.details.indexOf(d) + 1;
              const body = (
                <>
                  <p className="font-semibold text-ink">{q.stem}</p>
                  {q.stemJp && <p lang="ja" className="jp text-slate mt-1">{q.stemJp}</p>}
                  <div className="mt-3 text-sm space-y-1">
                    <p className="text-slate">
                      You answered: <span className="font-semibold text-ink">{d.pickedLabel}</span>
                      {d.pickedLabelJp && d.pickedLabelJp !== d.pickedLabel && (
                        <span lang="ja" className="jp block text-slate">{d.pickedLabelJp}</span>
                      )}
                    </p>
                    {!d.correct && (
                      <p className="text-slate">
                        Correct: <span className="font-semibold text-academy-teal-dark">{d.correctLabel}</span>
                        {d.correctLabelJp && d.correctLabelJp !== d.correctLabel && (
                          <span lang="ja" className="jp block text-slate">{d.correctLabelJp}</span>
                        )}
                      </p>
                    )}
                  </div>
                  <p className="mt-3 text-[15px] text-slate leading-relaxed border-t border-border pt-3">
                    <span aria-hidden="true" className="mr-2 align-middle">
                      <Badge tone="warning">Draft</Badge>
                    </span>
                    <span className="font-semibold text-ink">Why: </span>{d.explanation}
                  </p>
                </>
              );
              if (d.correct) {
                return (
                  <details key={d.id} className="bg-paper border border-academy-teal/40 rounded-2xl p-5">
                    <summary className="cursor-pointer font-semibold text-ink list-none flex items-center gap-3">
                      <span aria-hidden="true" className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-academy-teal/15 text-academy-teal-dark shrink-0">✓</span>
                      <span className="sr-only">Correct — </span>
                      <span>Q{num} · {d.topic} — you got this</span>
                    </summary>
                    <div className="mt-4">{body}</div>
                  </details>
                );
              }
              return (
                <div key={d.id} id={`review-${d.id}`}>
                  <Card className="!border-red-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span aria-hidden="true" className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-red-100 text-red-700">✗</span>
                      <span className="sr-only">Incorrect — </span>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate">Q{num} · {d.topic}</p>
                    </div>
                    {body}
                  </Card>
                </div>
              );
            })}
          </div>
        </section>

        {/* Starter plan — the MD spec's "create plan" next action, built from real results.
            Weak-skills-first: the diagnostic's weakest skill is always step one. */}
        <section aria-labelledby="diag-plan">
          <Card className="mt-10 !p-8">
            <h2 id="diag-plan" className="text-2xl font-extrabold text-ink">Your starter plan</h2>
            <p className="text-slate mt-1 mb-6">
              {needsHelpSkills.length === 0
                ? "Every sampled skill came back strong. This plan is about staying sharp."
                : "Built from your answers, weakest skill first. Retake the diagnostic anytime to update it."}
            </p>
            {needsHelpSkills.length === 0 ? (
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="font-bold text-ink">Keep it sharp: timed mixed practice</p>
                    <p className="text-sm text-slate mt-1">
                      You cleared every sampled skill. The 30-minute timed mock builds the speed the real test demands.
                    </p>
                    <div className="mt-2">
                      <Button href="/exams/jft-basic/mock-tests" size="sm">
                        Try a timed mock →
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue/15 text-academy-blue font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <p className="font-bold text-ink">Round out the skills we didn&apos;t sample</p>
                    <p className="text-sm text-slate mt-1">
                      Ten questions can&apos;t cover all 11 skills. Topic practice covers every one of them.
                    </p>
                    <div className="mt-2">
                      <Button href="/exams/jft-basic/topics" variant="secondary" size="sm">
                        Practice by topic →
                      </Button>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue/15 text-academy-blue font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <p className="font-bold text-ink">Retake this diagnostic in a week</p>
                    <p className="text-sm text-slate mt-1">Same 10 questions: confirm every skill is still in &ldquo;Can do&rdquo;.</p>
                    <div className="mt-2">
                      <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
                        Retake diagnostic
                      </Button>
                    </div>
                  </div>
                </li>
              </ol>
            ) : (
              <ol className="space-y-5">
                <li className="flex gap-4">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="font-bold text-ink">Start with {weakestSkill.label}: 15 minutes a day</p>
                    <p className="text-sm text-slate mt-1">
                      Your weakest skill is your fastest win. ({weakestSkill.topic})
                    </p>
                    <div className="mt-2">
                      <Button href={`/exams/jft-basic/practice/${weakestSkill.practiceSlug}`} size="sm">
                        Start practicing →
                      </Button>
                    </div>
                  </div>
                </li>
                {secondWeakestSkill && secondWeakestSkill.skill !== weakestSkill.skill && (
                  <li className="flex gap-4">
                    <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue/15 text-academy-blue font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <p className="font-bold text-ink">Then {secondWeakestSkill.label}</p>
                      <p className="text-sm text-slate mt-1">
                        Your second-weakest skill: rotate it in after a few days. ({secondWeakestSkill.topic})
                      </p>
                      <div className="mt-2">
                        <Button href={`/exams/jft-basic/practice/${secondWeakestSkill.practiceSlug}`} variant="secondary" size="sm">
                          Practice {secondWeakestSkill.label} →
                        </Button>
                      </div>
                    </div>
                  </li>
                )}
                {needsHelpSkills.length > 2 && (
                  <li className="flex gap-4">
                    <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue/15 text-academy-blue font-bold flex items-center justify-center shrink-0">·</span>
                    <div>
                      <p className="text-sm text-slate">
                        Plus {needsHelpSkills.length - 2} more skill{needsHelpSkills.length - 2 === 1 ? "" : "s"} in your{" "}
                        <a href="#diag-gapmap" className="font-bold text-academy-blue hover:underline">skill map above</a>{" "}
                        — all weakest-first.
                      </p>
                    </div>
                  </li>
                )}
                <li className="flex gap-4">
                  <span aria-hidden="true" className="w-8 h-8 rounded-full bg-academy-blue/15 text-academy-blue font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <p className="font-bold text-ink">Retake this diagnostic in a week</p>
                    <p className="text-sm text-slate mt-1">Same 10 questions: watch the skills move from &ldquo;Needs help&rdquo; to &ldquo;Can do&rdquo;.</p>
                    <div className="mt-2">
                      <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>
                        Retake diagnostic
                      </Button>
                    </div>
                  </div>
                </li>
              </ol>
            )}
            <p className="mt-6 text-sm text-slate">
              Your result is saved on this device automatically — an account keeps it across devices.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button href="/signup">Save your results: create account</Button>
              <Button href="/exams/jft-basic" variant="ghost">Back to JFT-Basic</Button>
            </div>
          </Card>
        </section>

        {/* Optional 2-question exit survey — MD blueprint 07_DIGITAL_GROWTH_AND_FINANCES, line 92. */}
        <ExitSurvey />
      </div>
    );
  }

  /* ---------- SUBMIT CONFIRM ---------- */
  if (confirming) {
    const unanswered = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => !answers[q.id]);
    const flaggedAnswered = questions
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => flagged[q.id] && answers[q.id]);
    return (
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-title"
        className="bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-lg mx-auto text-center !p-10 guide-reveal"
      >
        <h2 id="submit-title" className="text-2xl font-extrabold text-ink mb-3">Submit your diagnostic?</h2>
        <p className="text-slate">
          You answered <span className="font-bold text-ink">{questions.length - unanswered.length}</span> of{" "}
          {questions.length} questions.
          {unanswered.length > 0 && " Unanswered questions count as incorrect."}
        </p>
        {unanswered.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink mb-2">Unanswered — tap to jump back:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {unanswered.map(({ q, i }) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-bold text-slate hover:border-academy-blue hover:text-ink"
                >
                  Q{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        {flaggedAnswered.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-ink mb-2">Flagged for review:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {flaggedAnswered.map(({ q, i }) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-sm font-bold text-amber-700 hover:bg-amber-100"
                >
                  Q{i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
        {scoreError && <p className="mt-3 text-sm font-semibold text-red-600">Scoring failed — please try again.</p>}
        <div className="mt-6 flex gap-3 justify-center">
          <Button ref={keepAnsweringRef} variant="secondary" onClick={() => setConfirming(false)}>Keep answering</Button>
          <Button onClick={submit} disabled={scoring}>{scoring ? "Scoring…" : "Submit answers"}</Button>
        </div>
      </div>
    );
  }

  /* ---------- PLAYER ---------- */
  const q = questions[index];
  const picked = answers[q.id];
  const answeredCount = Object.keys(answers).length;
  const isFlagged = !!flagged[q.id];

  return (
    <div ref={playerRef}>
      {/* Progress + palette */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate mb-2" aria-live="polite">
          Question {index + 1} of {questions.length} · {answeredCount} answered
        </p>
        <div
          className="h-2 rounded-full bg-border/60 overflow-hidden mb-4"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answeredCount}
        >
          <div className="h-full bg-academy-blue rounded-full transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Question navigator">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to question ${i + 1}${answers[qq.id] ? ", answered" : ", unanswered"}${flagged[qq.id] ? ", flagged" : ""}`}
              aria-current={i === index ? "true" : undefined}
              className={`w-11 h-11 rounded-lg text-sm font-bold border-2 transition-all ${
                i === index
                  ? "border-academy-blue bg-academy-blue text-white"
                  : answers[qq.id]
                    ? "border-academy-teal/50 bg-academy-teal/10 text-academy-teal-dark"
                    : "border-border text-slate hover:border-slate"
              } ${flagged[qq.id] && i !== index ? "!border-amber-400" : ""}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question card */}
      <Card className={`!p-6 md:!p-10${animateCard ? " guide-reveal" : ""}`} key={q.id}>
        <div className="flex items-center justify-between gap-3">
          <Badge tone="info">{q.topic}</Badge>
          <button
            type="button"
            onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
            aria-pressed={isFlagged}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg border ${isFlagged ? "border-amber-400 bg-amber-50 text-amber-700" : "border-border text-slate hover:text-ink"}`}
          >
            <Flag size={14} aria-hidden="true" />{isFlagged ? "Flagged" : "Flag for review"}
          </button>
        </div>
        <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
        {q.stemJp && <p lang="ja" className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}

        {q.audioTextJp && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => speakJapanese(q.audioTextJp!)}
            >
              <Volume2 size={15} aria-hidden="true" /> Play audio
            </Button>
            <p className="text-xs text-slate">Transcript always available below — audio is never required.</p>
          </div>
        )}

        <fieldset className="mt-6">
          <legend className="sr-only">Options for question {index + 1}</legend>
          <div className="space-y-3">
            {q.options.map((o, oi) => {
              const selected = picked === o.id;
              return (
                <label
                  key={o.id}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all cursor-pointer flex items-start focus-within:ring-2 focus-within:ring-academy-blue focus-within:ring-offset-2 focus-within:outline-none ${
                    selected
                      ? "border-academy-blue bg-academy-blue/5 shadow-sm"
                      : "border-border hover:border-academy-blue/50 hover:bg-canvas"
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={o.id}
                    checked={selected}
                    onChange={() => pick(q.id, o.id)}
                    className="sr-only"
                  />
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate/10 text-sm font-bold text-slate mr-3 shrink-0" aria-hidden="true">
                    {oi + 1}
                  </span>
                  <span>
                    <span lang="ja" className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
                    {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1">{o.text}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <p className="mt-4 text-xs text-slate hidden sm:block">
          Tip: press 1–{q.options.length} to choose, <span aria-hidden="true">← →</span><span className="sr-only">left and right arrow keys</span> to move between questions.
        </p>
      </Card>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          ← Back
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next →</Button>
        ) : (
          <Button onClick={() => setConfirming(true)}>Review &amp; submit</Button>
        )}
      </div>
    </div>
  );
}

/**
 * Optional 2-question exit survey — MD blueprint 07_DIGITAL_GROWTH_AND_FINANCES
 * calls for exactly these two questions after the adult diagnostic.
 * Purely optional, dismissible, stored on-device only (no endpoint exists yet).
 */
function ExitSurvey() {
  const [dismissed, setDismissed] = useState(false);
  const [sent, setSent] = useState(false);
  const [goal, setGoal] = useState("");
  const [missing, setMissing] = useState("");

  if (dismissed) return null;

  if (sent) {
    return (
      <Card className="mt-8 !p-6 md:!p-8 text-center">
        <p className="font-bold text-ink">Thanks — that helps us make the diagnostic better.</p>
        <p className="text-sm text-slate mt-1">Your answers are stored on this device only.</p>
      </Card>
    );
  }

  return (
    <Card className="mt-8 !p-6 md:!p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-ink">Two quick questions — optional</h2>
          <p className="text-sm text-slate mt-1">
            Help us improve this diagnostic. Skip any question you don&apos;t want to answer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-sm font-bold text-slate hover:text-ink shrink-0 px-2 py-1"
        >
          Skip all
        </button>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="exit-goal" className="block text-sm font-bold text-ink mb-1.5">
            What were you hoping this would help you do?
          </label>
          <input
            id="exit-goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. see if my Japanese is good enough for work"
            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-slate/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-academy-blue"
          />
        </div>
        <div>
          <label htmlFor="exit-missing" className="block text-sm font-bold text-ink mb-1.5">
            What was missing?
          </label>
          <input
            id="exit-missing"
            type="text"
            value={missing}
            onChange={(e) => setMissing(e.target.value)}
            placeholder="e.g. more listening questions"
            className="w-full rounded-xl border border-border bg-canvas px-4 py-3 text-ink placeholder:text-slate/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-academy-blue"
          />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          size="sm"
          disabled={!goal.trim() && !missing.trim()}
          onClick={() => {
            try {
              const key = "ua-diagnostic-feedback";
              const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
              prev.push({ goal: goal.trim(), missing: missing.trim(), at: new Date().toISOString() });
              localStorage.setItem(key, JSON.stringify(prev.slice(-20)));
            } catch {
              /* storage unavailable — feedback simply isn't saved */
            }
            setSent(true);
          }}
        >
          Send feedback
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
          Skip
        </Button>
      </div>
    </Card>
  );
}
