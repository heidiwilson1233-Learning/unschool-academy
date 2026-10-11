/**
 * Pilot parent view data layer — pure functions, client-safe (no JSX, no answer keys).
 *
 * Portal-doctrine move 3 (mastery dashboards, parent half): the parent view
 * reads the same "ua-attempts" store as the student dashboard — activity
 * recency, session scores, per-skill mastery translated into plain parent
 * language, and an auto-generated monthly report with a copyable summary.
 *
 * Honest by construction: everything is computed from THIS browser's stored
 * sessions only. Empty states say so; copy never inflates counts.
 */

import { tallySkills, computeMastery, nextBestSkill, MASTERY_LEVEL_NAMES } from "./mastery";
import type { StoredAttempt, MasterySkillInput, MasteryLevel, SkillMastery } from "./mastery";

export type ParentAttempt = StoredAttempt & { kind: string; topic?: string };

/** Strict-parse stored attempts; junk records are dropped, never rendered. */
export function parseAttempts(raw: unknown): ParentAttempt[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((a): a is ParentAttempt => {
    if (!a || typeof a !== "object") return false;
    const r = a as Record<string, unknown>;
    return (
      typeof r.kind === "string" &&
      typeof r.at === "string" &&
      !isNaN(new Date(r.at).getTime()) &&
      typeof r.score === "number" &&
      typeof r.total === "number"
    );
  });
}

export function attemptDate(a: ParentAttempt): Date {
  return new Date(a.at as string);
}

/** "mock (auto-submitted)" -> "Mock test (short)". Plain language: parents
 *  should not have to decode which mock is which. */
