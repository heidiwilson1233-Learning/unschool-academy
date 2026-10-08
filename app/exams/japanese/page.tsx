import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero, Callout, FAQAccordion } from "@/components/ui";

export const metadata: Metadata = {
  title: "Japanese Learning Hub — JFT-Basic vs JLPT",
  description:
    "Understand the difference between JFT-Basic and the JLPT's five levels, and choose the right Japanese qualification path. Honest, officially-grounded comparison.",
};

const JFT_OFFICIAL_URL = "https://www.jpf.go.jp/jft-basic/e/about/index.html";
const JLPT_OFFICIAL_URL = "https://www.jlpt.jp/";

const faqItems: { q: string; a: string }[] = [
  {
    q: "Is JFT-Basic the same as JLPT N5 or N4?",
    a: "No. The Japan Foundation's own FAQ defines JFT-Basic entirely in CEFR terms — levels A1, A2.1, and A2.2 — so it isn't interchangeable with any JLPT level. A JFT-Basic practice score says nothing about JLPT readiness; the two tests assess different things in different formats.",
  },
  {
    q: "Which test do I need to work in Japan?",
    a: "JFT-Basic assesses the everyday Japanese needed for daily life in Japan and is used for Specified Skilled Worker (i), Employment for Skill Development, and Student residence applications. If you need a widely recognized proficiency credential for study or career, the JLPT path may fit instead.",
  },
  {
    q: "How often can I take each test?",
    a: "The JLPT runs twice a year; JFT-Basic offers more test opportunities and gives results the same day. Check the Japan Foundation's official pages for current dates and venues.",
  },
  {
    q: "Is Unschool's JLPT prep available yet?",
    a: "Not yet — it's in the research stage, and we publish prep only after verification and reviewed content. Meanwhile, our free JFT-Basic diagnostic gives you a CEFR-aligned starting point that's useful no matter which exam you later choose.",
  },
  {
    q: "Where can I read the official sources?",
    a: "Start with the Japan Foundation's official JFT-Basic pages — the JFT-Basic facts on this page were verified against them on 2026-10-08 — and the official JLPT site for levels, dates, and registration.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Exams", item: "https://unschool.academy/exams" },
    { "@type": "ListItem", position: 3, name: "Japanese learning", item: "https://unschool.academy/exams/japanese" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-academy-blue font-semibold hover:underline"
    >
      {children}
      <span aria-hidden="true"> ↗</span>
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export default function JapaneseHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHero
        eyebrow="Japanese qualifications"
        tone="exam"
        title="JFT-Basic or JLPT? Choose with clear eyes."
        sub="Two different tests, different organizers, different purposes — and a lot of confused advice online. Here's the honest comparison, grounded in official sources. Then pick the path that fits your goal."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "Japanese learning" }]} />
        <SectionHeading
          align="left"
          eyebrow="At a glance"
          title="The two tests, side by side"
          sub="One table, seven facts, zero spin — everything below is verified against the Japan Foundation's official pages."
        />
        <div className="overflow-x-auto rounded-2xl border border-border bg-paper shadow-sm">
          <table className="w-full min-w-[600px] text-left text-[15px]">
            <caption className="sr-only">Comparison of JFT-Basic and JLPT</caption>
            <thead>
              <tr className="border-b-2 border-border">
                <th scope="col" className="px-5 py-4"><span className="sr-only">Aspect</span></th>
                <th scope="col" className="px-5 py-4 text-lg font-extrabold text-ink">JFT-Basic</th>
                <th scope="col" className="px-5 py-4 text-lg font-extrabold text-ink">JLPT (N1–N5)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Organizer</th>
                <td className="px-5 py-4 text-slate align-top">Japan Foundation</td>
                <td className="px-5 py-4 text-slate align-top">Japan Foundation &amp; JEES</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Purpose</th>
                <td className="px-5 py-4 text-slate align-top">Everyday Japanese needed for daily life in Japan</td>
                <td className="px-5 py-4 text-slate align-top">General Japanese proficiency across five levels (N5 beginner → N1 advanced)</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Used for</th>
                <td className="px-5 py-4 text-slate align-top">Specified Skilled Worker (i), Employment for Skill Development, and Student residence applications</td>
                <td className="px-5 py-4 text-slate align-top">Study, work credentials, and personal goals worldwide</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Format</th>
                <td className="px-5 py-4 text-slate align-top">Computer-based · ~50 questions · 60 minutes · 4 sections (Script and Vocabulary, Conversation and Expression, Listening, Reading)</td>
                <td className="px-5 py-4 text-slate align-top">Paper-based</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Scoring</th>
                <td className="px-5 py-4 text-slate align-top">Scaled 10–250; levels A1 (145–174), A2.1 (175–199), A2.2 (200–250) — CEFR-based, no per-section minimum</td>
                <td className="px-5 py-4 text-slate align-top">Five independent levels, N5 (beginner) → N1 (advanced)</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Frequency</th>
                <td className="px-5 py-4 text-slate align-top">More test opportunities</td>
                <td className="px-5 py-4 text-slate align-top">Twice a year</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Results</th>
                <td className="px-5 py-4 text-slate align-top">Same day</td>
                <td className="px-5 py-4 text-slate align-top">—</td>
              </tr>
              <tr>
                <th scope="row" className="px-5 py-4 font-semibold text-ink align-top">Our status here</th>
                <td className="px-5 py-4 align-top">
                  <Badge tone="success">Live pilot</Badge>
                  <p className="mt-2 text-slate">Practice available now — start with the free diagnostic.</p>
                </td>
                <td className="px-5 py-4 align-top">
                  <Badge tone="neutral">Under evaluation</Badge>
                  <p className="mt-2 text-slate">Research stage — we publish prep only after verification and reviewed content.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate">JFT-Basic facts verified 2026-10-08 against the Japan Foundation&apos;s official JFT-Basic pages.</p>
      </Section>
      <Section className="!pt-0">
        <SectionHeading
          eyebrow="Start from your goal"
          title="Which one fits your goal?"
          sub="Don't start from the test — start from why you're learning Japanese. Three honest paths, no wrong answers."
        />
        <div className="grid md:grid-cols-3 gap-6">
          <Card hover className="!border-2 !border-academy-blue">
            <Badge tone="info">JFT-Basic path</Badge>
            <h3 className="mt-3 text-xl font-extrabold text-ink">Moving to Japan for daily life or work</h3>
            <p className="mt-2 text-[15px] text-slate">
              If you need the Japanese used for everyday life in Japan — work, errands, conversations —
              JFT-Basic is the test built for that, and our practice is live right now.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/exams/jft-basic/diagnostic" size="sm">Take the free diagnostic</Button>
              <Button href="/exams/jft-basic" size="sm" variant="ghost">Explore practice</Button>
            </div>
          </Card>
          <Card hover>
            <Badge tone="neutral">JLPT path</Badge>
            <h3 className="mt-3 text-xl font-extrabold text-ink">Need a credential for study or career</h3>
            <p className="mt-2 text-[15px] text-slate">
              The JLPT&apos;s five levels are the widely recognized proficiency ladder. Our JLPT prep is
              still under evaluation — start with the official sources, and check back here.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ExternalLink href={JLPT_OFFICIAL_URL}>Official JLPT info</ExternalLink>
              <Button href="/exams/catalog" size="sm" variant="ghost">Browse our research catalog</Button>
            </div>
          </Card>
          <Card hover>
            <Badge tone="success">Start here</Badge>
            <h3 className="mt-3 text-xl font-extrabold text-ink">Just getting started</h3>
            <p className="mt-2 text-[15px] text-slate">
              Not sure of your level yet? A free 10-question diagnostic gives you a CEFR-aligned
              starting point — useful whichever exam you later choose. No account needed.
            </p>
            <div className="mt-6">
              <Button href="/exams/jft-basic/diagnostic" size="sm">Take the free diagnostic</Button>
            </div>
          </Card>
        </div>
        <div className="mt-8 max-w-3xl mx-auto">
          <Callout title="No false equivalence" tone="info">
            The Japan Foundation&apos;s own FAQ draws the line: JLPT has five levels (N1–N5), is
            paper-based and runs twice a year; JFT-Basic assesses A1/A2.1/A2.2, focuses on daily
            life in Japan, offers more test opportunities, and gives results the same day. A
            JFT-Basic practice score says nothing about JLPT readiness — they test different things.
          </Callout>
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Decide with confidence"
            title="Questions people ask before choosing"
            sub="Straight answers from officially-grounded facts — including what we don't do yet."
          />
          <FAQAccordion items={faqItems} />
          <p className="mt-6 text-sm text-slate">
            Official sources: <ExternalLink href={JFT_OFFICIAL_URL}>Japan Foundation — JFT-Basic</ExternalLink>
            {" · "}
            <ExternalLink href={JLPT_OFFICIAL_URL}>Official JLPT site</ExternalLink>
          </p>
        </div>
      </Section>
      <Section className="!pt-0">
        <Card className="max-w-3xl mx-auto text-center !p-10">
          <h2 className="text-2xl font-extrabold text-ink">Not sure which fits your goal?</h2>
          <p className="text-slate mt-3 max-w-xl mx-auto">
            Moving to Japan for daily life and work? Start with JFT-Basic practice. Need a
            widely recognized proficiency credential for study or career? The JLPT path may fit —
            our JLPT prep is still under evaluation, so start with the{" "}
            <ExternalLink href={JLPT_OFFICIAL_URL}>official JLPT site</ExternalLink> for dates and
            levels, and check back here.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button href="/exams/jft-basic/diagnostic" size="lg">Take the free diagnostic</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
