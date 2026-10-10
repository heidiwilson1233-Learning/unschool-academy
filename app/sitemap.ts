import type { MetadataRoute } from "next";
import { listExamSlugs, getExamPageData } from "@/lib/exam-template";

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
  "/exams/tiers",
  "/faq",
  "/free-practice",
  "/how-it-works",
  "/kids",
  "/parent",
  "/pricing",
  "/resources",
  "/search",
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
  const base = "https://unschool.academy";
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
