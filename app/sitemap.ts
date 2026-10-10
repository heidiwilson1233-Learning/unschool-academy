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
  "/faq",
  "/free-practice",
  "/how-it-works",
  "/kids",
  "/parent",
  "/pricing",
  "/resources",
  "/search",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://unschool.academy";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
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
  return entries;
}
