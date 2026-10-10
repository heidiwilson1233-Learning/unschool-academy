/**
 * Unschool Academy — exam page template data layer (server-only).
 *
 * Reads `content/curriculum/<exam>/course.json` (+ units, question batches,
 * videos) and cross-references the research catalog (lib/catalog.ts) to
 * produce ONE uniform data shape for the exam page template at
 * app/exams/[exam]/page.tsx. Doctrine doc 12: identical template for every
 * exam — no exam gets special UI.
 *
 * HONESTY CONTRACT (never break):
 * - Only counts are exposed, never question objects/answer keys/explanations.
 *   Nothing in this module may be imported by a client component.
 * - Every section of the template is data-gated: missing course.json fields
 *   mean the section is omitted, never filled with invented copy.
 * - All question counts are labeled draft-pending-sme-review by the template.
 */

import { readFileSync, readdirSync, accessSync, constants as fsConstants } from "node:fs";
import path from "node:path";
import { getExamById as getCatalogExam } from "@/lib/catalog";

const CURRICULUM_DIR = path.join(process.cwd(), "content", "curriculum");
const APP_EXAMS_DIR = path.join(process.cwd(), "app", "exams");

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ExamUnitSkill {
  id: string;
  label: string;
}

export interface ExamUnitData {
  id: string;
  title: string;
  description: string;
  order: number;
  skills: ExamUnitSkill[];
  source: string | null;
  questionCount: number;
  levels: string[];
}

/** Verbatim course.json exam_pattern object (official test facts), or null. */
export type ExamPattern = Record<string, string | number | string[]> | null;

export interface ExamOffer {
  name: string;
  price: string;
  note: string;
}

export interface ExamCatalogRef {
  id: string;
  name: string;
  issuingBody: string;
  category: string;
  officialUrl: string | null;
}

export interface ExamFeatures {
  diagnostic: boolean;
  practice: boolean;
  mockTests: boolean;
  topics: boolean;
  syllabus: boolean;
  answers: boolean;
}

export type ExamStatus = "pilot" | "in-progress" | "draft-pending-sme-review" | "unknown";

export interface RelatedExam {
  slug: string;
  title: string;
}

