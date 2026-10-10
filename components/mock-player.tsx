"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Check, Volume2, X, Timer as TimerIcon } from "lucide-react";
import { Button, Badge, Card, Callout } from "@/components/ui";
import { recordAttempt, speakJapanese } from "@/lib/attempts";

type MockQ = {
  id: string;
  topic: string;
  stem: string;
  stemJp: string | null;
  options: { id: string; text: string; textJp: string | null }[];
  audioTextJp: string | null;
};

type MockResult = {
  score: number;
  total: number;
  percent: number;
  elapsedSec: number;
  overTime?: boolean;
  details: { id: string; topic: string; correct: boolean; correctId?: string; correctLabel: string; correctLabelJp: string | null; explanation: string }[];
  sectionStats?: { topic: string; total: number; correct: number; timeSec: number; avgSec: number }[];
  disclaimer: string;
};

/** Section label → practice-topic slug (mirrors practice/[topic] SLUG_TO_TOPIC). */
const TOPIC_SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* TimerBar — owns the ticking clock in local state so the parent tree  */
/* never re-renders on a tick. Derived from startedAt so background-tab */
/* throttling can't drift the displayed clock.                         */
/* ------------------------------------------------------------------ */
type TimerBarProps = {
  startedAt: number;
  timeLimitSec: number;
  index: number;
  total: number;
  answeredCount: number;
  onMilestone: (msg: string) => void;
  onTimeout: () => void;
};

function TimerBar({ startedAt, timeLimitSec, index, total, answeredCount, onMilestone, onTimeout }: TimerBarProps) {
  const [remaining, setRemaining] = useState(timeLimitSec);
  const fired = useRef<Set<string>>(new Set());
  const timeoutFired = useRef(false);

  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, timeLimitSec - Math.floor((Date.now() - startedAt) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [startedAt, timeLimitSec]);

  useEffect(() => {
    if (remaining <= 300 && !fired.current.has("5")) {
      fired.current.add("5");
      onMilestone("5 minutes left.");
    }
    if (remaining <= 60 && !fired.current.has("1")) {
      fired.current.add("1");
      onMilestone("1 minute left.");
    }
    if (remaining <= 0 && !timeoutFired.current) {
      timeoutFired.current = true;
      onMilestone("Time's up — your answers were submitted automatically.");
      onTimeout();
    }
  }, [remaining, onMilestone, onTimeout]);

  const urgent = remaining < 300;
  const progress = 1 - remaining / timeLimitSec;
  const unanswered = total - answeredCount;
  const pacing = remaining < 900 && unanswered > 0 ? Math.max(1, Math.floor(remaining / unanswered)) : 0;

  return (
    <div className={`border-b ${urgent ? "bg-red-50/80 border-red-200" : "bg-paper border-border"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate">Time remaining</p>
          <p
            className={`text-2xl font-extrabold tabular-nums ${urgent ? "text-red-700" : "text-ink"}`}
            role="timer"
            aria-label="Time remaining"
            aria-atomic="true"
          >
            <TimerIcon className="inline-block w-5 h-5 mr-1.5 -mt-1" aria-hidden />
            {fmt(remaining)}
          </p>
          {urgent && <p className="sr-only">Less than 5 minutes left.</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate">
            Question {index + 1} of {total} · {answeredCount} answered
          </p>
          {pacing > 0 && (
            <p className="text-xs text-slate mt-0.5">
              ≈{fmt(pacing)} per question left
            </p>
          )}
        </div>
      </div>
      {/* Elapsed-time rule — GPU-only scaleX, never width */}
      <div className="h-0.5 bg-border/60" aria-hidden>
        <div
          className={`h-full origin-left ${urgent ? "bg-red-500" : "bg-academy-teal"}`}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* QuestionPalette — compact sticky navigator. States: current (ring +  */
/* aria-current), answered (teal), seen-not-answered (amber outline),  */
/* unvisited (border). Legend keeps cues non-color-only.                */
/* ------------------------------------------------------------------ */
type PaletteProps = {
  questions: MockQ[];
  answers: Record<string, string>;
  visited: Set<number>;
  index: number;
  onJump: (i: number) => void;
};

const QuestionPalette = memo(function QuestionPalette({ questions, answers, visited, index, onJump }: PaletteProps) {
  return (
    <nav aria-label="Question navigation" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2.5 pb-2">
      <p id="palette-label" className="sr-only">Go to question:</p>
      <ul aria-labelledby="palette-label" className="flex gap-1.5 overflow-x-auto pb-1">
        {questions.map((qq, i) => {
          const isCurrent = i === index;
          const isAnswered = Boolean(answers[qq.id]);
          const isSeen = visited.has(i);
          const cls = isCurrent
            ? "bg-academy-blue text-white ring-2 ring-academy-blue ring-offset-2 ring-offset-paper"
            : isAnswered
              ? "border-academy-teal/60 bg-academy-teal/10 text-academy-teal-dark"
              : isSeen
                ? "border-amber-400/80 text-amber-700"
                : "border-border text-slate";
          return (
            <li key={qq.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-label={`Go to question ${i + 1}${isCurrent ? " (current)" : ""}${isAnswered ? ", answered" : isSeen ? ", seen, not answered" : ", not visited"}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`w-9 h-9 rounded-lg text-sm font-bold border-2 transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academy-blue focus-visible:ring-offset-2 ${cls}`}
              >
                {i + 1}
              </button>
            </li>
          );
        })}
      </ul>
      <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate" aria-hidden>
        <li className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-academy-teal/60 bg-academy-teal/10" /> Answered
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded border-2 border-amber-400/80" /> Seen
        </li>
        <li className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-academy-blue" /> Current
        </li>
      </ul>
    </nav>
  );
});

