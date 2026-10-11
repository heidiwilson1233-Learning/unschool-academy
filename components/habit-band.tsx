"use client";

import { useEffect, useMemo, useState } from "react";
import { Shield, Check } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import {
  computeHabit,
  dayKeyLocal,
  loadHabit,
  saveHabit,
  GOAL_OPTIONS,
  MAX_FREEZES,
  type HabitView,
  type WeekDayState,
} from "@/lib/habits";

type MiniAttempt = { kind: string; total: number; at: string };

function parsedDayKey(a: MiniAttempt): string | null {
  const d = new Date(a.at);
  return isNaN(d.getTime()) ? null : dayKeyLocal(d);
}

/**
 * The three habit cells for the learner dashboard: streak dossier (with freeze),
 * customizable daily goal ring, and today's challenge entry point.
 * All state is local to this browser — nothing is sent anywhere.
 */
export default function HabitCells({ attempts }: { attempts: MiniAttempt[] }) {
  const [tick, bump] = useState(0);
  // Client-only date label: rendering the date during SSR would use the
  // server's timezone and risk a hydration mismatch across midnight.
  const [dateLabel, setDateLabel] = useState("");
  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    );
  }, []);

  const habit: HabitView = useMemo(() => {
    const dayKeys: string[] = [];
    const seen = new Set<string>();
    let answeredToday = 0;
    const todayKey = dayKeyLocal(new Date());
    for (const a of attempts) {
      const k = parsedDayKey(a);
      if (!k) continue;
      if (!seen.has(k)) {
        seen.add(k);
        dayKeys.push(k);
      }
      if (k === todayKey) answeredToday += a.total > 0 ? a.total : 0;
    }
    return computeHabit(dayKeys, answeredToday);
    // Recompute when attempts change OR the goal picker bumps the tick
    // (computeHabit re-reads the persisted goal from localStorage).
  }, [attempts, tick]);

  const challengeDoneToday = useMemo(() => {
    const todayKey = dayKeyLocal(new Date());
    return attempts.some((a) => a.kind === "challenge" && parsedDayKey(a) === todayKey);
  }, [attempts]);

  const setGoal = (goal: number) => {
    saveHabit({ ...loadHabit(), goal });
    bump((n) => n + 1);
  };

  const ringR = 26;
  const ringC = 2 * Math.PI * ringR;
  const ringFrac = Math.min(1, habit.answeredToday / habit.goal);
  // Evening at-risk nudge (doctrine: nudges to at-risk learners only,
  // encouragement never guilt). Client-only is fine — it renders after mount.
  const [eveningNudge, setEveningNudge] = useState(false);
  useEffect(() => {
    setEveningNudge(new Date().getHours() >= 19);
  }, []);

  const weekSummary = useMemo(() => {
    const counts = { active: 0, bridged: 0, inactive: 0 };
    for (const d of habit.week) {
      if (d.state === "active") counts.active += 1;
      else if (d.state === "bridged") counts.bridged += 1;
      else if (d.state === "inactive") counts.inactive += 1;
    }
    return `Last 7 days: ${counts.active} active, ${counts.bridged} covered by a freeze, ${counts.inactive} missed.`;
  }, [habit.week]);

  const dotClass = (state: WeekDayState) =>
    state === "active"
      ? "bg-academy-teal border-academy-teal"
      : state === "bridged"
        ? "border-academy-teal-dark bg-academy-teal/25"
        : state === "today"
          ? "border-dashed border-slate motion-safe:animate-pulse"
          : "border-border";

  return (
    <>
      {/* ---------- Streak dossier ---------- */}
      <Card className="col-span-6 md:col-span-2 !shadow-none">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
          Day streak
        </h2>
        <p
          className="mt-2 text-6xl font-extrabold tracking-[-0.03em] text-ink leading-none tabular-nums"
          aria-label={`${habit.streak} day streak`}
        >
          {habit.streak}
        </p>

        {/* Week strip: the dossier's signature instrument — last 7 days at a glance. */}
        <div
          className="mt-4 flex items-end gap-1.5"
          role="img"
          aria-label={weekSummary}
        >
          {habit.week.map((d) => (
            <span key={d.key} className="flex flex-col items-center gap-1" aria-hidden>
              <span
                className={`block w-3.5 h-3.5 rounded-full border-2 ${dotClass(d.state)}`}
              />
              <span className="font-mono text-[9px] uppercase text-slate">{d.label}</span>
            </span>
          ))}
        </div>

        {/* Freeze pips: 2 slots, filled vs hollow — the freeze economy at a glance. */}
        <div className="mt-4 flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            {Array.from({ length: MAX_FREEZES }).map((_, i) => (
              <Shield
                key={i}
                size={16}
                className={
                  i < habit.freezes
                    ? "fill-academy-teal text-academy-teal-dark"
                    : "text-border"
                }
              />
            ))}
          </span>
          <span className="text-sm font-semibold text-ink">
            {habit.freezes} of {MAX_FREEZES} freezes
          </span>
        </div>
        <p className="mt-2 text-sm text-slate leading-relaxed">
          One session a day keeps your streak. A freeze covers a missed day automatically.
          {habit.daysToNextFreeze !== null && !habit.earnedFreezeNow && (
            <>
              {" "}
              {habit.daysToNextFreeze === 7
                ? "A new 7-day week starts today."
                : `${habit.daysToNextFreeze} more ${habit.daysToNextFreeze === 1 ? "day" : "days"} to earn a freeze.`}
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-slate leading-relaxed">
          {habit.earnedFreezeNow ? (
            <span className="font-semibold text-academy-teal-dark">
              7-day week complete — you earned a freeze.
            </span>
          ) : habit.alive ? (
            habit.bridgedYesterday ? (
              "Yesterday was covered by a freeze. Practise today to keep the run going."
            ) : (
              "One session today keeps the streak alive."
            )
          ) : (
            "No active streak — one session today starts a new one."
          )}
        </p>
      </Card>

      {/* ---------- Daily goal ---------- */}
      <Card className="col-span-6 md:col-span-3 !shadow-none">
        <div className="flex items-start gap-5">
          <div
            className="relative shrink-0 w-20 h-20"
            role="img"
            aria-label={`${habit.answeredToday} of ${habit.goal} questions answered today`}
          >
            <svg viewBox="0 0 64 64" className="w-20 h-20 -rotate-90" aria-hidden>
              <circle cx="32" cy="32" r={ringR} fill="none" strokeWidth="7" className="stroke-border/60" />
              <circle
                cx="32"
                cy="32"
                r={ringR}
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                className="stroke-academy-teal transition-[stroke-dashoffset] duration-500 ease-signature motion-reduce:transition-none"
                strokeDasharray={ringC}
                strokeDashoffset={ringC * (1 - ringFrac)}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold text-ink tabular-nums">
              {habit.answeredToday}
              <span className="text-xs font-semibold text-slate">/{habit.goal}</span>
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
              Today&apos;s goal
            </h2>
            <p className="mt-2 text-[15px] text-ink leading-relaxed">
              {habit.goalMet ? (
                <>
                  <span className="font-bold">Goal met.</span>{" "}
                  <span className="text-slate">Consistency beats intensity — the streak takes care of itself from here.</span>
                </>
              ) : eveningNudge ? (
                <>
                  <span className="font-bold">{habit.goal - habit.answeredToday} to go.</span>{" "}
                  <span className="text-slate">
                    Evening check-in — today&apos;s challenge is five questions and closes your goal.
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold">{habit.goal - habit.answeredToday} to go.</span>{" "}
                  <span className="text-slate">
                    {habit.goal - habit.answeredToday === 1 ? "One question" : "A few questions"} — every session counts: practice, mocks, or today&apos;s challenge.
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate" id="goal-picker-label">
            Daily goal
          </p>
          <div
            className="mt-2 inline-flex rounded-xl border border-border p-1 gap-1"
            role="group"
            aria-labelledby="goal-picker-label"
          >
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                aria-pressed={habit.goal === g}
                className={`min-w-11 min-h-11 px-3 py-2 rounded-lg text-sm font-bold transition-colors duration-200 motion-reduce:transition-none active:scale-[0.97] motion-reduce:active:scale-100 ${
                  habit.goal === g
                    ? "bg-ink text-white"
                    : "text-slate hover:text-ink hover:bg-border/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate">Questions per day. Pick a number you can hit on a busy day.</p>
        </div>
      </Card>

      {/* ---------- Today's challenge ---------- */}
      <Card className="col-span-6 md:col-span-3 !shadow-none">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
              Challenge of the day
            </h2>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate">
              {dateLabel || "Today"}
            </p>
          </div>
          {challengeDoneToday && <Badge tone="success">Done today</Badge>}
        </div>
        <p className="mt-3 text-[15px] text-ink leading-relaxed">
          Five questions, reshuffled at your local midnight — the same set for everyone on the
          same day.
        </p>
        <p className="mt-1 text-sm text-slate leading-relaxed">
          Counts toward your daily goal and your streak. A few minutes, any time.
        </p>
        <div className="mt-5">
          {challengeDoneToday ? (
            <p className="text-sm font-semibold text-academy-teal-dark inline-flex items-center gap-2">
              <Check size={16} aria-hidden /> Finished — a new set lands at your local midnight.
            </p>
          ) : (
            <Button href="/app/exams/challenge">Start today&apos;s challenge</Button>
          )}
        </div>
      </Card>
    </>
  );
}