export interface ExamPageData {
  slug: string;
  /** Verbatim course.json title. */
  title: string;
  description: string;
  status: ExamStatus;
  statusLabel: string;
  tier: string | null;
  estimatedHours: number | null;
  catalog: ExamCatalogRef | null;
  units: ExamUnitData[];
  /** Practice questions across all batches (all draft-pending-sme-review). Diagnostic items are counted separately. */
  questionCount: number;
  /** Diagnostic-bank questions (free funnel), counted separately from practice. */
  diagnosticCount: number;
  /** Distinct skill labels across units. */
  skillCount: number;
  /** Levels present in the bank, ordered L1..L4. */
  levels: string[];
  videoCount: number;
  examPattern: ExamPattern;
  /** Deduped source lines from course.json + units. */
  sources: string[];
  features: ExamFeatures;
  offers: ExamOffer[];
  /** Other template exams in the same catalog category (discovery). */
  related: RelatedExam[];
  /** True when the bank is too thin to index (SEO honesty). */
  thin: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

function exists(file: string): boolean {
  try {
    accessSync(file, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

const LEVEL_ORDER = ["L1", "L2", "L3", "L4"];

function sortLevels(levels: Set<string>): string[] {
  return [...levels].sort((a, b) => {
    const ia = LEVEL_ORDER.indexOf(a);
    const ib = LEVEL_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

const STATUS_LABELS: Record<ExamStatus, string> = {
  pilot: "Pilot",
  "in-progress": "In progress",
  "draft-pending-sme-review": "Draft — pending expert review",
  unknown: "In research",
};

function toStatus(raw: unknown): ExamStatus {
  return raw === "pilot" || raw === "in-progress" || raw === "draft-pending-sme-review"
    ? raw
    : "unknown";
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Slugs of every exam with a course.json — the template's static params. */
export function listExamSlugs(): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(CURRICULUM_DIR);
  } catch {
    return [];
  }
  const slugs: string[] = [];
  for (const e of entries) {
    if (exists(path.join(CURRICULUM_DIR, e, "course.json"))) slugs.push(e);
  }
  return slugs.sort();
}

export function getExamPageData(slug: string): ExamPageData | null {
  const course = readJson<Record<string, unknown>>(
    path.join(CURRICULUM_DIR, slug, "course.json")
  );
  if (!course || typeof course.title !== "string") return null;

  /* Units ---------------------------------------------------------- */
  const unitsDir = path.join(CURRICULUM_DIR, slug, "units");
  let unitDirs: string[] = [];
  try {
    unitDirs = readdirSync(unitsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    /* no units dir — page still renders, section omitted */
  }

  const units: ExamUnitData[] = [];
  const sources = new Set<string>();
  const allLevels = new Set<string>();
  let questionCount = 0;
  let diagnosticCount = 0;
  let videoCount = 0;

  const courseSource = typeof course.source === "string" ? course.source : null;
  if (courseSource) sources.add(courseSource);

  for (const ud of unitDirs.sort()) {
    const meta = readJson<{
      id?: string; title?: string; description?: string; order?: number;
      skills?: unknown; source?: string;
    }>(path.join(unitsDir, ud, "unit.json"));

    let files: string[] = [];
    try {
      files = readdirSync(path.join(unitsDir, ud));
    } catch {
      continue;
    }

    let unitQuestions = 0;
    const unitLevels = new Set<string>();
    for (const f of files) {
      const fp = path.join(unitsDir, ud, f);
      if (/^questions-.*\.json$/.test(f)) {
        const batch = readJson<unknown>(fp);
        const arr = Array.isArray(batch)
          ? batch
          : batch && typeof batch === "object" && Array.isArray((batch as { questions?: unknown }).questions)
            ? (batch as { questions: unknown[] }).questions
            : [];
        const isDiagnostic = f.startsWith("questions-diagnostic");
        if (isDiagnostic) {
          diagnosticCount += arr.length;
        } else {
          unitQuestions += arr.length;
        }
        for (const q of arr) {
          if (q && typeof q === "object") {
            const lvl = (q as { level?: unknown }).level;
            if (typeof lvl === "string" && lvl) {
              unitLevels.add(lvl);
              allLevels.add(lvl);
            }
          }
        }
      } else if (f === "videos.json") {
        const vids = readJson<unknown>(fp);
        if (Array.isArray(vids)) videoCount += vids.length;
      }
    }
    questionCount += unitQuestions;

    const rawSkills = meta?.skills;
    const skills: ExamUnitSkill[] = Array.isArray(rawSkills)
      ? rawSkills
          .map((s) => {
            if (typeof s === "string") return { id: s, label: humanizeSkill(s) };
            if (s && typeof s === "object") {
              const o = s as { id?: unknown; label?: unknown };
              const id = typeof o.id === "string" ? o.id : "";
              const label = typeof o.label === "string" ? o.label : humanizeSkill(id);
              return id ? { id, label } : null;
            }
            return null;
          })
          .filter((s): s is ExamUnitSkill => s !== null)
      : [];
    if (typeof meta?.source === "string" && meta.source) sources.add(meta.source);

    units.push({
      id: typeof meta?.id === "string" && meta.id ? meta.id : ud,
      title: typeof meta?.title === "string" && meta.title ? meta.title : humanizeSkill(ud),
      description: typeof meta?.description === "string" ? meta.description : "",
      order: typeof meta?.order === "number" ? meta.order : 999,
      skills,
      source: typeof meta?.source === "string" ? meta.source : null,
      questionCount: unitQuestions,
      levels: sortLevels(unitLevels),
    });
  }
  units.sort((a, b) => a.order - b.order);

  /* Catalog cross-reference ----------------------------------------- */
  let catalog: ExamCatalogRef | null = null;
  const catalogId = typeof course.catalog_id === "string" ? course.catalog_id : null;
  if (catalogId) {
    const entry = getCatalogExam(catalogId);
    if (entry) {
      catalog = {
        id: entry.id,
        name: entry.exam_or_track,
        issuingBody: entry.issuing_body,
        category: entry.category,
        officialUrl: entry.official_directory_url || null,
      };
    }
  }

  /* Deep-route features (only what exists on disk is linked) -------- */
  const feature = (name: string) =>
    exists(path.join(APP_EXAMS_DIR, slug, name, "page.tsx"));
  const features: ExamFeatures = {
    diagnostic: feature("diagnostic"),
    practice: feature("practice"),
    mockTests: feature("mock-tests"),
    topics: feature("topics"),
    syllabus: feature("syllabus"),
    answers: feature("answers"),
  };

  /* Offers — MD-backed prices only, declared in course.json --------- */
  const offers: ExamOffer[] = Array.isArray(course.offers)
    ? course.offers
        .map((o) => {
          if (!o || typeof o !== "object") return null;
          const r = o as Record<string, unknown>;
          if (typeof r.name !== "string" || typeof r.price !== "string") return null;
          return {
            name: r.name,
            price: r.price,
            note: typeof r.note === "string" ? r.note : "",
          };
        })
        .filter((o): o is ExamOffer => o !== null)
    : [];

  /* Exam pattern — verbatim structured object, or null -------------- */
  const rawPattern = course.exam_pattern;
  const examPattern: ExamPattern =
    rawPattern && typeof rawPattern === "object" && !Array.isArray(rawPattern)
      ? (rawPattern as ExamPattern)
      : null;

  const skillCount = new Set(units.flatMap((u) => u.skills.map((s) => s.id))).size;
  const status = toStatus(course.status);

  /* Related exams: same catalog category, other curriculum slugs only. --- */
  const related: RelatedExam[] = [];
  if (catalog) {
    let siblings: string[] = [];
    try {
      siblings = readdirSync(CURRICULUM_DIR).filter(
        (e) => e !== slug && exists(path.join(CURRICULUM_DIR, e, "course.json"))
      );
    } catch {
      siblings = [];
    }
    for (const sib of siblings) {
      const sibCourse = readJson<{ title?: unknown; catalog_id?: unknown }>(
        path.join(CURRICULUM_DIR, sib, "course.json")
      );
      if (!sibCourse) continue;
      const sibCatalogId =
        typeof sibCourse.catalog_id === "string" ? sibCourse.catalog_id : null;
      if (!sibCatalogId) continue;
      const sibEntry = getCatalogExam(sibCatalogId);
      if (
        sibEntry &&
        sibEntry.category === catalog.category &&
        typeof sibCourse.title === "string"
      ) {
        related.push({ slug: sib, title: sibCourse.title });
      }
    }
    related.sort((a, b) => a.title.localeCompare(b.title));
  }

  return {
    slug,
    title: course.title,
    description: typeof course.description === "string" ? course.description : "",
    status,
    statusLabel: STATUS_LABELS[status],
    tier: typeof course.tier === "string" ? course.tier : null,
    estimatedHours:
      typeof course.estimated_hours === "number" ? course.estimated_hours : null,
    catalog,
    units,
    questionCount,
    diagnosticCount,
    skillCount,
    levels: sortLevels(allLevels),
    videoCount,
    examPattern,
    sources: [...sources],
    features,
    offers,
    related: related.slice(0, 4),
    thin: questionCount === 0,
  };
}

function humanizeSkill(id: string): string {
  return id
    .split(/[-_]/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}
