/**
 * Mastery computation — pure functions, client-safe (no JSX, no answer keys).
 *
 * Portal-doctrine move 3 (mastery dashboards): per-skill mastery levels from
 * skill-tagged attempts stored on this device ("ua-attempts"). Exam-agnostic:
 * callers pass the skill list; thresholds are documented below and disclosed
 * on the mastery page so learners see exactly what each level means.
 *
 * Levels (doctrine rule 6: mastery-gated progression, regression allowed).
 * Thresholds are scaled to the pilot bank (~6 questions per skill across 11
 * skills): the diagnostic gives 1 attempt per skill, a full practice pass
 * adds ~6 more. Requiring 10+/20+ attempts would make the top rungs
 * mathematically unreachable on distinct questions — the ladder must be
 * climbable, not decorative.
 *   not-started  — no attempts yet
 *   attempted    — 1+ attempts
 *   familiar     — 3+ attempts and accuracy >= 60%
 *   proficient   — 5+ attempts and accuracy >= 80%
 *   mastered     — 8+ attempts and accuracy >= 80%
 *
 * Regression is allowed by design: levels recompute from ALL attempts, so a
 * string of misses lowers accuracy and drops the level back down. No "crack"
 * gimmicks — the number is always honest.
 */

export type MasteryLevel = "not-started" | "attempted" | "familiar" | "proficient" | "mastered";

export const MASTERY_LEVEL_ORDER: MasteryLevel[] = [
  "not-started",
  "attempted",
  "familiar",
  "proficient",
  "mastered",
];

/** Rank order: 0 = not-started ... 4 = mastered. */
export const MASTERY_RANK: Record<MasteryLevel, number> = {
  "not-started": 0,
  attempted: 1,
  familiar: 2,
  proficient: 3,
  mastered: 4,
};

export const MASTERY_LEVEL_NAMES: Record<MasteryLevel, string> = {
  "not-started": "Not started",
  attempted: "Attempted",
  familiar: "Familiar",
  proficient: "Proficient",
  mastered: "Mastered",
};

export const MASTERY_LEVELS: { id: MasteryLevel; name: string; minAttempts: number; minAccuracy: number }[] = [
  { id: "mastered", name: "Mastered", minAttempts: 8, minAccuracy: 0.8 },
  { id: "proficient", name: "Proficient", minAttempts: 5, minAccuracy: 0.8 },
  { id: "familiar", name: "Familiar", minAttempts: 3, minAccuracy: 0.6 },
  { id: "attempted", name: "Attempted", minAttempts: 1, minAccuracy: 0 },
];

export type SkillAttempts = { correct: number; total: number };

export type SkillMastery = {
  level: MasteryLevel;
  /** Rank order: 0 = not-started ... 4 = mastered. */
  rank: number;
  correct: number;
  total: number;
  /** Accuracy as a fraction (0..1), null when nothing attempted. */
  accuracy: number | null;
};

export function levelFor(correct: number, total: number): MasteryLevel {
  if (total < 1) return "not-started";
  const accuracy = correct / total;
  for (const l of MASTERY_LEVELS) {
    if (total >= l.minAttempts && accuracy >= l.minAccuracy) return l.id;
  }
  return "attempted";
}

export function computeMastery(tallies: Record<string, SkillAttempts>): Record<string, SkillMastery> {
  const out: Record<string, SkillMastery> = {};
  for (const [skill, t] of Object.entries(tallies)) {
    const level = levelFor(t.correct, t.total);
    out[skill] = {
      level,
      rank: MASTERY_RANK[level],
      correct: t.correct,
      total: t.total,
      accuracy: t.total > 0 ? t.correct / t.total : null,
    };
  }
  return out;
}

/** The next rung up from a level, or null at mastered. */
export function nextLevelFor(level: MasteryLevel): MasteryLevel | null {
  const i = MASTERY_LEVEL_ORDER.indexOf(level);
  return i >= 0 && i < MASTERY_LEVEL_ORDER.length - 1 ? MASTERY_LEVEL_ORDER[i + 1] : null;
}

