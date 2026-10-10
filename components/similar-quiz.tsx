"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

export type QuizItem = {
  id: string;
  skillLabel: string;
  stem: string;
  stemJp: string | null;
  options: { id: string; text: string; textJp: string | null }[];
};

type CheckResult = { correct: boolean; correctLabel?: string };

const CLEARED_KEY = "ua-answers-cleared";

function readPriorMisses(): Set<string> {
  try {
    const attempts = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
    const s = new Set<string>();
    for (const a of attempts) for (const id of a.misses ?? []) s.add(id);
    return s;
  } catch {
    return new Set();
  }
}

function markCleared(id: string) {
  try {
    const raw: string[] = JSON.parse(localStorage.getItem(CLEARED_KEY) ?? "[]");
    if (!raw.includes(id)) {
      raw.push(id);
      localStorage.setItem(CLEARED_KEY, JSON.stringify(raw));
    }
  } catch {
    /* storage unavailable — the clear simply isn't persisted */
  }
}

/**
 * Inline 3-question re-attempt quiz (answers portal, doctrine move 2).
 * Stems and options arrive as props; correctness is validated server-side
 * via /api/practice/check — the client never sees answer keys.
 */
export function SimilarQuiz({ items }: { items: QuizItem[] }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [clearedNow, setClearedNow] = useState<string[]>([]);
  const priorMisses = useMemo(readPriorMisses, []);

  const q = items[index];
  if (!q) return null;

  const check = async () => {
    if (!picked || checking) return;
    setChecking(true);
    try {
      const r = await fetch("/api/practice/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, optionId: picked }),
      });
      const d = (await r.json()) as CheckResult;
      setResult(d);
      if (d.correct) {
        setScore((s) => s + 1);
        if (priorMisses.has(q.id) && !clearedNow.includes(q.id)) {
          markCleared(q.id);
          setClearedNow((c) => [...c, q.id]);
        }
      }
    } finally {
      setChecking(false);
    }
  };

  const next = () => {
    if (index + 1 >= items.length) {
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
      setResult(null);
    }
  };

  if (finished) {
    return (
      <div className="border border-border rounded-2xl p-6 md:p-8 bg-paper" role="status">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
          Mini quiz done
        </p>
        <p className="mt-2 text-xl font-extrabold text-ink">
          {score} of {items.length} correct
        </p>
        <p className="mt-2 text-[15px] text-slate leading-relaxed">
          {score === items.length
            ? "Clean sweep. The skill is sticking."
            : "Progress, not perfection. The ones you missed are in your review deck."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/exams/jft-basic/answers/review"
            className="inline-flex items-center gap-1 font-semibold text-academy-blue hover:underline"
          >
            Open your review deck <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-2xl p-6 md:p-8 bg-paper">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
          Try it live · {index + 1} of {items.length}
        </p>
        <p className="font-mono text-xs tabular-nums text-slate">Score {score}</p>
      </div>

      <p className="mt-4 text-lg font-bold text-ink leading-snug">{q.stem}</p>
      {q.stemJp && q.stemJp !== q.stem && (
        <p lang="ja" className="jp mt-2 text-slate">
          {q.stemJp}
        </p>
      )}

      <div className="mt-5 grid gap-2.5" role="group" aria-label="Answer choices">
        {q.options.map((o) => {
          const selected = picked === o.id;
          const disabled = result !== null;
          return (
            <button
              key={o.id}
              type="button"
              disabled={disabled}
              onClick={() => setPicked(o.id)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-colors duration-200 ease-signature motion-safe:active:scale-[0.99] disabled:cursor-default focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue ${
                selected ? "border-academy-blue bg-academy-blue/5" : "border-border hover:border-academy-blue/50"
              }`}
            >
              <span className="text-[15px] font-semibold text-ink">
                {o.textJp && o.textJp !== o.text ? (
                  <>
                    <span lang="ja" className="jp">
                      {o.textJp}
                    </span>
                    <span className="block text-sm font-normal text-slate mt-0.5">{o.text}</span>
                  </>
                ) : (
                  o.text
                )}
              </span>
            </button>
          );
        })}
      </div>

      {result ? (
        <div className="mt-5 border-t border-border pt-4">
          <p
            className={`font-extrabold flex items-center gap-2 ${
              result.correct ? "text-academy-teal-dark" : "text-red-700"
            }`}
          >
            {result.correct ? (
              <>
                <Check size={18} aria-hidden /> Correct
              </>
            ) : (
              <>
                <X size={18} aria-hidden /> Not quite
                {result.correctLabel ? ` — the answer is “${result.correctLabel}”` : ""}
              </>
            )}
          </p>
          {result.correct && clearedNow.includes(q.id) && (
            <p className="mt-2 text-sm font-semibold text-academy-teal-dark" role="status">
              Cleared from your review deck.
            </p>
          )}
          {!result.correct && (
            <p className="mt-2">
              <Link
                href={`/exams/jft-basic/answers/${q.id}`}
                aria-label={`Full explanation for this question`}
                className="text-[15px] font-semibold text-academy-blue hover:underline"
              >
                Full explanation <span aria-hidden="true">→</span>
              </Link>
            </p>
          )}
          <button
            type="button"
            onClick={next}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-bold text-white transition-transform duration-200 ease-signature motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue"
          >
            {index + 1 >= items.length ? "See my score" : "Next question"} <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={check}
          disabled={!picked || checking}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 font-bold text-white transition-all duration-200 ease-signature motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue"
        >
          {checking ? "Checking…" : "Check answer"}
        </button>
      )}
    </div>
  );
}
