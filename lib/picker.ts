/**
 * Homepage exam-goal picker — SERVER-ONLY data layer (never imported by client
 * components; the client picker receives plain serialized props).
 *
 * Portal-doctrine moves 8 + 10 (frictionless entry, discovery at scale):
 * one honest "live pilot" program plus the research pipeline behind it.
 * All figures are computed from the build's own content files at build time —
 * nothing hardcoded, so new question batches update the homepage counts
 * automatically (move 9: content as versioned data).
 *
 * Honesty rules:
 * - Only the practiceReady exam (JFT-Basic) is "live". Everything else is a
 *   research pipeline with DRAFT question counts (draft-pending-SME-review).
 * - Research rows link to /exams/catalog/[id] only when that page exists
 *   (catalog_id present AND in the exam-catalog data); otherwise to the
 *   catalog directory. Never render a link that 404s.
 * - Exam titles come verbatim from each course.json title field.
 * - Sync fs reads at module scope: prerender-safe (no uncached async I/O).
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getExamById } from "./catalog";

export type PickerExam = {
  /** curriculum slug, e.g. "upsc-cse" */
  slug: string;
  /** verbatim course.json title */
  title: string;
  /** catalog code shown in mono, e.g. "EX-186"; undefined when unknown */
  code?: string;
  /** honest research category shown as the tab label */
  category: string;
  /** draft question count computed from questions-*.json files */
  draftQuestions: number;
  /** where the row links: per-exam research page if it exists, else /exams/catalog */
  href: string;
};

export type PickerData = {
  /** the single practiceReady program */
  live: { name: string; href: string };
  /** research-pipeline exams, grouped by category */
  categories: { label: string; exams: PickerExam[] }[];
  /** total draft questions across all research exams */
  totalDraftQuestions: number;
  /** total research exams */
  totalResearchExams: number;
};

const CURRICULUM_DIR = join(process.cwd(), "content", "curriculum");

/* Curriculum slug -> honest homepage category tab. */
const CATEGORY_OF: Record<string, string> = {
  "upsc-cse": "India",
  "ssc-cgl": "India",
  "jee-main": "India",
  "neet-ug": "India",
  "cat-india": "India",
  "ielts-academic": "Languages",
  sat: "Grad & Admissions",
  "gre-general": "Grad & Admissions",
  "cfa-level-1": "Finance",
  "aws-saa": "Tech",
};

const CATEGORY_ORDER = ["India", "Languages", "Grad & Admissions", "Finance", "Tech"];

/* Catalog code comes from each course.json's catalog_id field (data, not code) —
   a missing id means no code cell, never a wrong link. */
function catalogIdFor(slug: string): string | undefined {
  try {
    const course = JSON.parse(readFileSync(join(CURRICULUM_DIR, slug, "course.json"), "utf8"));
    if (typeof course.catalog_id === "string" && course.catalog_id.trim()) return course.catalog_id.trim();
  } catch {
    /* missing/unreadable course.json: no code shown, row still listed honestly */
  }
  return undefined;
}

function countDraftQuestions(slug: string): number {
  let total = 0;
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(p);
      } else if (entry.isFile() && entry.name.startsWith("questions-") && entry.name.endsWith(".json")) {
        try {
          const data = JSON.parse(readFileSync(p, "utf8"));
          if (Array.isArray(data)) total += data.length;
        } catch {
          /* a malformed batch must not break the homepage build */
        }
      }
    }
  };
  try {
    walk(join(CURRICULUM_DIR, slug));
  } catch {
    /* missing dir: 0, still listed honestly */
  }
  return total;
}

function researchHref(slug: string): string {
  /* Exams with a course.json get the full template page; the rest stay on
     their honest catalog research entries. */
  try {
    readFileSync(join(CURRICULUM_DIR, slug, "course.json"), "utf8");
    return `/exams/${slug}`;
  } catch {
    /* no course.json — fall through to catalog */
  }
  const catalogId = catalogIdFor(slug);
  if (catalogId && getExamById(catalogId)) return `/exams/catalog/${catalogId}`;
  return "/exams/catalog";
}

function researchTitle(slug: string): string {
  try {
    const course = JSON.parse(readFileSync(join(CURRICULUM_DIR, slug, "course.json"), "utf8"));
    if (typeof course.title === "string" && course.title.trim()) return course.title.trim();
  } catch {
    /* fall through */
  }
  return slug;
}

function buildPickerData(): PickerData {
  const slugs = Object.keys(CATEGORY_OF).filter((s) => s !== "jft-basic");
  const exams: PickerExam[] = slugs.map((slug) => ({
    slug,
    title: researchTitle(slug),
    code: catalogIdFor(slug),
    category: CATEGORY_OF[slug],
    draftQuestions: countDraftQuestions(slug),
    href: researchHref(slug),
  }));
  const categories = CATEGORY_ORDER.map((label) => ({
    label,
    exams: exams.filter((e) => e.category === label),
  })).filter((c) => c.exams.length > 0);
  return {
    live: { name: "JFT-Basic", href: "/exams/jft-basic" },
    categories,
    totalDraftQuestions: exams.reduce((t, e) => t + e.draftQuestions, 0),
    totalResearchExams: exams.length,
  };
}

export const PICKER_DATA: PickerData = buildPickerData();
