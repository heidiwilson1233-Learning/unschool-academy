"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair } from "lucide-react";

/**
 * Smart pick — the practice picker's one-tap adaptive entry (portal-doctrine
 * moves 2 + 8). Reads this device's past practice sessions from localStorage
 * and points at the weakest topic, so a returning learner skips the choice
 * and starts where the payoff is highest. No account, no server, no guilt —
 * encouragement copy only.
 *
 * Renders nothing until after mount (localStorage is client-only), so there
 * is no hydration mismatch and the picker page stays a static shell.
 */
export type SmartPickUnit = { id: string; title: string; href: string };

type StoredAttempt = {
  kind?: string;
  exam?: string;
  topic?: string;
  score?: number;
  total?: number;
};

export default function PracticeSmartPick({
  exam,
  units,
}: {
  exam: string;
  units: SmartPickUnit[];
}) {
  const [weakest, setWeakest] = useState<SmartPickUnit | null>(null);
  const [stats, setStats] = useState<{ rate: number; sessions: number } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const attempts = JSON.parse(
        localStorage.getItem("ua-attempts") ?? "[]"
      ) as StoredAttempt[];
      const byTopic = new Map<string, { correct: number; total: number; sessions: number }>();
      for (const a of attempts) {
        if (a.kind !== "practice") continue;
        if ((a.exam ?? "jft-basic") !== exam) continue;
        if (!a.topic || typeof a.score !== "number" || typeof a.total !== "number" || a.total <= 0)
          continue;
        const cur = byTopic.get(a.topic) ?? { correct: 0, total: 0, sessions: 0 };
        cur.correct += a.score;
        cur.total += a.total;
        cur.sessions += 1;
        byTopic.set(a.topic, cur);
      }
      let pick: { unit: SmartPickUnit; rate: number; sessions: number } | null = null;
      for (const u of units) {
        const t = byTopic.get(u.title);
        if (!t || t.sessions === 0) continue;
        const rate = t.correct / t.total;
        if (!pick || rate < pick.rate) pick = { unit: u, rate, sessions: t.sessions };
      }
      if (pick) {
        setWeakest(pick.unit);
        setStats({ rate: Math.round(pick.rate * 100), sessions: pick.sessions });
      }
    } catch {
      /* storage unavailable — the card falls back to the neutral state */
    }
    setReady(true);
  }, [exam, units]);

  if (!ready) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-academy-teal/40 bg-academy-teal/[0.06] p-6 md:p-7">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.16), transparent)" }}
      />
      <p className="relative flex items-center gap-2 text-sm font-bold text-academy-teal-dark">
        <Crosshair size={16} aria-hidden /> Smart pick
      </p>
      {weakest && stats ? (
        <>
          <p className="relative mt-3 text-[15px] text-slate leading-relaxed">
            Your weakest topic on this device:{" "}
            <span className="font-semibold text-ink">{weakest.title}</span> —{" "}
            {stats.rate}% across {stats.sessions} {stats.sessions === 1 ? "session" : "sessions"}.
            Five focused questions beat fifty scattered ones.
          </p>
          <Link
            href={weakest.href}
            className="relative mt-4 inline-flex items-center gap-1 font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-blue rounded"
          >
            Practice {weakest.title} <span aria-hidden="true">→</span>
          </Link>
        </>
      ) : (
        <p className="relative mt-3 text-[15px] text-slate leading-relaxed">
          No practice sessions on this device yet. Pick any unit below — after a
          session, your weakest topic will show up here as the fastest next step.
        </p>
      )}
    </div>
  );
}
