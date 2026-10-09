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
  details: { id: string; topic: string; correct: boolean; correctLabel: string; correctLabelJp: string | null; explanation: string }[];
  disclaimer: string;
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
export default function MockPlayer() {
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
  const submitted = useRef(false);

  useEffect(() => {
    fetch("/api/mock")
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setLoadError(true));
  }, []);

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
      try {
        const r = await fetch("/api/mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, startedAt: data.startedAt }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Scoring failed");
        setResult(d);
        recordAttempt({ kind: auto ? "mock (auto-submitted)" : "mock", score: d.score, total: d.total, at: new Date().toISOString() });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        submitted.current = false;
        setSubmitError("Scoring failed — please check your connection and try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [data, answers]
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
