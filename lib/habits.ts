// Habit mechanics for the learner app: streak + streak freeze, customizable
// daily goal, and the deterministic challenge-of-the-day set.
//
// Pure functions + browser guards — NO answer keys or curriculum imports here,
// so this module is safe to import from client components.
//
// Streak rule (spelled out in one sentence on the dashboard):
// "One session a day keeps your streak; a freeze covers a missed day automatically."
// - A freeze bridges exactly one missed day and is auto-applied (Duolingo pattern:
//   forgiveness is part of the loss mechanic — Duolingo's own write-ups credit
//   the freeze with lifting retention, and independent "emergency reserves"
//   research (Sharif & Shu, 2017) finds people persist partly to avoid
//   spending a defined reserve.)
// - New learners start with 1 freeze; every completed 7-day week earns +1,
//   capped at 2 held. (Product decision benchmarked on Duolingo's public
//   streak-freeze analysis: 2 equipped freezes beat 1; a third added nothing.)
// - Encouragement, never guilt: a broken streak restarts at 0 with a fresh-start
//   line, not a loss-framed scolding.

export const HABIT_KEY = "ua-habit";
export const GOAL_OPTIONS = [3, 5, 10, 20] as const;
export const DEFAULT_GOAL = 5;
export const MAX_FREEZES = 2;
export const FREEZE_EARN_EVERY = 7;
export const CHALLENGE_SIZE = 5;

export type HabitPrefs = {
  /** Freezes currently held. */
  freezes: number;
  /** Daily goal in questions answered. */
  goal: number;
  /** Local dayKeys (YYYY-MM-DD) already auto-bridged by a freeze. */
  freezesUsed: string[];
  /** Highest 7-multiple streak at which a freeze was earned (prevents re-earning). */
  lastEarnMilestone: number;
};

const DEFAULTS: HabitPrefs = {
  freezes: 1,
  goal: DEFAULT_GOAL,
  freezesUsed: [],
  lastEarnMilestone: 0,
};

export function dayKeyLocal(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function shiftDayKey(key: string, deltaDays: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + deltaDays);
  return dayKeyLocal(dt);
}

