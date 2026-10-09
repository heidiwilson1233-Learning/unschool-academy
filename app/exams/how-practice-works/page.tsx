import type { Metadata } from "next";
import {
  Section,
  SectionHeading,
  Button,
  Card,
  Badge,
  Breadcrumbs,
  PageHero,
} from "@/components/ui";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

export const metadata: Metadata = {
  title: "How Practice Works — Method & Limits",
  description:
    "How Unschool Academy practice works: original questions, deterministic scoring, reviewed explanations — and the honest limits of what practice scores can tell you.",
};

// One source of truth for the breadcrumb trail: the visual <Breadcrumbs>
// and the BreadcrumbList JSON-LD below are both derived from this array.
const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "How practice works" },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `https://unschool.academy${t.href}` } : {}),
  })),
};

// The worked example uses a real question from the practice bank so the
// method is shown on real content, not a mockup. Every bank question is
// draft — pending Japanese SME review — and the example is labelled as such.
const EXAMPLE = PRACTICE_QUESTIONS[0];
const jpCut = EXAMPLE.stem.indexOf("。");
const stemJp = jpCut >= 0 ? EXAMPLE.stem.slice(0, jpCut + 1) : EXAMPLE.stem;
const stemEn = jpCut >= 0 ? EXAMPLE.stem.slice(jpCut + 1).trim() : "";

const PRINCIPLES = [
  {
    title: "Original questions, never scraped",
    body: "Every practice item is written in-house for the skill it tests. We never reproduce official past papers, certification dumps, or competitors' questions. Each item carries a version — your past results never change when we improve a question.",
  },
  {
    title: "Scoring is deterministic",
    body: "Your score is computed on our server from the fixed answer key — versioned, never changed silently after you score. One point per correct answer, no hidden weighting, no invented percentiles. What you see is exactly what the answer key says.",
  },
  {
    title: "Practice and mock are different modes",
    body: "In practice mode you get hints and explanations as you go. In mock mode answers stay hidden until you submit — like the real thing, including the timer. The two modes never mix.",
  },
  {
    title: "Explanations teach, not just correct",
    body: "Every answer explains why the right choice is right and why the tempting wrong ones are wrong — in plain language: English where it clarifies, Japanese where the real test demands it, right alongside. You leave each question understanding more than when you arrived.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageHero
        eyebrow="Our method"
        tone="exam"
        title="Practice that respects your intelligence"
        sub="No inflated claims, no mystery scoring, no 10,000-question dumps of dubious origin. Here's exactly how our practice works — and exactly where its limits are."
        art="/img/how-practice.webp"
        artAlt="A learner writing in a notebook beside a laptop showing a rising progress chart in a warm study corner"
      >
        <Button href="#worked-example" variant="ghost">
          See a worked example
        </Button>
      </PageHero>
      <Section>
        <Breadcrumbs trail={TRAIL} />
        <SectionHeading
          align="left"
          eyebrow="The method"
          title="Six rules we hold ourselves to"
        />
        <ul className="grid md:grid-cols-2 gap-6">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title}>
              <Card className="h-full">
                <p className="text-sm font-extrabold text-academy-blue/40" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="text-xl font-bold text-ink mt-1 mb-2">{p.title}</h2>
                <p className="text-slate leading-relaxed text-[15px]">{p.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
      <Section className="!pt-0" >
        <div id="worked-example">
          <SectionHeading
            align="left"
            eyebrow="Worked example"
            title="One question, end to end"
            sub="Below is one real question from the practice bank, shown the way the practice player treats it. This is the flow your study time actually runs on — question, hint, explanation, topic tag."
          />
          <Card className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge tone="warning">Sample — draft, pending SME review</Badge>
              <span className="text-sm text-slate">Topic: {EXAMPLE.topic}</span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate mb-2">
              The question
            </p>
            <p className="text-lg text-ink leading-relaxed">
              <span lang="ja">{stemJp}</span> {stemEn}
            </p>
            <ul className="mt-4 space-y-2" aria-label="Answer options">
              {EXAMPLE.options.map((o) => {
                const correct = o.id === EXAMPLE.correctId;
                return (
                  <li
                    key={o.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                      correct
                        ? "border-2 border-emerald-600 bg-emerald-50"
                        : "border border-border"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="text-xs font-extrabold uppercase text-slate w-5 shrink-0"
                    >
                      {o.id}
                    </span>
                    <span className="text-ink">
                      {o.textJp && o.textJp !== o.text ? (
                        <>
                          <span lang="ja">{o.textJp}</span> ·{" "}
                        </>
                      ) : null}
                      {o.text}
                    </span>
                    {correct && <Badge tone="success">Correct</Badge>}
                  </li>
                );
              })}
            </ul>
            <p className="text-xs font-bold uppercase tracking-widest text-slate mt-8 mb-2">
              The hint, if you ask for one
            </p>
            <blockquote className="border-l-4 border-academy-teal-dark/40 pl-4 text-slate italic leading-relaxed">
              {EXAMPLE.hint}
            </blockquote>
            <p className="text-xs font-bold uppercase tracking-widest text-slate mt-8 mb-2">
              The explanation, after you answer
            </p>
            <p className="text-slate leading-relaxed">{EXAMPLE.explanation}</p>
            <div className="mt-8 pt-6 border-t border-border text-[15px] text-slate space-y-3 leading-relaxed">
              <p>
                <strong className="text-ink">Filed under {EXAMPLE.topic}.</strong> Every
                question carries a topic tag, and the diagnostic&apos;s results page
                breaks your score down by tag — so you always know which skill needs
                the work, not just how many you got right.
              </p>
              <p>
                <strong className="text-ink">Your history never moves.</strong> Questions
                are versioned; when a question improves, your past results still point at
                the version you answered.
              </p>
            </div>
          </Card>
        </div>
      </Section>
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="See for yourself" title="Don't take our word for it — take the diagnostic" />
          <Card className="text-center !p-10">
            <p className="text-slate max-w-xl mx-auto">
              The free diagnostic is the method in miniature: real questions, server-side
              scoring, a topic breakdown, honest explanations. Two minutes from now
              you&apos;ll see for yourself whether we practice what we preach.
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
