import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Card, Badge, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog — Original Articles",
  description: "Original articles from the Unschool Academy content team: Japanese learning guides and honest notes on how we build.",
};

const POSTS = [
  {
    slug: "station-kanji",
    badge: "Japanese learning",
    title: "4 station kanji that unlock the whole station",
    excerpt: "出口, 入口, 改札, 乗換 — learn these four as pairs and you'll never feel lost in a Japanese station again.",
    date: "October 2026",
  },
  {
    slug: "why-no-percentiles",
    badge: "How we build",
    title: "Why we don't do percentiles",
    excerpt: "A practice score of “top 12%” sounds impressive and means nothing. Here's what honest scoring looks like instead.",
    date: "October 2026",
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Original articles" sub="Written by our content team, reviewed like everything else. No scraped content, no SEO filler." />
      <Section>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <div className="space-y-5">
            {POSTS.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <Card hover>
                  <div className="flex items-center gap-3 mb-2">
                    <Badge tone="info">{p.badge}</Badge>
                    <span className="text-xs text-slate">{p.date}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-ink">{p.title}</h2>
                  <p className="text-slate mt-2">{p.excerpt}</p>
                  <p className="mt-3 font-semibold text-academy-blue">Read article →</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
