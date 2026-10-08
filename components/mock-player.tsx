"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Badge, Card, Callout } from "@/components/ui";
import { recordAttempt } from "@/components/practice-player";

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

function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MockPlayer() {
  const [data, setData] = useState<{ questions: MockQ[]; timeLimitSec: number; startedAt: number } | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<MockResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submitted = useRef(false);

  useEffect(() => {
    fetch("/api/mock")
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setRemaining(d.timeLimitSec);
      })
      .catch(() => setLoadError(true));
  }, []);

  const submit = useCallback(
    async (auto = false) => {
      if (!data || submitted.current) return;
      submitted.current = true;
      setSubmitting(true);
      setSubmitError(null);
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
      } catch (e) {
        submitted.current = false;
        setSubmitError(e instanceof Error ? e.message : "Scoring failed — please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [data, answers]
  );

  // Countdown — auto-submit at zero
  useEffect(() => {
    if (!data || result) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          submit(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [data, result, submit]);

  if (loadError) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-ink mb-2">Couldn&apos;t start the mock</h2>
        <p className="text-slate">Check your connection and reload.</p>
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

  if (result) {
    return (
      <div className="animate-fade-up">
        <Card className="text-center !p-10">
          <Badge tone={result.percent >= 70 ? "success" : result.percent >= 40 ? "warning" : "neutral"}>Mock complete</Badge>
          <p className="mt-6 text-6xl font-extrabold text-ink">{result.score}<span className="text-2xl text-slate font-semibold">/{result.total}</span></p>
          <p className="mt-2 text-slate">Finished in {fmt(result.elapsedSec)} of {fmt(data.timeLimitSec)}.</p>
          <Callout title="Honest scoring" tone="info"><p>{result.disclaimer}</p></Callout>
        </Card>
        <h2 className="text-2xl font-extrabold text-ink mt-10 mb-4">Review</h2>
        <div className="space-y-4">
          {result.details.map((d, i) => {
            const q = data.questions.find((qq) => qq.id === d.id)!;
            return (
              <Card key={d.id} className={d.correct ? "!border-academy-teal/40" : "!border-red-200"}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${d.correct ? "bg-academy-teal/15 text-academy-teal-dark" : "bg-red-100 text-red-700"}`}>{d.correct ? "✓" : "✗"}</span>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate">Q{i + 1} · {d.topic}</p>
                </div>
                <p className="font-semibold text-ink">{q.stem}</p>
                {!d.correct && <p className="text-sm text-slate mt-2">Correct: <span className="font-semibold text-academy-teal-dark">{d.correctLabel}</span></p>}
                <p className="mt-3 text-[15px] text-slate leading-relaxed border-t border-border pt-3">
                  <span className="font-semibold text-ink">Why: </span>{d.explanation}
                </p>
              </Card>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button href="/exams/jft-basic/mock-tests">Back to mocks</Button>
          <Button href="/app/exams" variant="secondary">My progress</Button>
        </div>
      </div>
    );
  }

  const q = data.questions[index];
  const urgent = remaining < 300;

  return (
    <div>
      {/* Timer bar */}
      <div className={`sticky top-[72px] z-30 -mx-4 px-4 py-3 mb-6 border-b ${urgent ? "bg-red-50 border-red-200" : "bg-paper border-border"}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm font-semibold text-slate" aria-live="polite">
            Q{index + 1}/{data.questions.length} · {Object.keys(answers).length} answered
          </p>
          <p className={`text-2xl font-extrabold tabular-nums ${urgent ? "text-red-700" : "text-ink"}`} role="timer" aria-label={`${fmt(remaining)} remaining`}>
            ⏱ {fmt(remaining)}
          </p>
        </div>
      </div>

      <Card className="!p-6 md:!p-10 animate-fade-up" key={q.id}>
        <Badge tone="info">{q.topic}</Badge>
        <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
        {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}
        {q.audioTextJp && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={() => speakJapanese(q.audioTextJp!)}><span aria-hidden>🔊</span> Replay audio</Button>
          </div>
        )}
        <div className="mt-6 space-y-3" role="radiogroup" aria-label={`Options for question ${index + 1}`}>
          {q.options.map((o, oi) => {
            const selected = answers[q.id] === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: o.id }))}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${selected ? "border-academy-blue bg-academy-blue/5" : "border-border hover:border-academy-blue/50"}`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate/10 text-sm font-bold text-slate mr-3" aria-hidden>{oi + 1}</span>
                <span className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
                {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1 ml-10">{o.text}</span>}
              </button>
            );
          })}
        </div>
        <Callout title="Mock conditions" tone="info">
          No hints, no explanations until you submit — like the real thing. Unanswered questions count as incorrect.
        </Callout>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>← Back</Button>
        {index < data.questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next →</Button>
        ) : (
          <Button onClick={() => submit(false)} disabled={submitting}>{submitting ? "Submitting…" : "Submit mock"}</Button>
        )}
      </div>
      {submitError && <p role="alert" className="mt-4 text-sm font-semibold text-red-600 text-center">{submitError}</p>}

      {/* Question palette */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-slate mb-2">Jump to:</p>
        <div className="flex flex-wrap gap-2">
          {data.questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to question ${i + 1}${answers[qq.id] ? ", answered" : ""}`}
              className={`w-10 h-10 rounded-lg text-sm font-bold border-2 ${i === index ? "border-academy-blue bg-academy-blue text-white" : answers[qq.id] ? "border-academy-teal/50 bg-academy-teal/10 text-academy-teal-dark" : "border-border text-slate"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
