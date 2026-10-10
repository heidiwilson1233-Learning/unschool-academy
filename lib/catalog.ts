/**
 * Unschool Academy — Global Exam Catalog (500 research entries).
 *
 * Source: unschool_academy_blueprint/data/exam_opportunities_500.json
 * (500 rows, 500 unique IDs).
 *
 * HONESTY MODEL (per blueprint docs/04 and docs/06):
 * - Every entry is a RESEARCH entry by default. Nothing is advertised as
 *   active, official, available, or supported until individually verified.
 * - Only entries with verifiedAt set may show verified facts; only entries
 *   with practiceReady=true may link to practice/diagnostic/mocks.
 * - question_bank_status "Not authored" everywhere: we never imply questions
 *   exist for an exam that has none.
 */

import financeBusiness from "@/content/exam-catalog/categories/finance-business.json";
import globalGraduateEntry from "@/content/exam-catalog/categories/global-graduate-entry.json";
import healthcareLicensing from "@/content/exam-catalog/categories/healthcare-licensing.json";
import indiaEntranceGovernment from "@/content/exam-catalog/categories/india-entrance-government.json";
import internationalSecondary from "@/content/exam-catalog/categories/international-secondary.json";
import languages from "@/content/exam-catalog/categories/languages.json";
import lawTeachingPublic from "@/content/exam-catalog/categories/law-teaching-public.json";
import techCloud from "@/content/exam-catalog/categories/tech-cloud.json";
import tradesInternationalCareers from "@/content/exam-catalog/categories/trades-international-careers.json";
import usAdmissionsSchool from "@/content/exam-catalog/categories/us-admissions-school.json";

export interface ExamEntry {
  id: string; // EX-001 … EX-500
  category: string;
  region: string;
  exam_or_track: string;
  issuing_body: string;
  kind: string;
  exam_family: string;
  official_directory_url: string;
  validation_status: string;
  launch_status: string;
  demand_rank: string;
  question_bank_status: string;
}

/** Editorial overlay applied on top of the raw research row. */
export interface ExamOverlay {
  verifiedAt?: string; // ISO date of last verification pass
  verifiedFacts?: Record<string, string>; // section -> fact, sourced
  practiceReady?: boolean; // links to real practice/diagnostic/mocks
  practiceHref?: string;
  retiredOrRenamed?: string; // note when an exam is retired/renamed
}

export type PublicStatus = "practice-ready" | "verified" | "research" | "retired";

/* ------------------------------------------------------------------ */
/* Research validation overlay (2026-10-08 deep-research pass)          */
/* ------------------------------------------------------------------ */

export type ValidationFlag = "verified-active" | "needs-review" | "retired-or-renamed";

export interface ValidationOverlay {
  status: ValidationFlag;
  note: string;
}

// Per-exam validation flags from research/exam-catalog (10 category files,
// 2026-10-08). Bundled as JSON so detail pages can label retired/renamed
// exams honestly instead of presenting them as current.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const VALIDATION: { researched_at: string; exams: Record<string, { status: ValidationFlag; note: string; file: string }> } =
  require("@/content/exam-catalog/validation.json");

export function getValidation(id: string): ValidationOverlay | null {
  const v = VALIDATION.exams[id.trim().toUpperCase()];
  return v ? { status: v.status, note: v.note } : null;
}

/* ------------------------------------------------------------------ */
/* Raw catalog                                                         */
/* ------------------------------------------------------------------ */

const CATALOG = [
  ...(financeBusiness as ExamEntry[]),
  ...(globalGraduateEntry as ExamEntry[]),
  ...(healthcareLicensing as ExamEntry[]),
  ...(indiaEntranceGovernment as ExamEntry[]),
  ...(internationalSecondary as ExamEntry[]),
  ...(languages as ExamEntry[]),
  ...(lawTeachingPublic as ExamEntry[]),
  ...(techCloud as ExamEntry[]),
  ...(tradesInternationalCareers as ExamEntry[]),
  ...(usAdmissionsSchool as ExamEntry[]),
];

export function getAllExams(): ExamEntry[] {
  return CATALOG;
}

export function getExamById(id: string): ExamEntry | undefined {
  const needle = id.trim().toUpperCase();
  return CATALOG.find((e) => e.id.toUpperCase() === needle);
}

export function getExamsByCategory(category: string): ExamEntry[] {
  return CATALOG.filter((e) => e.category === category);
}

export function getCategories(): string[] {
  const seen: string[] = [];
  for (const e of CATALOG) if (!seen.includes(e.category)) seen.push(e.category);
  return seen;
}

export function getRegions(): string[] {
  const seen: string[] = [];
  for (const e of CATALOG) if (!seen.includes(e.region)) seen.push(e.region);
  return seen.sort();
}

export function getKinds(): string[] {
  const seen: string[] = [];
  for (const e of CATALOG) if (!seen.includes(e.kind)) seen.push(e.kind);
  return seen.sort();
}

