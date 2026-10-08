import type { Metadata } from "next";
import { Section, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why We Don't Do Percentiles",
  description: "A practice score of 'top 12%' sounds impressive and means nothing. How Unschool Academy scores honestly instead.",
};

export default function PercentilesPost() {
  return (
    <>
      <PageHero eyebrow="How we build" title="Why we don't do percentiles" sub="October 2026 · 3 min read" />
      <Section>
        <article className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Why no percentiles" }]} />
          <div className="space-y-5 text-slate leading-relaxed text-[17px]">
            <p>Many test-prep sites show you a percentile: “you scored better than 82% of learners!” It feels scientific. It is, in most cases, fiction — computed from tiny, self-selected samples of other website users, not from anything resembling the real exam population.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">What a percentile would need to be honest</h2>
            <p>A real percentile needs a representative sample of actual test-takers, a disclosed methodology, and regular recalibration. Almost no practice site has any of these. So the number is decoration — decoration that shapes real decisions about when you're “ready”.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">What we show instead</h2>
            <p>Your raw score. Your score by topic. Whether each attempt was independent or hinted. And a plain statement of what the score can and cannot tell you. Less impressive on a dashboard. More useful for actual learning.</p>
            <h2 className="text-2xl font-bold text-ink pt-4">The rule we hold</h2>
            <p>If we can't show our working, we don't show the number. That applies to percentiles, “pass probability”, and every other impressive-sounding statistic. Try the <a href="/exams/jft-basic/diagnostic" className="text-academy-blue font-semibold hover:underline">free diagnostic</a> and you'll see exactly what we mean.</p>
          </div>
        </article>
      </Section>
    </>
  );
}
