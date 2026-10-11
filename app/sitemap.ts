import type { MetadataRoute } from "next";
import { listExamSlugs, getExamPageData } from "@/lib/exam-template";
import { listPracticeExams, getExamPracticeMeta } from "@/lib/exam-banks";

/**
 * Sitemap — static routes plus one entry per exam with authored content.
 * Thin exams (no questions yet) are excluded until they have real content;
 * their pages stay live internally but unindexed (see the template's robots).
 */
const STATIC_ROUTES = [
  "",
  "/about",
  "/exams",
  "/exams/catalog",
  "/exams/how-practice-works",
  "/exams/jft-basic/diagnostic",
  "/exams/jft-basic/mock-tests",
  "/exams/japanese",
  "/exams/tiers",
  "/faq",
  "/free-practice",
  "/blog",
  "/blog/why-no-percentiles",
  "/blog/station-kanji",
  "/blog/jft-listening-two-plays",
  "/blog/why-no-scores-kids",
  "/blog/draft-pending-review",
  "/how-it-works",
  "/kids",
  "/kids/pricing",
  "/kids/for-parents",
  "/kids/library",
  "/kids/roadmap",
  "/kids/characters",
  "/kids/world",
  "/parent",
  "/pricing",
  "/resources",
  "/contact",
  "/legal/accessibility",
  "/legal/child-privacy",
  "/legal/exam-trademarks",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/terms",
];

/**
 * Legal pages are staged drafts pending legal review — they change on
 * legal-review cycles, not weekly. Marking them yearly/0.4 keeps the sitemap
 * honest about cadence instead of implying they update like product pages.
 */
const LEGAL_ROUTES = new Set([
  "/legal/accessibility",
  "/legal/child-privacy",
  "/legal/exam-trademarks",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/terms",
]);

export default function sitemap(): MetadataRoute.Sitemap {
  /* Canonical host = the actual serving production deployment (not the
     aspirational custom domain). Keep in lockstep with metadataBase in
     app/layout.tsx and the sitemap URL in app/robots.ts. */
  const base = "https://unschool-academy-lr98.vercel.app";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: (LEGAL_ROUTES.has(route) ? "yearly" : "weekly") as
      | "yearly"
      | "weekly",
    priority: route === "" ? 1 : LEGAL_ROUTES.has(route) ? 0.4 : 0.7,
  }));
  for (const slug of listExamSlugs()) {
    const data = getExamPageData(slug);
    if (!data || data.thin) continue;
    entries.push({
      url: `${base}/exams/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }
  /* Practice pickers + topic pages for exams with question banks — indexed
     content pages with honest counts (run 65). For JFT-Basic the public
     canonical topic URLs are the legacy slugs (the concrete route also
     accepts unit ids as aliases, but the sitemap lists canonicals only). */
  const JFT_LEGACY_TOPIC_SLUGS = ["vocabulary", "conversation", "listening", "reading"];
  for (const slug of listPracticeExams()) {
    entries.push({
      url: `${base}/exams/${slug}/practice`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    });
    const topicSlugs =
      slug === "jft-basic"
        ? JFT_LEGACY_TOPIC_SLUGS
        : (getExamPracticeMeta(slug)?.units ?? []).map((u) => u.id);
    for (const t of topicSlugs) {
      entries.push({
        url: `${base}/exams/${slug}/practice/${t}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      });
    }
  }
  /* Answers portal index (the 95 draft [id] pages are noindex by design —
     they stay out of the sitemap). */
  entries.push({
    url: `${base}/exams/jft-basic/answers`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  });
  return entries;
}
