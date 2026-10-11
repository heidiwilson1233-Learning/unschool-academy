"use client";

import { useEffect, useState } from "react";
import PracticePlayer, { type ChallengePack } from "@/components/practice-player";
import { dayKeyLocal } from "@/lib/habits";
import { Card, Button } from "@/components/ui";

/**
 * Fetches today's deterministic challenge set (the learner's local date decides
 * midnight rollover) and plays it in the shared practice engine.
 */
export default function ChallengeRunner() {
  const [pack, setPack] = useState<ChallengePack | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    const key = dayKeyLocal(new Date());
    setDateKey(key);
    try {
      const prev = JSON.parse(localStorage.getItem("ua-attempts") ?? "[]");
      setDoneToday(
        prev.some((a: { kind: string; at: string }) => {
          const d = new Date(a.at);
          return (
            a.kind === "challenge" && !isNaN(d.getTime()) && dayKeyLocal(d) === key
          );
        })
      );
    } catch {
      /* storage unavailable — done state simply isn't shown */
    }
    fetch(`/api/challenge/today?date=${key}`)
      .then((r) => {
        if (!r.ok) throw new Error("load failed");
        return r.json();
      })
      .then((d) => {
        if (!d.questions || d.questions.length === 0) throw new Error("empty set");
        setPack({ date: d.date, questions: d.questions, contentVersion: d.version ?? null });
      })
      .catch(() => setLoadError(true));
  }, []);

  if (loadError) {
    return (
      <Card>
        <h2 className="text-xl font-bold text-ink mb-2">Couldn&apos;t load today&apos;s challenge</h2>
        <p className="text-slate">Check your connection and reload.</p>
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      </Card>
    );
  }
  if (!pack) {
    return (
      <div aria-busy="true" aria-live="polite">
        <p className="sr-only">Picking today&apos;s five questions…</p>
        <div className="space-y-3" aria-hidden>
          <div className="h-6 w-2/3 rounded-lg bg-border/40" />
          <div className="h-40 rounded-2xl bg-border/40" />
          <div className="h-12 rounded-xl bg-border/40" />
          <div className="h-12 rounded-xl bg-border/40" />
        </div>
      </div>
    );
  }
  const spokenDate = dateKey
    ? new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
  return (
    <>
      {spokenDate && <p className="sr-only">Challenge set for {spokenDate}</p>}
      {doneToday && (
        <p className="mb-6 rounded-xl border border-academy-teal/30 bg-academy-teal/5 px-5 py-4 text-[15px] text-ink">
          <span className="font-bold">Done today — nice.</span>{" "}
          <span className="text-slate">
            Replaying is good practice; your streak and goal already counted this set.
          </span>
        </p>
      )}
      <PracticePlayer challenge={pack} />
    </>
  );
}
