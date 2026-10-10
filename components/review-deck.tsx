"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import type { AnswerMeta } from "@/lib/answers";

const CLEARED_KEY = "ua-answers-cleared";

type Attempt = { misses?: string[]; cleared?: string[]; at?: string };

type Card = {
  id: string;
  skillLabel: string;
  topic: string;
  stem: string;
  missCount: number;
  lastMissed: number;
};

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function loadManualCleared(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CLEARED_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/**
 * The error-log review deck (answers portal, doctrine move 2).
 * Wrong answers from practice sessions auto-collect here; getting one right
 * later — or marking it reviewed — clears it. Encouragement, never guilt:
 * the deck shrinks as you learn.
 */
export function ReviewDeck({ meta }: { meta: AnswerMeta[] }) {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [clearedCount, setClearedCount] = useState(0);
  const [totalMissed, setTotalMissed] = useState(0);

  const recompute = () => {
    try {
      const attempts: Attempt[] = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      const cleared = new Set<string>(loadManualCleared());
      for (const a of attempts) for (const id of a.cleared ?? []) cleared.add(id);

      const byId = new Map(meta.map((m) => [m.id, m]));
      const stats = new Map<string, { missCount: number; lastMissed: number }>();
      for (const a of attempts) {
        const at = a.at ? Date.parse(a.at) : 0;
        for (const id of a.misses ?? []) {
          if (!byId.has(id)) continue;
          const s = stats.get(id) ?? { missCount: 0, lastMissed: 0 };
          s.missCount += 1;
          s.lastMissed = Math.max(s.lastMissed, at);
          stats.set(id, s);
        }
      }

      setTotalMissed(stats.size);
      const open: Card[] = [];
      let clearedN = 0;
      for (const [id, s] of stats) {
        if (cleared.has(id)) {
          clearedN += 1;
          continue;
        }
        const m = byId.get(id)!;
        open.push({ id, skillLabel: m.skillLabel, topic: m.topic, stem: m.stem, ...s });
      }
      /* Needs-you-most first: missed most often, then most recently. */
      open.sort((a, b) => b.missCount - a.missCount || b.lastMissed - a.lastMissed);
      setClearedCount(clearedN);
      setCards(open);
    } catch {
      setCards([]);
      setClearedCount(0);
      setTotalMissed(0);
    }
  };

  useEffect(recompute, [meta]);

  const markReviewed = (id: string) => {
    try {
      const raw = loadManualCleared();
      if (!raw.includes(id)) {
        raw.push(id);
        localStorage.setItem(CLEARED_KEY, JSON.stringify(raw));
      }
    } catch {
      /* storage unavailable — the mark simply isn't persisted */
    }
    recompute();
  };

  if (cards === null) {
    return (
      <div aria-busy="true" className="py-16">
        <p className="sr-only">Loading your review deck</p>
        <div className="h-40 rounded-2xl bg-border/40" />
      </div>
    );
  }

  /* Empty state 1 — never missed anything on this device. */
  if (totalMissed === 0) {
    return (
      <div className="border border-border rounded-2xl p-10 md:p-14 text-center bg-paper">
        <h2 className="text-2xl font-extrabold text-ink tracking-tight">Nothing to review yet</h2>
        <p className="mt-3 text-slate max-w-md mx-auto leading-relaxed">
          That is a good sign. Anything you miss in practice will quietly land here for a
          second look.
        </p>
        <div className="mt-6">
          <Link
            href="/exams/jft-basic/practice/vocabulary"
            className="inline-flex items-center gap-2 rounded-xl bg-academy-teal px-5 py-3 font-bold text-white transition-transform duration-200 ease-signature motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal-dark"
          >
            Keep practicing <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate">Saved on this device only — clearing your browser data clears this list.</p>
      </div>
    );
  }

  /* Empty state 2 — everything reviewed. A milestone, not a blank page. */
  if (cards.length === 0) {
    return (
      <div className="border border-academy-teal/30 bg-academy-teal/5 rounded-2xl p-10 md:p-14 text-center">
        <h2 className="text-2xl font-extrabold text-ink tracking-tight">Deck cleared</h2>
        <p className="mt-3 text-slate max-w-md mx-auto leading-relaxed" aria-live="polite">
          Every miss reviewed: {clearedCount} of {totalMissed}. That is the whole game:
          miss it, understand it, clear it.
        </p>
        <div className="mt-6">
          <Link
            href="/exams/jft-basic/practice/vocabulary"
            className="inline-flex items-center gap-2 font-semibold text-academy-blue hover:underline"
          >
            Keep practicing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const pct = totalMissed > 0 ? Math.round((clearedCount / totalMissed) * 100) : 0;

  return (
    <div>
      {/* Progress header — mastery-style, hairline, never a streak flame */}
      <div className="border-y border-border py-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
            {clearedCount} of {totalMissed} cleared
          </p>
          <p className="font-mono text-sm tabular-nums text-slate" aria-live="polite">
            {cards.length} to review
          </p>
        </div>
        <div
          className="mt-2.5 h-1.5 rounded-full bg-border/60 overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${clearedCount} of ${totalMissed} misses cleared`}
        >
          <div
            className="h-full bg-academy-teal rounded-full transition-[width] duration-500 ease-signature"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="mt-2 divide-y divide-border">
        {cards.map((c) => (
          <li key={c.id} className="py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate font-mono">
                  {c.skillLabel} · missed {c.missCount} {c.missCount === 1 ? "time" : "times"}
                  {c.lastMissed > 0 && ` · last ${fmtDate(c.lastMissed)}`}
                </p>
                <p className="mt-1.5 text-[15px] md:text-base font-semibold text-ink leading-relaxed">
                  {c.stem}
                </p>
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                href={`/exams/jft-basic/answers/${c.id}`}
                aria-label={`Read the explanation for: ${c.stem}`}
                className="font-semibold text-academy-blue hover:underline text-[15px]"
              >
                Read the explanation <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={`/exams/jft-basic/answers/${c.id}#try-similar`}
                className="font-semibold text-academy-blue hover:underline text-[15px]"
              >
                Re-attempt now <span aria-hidden="true">→</span>
              </Link>
              <button
                type="button"
                onClick={() => markReviewed(c.id)}
                className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-slate hover:text-academy-teal-dark transition-colors duration-200 ease-signature focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
              >
                <Check size={15} aria-hidden /> Mark reviewed
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-slate border-t border-border pt-5">
        Questions you missed, kept here for a second look. Getting them right next time is
        the whole point — no rush, no scoreboard. Saved on this device only — clearing your
        browser data clears this list.
      </p>
    </div>
  );
}
