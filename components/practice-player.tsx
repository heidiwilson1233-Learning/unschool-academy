"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Badge, Card } from "@/components/ui";
import { speakJapanese, recordAttempt } from "@/lib/attempts";

type PracticeQ = {
  id: string;
  topic: string;
  stem: string;
  stemJp: string | null;
  options: { id: string; text: string; textJp: string | null }[];
  audioTextJp: string | null;
  hint: string;
};

type CheckResult = {
  correct: boolean;
  pickedLabel: string;
  correctLabel: string;
  correctLabelJp: string | null;
  explanation: string;
};

export default function PracticePlayer({ topic }: { topic: string }) {
  const [questions, setQuestions] = useState<PracticeQ[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(`/api/practice/questions?topic=${encodeURIComponent(topic)}`)
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => setQuestions(d.questions))
      .catch(() => setLoadError(true));
  }, [topic]);

  const check = useCallback(async () => {
    if (!questions || !picked) return;
    setChecking(true);
    try {
      const r = await fetch("/api/practice/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: questions[index].id, optionId: picked }),
      });
      const d = await r.json();
      setResult(d);
      if (d.correct) setScore((s) => s + 1);
    } finally {
      setChecking(false);
    }
  }, [questions, index, picked]);

  const next = () => {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      setFinished(true);
      recordAttempt({ kind: "practice", topic, score, total: questions.length, at: new Date().toISOString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setResult(null);
      setShowHint(false);
    }
  };

  if (loadError) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-ink mb-2">Couldn&apos;t load practice questions</h2>
        <p className="text-slate">Check your connection and reload.</p>
        <div className="mt-4"><Button onClick={() => window.location.reload()}>Reload</Button></div>
      </Card>
    );
  }
  if (!questions) {
    return (
      <div aria-live="polite" className="space-y-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-border/40 animate-pulse" />)}
        <p className="text-slate text-sm">Loading practice questions…</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Card className="text-center !p-10 animate-fade-up">
        <Badge tone={pct >= 70 ? "success" : pct >= 40 ? "warning" : "neutral"}>Session complete</Badge>
        <p className="mt-6 text-6xl font-extrabold text-ink">{score}<span className="text-2xl text-slate font-semibold">/{questions.length}</span></p>
        <p className="mt-3 text-slate">
          {pct >= 80 ? "Excellent — this topic is becoming solid." : pct >= 50 ? "Good progress. Review the ones you missed below, then try again tomorrow." : "Every expert started here. Re-read the explanations, then try another session."}
        </p>
        <p className="mt-2 text-sm text-slate">Hints used: {hintsUsed} · Saved to your progress on this device.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>Practice again</Button>
          <Button href="/exams/jft-basic/topics" variant="secondary">Choose another topic</Button>
          <Button href="/app/exams" variant="ghost">My progress →</Button>
        </div>
      </Card>
    );
  }

  const q = questions[index];

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-semibold text-slate mb-2" aria-live="polite">
          Question {index + 1} of {questions.length} · Score so far: {score}
        </p>
        <div className="h-2 rounded-full bg-border/60 overflow-hidden">
          <div className="h-full bg-academy-teal rounded-full transition-all" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
      </div>

      <Card className="!p-6 md:!p-10 animate-fade-up" key={q.id}>
        <Badge tone="info">{q.topic}</Badge>
        <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
        {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}
        {q.audioTextJp && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={() => speakJapanese(q.audioTextJp!)}>
              <span aria-hidden>🔊</span> Replay audio
            </Button>
          </div>
        )}

        <div className="mt-6 space-y-3" role="radiogroup" aria-label={`Options for question ${index + 1}`}>
          {q.options.map((o, oi) => {
            const selected = picked === o.id;
            const disabled = !!result;
            const isCorrectOpt = result && o.text === result.correctLabel;
            const isWrongPick = result && selected && !result.correct;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={disabled}
                onClick={() => setPicked(o.id)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all disabled:cursor-default ${
                  isCorrectOpt
                    ? "border-academy-teal bg-academy-teal/10"
                    : isWrongPick
                      ? "border-red-400 bg-red-50"
                      : selected
                        ? "border-academy-blue bg-academy-blue/5"
                        : "border-border hover:border-academy-blue/50"
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate/10 text-sm font-bold text-slate mr-3" aria-hidden>{oi + 1}</span>
                <span className="jp text-lg font-semibold text-ink">{o.textJp ?? o.text}</span>
                {o.textJp && o.textJp !== o.text && <span className="block text-sm text-slate mt-1 ml-10">{o.text}</span>}
                {isCorrectOpt && <span className="ml-3 text-sm font-bold text-academy-teal-dark">✓</span>}
                {isWrongPick && <span className="ml-3 text-sm font-bold text-red-600">✗</span>}
              </button>
            );
          })}
        </div>

        {result ? (
          <div className="mt-6 border-t border-border pt-5 animate-fade-up">
            <p className={`font-extrabold text-lg ${result.correct ? "text-academy-teal-dark" : "text-red-700"}`}>
              {result.correct ? "✓ Correct" : `✗ Not quite — the answer is “${result.correctLabel}”`}
            </p>
            <p className="mt-2 text-[15px] text-slate leading-relaxed">
              <span className="font-semibold text-ink">Why: </span>{result.explanation}
            </p>
            <div className="mt-5"><Button onClick={next} size="lg">{index + 1 >= questions.length ? "See my session result" : "Next question →"}</Button></div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={check} disabled={!picked || checking} size="lg">{checking ? "Checking…" : "Check answer"}</Button>
            {!showHint ? (
              <button
                type="button"
                onClick={() => { setShowHint(true); setHintsUsed((h) => h + 1); }}
                className="px-4 py-3 rounded-xl border-2 border-dashed border-border text-slate font-semibold hover:border-academy-teal hover:text-academy-teal-dark"
              >
                💡 Show hint
              </button>
            ) : (
              <p className="text-sm text-slate bg-academy-teal/5 border border-academy-teal/20 rounded-xl px-4 py-2.5" role="status">
                💡 {q.hint}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