/* ------------------------------------------------------------------ */
/* QuestionCard — memoized so timer ticks never touch it. Full radio    */
/* keyboard pattern: roving tabindex + arrow keys.                     */
/* ------------------------------------------------------------------ */
type QuestionCardProps = {
  q: MockQ;
  index: number;
  selectedId: string | undefined;
  onSelect: (qid: string, oid: string) => void;
};

const QuestionCard = memo(function QuestionCard({ q, index, selectedId, onSelect }: QuestionCardProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusIdx = Math.max(0, q.options.findIndex((o) => o.id === selectedId));

  const onKey = (e: React.KeyboardEvent, oi: number) => {
    const len = q.options.length;
    let n = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") n = (oi + 1) % len;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = (oi - 1 + len) % len;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = len - 1;
    if (n >= 0) {
      e.preventDefault();
      onSelect(q.id, q.options[n].id);
      btnRefs.current[n]?.focus();
    }
  };

  return (
    <Card className="!p-6 md:!p-10 animate-fade-up" key={q.id}>
      <Badge tone="info">{q.topic}</Badge>
      <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
      {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}
      {q.audioTextJp && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={() => speakJapanese(q.audioTextJp!)}>
            <Volume2 className="w-4 h-4" aria-hidden /> Replay audio
          </Button>
        </div>
      )}
      <div className="mt-6 space-y-3" role="radiogroup" aria-label={`Options for question ${index + 1}`}>
        {q.options.map((o, oi) => {
          const selected = selectedId === o.id;
          return (
            <button
              key={o.id}
              ref={(el) => { btnRefs.current[oi] = el; }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={oi === focusIdx ? 0 : -1}
              onKeyDown={(e) => onKey(e, oi)}
              onClick={() => onSelect(q.id, o.id)}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academy-blue focus-visible:ring-offset-2 ${selected ? "border-academy-blue bg-academy-blue/5" : "border-border hover:border-academy-blue/50"}`}
            >
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold mr-3 ${selected ? "bg-academy-blue text-white" : "bg-slate/10 text-slate"}`}
                aria-hidden
              >
                {oi + 1}
              </span>
              <span className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
              {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1 ml-10">{o.text}</span>}
            </button>
          );
        })}
      </div>
      <Callout title="Test conditions" tone="info">
        No hints, no explanations until you submit — like the real thing. Unanswered questions are marked incorrect.
      </Callout>
    </Card>
  );
});