/* ------------------------------------------------------------------ */
/* Category metadata                                                   */
/* ------------------------------------------------------------------ */

export interface CategoryMeta {
  slug: string;
  name: string;
  tagline: string;
  description: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  {
    slug: "finance-business",
    name: "Finance & Business",
    tagline: "Professional accountancy and finance qualifications",
    description:
      "The papers that build finance careers — ACCA, CIMA, US CPA, CFA, FRM and India CA, each tracked separately because every paper has its own syllabus, format and sittings.",
  },
  {
    slug: "global-graduate-entry",
    name: "Global Graduate & Entry",
    tagline: "Admissions tests for graduate and professional study",
    description:
      "The gatekeepers of graduate school — GRE, GMAT, CAT (India), MCAT, LSAT, UCAT and university-specific admissions assessments, each with its own format and scoring logic.",
  },
  {
    slug: "healthcare-licensing",
    name: "Healthcare & Licensing",
    tagline: "Medical, nursing and allied-health licensing exams",
    description:
      "Where the stakes are highest — USMLE, NCLEX, NAPLEX, PLAB, MRCP/MRCS and related credential exams, tracked stage by stage across jurisdictions.",
  },
  {
    slug: "india-entrance-government",
    name: "India Entrance & Government",
    tagline: "Indian entrance examinations, paper by paper",
    description:
      "India's great academic sorters: JEE, NEET, GATE papers, CUET subjects, BITSAT and state CETs. Tracked per paper, because no two papers test the same thing.",
  },
  {
    slug: "international-secondary",
    name: "International Secondary",
    tagline: "IGCSE, AS/A Level and IB Diploma subjects",
    description:
      "The world's classrooms, subject by subject — Cambridge IGCSE, International AS & A Level, and IB Diploma Programme courses at HL and SL.",
  },
  {
    slug: "languages",
    name: "Languages",
    tagline: "Language proficiency exams and official levels",
    description:
      "Proof you can actually communicate — IELTS, TOEFL, JLPT levels N1–N5, JFT-Basic, DELF/DALF, PTE and Cambridge English qualifications.",
  },
  {
    slug: "law-teaching-public",
    name: "Law, Teaching & Public Service",
    tagline: "Bar, securities, teaching and citizenship tests",
    description:
      "Bar examinations, securities licences, teaching credentials (CTET, UGC NET, Praxis) and citizenship tests — the exams that licence a practice or open the door to a country.",
  },
  {
    slug: "tech-cloud",
    name: "Tech & Cloud",
    tagline: "Cloud and IT certifications, exam by exam",
    description:
      "The credentials behind the cloud — AWS, CompTIA and Microsoft (Azure, Microsoft 365, Power Platform, Security) exams. Vendors retire and rename these often, so we verify status per exam.",
  },
  {
    slug: "trades-international-careers",
    name: "Trades & International Careers",
    tagline: "Trade assessments, aviation and safety credentials",
    description:
      "Skilled hands, certified — EASA Part-66 modules, FAA knowledge tests, NEBOSH, ServSafe and inspector credentials for careers that keep the world running.",
  },
  {
    slug: "us-admissions-school",
    name: "US Admissions & School",
    tagline: "SAT, ACT, AP subjects and US school exams",
    description:
      "America's admissions gauntlet — SAT, ACT, PSAT, CLEP and every AP subject tracked individually, because Calculus BC and Art History test nothing alike.",
  },
];

export function getCategoryMeta(slug: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.slug === slug);
}

export function getCategoryByName(name: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.name === name);
}

/* ------------------------------------------------------------------ */
/* Editorial overlays (verification state lives here, not in the CSV)   */
/* ------------------------------------------------------------------ */

/**
 * Exams with real, reviewed practice on the site. Everything else is a
 * research entry until the per-exam validation checklist passes.
 */
const OVERLAYS: Record<string, ExamOverlay> = {
  "EX-299": {
    verifiedAt: "2026-10-08",
    practiceReady: true,
    practiceHref: "/exams/jft-basic",
    verifiedFacts: {
      organizer: "Japan Foundation",
      format: "~50 questions, 60 minutes, computer-based (CBT)",
      sections: "Script and Vocabulary · Conversation and Expression · Listening Comprehension · Reading Comprehension",
      scoring: "Scaled score 10–250; A1 145–174 · A2.1 175–199 · A2.2 200–250",
    },
  },
};

export function getOverlay(id: string): ExamOverlay {
  return OVERLAYS[id.trim().toUpperCase()] ?? {};
}

export function getPublicStatus(entry: ExamEntry): PublicStatus {
  const o = getOverlay(entry.id);
  if (o.practiceReady) return "practice-ready";
  if (o.verifiedAt) return "verified";
  const v = getValidation(entry.id);
  if (v?.status === "retired-or-renamed") return "retired";
  if (v?.status === "verified-active") return "verified";
  return "research";
}

