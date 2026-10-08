import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "How Practice Works — Method & Limits",
  description:
    "How Unschool Academy practice works: original questions, deterministic scoring, reviewed explanations — and the honest limits of what practice scores can tell you.",
};

const PRINCIPLES = [
  {
    title: "Original questions, never scraped",
    body: "Every practice item is written in-house for the skill it tests. We never reproduce official past papers, certification dumps, or competitors' questions. Each item carries a version — your past results never change when we improve a question.",
  },
  {
    title: "Scoring is deterministic",
    body: "Your score is computed on our server from the published answer key: one point per correct answer, no hidden weighting, no invented percentiles. What you see is exactly what the answer key says.",
  },
  {
    title: "Practice and mock are different modes",
    body: "In practice mode you get hints and explanations as you go. In mock mode answers stay hidden until you submit — like the real thing, including the timer. The two modes never mix.",
  },
  {
    title: "Explanations teach, not just correct",
    body: "Every answer explains why the right choice is right and why the tempting wrong ones are wrong — in plain language, with the Japanese you need right alongside it. You leave each question understanding more than when you arrived.",
  },
  {
    title: "Scores are unofficial, always",
    body: "A practice score measures your performance on our questions. It cannot predict an official exam result, a visa outcome, or a job offer. We will never sell you a 'guaranteed pass'.",
  },
  {
    title: "Reviewed before it reaches you",
    body: "Draft → fact and language check → subject-expert review → accessibility check → QA → published. The drafter never approves their own work. Draft content is labelled as draft.",
  },
];

export default function HowPracticeWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Our method"
        tone="exam"
        title="Practice that respects your intelligence"
        sub="No inflated claims, no mystery scoring, no 10,000-question dumps of dubious origin. Here's exactly how our practice works — and exactly where its limits are."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "How practice works" }]} />
        <div className="grid md:grid-cols-2 gap-6">
          {PRINCIPLES.map((p, i) => (
            <Card key={p.title}>
              <p className="text-sm font-extrabold text-academy-blue/40" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="text-xl font-bold text-ink mt-1 mb-2">{p.title}</h2>
              <p className="text-slate leading-relaxed text-[15px]">{p.body}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="See for yourself" title="Don't take our word for it — take the diagnostic" />
          <Card className="text-center !p-10">
            <p className="text-slate max-w-xl mx-auto">
              The free diagnostic is the whole method in miniature: real questions, server-side
              scoring, a topic breakdown, honest explanations. Two minutes from now you&apos;ll know
              exactly whether we practice what we preach.
            </p>
            <div className="mt-6">
              <Button href="/exams/jft-basic/diagnostic" size="lg">Take the free diagnostic</Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