/* ------------------------------------------------------------------ */
/* MockPlayer                                                          */
/* ------------------------------------------------------------------ */
export default function MockPlayer({ apiPath = "/api/mock", attemptKind = "mock" }: { apiPath?: string; attemptKind?: string } = {}) {
  const [data, setData] = useState<{ questions: MockQ[]; timeLimitSec: number; startedAt: number } | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [result, setResult] = useState<MockResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [reattempt, setReattempt] = useState<{ order: string[]; idx: number; picked: Record<string, string> } | null>(null);
  const submitted = useRef(false);
  // Re-attempt focus targets: heading (between questions) and feedback (after a pick).
  const reHeadingRef = useRef<HTMLParagraphElement>(null);
  const reFeedbackRef = useRef<HTMLDivElement>(null);
  // Per-question timing for section-pace analytics: credit elapsed time to the
  // question on screen whenever the index changes, flush on submit.
  const qTime = useRef<{ qid: string | null; since: number; totals: Record<string, number> }>({
    qid: null, since: 0, totals: {},
  });

  const startTiming = useCallback((qid: string | null) => {
    const t = qTime.current;
    const now = Date.now();
    if (t.qid) t.totals[t.qid] = (t.totals[t.qid] ?? 0) + (now - t.since) / 1000;
    t.qid = qid;
    t.since = now;
  }, []);

  useEffect(() => {
    fetch(apiPath)
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setLoadError(true));
  }, [apiPath]);

  useEffect(() => {
    if (data && !result) startTiming(data.questions[index]?.id ?? null);
  }, [index, data, result, startTiming]);

  useEffect(() => {
    setVisited((v) => {
      if (v.has(index)) return v;
      const next = new Set(v);
      next.add(index);
      return next;
    });
  }, [index]);

  const submit = useCallback(
    async (auto = false) => {
      if (!data || submitted.current) return;
      submitted.current = true;
      setSubmitting(true);
      setSubmitError(null);
      setConfirming(false);
      startTiming(null); // flush the last question's time
      try {
        const r = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, startedAt: data.startedAt, times: qTime.current.totals, auto }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Scoring failed");
        setResult(d);
        const kind = d.overTime ? `${attemptKind} (over time)` : auto ? `${attemptKind} (auto-submitted)` : attemptKind;
        recordAttempt({ kind, score: d.score, total: d.total, at: new Date().toISOString() });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        submitted.current = false;
        setSubmitError("Scoring failed — please check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [data, answers, apiPath, attemptKind, startTiming]
  );

  const onMilestone = useCallback((msg: string) => setAnnouncement(msg), []);
  const onTimeout = useCallback(() => submit(true), [submit]);

  if (loadError) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-ink mb-2">This mock couldn&apos;t load</h2>
        <p className="text-slate">Check your connection and try again.</p>
        <div className="mt-4"><Button onClick={() => window.location.reload()}>Reload</Button></div>
      </Card>
    );
  }
  if (!data) {
    return (
      <div aria-live="polite" className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-border/40 animate-pulse" />)}
        <p className="text-slate text-sm">Preparing your mock test…</p>
      </div>
    );
  }

  /* ------------------------------ Result ------------------------------ */
  if (result) {
    const wrong = result.details.filter((d) => !d.correct);
    const right = result.details.filter((d) => d.correct);
    const wrongByTopic: { topic: string; items: typeof wrong }[] = [];
    for (const d of wrong) {
      const g = wrongByTopic.find((x) => x.topic === d.topic);
      if (g) g.items.push(d);
      else wrongByTopic.push({ topic: d.topic, items: [d] });
    }
    const avgSec = Math.round(result.elapsedSec / result.total);

    /* ------------------------- Re-attempt mode -------------------------
     * Wrong-questions-only revision: no timer, instant feedback per answer.
     * Portal-doctrine move 4 (test series): "re-attempt mode for revision". */
    if (reattempt) {
      const qid = reattempt.order[reattempt.idx];
      const q = data.questions.find((qq) => qq.id === qid)!;
      const d = result.details.find((x) => x.id === qid)!;
      const picked = reattempt.picked[qid];
      const revealed = Boolean(picked);
      const last = reattempt.idx === reattempt.order.length - 1;
      const doneCount = Object.keys(reattempt.picked).length;
      const reScore = reattempt.order.filter(
        (id) => reattempt.picked[id] === result.details.find((x) => x.id === id)?.correctId
      ).length;
      const pick = (oid: string) => {
        if (!reattempt.picked[qid]) {
          setReattempt({ ...reattempt, picked: { ...reattempt.picked, [qid]: oid } });
          // Focus drops to body when the picked button disables — move it to the feedback.
          setTimeout(() => reFeedbackRef.current?.focus(), 60);
        }
      };
      const goNext = () => {
        setReattempt({ ...reattempt, idx: reattempt.idx + 1 });
        setTimeout(() => reHeadingRef.current?.focus(), 60);
      };
      return (
        <div className="animate-fade-up">
          <div className="flex items-center justify-between mb-6">
            <p ref={reHeadingRef} tabIndex={-1} className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate focus-visible:outline-none">
              Re-attempt · {reattempt.idx + 1} of {reattempt.order.length}
            </p>
            <Button variant="secondary" size="sm" onClick={() => { setReattempt(null); window.scrollTo({ top: 0 }); }}>
              Back to results
            </Button>
          </div>
          <Card className="!p-6 md:!p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate mb-3">{d.topic}</p>
            <h2 className="text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
            {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}
            {q.audioTextJp && (
              <div className="mt-4">
                <Button variant="secondary" size="sm" onClick={() => speakJapanese(q.audioTextJp!)}>
                  <Volume2 className="w-4 h-4" aria-hidden /> Replay audio
                </Button>
              </div>
            )}
            <div className="mt-6 space-y-3" role="group" aria-label={`Re-attempt options, question ${reattempt.idx + 1}`}>
              {q.options.map((o) => {
                const isPicked = picked === o.id;
                const isCorrect = d.correctId === o.id;
                const cls = revealed
                  ? isCorrect
                    ? "border-academy-teal bg-academy-teal/10"
                    : isPicked
                      ? "border-red-300 bg-red-50"
                      : "border-border opacity-60"
                  : "border-border hover:border-academy-blue/50 active:scale-[0.99]";
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={revealed}
                    onClick={() => pick(o.id)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-[border-color,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academy-blue focus-visible:ring-offset-2 ${cls}`}
                  >
                    <span className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
                    {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1">{o.text}</span>}
                    {revealed && isCorrect && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-academy-teal-dark">
                        <Check className="w-4 h-4" aria-hidden /> Correct
                      </span>
                    )}
                    {revealed && isPicked && !isCorrect && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-red-700">
                        <X className="w-4 h-4" aria-hidden /> Not quite
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <div ref={reFeedbackRef} tabIndex={-1} className="mt-6 focus-visible:outline-none">
                <p className="text-[15px] text-slate leading-relaxed border-t border-border pt-4">
                  <span className="font-semibold text-ink">Why: </span>{d.explanation}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm text-slate">
                    Re-attempt score so far: <span className="font-bold text-ink">{reScore}/{doneCount}</span>
                  </p>
                  {last ? (
                    <Button onClick={() => { setReattempt(null); window.scrollTo({ top: 0 }); }}>
                      Finish — back to results
                    </Button>
                  ) : (
                    <Button onClick={goNext}>Next</Button>
                  )}
                </div>
              </div>
            )}
          </Card>
          <p className="mt-4 text-xs text-slate text-center">Explanations are drafts, pending Japanese SME review.</p>
        </div>
      );
    }

    const sectionStats = result.sectionStats ?? [];
    const weakest =
      sectionStats.length > 1
        ? [...sectionStats].sort((a, b) => a.correct / a.total - b.correct / b.total)[0]
        : null;
    const showWeakest = weakest && weakest.correct < weakest.total && TOPIC_SLUGS[weakest.topic];

    const renderDetail = (d: MockResult["details"][number], i: number) => {
      const q = data.questions.find((qq) => qq.id === d.id)!;
      return (
        <Card key={d.id} className={d.correct ? "!border-academy-teal/40" : "!border-red-200"}>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${d.correct ? "text-academy-teal-dark" : "text-red-700"}`}
            >
              {d.correct ? <Check className="w-4 h-4" aria-hidden /> : <X className="w-4 h-4" aria-hidden />}
              {d.correct ? "Correct" : "Incorrect"}
            </span>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate">Q{i + 1} · {d.topic}</p>
          </div>
          <p className="font-semibold text-ink">{q.stem}</p>
          {!d.correct && (
            <p className="text-sm text-slate mt-2">
              Correct: <span className="font-semibold text-academy-teal-dark">{d.correctLabel}</span>
              {d.correctLabelJp && d.correctLabelJp !== d.correctLabel && (
                <span className="jp block text-sm mt-0.5">{d.correctLabelJp}</span>
              )}
            </p>
          )}
          <p className="mt-3 text-[15px] text-slate leading-relaxed border-t border-border pt-3">
            <span className="font-semibold text-ink">Explanation: </span>{d.explanation}
          </p>
          <p className="mt-2 text-xs text-slate">Explanation is a draft, pending Japanese SME review.</p>
        </Card>
      );
    };

    return (
      <div className="animate-fade-up">
        {/* Credential-style result card — type-as-hero, hairline rules */}
        <Card className="!p-8 md:!p-12 text-center">
          <Badge tone={result.percent >= 70 ? "success" : result.percent >= 40 ? "warning" : "neutral"}>Your score</Badge>
          <p className="mt-6 text-[clamp(3.5rem,12vw,6rem)] leading-none font-extrabold tracking-[-0.03em] text-ink text-balance">
            {result.score}<span className="text-[0.4em] text-slate font-semibold">/{result.total}</span>
          </p>
          <div className="mt-8 border-t border-border pt-6 grid grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate">Time used</p>
              <p className="mt-1 font-bold text-ink">You used {fmt(result.elapsedSec)} of {fmt(data.timeLimitSec)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-slate">Average pace</p>
              <p className="mt-1 font-bold text-ink">≈{avgSec}s per question</p>
            </div>
          </div>
          <p className="mt-6 text-slate">Review the questions you missed below to see what to practise next.</p>
          <div className="mt-6 text-left">
            <Callout title="Honest scoring" tone="info"><p>{result.disclaimer}</p></Callout>
          </div>
        </Card>

        {result.overTime && (
          <div className="mt-6">
            <Callout title="Scored for review, not as a timed attempt" tone="warning">
              <p>The clock ran out before your answers reached us, so this score counts your
              work but not your time. Review it, then take the mock again under the clock.</p>
            </Callout>
          </div>
        )}

        {/* Section analytics: accuracy + pace per section (research: GICE, iQuanta, PracticeMock) */}
        {sectionStats.length > 0 && (
          <section aria-label="Section performance" className="mt-12">
            <h2 className="text-2xl font-extrabold text-ink mb-1">Where the marks went</h2>
            <p className="text-slate mb-6">Accuracy and pace for each section of the mock.</p>
            <ul className="divide-y divide-border border-y border-border">
              {sectionStats.map((s) => {
                const pct = Math.round((s.correct / s.total) * 100);
                return (
                  <li key={s.topic} className="py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="font-bold text-ink">{s.topic}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-academy-teal"
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={s.correct}
                          aria-valuemin={0}
                          aria-valuemax={s.total}
                          aria-label={`${s.topic}: ${s.correct} of ${s.total} correct`}
                        />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-ink tabular-nums">{s.correct}/{s.total} <span className="font-normal text-slate">({pct}%)</span></p>
                    <p className="text-sm text-slate tabular-nums ml-auto">about {s.avgSec}s a question</p>
                  </li>
                );
              })}
            </ul>
            {showWeakest && weakest && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-paper p-5">
                <p className="text-[15px] text-ink">
                  <span className="font-bold">Weakest section: {weakest.topic}</span>{" "}
                  <span className="text-slate">({weakest.correct}/{weakest.total} correct).</span>
                </p>
                <Button href={`/exams/jft-basic/practice/${TOPIC_SLUGS[weakest.topic]}`} variant="secondary" size="sm">
                  Practise this section
                </Button>
              </div>
            )}
          </section>
        )}

        {wrong.length > 0 && (
          <div className="mt-10 text-center">
            <Button onClick={() => { setReattempt({ order: wrong.map((d) => d.id), idx: 0, picked: {} }); window.scrollTo({ top: 0 }); setTimeout(() => reHeadingRef.current?.focus(), 80); }}>
              Re-attempt {wrong.length} missed {wrong.length === 1 ? "question" : "questions"}
            </Button>
            <p className="mt-2 text-sm text-slate">No timer. Instant feedback on every answer.</p>
          </div>
        )}

        {wrong.length > 0 && (
          <>
            <h2 className="text-2xl font-extrabold text-ink mt-12 mb-1">Questions to review</h2>
            <p className="text-slate mb-6">{wrong.length} missed — start here.</p>
            {wrongByTopic.map((g) => (
              <section key={g.topic} aria-label={`${g.topic} — missed questions`} className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-academy-teal-dark mb-3">{g.topic}</h3>
                <div className="space-y-4">{g.items.map((d) => renderDetail(d, result.details.indexOf(d)))}</div>
              </section>
            ))}
          </>
        )}

        {right.length > 0 && (
          <details className="mt-10">
            <summary className="cursor-pointer text-academy-blue font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-academy-teal rounded">
              {right.length} answered correctly — show them
            </summary>
            <div className="space-y-4 mt-4">{right.map((d) => renderDetail(d, result.details.indexOf(d)))}</div>
          </details>
        )}

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button href="/exams/jft-basic/mock-tests">Back to mocks</Button>
          <Button href="/app/exams" variant="secondary">My progress</Button>
        </div>
      </div>
    );
  }

  /* ------------------------------ Test run ------------------------------ */
  const q = data.questions[index];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = data.questions.length - answeredCount;
  const last = index === data.questions.length - 1;

  const onSelect = (qid: string, oid: string) => setAnswers((a) => ({ ...a, [qid]: oid }));

  const handleNextOrSubmit = () => {
    if (!last) {
      setIndex((i) => i + 1);
    } else if (unansweredCount > 0) {
      setConfirming(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      submit(false);
    }
  };

  return (
    <div>
      {/* Screen-reader announcements: milestones only, never the ticking clock */}
      <p className="sr-only" aria-live="polite" role="status">{announcement}</p>

      {/* Sticky timer + palette strip */}
      <div className="sticky top-[72px] z-30 -mx-4 sm:-mx-6 lg:-mx-8">
        <TimerBar
          startedAt={data.startedAt}
          timeLimitSec={data.timeLimitSec}
          index={index}
          total={data.questions.length}
          answeredCount={answeredCount}
          onMilestone={onMilestone}
          onTimeout={onTimeout}
        />
        <div className="bg-paper border-b border-border">
          <QuestionPalette questions={data.questions} answers={answers} visited={visited} index={index} onJump={setIndex} />
        </div>
      </div>

      <div className="mt-6">
        <QuestionCard q={q} index={index} selectedId={answers[q.id]} onSelect={onSelect} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>← Back</Button>
        <Button onClick={handleNextOrSubmit} disabled={submitting || confirming}>
          {last ? (submitting ? "Submitting…" : "Submit answers") : "Next →"}
        </Button>
      </div>

      {confirming && (
        <div
          role="alertdialog"
          aria-labelledby="confirm-submit-title"
          aria-describedby="confirm-submit-desc"
          className="mt-6 rounded-xl border-2 border-academy-blue bg-academy-blue/5 p-6"
        >
          <p id="confirm-submit-title" className="font-bold text-ink">
            Submit with {unansweredCount} unanswered {unansweredCount === 1 ? "question" : "questions"}?
          </p>
          <p id="confirm-submit-desc" className="mt-1 text-sm text-slate">
            Unanswered questions are marked incorrect, and you can&apos;t change answers after submitting.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => submit(false)} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit answers"}
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>Keep answering</Button>
          </div>
        </div>
      )}

      {submitError && <p role="alert" className="mt-4 text-sm font-semibold text-red-600 text-center">{submitError}</p>}
    </div>
  );
}