export function statusLabel(status: PublicStatus): string {
  switch (status) {
    case "practice-ready":
      return "Practice available";
    case "verified":
      return "Facts verified";
    case "retired":
      return "Retired / renamed";
    case "research":
      return "Research entry";
  }
}

/* ------------------------------------------------------------------ */
/* Search / filter                                                     */
/* ------------------------------------------------------------------ */

export interface CatalogFilters {
  query?: string;
  category?: string;
  region?: string;
  kind?: string;
  status?: PublicStatus | "all";
}

export function searchCatalog(filters: CatalogFilters): ExamEntry[] {
  const q = (filters.query ?? "").trim().toLowerCase();
  return CATALOG.filter((e) => {
    if (filters.category && e.category !== filters.category) return false;
    if (filters.region && e.region !== filters.region) return false;
    if (filters.kind && e.kind !== filters.kind) return false;
    if (filters.status && filters.status !== "all" && getPublicStatus(e) !== filters.status) return false;
    if (q) {
      const hay = `${e.id} ${e.exam_or_track} ${e.issuing_body} ${e.exam_family} ${e.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function kindLabel(kind: string): string {
  return kind
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ------------------------------------------------------------------ */
/* Catalog summary helpers (run 42 — honest counts, computed not hardcoded) */
/* ------------------------------------------------------------------ */

export interface CatalogStatusCounts {
  total: number;
  practiceReady: number;
  verified: number;
  research: number;
  retired: number;
}

/** Counts over the live catalog: every number on /exams/catalog comes from here. */
export function getCatalogStatusCounts(): CatalogStatusCounts {
  const counts: CatalogStatusCounts = {
    total: 0,
    practiceReady: 0,
    verified: 0,
    research: 0,
    retired: 0,
  };
  for (const e of CATALOG) {
    counts.total++;
    const st = getPublicStatus(e);
    if (st === "practice-ready") counts.practiceReady++;
    else if (st === "verified") counts.verified++;
    else if (st === "research") counts.research++;
    else counts.retired++;
  }
  return counts;
}

export interface PracticeReadyEntry {
  id: string;
  name: string;
  href: string;
}

/** Entries with real practice on the site (derived from OVERLAYS, never hardcoded). */
export function getPracticeReadyEntries(): PracticeReadyEntry[] {
  return Object.entries(OVERLAYS)
    .filter(([, o]) => o.practiceReady)
    .map(([id, o]) => {
      const entry = CATALOG.find((e) => e.id === id.toUpperCase());
      return { id, name: entry?.exam_or_track ?? id, href: o.practiceHref ?? examUrl(id) };
    });
}

export interface CategoryStatusCounts {
  total: number;
  verified: number;
  practiceReady: number;
  retired: number;
}

/** Per-category counts for the "Browse by category" ledger rows. */
export function getCategoryStatusCounts(categoryName: string): CategoryStatusCounts {
  const counts: CategoryStatusCounts = { total: 0, verified: 0, practiceReady: 0, retired: 0 };
  for (const e of getExamsByCategory(categoryName)) {
    counts.total++;
    const st = getPublicStatus(e);
    if (st === "practice-ready") counts.practiceReady++;
    else if (st === "verified") counts.verified++;
    else if (st === "retired") counts.retired++;
  }
  return counts;
}

/* ------------------------------------------------------------------ */
/* Client-safe row projection (run 42 perf)                             */
/*                                                                     */
/* lib/catalog.ts statically imports ~212KB of category JSON plus       */
/* ~100KB validation.json. The "use client" CatalogBrowser only needs  */
/* a slim projection with statuses precomputed server-side, so this    */
/* type + builder keep the dataset and validation notes out of the      */
/* client bundle (~65% smaller raw payload). Pure + serializable: safe  */
/* as RSC props into the client component.                             */
/* ------------------------------------------------------------------ */

export interface CatalogRow {
  id: string;
  categoryName: string;
  region: string;
  name: string;
  issuingBody: string;
  examFamily: string;
  kind: string;
  status: PublicStatus;
  statusLabel: string;
  href: string;
}

export function getCatalogRows(): CatalogRow[] {
  return CATALOG.map((e) => ({
    id: e.id,
    categoryName: e.category,
    region: e.region,
    name: e.exam_or_track,
    issuingBody: e.issuing_body,
    examFamily: e.exam_family,
    kind: kindLabel(e.kind),
    status: getPublicStatus(e),
    statusLabel: statusLabel(getPublicStatus(e)),
    href: examUrl(e.id),
  }));
}

/* ------------------------------------------------------------------ */
/* URLs                                                                */
/* ------------------------------------------------------------------ */

export function examUrl(id: string): string {
  return `/exams/catalog/${id.trim().toUpperCase()}`;
}

export function categoryUrl(slug: string): string {
  return `/exams/catalog/category/${slug}`;
}
