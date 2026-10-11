// Shared client-side helpers for the quiz players.
// Pure functions + browser API guards — no JSX, safe to import from any "use client" module.
export function speakJapanese(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export type AttemptSkill = { skill: string; correct: number; total: number };

export function recordAttempt(entry: {
  kind: string;
  /**
   * Exam this session belonged to (e.g. "jft-basic"). Stored so per-exam
   * analytics (mastery, smart-pick) never mix two exams' skill tallies.
   * Absent on entries written before run 65 — readers must default to
   * "jft-basic".
   */
  exam?: string;
  topic?: string;
  score: number;
  total: number;
  at: string;
  /** Per-skill results, when the attempt produced them (diagnostic v2) — feeds mastery views. */
  skills?: AttemptSkill[];
  /** Content payload version the learner saw (e.g. "practice-v2-curriculum") — per content-schema rule 4. */
  contentVersion?: string;
  /**
   * Question ids the learner missed this session — feeds the error-log
   * review deck (answers portal). Capped to the last 30 ids so the
   * localStorage payload stays small on low-end devices.
   */
  misses?: string[];
  /**
   * Previously-missed question ids answered correctly in this session —
   * the resolution signal that lets the review deck clear items
   * (encouragement: the deck shrinks as you learn). Capped like misses.
   */
  cleared?: string[];
}) {
  try {
    const key = "ua-attempts";
    // Defensive: a corrupted or non-array payload (any valid JSON that isn't
    // an array) must not break every future save — reset to [] instead.
    const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
    const prev: unknown[] = Array.isArray(parsed) ? parsed : [];
    const cap = (ids: string[] | undefined) => {
      const kept = (ids ?? []).slice(-30);
      return kept.length > 0 ? kept : undefined;
    };
    const entryToStore = { ...entry, misses: cap(entry.misses), cleared: cap(entry.cleared) };
    if (!entryToStore.misses) delete entryToStore.misses;
    if (!entryToStore.cleared) delete entryToStore.cleared;
    prev.push(entryToStore);
    localStorage.setItem(key, JSON.stringify(prev.slice(-50)));
  } catch {
    /* storage unavailable — session simply isn't saved */
  }
}