/**
 * How many more attempts a skill needs to reach its next level, assuming
 * they keep the accuracy gate. Only the attempt-count gap is computable —
 * the accuracy half depends on the learner, so the UI copy says "strong
 * attempts" honestly.
 */
export function attemptsToNext(m: SkillMastery): { level: MasteryLevel; remaining: number } | null {
  const next = nextLevelFor(m.level);
  if (!next) return null;
  const def = MASTERY_LEVELS.find((l) => l.id === next);
  if (!def) return null;
  return { level: next, remaining: Math.max(0, def.minAttempts - m.total) };
}

/** Attempts recorded by recordAttempt() — picks up per-skill results from the
 *  diagnostic (v2) and practice players. Shape kept deliberately loose: the
 *  mastery view must never crash on an old or partial record. */
export type StoredAttempt = {
  kind: string;
  at?: string;
  score?: number;
  total?: number;
  skills?: { skill: string; correct: number; total: number }[];
};

export function tallySkills(attempts: StoredAttempt[]): Record<string, SkillAttempts> {
  const tallies: Record<string, SkillAttempts> = {};
  for (const a of attempts) {
    for (const s of a.skills ?? []) {
      if (!s || typeof s.skill !== "string") continue;
      const t = tallies[s.skill] ?? { correct: 0, total: 0 };
      t.correct += Math.max(0, s.correct || 0);
      t.total += Math.max(0, s.total || 0);
      tallies[s.skill] = t;
    }
  }
  return tallies;
}

export type MasterySkillInput = {
  id: string;
  label: string;
  practiceSlug: string;
  section: string;
  level: string;
  levelName: string;
  sequence: number;
};

export type NextSkill = {
  skill: MasterySkillInput;
  mastery: SkillMastery | null;
  reason: string;
};

/**
 * The single best next move: the unmastered skill closest to its next level
 * (distance = remaining attempts, study order as tiebreak). Encouragement,
 * not guilt — the reason always names the quantified payoff of the next
 * rung. Regression-aware: if accuracy drops, the skill returns here instead
 * of being silently skipped.
 */
export function nextBestSkill(
  skills: MasterySkillInput[],
  mastery: Record<string, SkillMastery>
): NextSkill | null {
  let best: NextSkill | null = null;
  let bestScore = Infinity;
  for (const skill of skills) {
    const m = mastery[skill.id];
    const level = m?.level ?? "not-started";
    if (level === "mastered") continue;
    const remaining = m
      ? (attemptsToNext(m)?.remaining ?? 0)
      : 1; // one attempt moves not-started to attempted
    const score = remaining + skill.sequence / 1000;
    if (score < bestScore) {
      bestScore = score;
      const reason =
        !m || level === "not-started"
          ? "Not attempted yet — the curriculum places it here in your study order."
          : remaining === 0
            ? `Currently ${MASTERY_LEVEL_NAMES[level]} · ${Math.round((m.accuracy ?? 0) * 100)}% over ${m.total} ${m.total === 1 ? "attempt" : "attempts"} — one strong session at the gate could move it up.`
            : `Currently ${MASTERY_LEVEL_NAMES[level]} · ${Math.round((m.accuracy ?? 0) * 100)}% over ${m.total} ${m.total === 1 ? "attempt" : "attempts"} — about ${remaining} more strong ${remaining === 1 ? "attempt" : "attempts"} to reach ${MASTERY_LEVEL_NAMES[nextLevelFor(level) as MasteryLevel]}.`;
      best = { skill, mastery: m ?? null, reason };
    }
  }
  return best; // null = every skill mastered
}

export function masterySummary(mastery: Record<string, SkillMastery>, skillIds: string[]) {
  const mastered = skillIds.filter((id) => mastery[id]?.level === "mastered").length;
  const attempted = skillIds.filter((id) => mastery[id] && mastery[id].level !== "not-started").length;
  return { mastered, attempted, total: skillIds.length };
}
