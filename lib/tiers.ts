/**
 * Unschool Academy — exam tier rollout plan (MD doc 11, content strategy).
 *
 * Tier 1 = the 50 exams chosen to build first (pinned 2026-10-10 in
 * improvement-drive/state.json → tier1_exams). Tier 2/3 have no published
 * exam assignments yet — only volume targets. This module is the SSOT for
 * the tier list; pages must never hardcode the 50 names.
 *
 * Honesty model: demand_rank "Tier 1" in the MD is a tier label, NOT an
 * intra-tier demand ordering. Rows render grouped by category, never ranked.
 */

import tiers from "@/content/exam-catalog/tiers.json";
import { getExamById, getPublicStatus, type ExamEntry } from "@/lib/catalog";

export interface TierDefinition {
  exams: number;
  criteria: string;
  note?: string;
  per_exam: { questions: number; lessons: number | string; mocks: number };
}

const TIERS_JSON = tiers as {
  tiers: Record<"1" | "2" | "3", TierDefinition>;
  tier1_ids: string[];
  tier1_exam_pages: Record<string, string>;
  volume_targets: {
    tier1_questions: number;
    tier2_questions: number;
    tier3_questions: number;
    total_questions: number;
  };
  honest_rate: { questions_per_day: number; tier1_question_weeks: number };
};

export const TIER_DEFINITIONS = TIERS_JSON.tiers;
export const VOLUME_TARGETS = TIERS_JSON.volume_targets;
export const HONEST_RATE = TIERS_JSON.honest_rate;
export const TIER1_IDS: readonly string[] = TIERS_JSON.tier1_ids;

export interface Tier1Row {
  id: string;
  entry: ExamEntry;
  /** practice-ready | verified | research | retired — matches catalog badges */
  status: ReturnType<typeof getPublicStatus>;
  /** Real destination where one exists, else the catalog. */
  href: string;
  /** Whether the row has a real exam-page destination (for JSON-LD url). */
  hasExamPage: boolean;
}

const TIER1_EXAM_PAGES = TIERS_JSON.tier1_exam_pages;

/** Resolve the 50 Tier-1 ids against the catalog. Category-grouped input order is preserved. */
export function getTier1Rows(): Tier1Row[] {
  return TIER1_IDS.map((id) => {
    const entry = getExamById(id);
    if (!entry) {
      throw new Error(
        `[tiers] Tier-1 id ${id} does not resolve in the catalog — add a research row before publishing.`
      );
    }
    const href = TIER1_EXAM_PAGES[id] ?? "/exams/catalog";
    return {
      id,
      entry,
      status: getPublicStatus(entry),
      href,
      hasExamPage: Boolean(TIER1_EXAM_PAGES[id]),
    };
  });
}

/** Build-time integrity: all 50 ids resolve and none are retired/renamed. */
export function assertTier1Integrity(): Tier1Row[] {
  const rows = getTier1Rows();
  if (rows.length !== 50) {
    throw new Error(`[tiers] expected 50 Tier-1 rows, got ${rows.length}`);
  }
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.id)) throw new Error(`[tiers] duplicate Tier-1 id ${r.id}`);
    seen.add(r.id);
    if (r.status === "retired") {
      throw new Error(`[tiers] Tier-1 id ${r.id} is retired/renamed — remove or replace.`);
    }
  }
  return rows;
}

/** Category groups in catalog order, exams alphabetical within each group. */
export function groupTier1ByCategory(rows: Tier1Row[]): { category: string; rows: Tier1Row[] }[] {
  const groups = new Map<string, Tier1Row[]>();
  for (const r of rows) {
    const list = groups.get(r.entry.category) ?? [];
    list.push(r);
    groups.set(r.entry.category, list);
  }
  return [...groups.entries()].map(([category, list]) => ({
    category,
    rows: [...list].sort((a, b) => a.entry.exam_or_track.localeCompare(b.entry.exam_or_track)),
  }));
}

/** Honest computed counts for the Tier-1 list (never hardcode on a page). */
export function tier1StatusCounts(rows: Tier1Row[]): {
  practiceReady: number;
  verified: number;
  research: number;
} {
  return {
    practiceReady: rows.filter((r) => r.status === "practice-ready").length,
    verified: rows.filter((r) => r.status === "verified").length,
    research: rows.filter((r) => r.status === "research").length,
  };
}
