"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Lightbulb, RotateCcw, Volume2, X } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { speakJapanese, recordAttempt, type AttemptSkill } from "@/lib/attempts";

type PracticeQ = {
  id: string;
  topic: string;
  skill: string;
  skillLabel: string;
  version: number;
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
  version: number;
};

type SkillTally = { label: string; correct: number; total: number };

export default function PracticePlayer({ topic }: { topic: string }) {
  const [questions, setQuestions] = useState<PracticeQ[] | null>(null);
  const [contentVersion, setContentVersion] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const skillTallies = useRef<Record<string, SkillTally>>({});
  const missesRef = useRef<string[]>([]);
  /* Previously-missed ids (from earlier sessions on this device). Answering
     one correctly now records it as `cleared` — the review deck's
     resolution signal. */
  const priorMissesRef = useRef<Set<string>>(new Set());
  const clearedRef = useRef<string[]>([]);

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      const missed = new Set<string>();
      for (const a of prev) for (const id of a.misses ?? []) missed.add(id);
      priorMissesRef.current = missed;
    } catch {
      priorMissesRef.current = new Set();
    }
    fetch(`/api/practice/questions?topic=${encodeURIComponent(topic)}`)
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => {
        setQuestions(d.questions);
        setContentVersion(d.version ?? null);
      })
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
      const q = questions[index];
      setResult(d);
      // Tally per-skill results — feeds the mastery dashboard and the session report.
      const tally = skillTallies.current[q.skill] ?? { label: q.skillLabel, correct: 0, total: 0 };
      tally.total += 1;
      if (d.correct) {
        tally.correct += 1;
        setScore((s) => s + 1);
      } else {
        // Error log (answers portal): collect missed question ids for the review deck.
        if (!missesRef.current.includes(q.id)) missesRef.current.push(q.id);
      }
      // Resolution signal: a previously-missed question answered correctly now.
      if (d.correct && priorMissesRef.current.has(q.id) && !clearedRef.current.includes(q.id)) {
        clearedRef.current.push(q.id);
      }
      skillTallies.current[q.skill] = tally;
    } finally {
      setChecking(false);
    }
  }, [questions, index, picked]);

  const finishSession = useCallback(() => {
    if (!questions) return;
    const skills: AttemptSkill[] = Object.entries(skillTallies.current).map(([skill, t]) => ({
      skill,
      correct: t.correct,
      total: t.total,
    }));
    recordAttempt({
      kind: "practice",
      topic,
      score,
      total: questions.length,
      at: new Date().toISOString(),
      skills,
      contentVersion: contentVersion ?? undefined,
      misses: missesRef.current.length > 0 ? [...missesRef.current] : undefined,
      cleared: clearedRef.current.length > 0 ? [...clearedRef.current] : undefined,
    });
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [questions, score, topic, contentVersion]);

  const next = () => {
    if (!questions) return;
    if (index + 1 >= questions.length) {
      finishSession();
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
      <div aria-live="polite">
        <p className="text-slate text-sm">Loading practice questions…</p>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const skillRows = Object.entries(skillTallies.current)
      .map(([skill, t]) => ({ skill, ...t, rate: t.total ? t.correct / t.total : 0 }))
      .sort((a, b) => a.rate - b.rate || a.total - b.total);
    const weakest = skillRows[0];
    return (
      <Card className="text-center !p-10">
        <Badge tone={pct >= 70 ? "success" : pct >= 40 ? "warning" : "neutral"}>Session complete</Badge>
        <p className="mt-6 font-display text-7xl tracking-[-0.03em] text-ink tabular-nums">
          {score}<span className="text-3xl text-slate font-semibold">/{questions.length}</span>
        </p>
        <p className="mt-3 text-slate">
          {pct >= 80 ? "Excellent — this topic is becoming solid." : pct >= 50 ? "Good progress. Review the ones you missed below, then try again tomorrow." : "Every expert started here. Re-read the explanations, then try another session."}
        </p>

        {/* ---------- Per-skill report: the practice engine feeds the mastery dashboard ---------- */}
        <div className="mt-8 text-left">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
            Skill breakdown
          </h2>
          <ul className="mt-3 border-t border-border divide-y divide-border">
            {skillRows.map((row) => (
              <li key={row.skill} className="py-3 flex items-center gap-4">
                <span className="flex-1 min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">{row.label}</span>
                  <span
                    className="mt-1.5 block h-1.5 rounded-full bg-border/60 overflow-hidden"
                    role="progressbar"
                    aria-label={`${row.label} accuracy`}
                    aria-valuenow={Math.round(row.rate * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span
                      className="block h-full bg-academy-teal rounded-full"
                      style={{ width: `${Math.round(row.rate * 100)}%` }}
                    />
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-slate tabular-nums">
                  {row.correct}/{row.total}
                </span>
              </li>
            ))}
          </ul>
          {weakest && weakest.rate < 1 && (
            <p className="mt-4 text-[15px] text-slate leading-relaxed">
              Weakest here: <span className="font-semibold text-ink">{weakest.label}</span> — a free
              diagnostic maps exactly these gaps to a starter plan.
            </p>
          )}
        </div>

        <p className="mt-6 text-sm text-slate">Hints used: {hintsUsed} · Saved to your progress on this device.</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button onClick={() => window.location.reload()}>
            <RotateCcw size={16} aria-hidden /> Practice again
          </Button>
          <Button href="/exams/jft-basic/diagnostic" variant="secondary">Map my gaps</Button>
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
          <div className="h-full bg-academy-teal rounded-full transition-[width] duration-300 ease-signature" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>
      </div>

      <Card className="!p-6 md:!p-10 faq-reveal" key={q.id}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="info">{q.topic}</Badge>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate">{q.skillLabel}</span>
        </div>
        <h2 className="mt-4 text-xl md:text-2xl font-bold text-ink leading-relaxed">{q.stem}</h2>
        {q.stemJp && <p className="jp mt-2 text-lg text-slate">{q.stemJp}</p>}
        {q.audioTextJp && (
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={() => speakJapanese(q.audioTextJp!)}>
              <Volume2 size={16} aria-hidden /> Replay audio
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
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-colors duration-200 ease-signature active:scale-[0.99] disabled:cursor-default ${
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
                {isCorrectOpt && <Check size={16} className="inline-block ml-3 text-academy-teal-dark" aria-label="Correct option" />}
                {isWrongPick && <X size={16} className="inline-block ml-3 text-red-600" aria-label="Incorrect pick" />}
              </button>
            );
          })}
        </div>

        {result ? (
          <div className="mt-6 border-t border-border pt-5 faq-reveal">
            <p className={`font-extrabold text-lg flex items-center gap-2 ${result.correct ? "text-academy-teal-dark" : "text-red-700"}`}>
              {result.correct ? (
                <><Check size={20} aria-hidden /> Correct</>
              ) : (
                <><X size={20} aria-hidden /> Not quite — the answer is “{result.correctLabel}”</>
              )}
            </p>
            <p className="mt-2 text-[15px] text-slate leading-relaxed">
              <span className="font-semibold text-ink">Why: </span>{result.explanation}
            </p>
            {!result.correct && (
              <p className="mt-3">
                <Link
                  href={`/exams/jft-basic/answers/${q.id}`}
                  aria-label="Full explanation for this question"
                  className="inline-flex items-center gap-1 text-[15px] font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
                >
                  Full explanation <span aria-hidden="true">→</span>
                </Link>
              </p>
            )}
            <div className="mt-5"><Button onClick={next} size="lg">{index + 1 >= questions.length ? "See my session result" : "Next question →"}</Button></div>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={check} disabled={!picked || checking} size="lg">{checking ? "Checking…" : "Check answer"}</Button>
            {!showHint ? (
              <button
                type="button"
                onClick={() => { setShowHint(true); setHintsUsed((h) => h + 1); }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border text-slate font-semibold transition-colors duration-200 hover:border-academy-teal hover:text-academy-teal-dark active:scale-[0.98]"
              >
                <Lightbulb size={16} aria-hidden /> Show hint
              </button>
            ) : (
              <p className="inline-flex items-start gap-2 text-sm text-slate bg-academy-teal/5 border border-academy-teal/20 rounded-xl px-4 py-2.5" role="status">
                <Lightbulb size={16} aria-hidden className="shrink-0 mt-0.5" /> {q.hint}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
