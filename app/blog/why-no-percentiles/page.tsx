import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Button } from "@/components/ui";

/* Read time: ceil(visible words / 200). Currently ~180 visible words -> 1 min.
   Keep app/blog/page.tsx's entry for this post in sync. */
const READ_TIME = "1 min read";

const TITLE = "Why We Don't Do Percentiles";
const DESCRIPTION =
  "A practice score of 'top 12%' sounds impressive and means nothing. How Unschool Academy scores honestly instead.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog/why-no-percentiles" },
  openGraph: {
    type: "article",
    url: "/blog/why-no-percentiles",
    title: TITLE,
    description: DESCRIPTION,
    publishedTime: "2026-10",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "No percentiles, no pass-probability. What honest scoring looks like instead.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://unschool.academy/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: "Why no percentiles",
          item: "https://unschool.academy/blog/why-no-percentiles",
        },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: TITLE,
      datePublished: "2026-10",
      inLanguage: "en",
      author: { "@type": "Organization", name: "Unschool Academy content team" },
      publisher: { "@type": "Organization", name: "Unschool Academy" },
      mainEntityOfPage: "https://unschool.academy/blog/why-no-percentiles",
    },
  ],
};

const SHOWN_INSTEAD = [
  "Your raw score.",
  "Your score by topic.",
  "Whether each attempt was independent or hinted.",
  "A plain statement of what the score can and cannot tell you.",
];

export default function PercentilesPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Authored masthead — breadcrumbs above the h1, type as the hero. */}
      <Section className="pt-10 md:pt-14 pb-2">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "Why no percentiles" },
            ]}
          />
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
            How we build · Editorial
          </p>
          <h1 className="mt-3 font-display font-bold text-ink tracking-[-0.04em] text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[1.02]">
            Why We Don&rsquo;t Do Percentiles
          </h1>
          <p className="mt-5 font-display italic text-ink text-[clamp(1.25rem,3vw,1.75rem)] leading-snug text-balance">
            If we can&rsquo;t show our working, we don&rsquo;t show the number.
          </p>
          <p className="mt-5 text-slate text-[15px]">
            <time dateTime="2026-10">October 2026</time> · {READ_TIME} ·{" "}
            <span>By the Unschool Academy content team</span>
          </p>
        </div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto">
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>
              Many test-prep sites show you a percentile: &ldquo;you scored better than 82% of
              learners!&rdquo; It feels scientific. It is, in most cases, fiction: computed from
              tiny, self-selected samples of other website users, not from anything resembling
              the real exam population.
            </p>

            <h2 className="text-2xl font-bold text-ink pt-4">
              What would a percentile need to be honest?
            </h2>
            <p>
              A real percentile needs a representative sample of actual test-takers, a disclosed
              methodology, and regular recalibration. Almost no practice site publishes all
              three. So the number is decoration, and decoration still shapes real decisions
              about when you&rsquo;re &ldquo;ready&rdquo;.
            </p>

            <h2 className="text-2xl font-bold text-ink pt-4">What do we show instead?</h2>
            <ul className="border-t border-border">
              {SHOWN_INSTEAD.map((item, i) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-border py-3"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Less impressive on a dashboard, but more useful for actual learning.
            </p>

            <h2 className="text-2xl font-bold text-ink pt-4">
              What rule do we hold ourselves to?
            </h2>
            <p>
              If we can&rsquo;t show our working, we don&rsquo;t show the number. That applies to
              percentiles, &ldquo;pass probability&rdquo;, and every other impressive-sounding
              statistic. Try the{" "}
              <Link
                href="/exams/jft-basic/diagnostic"
                className="text-academy-blue font-semibold hover:underline"
              >
                free diagnostic
              </Link>{" "}
              and you&rsquo;ll see exactly what we mean.
            </p>
          </div>

          {/* Discovery: real relationships, editorial rows. */}
          <nav aria-label="More to read" className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-4 border-t border-border">
              <li className="border-b border-border">
                <Link
                  href="/blog/draft-pending-review"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">01</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      What &ldquo;draft pending review&rdquo; actually means
                    </span>
                    <span className="block text-[15px]">
                      How honest labeling works inside our content pipeline.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link
                  href="/blog/why-no-scores-kids"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">02</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Why your child doesn&rsquo;t need a score
                    </span>
                    <span className="block text-[15px]">
                      The sibling rule, written for young learners.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link href="/free-practice" className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">03</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      See honest scoring in practice
                    </span>
                    <span className="block text-[15px]">
                      Free sample questions with draft-labeled explanations.
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </Section>

      {/* Frictionless close: the diagnostic is the canonical zero-friction entry —
          one close, one destination (sibling-post convention). */}
      <Section>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-paper p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">Take the free diagnostic</h2>
            <p className="mt-2 text-slate text-[16px]">
              Ten questions, five minutes, no account needed.
            </p>
          </div>
          <Button href="/exams/jft-basic/diagnostic" className="shrink-0">
            Take the free diagnostic
          </Button>
        </div>
      </Section>
    </>
  );
}