export function loadHabit(): HabitPrefs {
  try {
    const raw = JSON.parse(localStorage.getItem(HABIT_KEY) ?? "{}");
    const freezes =
      typeof raw.freezes === "number" && raw.freezes >= 0 && raw.freezes <= MAX_FREEZES
        ? Math.floor(raw.freezes)
        : DEFAULTS.freezes;
    const goal =
      typeof raw.goal === "number" && (GOAL_OPTIONS as readonly number[]).includes(raw.goal)
        ? raw.goal
        : DEFAULTS.goal;
    const freezesUsed = Array.isArray(raw.freezesUsed)
      ? raw.freezesUsed.filter((x: unknown) => typeof x === "string")
      : [];
    const lastEarnMilestone =
      typeof raw.lastEarnMilestone === "number" && raw.lastEarnMilestone >= 0
        ? Math.floor(raw.lastEarnMilestone)
        : 0;
    return { freezes, goal, freezesUsed, lastEarnMilestone };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveHabit(p: HabitPrefs): void {
  try {
    localStorage.setItem(
      HABIT_KEY,
      JSON.stringify({ ...p, freezesUsed: p.freezesUsed.slice(-90) })
    );
  } catch {
    /* storage unavailable — habits simply aren't persisted */
  }
}

export type WeekDayState = "active" | "bridged" | "today" | "inactive";
export type WeekDay = { key: string; label: string; state: WeekDayState };

export type HabitView = {
  /** Consecutive active days in the current run (bridged days keep the run alive but don't count). */
  streak: number;
  /** Freezes currently held. */
  freezes: number;
  /** True when the run touches today or yesterday (streak is alive). */
  alive: boolean;
  /** Local dayKey of yesterday — used for "covered by a freeze" microcopy. */
  yesterdayKey: string;
  /** True when yesterday was bridged by a freeze (transparent auto-apply). */
  bridgedYesterday: boolean;
  /** True when the run just completed a 7-day week (earned a freeze this computation). */
  earnedFreezeNow: boolean;
  /** Whole days of the current run remaining until the next freeze (null when not earning). */
  daysToNextFreeze: number | null;
  /** Last 7 local days, oldest first — the dossier's week strip. */
  week: WeekDay[];
  goal: number;
  answeredToday: number;
  goalMet: boolean;
};

/**
 * Read the learner's habit state, applying the streak rules transparently:
 * freeze auto-bridges, weekly freeze earnings. PERSISTS the result —
 * call it once per render cycle, not from multiple places (spending is
 * idempotent per dayKey, but a second caller would re-trigger earn checks).
 *
 * Rules:
 * - The run anchors on the most recent active day that is today or yesterday.
 * - Yesterday may be freeze-bridged ONLY when there is an active day behind it
 *   (a freeze that saves nothing is never spent).
 * - Older gaps are bridged only when freezes cover every missed day in the gap;
 *   otherwise the run ends and no freeze is burned on the lost gap.
 * - Only days strictly before today may be bridged — today is never "missed"
 *   until it ends.
 * - A freeze is earned per completed 7-day week, capped at MAX_FREEZES held.
 */
export function computeHabit(dayKeys: string[], answeredToday: number): HabitView {
  const prefs = loadHabit();
  const days = new Set(dayKeys);
  const today = new Date();
  const todayKey = dayKeyLocal(today);
  const yesterdayKey = shiftDayKey(todayKey, -1);
  const dayBeforeYesterdayKey = shiftDayKey(todayKey, -2);
  const used = new Set(prefs.freezesUsed);
  let freezes = prefs.freezes;
  let lastEarnMilestone = prefs.lastEarnMilestone;
  let earnedFreezeNow = false;

  let streak = 0;
  let alive = false;
  let anchorKey: string | null = null;

  if (days.has(todayKey)) {
    anchorKey = todayKey;
    streak = 1;
    alive = true;
  } else if (days.has(yesterdayKey)) {
    anchorKey = yesterdayKey;
    streak = 1;
    alive = true;
  } else if (freezes > 0 && !used.has(yesterdayKey) && days.has(dayBeforeYesterdayKey)) {
    // Yesterday is over and missed; the freeze covers it and connects to the run behind.
    freezes -= 1;
    used.add(yesterdayKey);
    anchorKey = dayBeforeYesterdayKey;
    streak = 1;
    alive = true;
  }

  if (anchorKey) {
    // Walk older active days, newest first; bridge a gap only when every
    // missed day in it can be covered.
    const older = [...days].filter((k) => k < anchorKey).sort().reverse();
    let prevKey = anchorKey;
    for (const k of older) {
      const missed: string[] = [];
      let c = shiftDayKey(prevKey, -1);
      while (c > k) {
        missed.push(c);
        c = shiftDayKey(c, -1);
      }
      const unbridged = missed.filter((m) => m < todayKey && !used.has(m));
      if (unbridged.length <= freezes) {
        for (const m of unbridged) {
          freezes -= 1;
          used.add(m);
        }
        streak += 1;
        prevKey = k;
        continue;
      }
      break;
    }
  }

  // A broken run resets the earn clock: the next completed 7-day week earns
  // again, matching "every completed 7-day week earns +1".
  if (!alive) lastEarnMilestone = 0;

  // Earn a freeze per completed 7-day week, capped at MAX_FREEZES held.
  const milestone = Math.floor(streak / FREEZE_EARN_EVERY) * FREEZE_EARN_EVERY;
  while (lastEarnMilestone < milestone && freezes < MAX_FREEZES) {
    freezes += 1;
    lastEarnMilestone += FREEZE_EARN_EVERY;
    earnedFreezeNow = true;
  }

  // The dossier's week strip: last 7 local days, oldest first.
  const week: WeekDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const key = shiftDayKey(todayKey, -i);
    const [y, m, d] = key.split("-").map(Number);
    const label = new Date(y, m - 1, d)
      .toLocaleDateString("en-IN", { weekday: "short" })
      .slice(0, 2);
    const state: WeekDayState = days.has(key)
      ? "active"
      : key === todayKey
        ? "today"
        : used.has(key)
          ? "bridged"
          : "inactive";
    week.push({ key, label, state });
  }

  saveHabit({ goal: prefs.goal, freezes, freezesUsed: [...used], lastEarnMilestone });

  const goal = prefs.goal;
  const daysToNextFreeze =
    alive && streak > 0 && freezes < MAX_FREEZES
      ? FREEZE_EARN_EVERY - (streak % FREEZE_EARN_EVERY)
      : null;
  return {
    streak,
    freezes,
    alive,
    yesterdayKey,
    bridgedYesterday: used.has(yesterdayKey) && !days.has(yesterdayKey),
    earnedFreezeNow,
    daysToNextFreeze,
    week,
    goal,
    answeredToday,
    goalMet: answeredToday >= goal,
  };
}

/* ------------------------------------------------------------------ */
/* Challenge-of-the-day: deterministic seeded selection                */
/* ------------------------------------------------------------------ */

/** FNV-1a hash of a date string → 32-bit seed. Same date, same set, everywhere. */
export function dateSeed(dateKey: string): number {
  let h = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Pick a deterministic daily set, interleaved across topics (round-robin after
 * a seeded shuffle within each topic) — learning-science rule: interleave
 * problem types, don't block-practice one skill.
 */
export function pickDailyChallenge<T extends { topic: string }>(
  items: T[],
  dateKey: string,
  n: number = CHALLENGE_SIZE
): T[] {
  const rand = mulberry32(dateSeed(dateKey));
  const byTopic = new Map<string, T[]>();
  for (const item of items) {
    const list = byTopic.get(item.topic) ?? [];
    list.push(item);
    byTopic.set(item.topic, list);
  }
  const topics = [...byTopic.keys()].sort();
  for (const t of topics) {
    const list = byTopic.get(t)!;
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
  }
  const picked: T[] = [];
  let round = 0;
  while (picked.length < n) {
    let added = false;
    for (const t of topics) {
      const list = byTopic.get(t)!;
      if (round < list.length && picked.length < n) {
        picked.push(list[round]);
        added = true;
      }
    }
    if (!added) break;
    round += 1;
  }
  return picked;
}
