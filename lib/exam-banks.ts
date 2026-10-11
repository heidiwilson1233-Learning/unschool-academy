/**
 * Exam-bank loader — the exam-agnostic practice delivery layer.
 *
 * SERVER-ONLY module: reads content files with `node:fs`. It must NEVER be
 * imported by a client component — answer keys live in these files, and a
 * client import would bundle them. (Deliberately no `server-only` package
 * dependency: the repo has no lockfile; the discipline is enforced by the
 * layering rule in `lib/question-bank.ts` plus grep-review. If you add it
 * to a client module, `next build` will still succeed — so DON'T.)
 *
 * Portal-doctrine move 9 (content as versioned data): any exam that drops
 * skill-tagged `questions-*.json` batches under
 * `content/curriculum/<exam-id>/units/<unit>/` gets a working practice bank
 * with zero code changes. Delivery (`/api/practice/*`, the generic
 * `app/exams/[exam]/practice` routes) reads through this module; authoring
 * is just files in git (freeCodeCamp pattern); discovery stays in
 * `lib/exam-template.ts`.
 *
 * This REPLACES the hardcoded delivery path (`/api/practice/*` importing the
 * JFT-Basic instance module `lib/practice.ts`). That module remains the
 * JFT-Basic curated instance — frozen mock sets, diagnostic bank — but it is
 * no longer the practice API's data source.
 *
 * Design notes (from the billion-dollar portals):
 * - Khan Academy's Perseus: exercises are JSON + a widget registry; the
 *   renderer only renders types in the registry. Same contract here:
 *   `createQuestionBank` validates every batch against KNOWN_TYPES and the
 *   unit's skill taxonomy, so a bad batch fails at first request (and the
 *   prebuild gate `scripts/validate-curriculum.mjs` fails the build before
 *   that).
 * - Duolingo: course -> skill tree -> skills -> lessons -> challenges, with
 *   stable ids. Same hierarchy: exam -> units -> skills -> batches; question
 *   ids are namespaced per exam, so banks never collide.
 * - Open edX: authoring, delivery, and discovery are separate systems.
 *   Content changes land via redeploy (versioned data) — the in-memory cache
 *   below is stamped at process start and never invalidated at runtime.
 *
 * HONESTY: the review status shown to learners comes from course.json
 * `review_status` (default "draft — pending SME review"). It is never
 * invented here.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  bankUnitFromJson,
  createQuestionBank,
  type BankBatchInput,
  type QuestionBank,
} from "@/lib/question-bank";

const CURRICULUM_DIR = path.join(process.cwd(), "content", "curriculum");
const EXAM_ID_RE = /^[a-z0-9-]+$/;
const DEFAULT_REVIEW_STATUS = "draft — pending SME review";

type CourseMeta = {
  title?: unknown;
  skill_labels?: unknown;
  review_status?: unknown;
};

function readJson(file: string): unknown | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as unknown;
  } catch {
    return null;
  }
}

function asStringRecord(v: unknown): Record<string, string> | undefined {
  if (!v || typeof v !== "object" || Array.isArray(v)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
    if (typeof val === "string") out[k] = val;
  }
  return out;
}

/**
 * Slugs of every exam that ships at least one practice question batch.
 * Used for static params and for the exam template's practice-cell gating.
 */
export function listPracticeExams(): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(CURRICULUM_DIR);
  } catch {
    return [];
  }
  return entries.filter((e) => hasExamBank(e)).sort();
}