export function kindLabel(kind: string): string {
  const base = kind.split(" (")[0].trim();
  if (base === "diagnostic") return "Diagnostic";
  if (base === "mock") return "Mock test (short)";
  if (base === "full mock") return "Mock test (full-length)";
  if (base === "practice") return "Practice";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

/** Parent-friendly session label for the score ledger. */
export function sessionLabel(a: ParentAttempt): string {
  const base = kindLabel(a.kind);
  if (base === "Practice" && a.topic) return `Practice · ${a.topic}`;
  return base;
}

export function relativeTime(d: Date, now: Date = new Date()): string {
  const ms = now.getTime() - d.getTime();
  if (ms < 0) return "just now";
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "last week";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export function activeDayKeys(attempts: ParentAttempt[]): Set<string> {
  return new Set(attempts.map((a) => dayKey(attemptDate(a))));
}

/** Last 7 calendar days, oldest first: two-letter day label for sighted users,
 *  full name for screen readers, and activity flag. */
export function lastSevenDays(
  activeKeys: Set<string>,
  now: Date = new Date()
): { key: string; day: string; fullDay: string; active: boolean }[] {
  const out: { key: string; day: string; fullDay: string; active: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    out.push({
      key: k,
      day: d.toLocaleString("en-IN", { weekday: "short" }).slice(0, 2),
      fullDay: d.toLocaleString("en-IN", { weekday: "long" }),
      active: activeKeys.has(k),
    });
  }
  return out;
}

export function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
}

export function fmtDate(d: Date): string {
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export type MonthStats = {
  key: string;
  label: string;
  sessions: number;
  questions: number;
  correct: number;
  accuracy: number | null;
  activeDays: number;
  /** Latest score per session kind, for the copy summary. */
  latestByKind: { kind: string; score: number; total: number }[];
  /** Per-skill tallies within the month (ids only — labels resolved by caller). */
  skillTallies: Record<string, { correct: number; total: number }>;
};

export function groupByMonth(attempts: ParentAttempt[]): MonthStats[] {
  const groups = new Map<string, ParentAttempt[]>();
  for (const a of attempts) {
    const k = monthKey(attemptDate(a));
    const g = groups.get(k) ?? [];
    g.push(a);
    groups.set(k, g);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([key, list]) => {
      const questions = list.reduce((s, a) => s + Math.max(0, a.total ?? 0), 0);
      const correct = list.reduce((s, a) => s + Math.max(0, a.score ?? 0), 0);
      const seen = new Map<string, { kind: string; score: number; total: number }>();
      for (const a of [...list].sort((x, y) => attemptDate(y).getTime() - attemptDate(x).getTime())) {
        const k = kindLabel(a.kind);
        if (!seen.has(k) && a.score !== undefined && a.total !== undefined) {
          seen.set(k, { kind: k, score: a.score, total: a.total });
        }
      }
      return {
        key,
        label: monthLabel(key),
        sessions: list.length,
        questions,
        correct,
        accuracy: questions > 0 ? correct / questions : null,
        activeDays: activeDayKeys(list).size,
        latestByKind: [...seen.values()],
        skillTallies: tallySkills(list),
      };
    });
}

/** Parent-language grouping of mastery levels: encouragement, never surveillance.
 *
 *  Takes the precomputed mastery map (callers compute once — histories grow
 *  unbounded, so the double tally+compute pass is not repeated here). */
export function parentSkillGroups(
  skills: MasterySkillInput[],
  mastery: Record<string, SkillMastery>
): {
  strong: { id: string; label: string }[];
  building: { id: string; label: string }[];
  notStarted: { id: string; label: string }[];
} {
  const strong: { id: string; label: string }[] = [];
  const building: { id: string; label: string }[] = [];
  const notStarted: { id: string; label: string }[] = [];
  for (const s of skills) {
    const level = mastery[s.id]?.level ?? ("not-started" as MasteryLevel);
    const row = { id: s.id, label: s.label };
    if (level === "familiar" || level === "proficient" || level === "mastered") strong.push(row);
    else if (level === "attempted") building.push(row);
    else notStarted.push(row);
  }
  return { strong, building, notStarted };
}

export type ParentSummary = {
  month: MonthStats;
  /** Counts across the whole curriculum: attempted / total skills. */
  skillCounts: { attempted: number; strong: number; total: number };
  /** Strongest skill this month (label + accuracy), if any skill data exists. */
  strongest: { label: string; accuracy: number; total: number } | null;
  /** Next recommended step in plain language, or null when nothing to say. */
  nextStep: string | null;
  lastActive: string;
  sessionsThisWeek: number;
  labelFor: (id: string) => string;
};

/**
 * Build the copyable monthly summary — plain text for a parent to keep,
 * message, or print. Every number is computed from stored sessions; nothing
 * is projected or invented.
 */
export function buildSummaryText(s: ParentSummary): string {
  const m = s.month;
  const acc = m.accuracy === null ? "no scored sessions" : `${Math.round(m.accuracy * 100)}%`;
  const lines = [
    `Learner summary: JFT-Basic · ${m.label}`,
    `Generated ${new Date().toLocaleString("en-IN", { dateStyle: "medium" })} from ${m.sessions} ${m.sessions === 1 ? "session" : "sessions"} stored in this browser.`,
    ``,
    `Activity: last active ${s.lastActive} · ${m.activeDays} active ${m.activeDays === 1 ? "day" : "days"} this month · ${s.sessionsThisWeek} ${s.sessionsThisWeek === 1 ? "session" : "sessions"} this week`,
    `Scores: ${m.latestByKind.map((l) => `${l.kind} ${l.score}/${l.total}`).join(" · ") || "no scored sessions yet"}`,
    `Accuracy this month: ${acc} over ${m.questions} questions`,
  ];
  if (s.strongest) {
    lines.push(
      `Skills: ${s.skillCounts.strong} of ${s.skillCounts.total} strong · strongest this month: ${s.strongest.label} (${Math.round(s.strongest.accuracy * 100)}% over ${s.strongest.total})`
    );
  } else {
    lines.push(`Skills: ${s.skillCounts.attempted} of ${s.skillCounts.total} attempted so far`);
  }
  if (s.nextStep) lines.push(`Next step: ${s.nextStep}`);
  lines.push(``, `All questions are draft content, pending expert review.`);
  return lines.join("\n");
}

export { computeMastery, nextBestSkill, MASTERY_LEVEL_NAMES, tallySkills };
