import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Japanese Learning Hub — JFT-Basic vs JLPT",
  description:
    "Understand the difference between JFT-Basic and the JLPT's five levels, and choose the right Japanese qualification path. Honest, officially-grounded comparison.",
};

export default function JapaneseHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Japanese qualifications"
        tone="exam"
        title="JFT-Basic or JLPT? Choose with clear eyes."
        sub="Two different tests, different organizers, different purposes. Here's the honest comparison — then pick the path that fits your goal."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "Japanese learning" }]} />
        <div className="grid md:grid-cols-2 gap-6">
          <Card hover className="!border-2 !border-academy-blue">
            <p className="text-xs font-bold uppercase tracking-widest text-academy-teal mb-2">Our live pilot</p>
            <h2 className="text-2xl font-extrabold text-ink">JFT-Basic</h2>
            <p className="text-sm text-slate mt-1">Run by the Japan Foundation</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate">
              <li><span className="font-semibold text-ink">Purpose:</span> everyday Japanese needed for daily life in Japan — used for Specified Skilled Worker (i), Employment for Skill Development, and Student residence applications</li>
              <li><span className="font-semibold text-ink">Format:</span> computer-based · ~50 questions · 60 minutes · 4 sections (Script and Vocabulary, Conversation and Expression, Listening, Reading)</li>
              <li><span className="font-semibold text-ink">Scoring:</span> scaled 10–250; levels A1 (145–174), A2.1 (175–199), A2.2 (200–250) — CEFR-based, no per-section minimum</li>
              <li><span className="font-semibold text-ink">Not:</span> interchangeable with any JLPT level — the official FAQ defines it entirely in CEFR terms</li>
            </ul>
            <p className="mt-3 text-xs text-slate">Facts verified 2026-10-08 against the Japan Foundation&apos;s official JFT-Basic pages.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/exams/jft-basic" size="sm">Practice JFT-Basic</Button>
              <Button href="/exams/jft-basic/diagnostic" size="sm" variant="ghost">Free diagnostic →</Button>
            </div>
          </Card>
          <Card>
            <p className="text-xs font-bold uppercase tracking-widest text-slate mb-2">Under evaluation</p>
            <h2 className="text-2xl font-extrabold text-ink">JLPT N5 / N4</h2>
            <p className="text-sm text-slate mt-1">Run by the Japan Foundation & JEES</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-slate">
              <li><span className="font-semibold text-ink">Purpose:</span> general Japanese proficiency across five levels (N5 beginner → N1 advanced)</li>
              <li><span className="font-semibold text-ink">For:</span> study, work credentials, and personal goals worldwide</li>
              <li><span className="font-semibold text-ink">Status here:</span> research stage — we publish only after verification and reviewed content</li>
            </ul>
            <Callout title="No false equivalence" tone="warning">
              The Japan Foundation&apos;s own FAQ draws the line: JLPT has five levels (N1–N5), is
              paper-based and runs twice a year; JFT-Basic assesses A1/A2.1/A2.2, focuses on daily
              life in Japan, offers more test opportunities, and gives results the same day. A
              JFT-Basic practice score says nothing about JLPT readiness — they test different things.
            </Callout>
          </Card>
        </div>
      </Section>
      <Section className="!pt-0">
        <Card className="max-w-3xl mx-auto text-center !p-10">
          <h2 className="text-2xl font-extrabold text-ink">Not sure which fits your goal?</h2>
          <p className="text-slate mt-3 max-w-xl mx-auto">
            If your goal is daily life in Japan, start with JFT-Basic practice. If you need a
            widely recognized proficiency credential, the JLPT path may fit — and we&apos;ll tell
            you honestly when our JLPT preparation is actually ready.
          </p>
          <div className="mt-6">
            <Button href="/exams/jft-basic/diagnostic" size="lg">Take the free diagnostic</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