/** Cheap presence check: does this exam have any practice question batches? */
export function hasExamBank(examId: string): boolean {
  if (!EXAM_ID_RE.test(examId)) return false;
  const unitsDir = path.join(CURRICULUM_DIR, examId, "units");
  let unitDirs: string[] = [];
  try {
    unitDirs = readdirSync(unitsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return false;
  }
  for (const ud of unitDirs) {
    let files: string[] = [];
    try {
      files = readdirSync(path.join(unitsDir, ud));
    } catch {
      continue;
    }
    if (
      files.some(
        (f) =>
          f.startsWith("questions-") &&
          f.endsWith(".json") &&
          !f.startsWith("questions-diagnostic-")
      )
    ) {
      return true;
    }
  }
  return false;
}

/* Cache: content is versioned data — a deploy carries new content, so the
 * bank is built once per process and never invalidated at runtime. */
const bankCache = new Map<string, QuestionBank | null>();

/**
 * The validated practice bank for one exam, or null when the exam is
 * unknown / has no practice batches. Throws ONLY on content defects
 * (same fail-fast contract as the JFT module-load path it replaces).
 */
export function getExamBank(examId: string): QuestionBank | null {
  if (!EXAM_ID_RE.test(examId)) return null;
  if (bankCache.has(examId)) return bankCache.get(examId) ?? null;
  const bank = buildBank(examId);
  bankCache.set(examId, bank);
  return bank;
}

function buildBank(examId: string): QuestionBank | null {
  const examDir = path.join(CURRICULUM_DIR, examId);
  const course = readJson(path.join(examDir, "course.json")) as CourseMeta | null;
  if (!course) return null;

  const unitsDir = path.join(examDir, "units");
  let unitDirs: string[] = [];
  try {
    unitDirs = readdirSync(unitsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return null;
  }

  const batches: BankBatchInput[] = [];
  const orderOf = new Map<string, number>();
  for (const ud of unitDirs) {
    const unitDir = path.join(unitsDir, ud);
    const unitJson = readJson(path.join(unitDir, "unit.json")) as {
      id: string;
      title: string;
      skills: unknown;
      order?: unknown;
    } | null;
    if (!unitJson || typeof unitJson.id !== "string") continue;
    orderOf.set(
      unitJson.id,
      typeof unitJson.order === "number" ? unitJson.order : Number.MAX_SAFE_INTEGER
    );
    let files: string[] = [];
    try {
      files = readdirSync(unitDir)
        .filter(
          (f) =>
            f.startsWith("questions-") &&
            f.endsWith(".json") &&
            !f.startsWith("questions-diagnostic-")
        )
        .sort();
    } catch {
      continue;
    }
    const unit = bankUnitFromJson(unitJson);
    for (const f of files) {
      const raw = readJson(path.join(unitDir, f));
      if (raw) batches.push({ unit, raw });
    }
  }
  if (batches.length === 0) return null;

  /* Units render in curriculum order (unit.json `order`), then directory
   * name — this reproduces the JFT-Basic registration order exactly. */
  batches.sort((a, b) => {
    const oa = orderOf.get(a.unit.id) ?? Number.MAX_SAFE_INTEGER;
    const ob = orderOf.get(b.unit.id) ?? Number.MAX_SAFE_INTEGER;
    if (oa !== ob) return oa - ob;
    if (a.unit.id !== b.unit.id) return a.unit.id.localeCompare(b.unit.id);
    return 0;
  });

  return createQuestionBank(examId, batches, {
    skillLabels: asStringRecord(course.skill_labels),
  });
}

export type ExamPracticeMeta = {
  examId: string;
  examTitle: string;
  reviewStatus: string;
  units: {
    id: string;
    title: string;
    questionCount: number;
    skillCount: number;
    skills: { id: string; label: string; count: number }[];
  }[];
  questionCount: number;
};

/** Presentation metadata for the practice surfaces — counts only, never questions. */
export function getExamPracticeMeta(examId: string): ExamPracticeMeta | null {
  const bank = getExamBank(examId);
  if (!bank) return null;
  const course = readJson(
    path.join(CURRICULUM_DIR, examId, "course.json")
  ) as CourseMeta | null;
  const reviewStatus =
    typeof course?.review_status === "string" && course.review_status.length > 0
      ? course.review_status
      : DEFAULT_REVIEW_STATUS;
  const examTitle =
    typeof course?.title === "string" && course.title.length > 0
      ? course.title
      : examId;
  const units = Object.values(bank.units).map((u) => {
    const qs = bank.questions.filter((q) => q.topic === u.title);
    const perSkill = new Map<string, { label: string; count: number }>();
    for (const q of qs) {
      const cur = perSkill.get(q.skill) ?? { label: q.skillLabel, count: 0 };
      cur.count += 1;
      perSkill.set(q.skill, cur);
    }
    return {
      id: u.id,
      title: u.title,
      questionCount: qs.length,
      skillCount: perSkill.size,
      skills: [...perSkill.entries()].map(([id, s]) => ({
        id,
        label: s.label,
        count: s.count,
      })),
    };
  });
  return {
    examId,
    examTitle,
    reviewStatus,
    units,
    questionCount: bank.questionCount,
  };
}
