"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Badge, Callout, Card } from "@/components/ui";
import { recordAttempt } from "@/components/practice-player";

type PublicQuestion = {
  id: string;
  topic: string;
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

type ScoreResult = {
  score: number;
  total: number;
  percent: number;
  topics: { topic: string; description: string; correct: number; total: number; needsWork: boolean }[];
  details: ScoreDetail[];
  recommendation: string;
  disclaimer: string;
  reviewStatus: string;
};

function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

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
      const d = await r.json();
      setResult(d);
      setConfirming(false);
      recordAttempt({ kind: "diagnostic", score: d.score, total: d.total, at: new Date().toISOString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setScoreError(true);
    } finally {
      setScoring(false);
    }
  }, [answers]);

  // Keyboard: 1/2/3 select option, arrows move
  useEffect(() => {
    if (!questions || result || confirming) return;
    const onKey = (e: KeyboardEvent) => {
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
      <div aria-live="polite" className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-border/40 animate-pulse" />
        ))}
        <p className="text-slate text-sm">Loading your 10 questions…</p>
      </div>
    );
  }

  /* ---------- RESULTS ---------- */
  if (result) {
    return (
      <div className="animate-fade-up">
        <Card className="text-center !p-10">
          <Badge tone={result.percent >= 70 ? "success" : result.percent >= 40 ? "warning" : "neutral"}>
            Diagnostic complete
          </Badge>
          <p className="mt-6 text-6xl font-extrabold text-ink">
            {result.score}<span className="text-2xl text-slate font-semibold">/{result.total}</span>
          </p>
          <p className="mt-2 text-slate">{result.recommendation}</p>
          <Callout title="Honest scoring" tone="info">
            <p>{result.disclaimer}</p>
            <p className="mt-2 text-xs">{result.reviewStatus}</p>
          </Callout>
        </Card>

        <h2 className="text-2xl font-extrabold text-ink mt-10 mb-4">Your topics</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {result.topics.map((t) => (
            <Card key={t.topic} className={t.needsWork ? "!border-amber-300" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink">{t.topic}</h3>
                  <p className="text-sm text-slate mt-1">{t.description}</p>
                </div>
                <span className={`text-2xl font-extrabold ${t.needsWork ? "text-amber-600" : "text-academy-teal-dark"}`}>
                  {t.correct}/{t.total}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-border/60 overflow-hidden" role="img" aria-label={`${t.correct} of ${t.total} correct in ${t.topic}`}>
                <div
                  className={`h-full rounded-full ${t.needsWork ? "bg-amber-400" : "bg-academy-teal"}`}
                  style={{ width: `${(t.correct / t.total) * 100}%` }}
                />
              </div>
              {t.needsWork && <p className="mt-2 text-sm font-semibold text-amber-700">Focus here next</p>}
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-extrabold text-ink mt-10 mb-4">Review every question</h2>
        <div className="space-y-4">
          {result.details.map((d, i) => {
            const q = questions.find((qq) => qq.id === d.id)!;
            return (
              <Card key={d.id} className={d.correct ? "!border-academy-teal/40" : "!border-red-200"}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${d.correct ? "bg-academy-teal/15 text-academy-teal-dark" : "bg-red-100 text-red-700"}`}>
                    {d.correct ? "✓" : "✗"}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate">Q{i + 1} · {d.topic}</p>
                </div>
                <p className="font-semibold text-ink">{q.stem}</p>
                {q.stemJp && <p className="jp text-slate mt-1">{q.stemJp}</p>}
                <div className="mt-3 text-sm space-y-1">
                  <p className="text-slate">You answered: <span className="font-semibold text-ink">{d.pickedLabel}</span></p>
                  {!d.correct && (
                    <p className="text-slate">Correct: <span className="font-semibold text-academy-teal-dark">{d.correctLabel}</span></p>
                  )}
                </div>
                <p className="mt-3 text-[15px] text-slate leading-relaxed border-t border-border pt-3">
                  <span className="font-semibold text-ink">Why: </span>{d.explanation}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button href="/exams/jft-basic">Back to JFT-Basic</Button>
          <Button href="/signup" variant="secondary">Save my plan — create account</Button>
        </div>
      </div>
    );
  }

  /* ---------- SUBMIT CONFIRM ---------- */
  if (confirming) {
    const unanswered = questions.filter((q) => !answers[q.id]).length;
    return (
      <div role="dialog" aria-modal="true" aria-labelledby="submit-title" className="bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-lg mx-auto text-center !p-10 animate-fade-up">
        <h2 id="submit-title" className="text-2xl font-extrabold text-ink mb-3">Submit your diagnostic?</h2>
        <p className="text-slate">
          You answered <span className="font-bold text-ink">{questions.length - unanswered}</span> of{" "}
          {questions.length} questions.
          {unanswered > 0 && " Unanswered questions count as incorrect."}
        </p>
        {scoreError && <p className="mt-3 text-sm font-semibold text-red-600">Scoring failed — please try again.</p>}
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="secondary" onClick={() => setConfirming(false)}>Keep answering</Button>
          <Button onClick={submit} disabled={scoring}>{scoring ? "Scoring…" : "Submit answers"}</Button>
        </div>
      </div>
    );
  }

  /* ---------- PLAYER ---------- */
  const q = questions[index];
  const picked = answers[q.id];
  const answeredCount = Object.keys(answers).length;

  return (
    <div>
      {/* Progress + palette */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate" aria-live="polite">
            Question {index + 1} of {questions.length} · {answeredCount} answered
          </p>
          <button
            type="button"
            onClick={() => setFlagged((f) => ({ ...f, [q.id]: !f[q.id] }))}
            aria-pressed={!!flagged[q.id]}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg border ${flagged[q.id] ? "border-amber-400 bg-amber-50 text-amber-700" : "border-border text-slate hover:text-ink"}`}
          >
            {flagged[q.id] ? "★ Flagged" : "☆ Flag for review"}
          </button>
        </div>
        <div className="h-2 rounded-full bg-border/60 overflow-hidden mb-4">
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
              className={`w-10 h-10 rounded-lg text-sm font-bold border-2 transition-all ${
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
      <Card className="!p-6 md:!p-10 animate-fade-up" key={q.id}>
        <Badge tone="info">{q.topic}</Badge>
        <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
        {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}

        {q.audioTextJp && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => speakJapanese(q.audioTextJp!)}
            >
              <span aria-hidden>🔊</span> Replay audio
            </Button>
            <p className="text-xs text-slate">Transcript always available below — audio is never required.</p>
          </div>
        )}

        <div className="mt-6 space-y-3" role="radiogroup" aria-label={`Options for question ${index + 1}`}>
          {q.options.map((o, oi) => {
          const selected = picked === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => pick(q.id, o.id)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-academy-blue bg-academy-blue/5 shadow-sm"
                    : "border-border hover:border-academy-blue/50 hover:bg-canvas"
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate/10 text-sm font-bold text-slate mr-3" aria-hidden>
                  {oi + 1}
                </span>
                <span className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
                {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1 ml-10">{o.text}</span>}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-slate">Tip: press 1–{q.options.length} to choose, ← → to move between questions.</p>
      </Card>

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          ← Back
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next →</Button>
        ) : (
          <Button onClick={() => setConfirming(true)}>Review & submit</Button>
        )}
      </div>
    </div>
  );
}
