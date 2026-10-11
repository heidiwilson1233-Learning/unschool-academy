import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section, SectionHeading, Button, FAQAccordion, Badge } from "@/components/ui";
import { KidsSampler } from "@/components/samplers";
import { ExamGoalPicker } from "@/components/exam-picker";
import { PICKER_DATA } from "@/lib/picker";
import { Art, StagingNote } from "@/components/site-art";
import {
  HandUnderline,
  HandArrow,
  Stamp,
  WashiTape,
  Marginalia,
  TornEdge,
  PaperCard,
  CraftDetails,
} from "@/components/craft";
import { practiceQuestionById } from "@/lib/practice";

export const metadata: Metadata = {
  /* Layout template appends " | Unschool Academy" — 55 chars rendered. */
  title: "Practise Until It Makes Sense",
  description:
    "Focused exam preparation and joyful learning for ages 5 through Grade 5, built around things learners can actually do.",
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
};

/* Real specimen for the hero collage: the actual jft-p01 practice question,
   rendered server-side as a taped index card. Only stem/options/topic reach
   the markup — correctId/explanation are never touched here. */
const SPECIMEN = practiceQuestionById("jft-p01");
const SPECIMEN_LETTERS = ["A", "B", "C", "D", "E"];

/* Honest numbers: real site facts stated plainly — the 10-question diagnostic
   and the one live pilot program are fixed truths, not vanity stats; only
   the draft-question count is computed from the build's content files. */
const PROOF = [
  { n: "10", label: "Questions in the free JFT-Basic diagnostic. No account, no paywall." },
  { n: "1", label: "Exam program live in pilot: JFT-Basic." },
  {
    n: `${PICKER_DATA.totalDraftQuestions}+`,
    label: `Draft questions in research: ${PICKER_DATA.totalResearchExams} exams, labelled draft pending expert review`,
  },
];

const STEPS = [
  { n: "01", title: "Explore", body: "Find the exam or age track that fits. Read verified syllabi and learning goals. Plain facts, zero hype." },
  { n: "02", title: "Try", body: "Take the free diagnostic or play a full demo quest. Real questions, real interactions, nothing held back." },
  { n: "03", title: "Learn", body: "Follow a topic-by-topic plan: original practice, honest explanations for every answer (labelled draft or reviewed, never mixed), and hints that teach instead of telling." },
  { n: "04", title: "See progress", body: "Topic-level scores and observed skills. Honest evidence of what clicked and what still needs work." },
];

/* Method rows: one data source, two presentations — editorial hairline rows
   on desktop, a single tap-to-open card on mobile (mobile-compact rule). */
const METHOD_ROWS: { term: string; lead: ReactNode; body: string }[] = [
  {
    term: "Structure",
    lead: (<>Exam <span aria-hidden="true">→</span> skill <span aria-hidden="true">→</span> level.</>),
    body: "Every exam breaks into subjects, parts, skills and four levels: L1 Foundation to L4 Exam mastery. You never face \u201C10,000 questions.\u201D You face your next 10.",
  },
  {
    term: "Loop",
    lead: (<>Diagnose <span aria-hidden="true">→</span> master <span aria-hidden="true">→</span> prove.</>),
    body: "A 7-step loop: diagnose your level, learn, practice, understand every mistake, retain with spaced repetition, master the skill, prove it in mocks.",
  },
  {
    term: "Kids",
    lead: (<>500 books <span aria-hidden="true">→</span> quests.</>),
    body: "From age 5: Momo, Tara and Bobo turn beloved stories into quests across 5 subjects. Adaptive, no fail states, 15 minutes then off-screen play.",
  },
];

const FAQS = [
  {
    q: "Is Unschool Academy affiliated with the exam boards?",
    a: "No. Unschool Academy is an independent practice and learning service. Exam names belong to their respective owners, and our practice scores are unofficial: they measure your practice performance, not your official result.",
  },
  {
    q: "What does the free diagnostic include?",
    a: "Ten original JFT-Basic-style questions across all four official sections, with instant topic feedback. Explanations are clearly labelled as drafts pending expert review. No account needed; five minutes of your time. Your result is yours, never held behind a paywall.",
  },
  {
    q: "How does Unschool Kids keep children safe?",
    a: "Child profiles live under a parent-owned account. Child mode has no ads, no purchases, no external links, no social features and no open-ended AI chat. Parents control consent, data, billing and deletion from the Parent Hub.",
  },
  {
    q: "Do you really only have one exam program right now?",
    a: "Yes, and we say so proudly. JFT-Basic is our pilot: one complete preparation path. Live today as the free diagnostic, with the full path still in staged review. Our 500-exam research catalogue stays internal until each program passes verification and content review. We'd rather do one exam brilliantly than 500 badly.",
  },
];

/* One source for the picker's heading id — the figure's aria-labelledby and the
   picker's headingId prop must never diverge (C P2). */
const PICKER_HEADING_ID = "exam-goal-picker-heading";
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" }],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Unschool Academy",
  url: "https://unschool.academy/",
  inLanguage: "en",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      {/* HERO — de-JFT: the right side is the exam-goal picker (portal moves
          8 + 10: frictionless entry + discovery). Run 69 craft: the hero is
          a warm paper sheet (grain, no glow-orb gradients) and the picker
          sits in a taped paper collage with a real specimen question card. */}
      <div className="relative overflow-hidden">
        <div aria-hidden className="craft-hero-paper absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-6">
                Unschool Academy | Two ways to learn
              </p>
              <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-ink text-balance">
                <span className="guide-reveal block">Don&apos;t just study.</span>
                <span className="guide-reveal block" style={{ animationDelay: "91ms" }}>
                  Practise until it <HandUnderline>makes sense.</HandUnderline>
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-xl text-slate leading-relaxed">
                Focused exam preparation and joyful learning for ages 5 through Grade 5, built around
                things learners can actually do.
              </p>
              {/* Primary CTA is the free diagnostic (portal move 8: the acquisition funnel);
                  the picker handles discovery, so it sits at secondary weight. */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/exams/jft-basic/diagnostic" size="lg">See where you stand</Button>
                <Button href="#exam-picker" size="lg" variant="secondary">Pick your exam</Button>
                <Button href="/kids" size="lg" variant="secondary">Visit Kids World</Button>
              </div>
              <p className="mt-4 max-w-xl text-[15px] text-slate">
                Free JFT-Basic diagnostic: 10 questions, about five minutes, no account. Your gaps,
                topic by topic, with a starter plan.
              </p>
              <p id="diagnostic-note" className="sr-only">
                JFT-Basic is our first live diagnostic. The other exams shown are in research and have no diagnostic yet.
              </p>
            </div>
            <div className="lg:col-span-5">
              {/* HERO COLLAGE (run 69): the live picker console taped into a
                  paper collage — a real specimen question card peeks from
                  behind, a rubber stamp and handwritten marginalia point at
                  the console. Real visual weight, zero AI-generated imagery.
                  The specimen card is a presentational duplicate of the free
                  practice on offer below, so it is aria-hidden like a photo
                  in a collage; the live console stays fully operable. */}
              <div className="relative mx-auto max-w-md pb-10 lg:max-w-none">
                {/* SR equity for the aria-hidden collage card (B P2-6): one
                    honest line, no question dump. */}
                <p className="sr-only">
                  Specimen: a real JFT-Basic practice question card, labelled draft pending expert review.
                  Try real questions in the free diagnostic or the practice sampler.
                </p>
                <div aria-hidden="true" className="absolute -top-14 right-0 z-20 hidden w-48 md:block">
                  <Marginalia className="rotate-[-3deg] text-[19px] leading-snug">
                    no signup, just pick your exam
                  </Marginalia>
                  <HandArrow flip className="ml-auto mr-8 mt-1 h-[60px] w-[100px]" />
                </div>
                {SPECIMEN && (
                  <div aria-hidden="true" className="absolute -top-7 left-0 z-0 w-44 rotate-[-7deg] sm:w-56">
                    <PaperCard className="p-4 pt-5">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
                        Real question · JFT-Basic bank
                      </p>
                      <p className="mt-2 text-[13px] font-semibold leading-snug text-ink">
                        {SPECIMEN.stem}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {SPECIMEN.options.map((o, i) => (
                          <li key={o.id} className="text-[12px] text-slate">
                            <span className="mr-1.5 font-mono font-bold text-academy-teal-dark">
                              {SPECIMEN_LETTERS[i] ?? "·"}
                            </span>
                            {o.text}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 border-t border-[#e7dfcc] pt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                        Draft · pending SME review
                      </p>
                    </PaperCard>
                    <WashiTape tone="amber" tilt={-8} className="-top-3 left-1/2 -ml-[48px]" />
                  </div>
                )}
                <figure
                  id="exam-picker"
                  aria-labelledby={PICKER_HEADING_ID}
                  className="picker-frame relative z-10 scroll-mt-[140px]"
                >
                  <div className="rounded-2xl border border-border bg-paper shadow-[0_24px_60px_-28px_rgba(21,34,59,0.35)] overflow-hidden">
                    <div className="flex items-center gap-1.5 border-b border-border bg-canvas px-4 py-3">
                      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                      <span aria-hidden="true" className="ml-2 rounded-full bg-border/50 px-3 py-1 font-mono text-[11px] text-slate">
                        unschool.academy
                      </span>
                    </div>
                    <div className="bg-canvas p-4 md:p-5">
                      <ExamGoalPicker data={PICKER_DATA} headingId={PICKER_HEADING_ID} />
                    </div>
                  </div>
                  <WashiTape tone="teal" tilt={-14} className="left-6 top-1.5" />
                  <WashiTape tone="teal" tilt={12} className="right-6 top-1.5" />
                  <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                    One live program today, {PICKER_DATA.totalResearchExams} more being built into full programs. Choose one to see its status.
                  </figcaption>
                </figure>
                <Stamp tone="teal" tilt={7} className="absolute bottom-0 right-4 z-20 sm:right-8">
                  Free · no account
                </Stamp>
              </div>
            </div>
          </div>

          {/* Honest numbers — computed from the build's content files at build time. */}
          {/* SR fix (B P1-2): one sr-only term announces "N: label" once; the
              two visual dds are hidden duplicates, not a second announcement. */}
          <dl className="mt-14 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 border-y border-border py-8">
            {PROOF.map((p) => (
              <div key={p.n}>
                <dt className="sr-only">{p.n}: {p.label}</dt>
                <dd className="font-display text-4xl md:text-6xl tracking-[-0.03em] text-ink" aria-hidden="true">
                  {p.n}
                </dd>
                <dd className="mt-2 text-[13px] md:text-sm text-slate leading-snug max-w-[16rem]" aria-hidden="true">
                  {p.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/* Torn paper edge (run 69 craft): the warm hero sheet tears into the
          canvas below — a hand-made section break, not a hairline rule. */}
      <div aria-hidden="true" className="-mb-px bg-canvas text-paper-warm">
        <TornEdge />
      </div>

      {/* TWO DOORS — bento: institutional dossier (col-span-4) vs tactile kids cell (col-span-2).
          Exams door reframed for the pipeline: one pilot program, ten in research. */}
      <Section className="!py-14 md:!py-20">
        <ul className="grid md:grid-cols-6 gap-6 list-none p-0 m-0">
          <li className="md:col-span-4">
            <article className="h-full bg-paper border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="relative">
                <Art
                  src="/img/card-jft.webp"
                  alt="Study flashcards and an open notebook in warm window light"
                  ratio="card"
                  className="!rounded-none !border-0 !shadow-none"
                />
                <WashiTape tone="teal" tilt={-10} className="left-8 top-2" />
                <Stamp tone="teal" tilt={-8} className="absolute right-3 top-3">
                  Pilot
                </Stamp>
              </div>
              <div className="p-6 md:p-10">
                <Badge tone="info">Unschool Exams</Badge>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
                  Exam prep that shows its work
                </h2>
                <p className="mt-3 text-slate leading-relaxed max-w-xl">
                  JFT-Basic is live in pilot: a free 10-question diagnostic today, with the full
                  practice path in staged review. Behind it, {PICKER_DATA.totalResearchExams} more exam programs are being
                  researched question by question, each one sourced, labelled, and reviewed
                  before it ever reaches you.
                </p>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">01</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Free 10-question diagnostic:</strong> no account, no paywall.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">02</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Original questions:</strong> each explanation labelled draft pending expert review.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">03</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Honest unofficial scores:</strong> we never promise a pass.</span>
                  </li>
                </ul>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                  Pilot · JFT-Basic · {PICKER_DATA.totalResearchExams} exams in research
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/exams/catalog">Find your exam</Button>
                  <Button href="/exams/how-practice-works" variant="ghost">How practice works</Button>
                </div>
              </div>
            </article>
          </li>
          <li className="md:col-span-2">
            <article className="h-full bg-kids-cream border-2 border-b-4 border-kids-orange/40 rounded-2xl overflow-hidden">
              <div className="relative">
                <Art
                  src="/img/kids-world.webp"
                  alt="The Unschool Kids village: Momo's mango garden, Tara's story tree and Bobo's discovery pond under festival bunting"
                  ratio="card"
                  className="!rounded-none !border-0 !shadow-none"
                />
                <WashiTape tone="amber" tilt={8} className="right-8 top-2" />
              </div>
              <div className="p-6 md:p-8 pt-2">
                <StagingNote />
                <Badge tone="kids">Unschool Kids</Badge>
                <h2 className="mt-4 text-2xl md:text-[1.7rem] font-extrabold tracking-tight text-ink">
                  A village where learning feels like play
                </h2>
                <p className="mt-3 text-slate leading-relaxed text-[15px]">
                  Momo, Tara and Bobo guide children ages 5 through Grade 5 through real interactive
                  quests: counting mangoes, ordering stories, meeting the world. Parent-owned and
                  ad-free, always.
                </p>
                <div className="mt-6">
                  <Button href="/kids" variant="kids" className="w-full">Enter Kids World</Button>
                  <p className="mt-3 text-center">
                    <a
                      href="/kids/for-parents"
                      className="text-sm font-semibold text-kids-orange-ink underline underline-offset-4 decoration-kids-orange/50 hover:decoration-kids-orange rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                    >
                      For parents
                    </a>
                  </p>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </Section>

      {/* KIDS SAMPLER — each product sampled once on this page; the exam sampler lives on /free-practice. */}
      <Section className="!py-14 md:!py-20">
        <SectionHeading
          align="left"
          eyebrow="Try it now"
          title="A taste of the village"
          sub="Demo: a moment from Momo's mango quest. The real interaction, right here: no signup, no paywall, no sales pitch."
        />
        <KidsSampler />
      </Section>

      {/* HOW IT WORKS — horizontal loop rail on desktop (scroll spine, zero
          JS); a single tap-to-open card on mobile (mobile-compact rule:
          the same four steps, roughly a quarter of the scroll depth). */}
      <Section className="bg-paper border-y border-border !py-14 md:!py-20">
        <SectionHeading
          align="left"
          eyebrow="Method"
          title="One honest loop, every age"
          sub="The same learning rhythm for a 30-year-old exam candidate and a 4-year-old counter: try, get feedback, try smarter."
        />
        {/* Default open on mobile (A P1-3): the four credibility steps are
            the conversion content — a closed accordion would tax the exact
            mobile-first audience it must convince. */}
        <div className="md:hidden">
          <CraftDetails summary="The 4-step loop" open>
            <ol className="m-0 list-none space-y-5 p-0">
              {STEPS.map((s, i) => (
                <li key={s.n}>
                  <p aria-hidden="true" className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark">
                    {s.n}
                  </p>
                  <h3 className="mt-1 text-base font-bold text-ink">
                    <span className="sr-only">Step {i + 1} of 4: </span>{s.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate">{s.body}</p>
                </li>
              ))}
            </ol>
          </CraftDetails>
        </div>
        <ol className="relative mt-6 hidden list-none gap-10 p-0 m-0 md:grid md:grid-cols-4 md:gap-6">
          <div aria-hidden className="hidden md:block absolute top-[6px] left-0 right-0 h-px bg-border">
            <div className="loop-fill-x absolute inset-0 bg-academy-teal" />
          </div>
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="step-reveal relative md:pt-10"
              style={{ animationDelay: `${[0, 52, 91, 143][i]}ms` }}
            >
              <span
                aria-hidden
                className="hidden md:block absolute top-0 left-0 h-[13px] w-[13px] rounded-full border-2 border-academy-teal bg-paper"
              />
              <p aria-hidden className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark">
                {s.n}
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">
                <span className="sr-only">Step {i + 1} of 4: </span>{s.title}
              </h3>
              <p className="mt-2 text-slate leading-relaxed text-[15px]">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button href="/how-it-works" variant="secondary">Read the full method</Button>
        </div>
      </Section>

      {/* REVIEW STANDARDS — the gradient quote card is gone; a light editorial pull-quote carries the claim. */}
      <Section className="!py-14 md:!py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Review standards"
              title={<>Every answer has a <HandUnderline>source</HandUnderline>. Every claim has a reviewer.</>}
              sub="Our practice content passes a real pipeline (drafting, fact and language checks, subject-expert review, accessibility check, QA) before it reaches you. One vocabulary, everywhere: drafts ship labeled draft, demos ship labeled demo, and nothing ships as published until it passes review — reviewers never grade their own work."
            />
            <ul className="mt-8 space-y-4 text-slate">
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>JFT facts verified against the Japan Foundation&apos;s official JFT-Basic pages</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Original questions only: never scraped past papers or question dumps</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Every kids quest passes educator review before it joins the full library. The sampler on this page is a demo — a playable sample, still in staged review</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Versioned content: improving a question never rewrites your past results</span>
              </li>
            </ul>
          </div>
          <figure className="border-l-2 border-academy-teal pl-6 md:pl-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate mb-4">Our defining claim</p>
            <blockquote className="font-display italic text-2xl md:text-[2rem] leading-snug text-ink text-balance">
              &ldquo;Unschool Academy helps you learn by doing: focused exam practice for adult learners,
              imaginative real learning for young children.&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
              Pilot status: JFT-Basic diagnostic live. Paid paths and Kids quests in staged review.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* PRICING TEASER — editorial spec rows, not three identical cards.
          Prices are illustrative while checkout is in staged testing. */}
      <Section className="!pt-0 !pb-14 md:!pb-20">
        <div className="grid lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Pricing"
              title="Start free. Pay only for depth."
              sub="The diagnostic and demo quests are free forever: no trial clock, no card required. Paid plans are finite, clearly scoped, and easy to cancel."
            />
            <p className="mt-4 text-sm text-slate leading-relaxed">
              <Stamp tone="amber" tilt={-4} className="mr-2 align-middle">Staged</Stamp>
              Prices here are illustrative. Checkout is in staged testing, so nothing on this page
              takes your money yet.
            </p>
            <div className="mt-6">
              <Button href="/pricing" variant="secondary">Compare all plans</Button>
            </div>
          </div>
          <ul className="lg:col-span-4 divide-y divide-border border-y border-border list-none p-0 m-0 self-start">
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">Free</h3>
                <p className="mt-1 text-sm text-slate">JFT diagnostic + demo quests, forever.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹0
              </p>
            </li>
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">JFT-Basic 60-day pass</h3>
                <p className="mt-1 text-sm text-slate">Full practice path + timed mocks. Pilot pricing.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹699
              </p>
            </li>
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">Kids family</h3>
                <p className="mt-1 text-sm text-slate">All quests, parent dashboard, or ₹399 one-time founding access.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹249<span className="text-base font-semibold text-slate">/mo</span>
              </p>
            </li>
          </ul>
        </div>
      </Section>

      {/* METHOD — the learning architecture, promoted on-site.
          Editorial hairline rows on desktop; one tap-to-open card on mobile
          (mobile-compact rule). */}
      <Section className="!pt-0 !pb-14 md:!pb-20">
        <SectionHeading
          eyebrow="The Unschool Method"
          title={<>A <HandUnderline>path</HandUnderline>, not a pile.</>}
          sub="500 exams in the research catalogue. A 500-book library in progress. One architecture: hierarchy, loop, levels. Here is how learning actually works here."
        />
        <dl className="hidden md:block divide-y divide-border border-y border-border">
          {METHOD_ROWS.map((r) => (
            <div key={r.term} className="py-6 md:py-7 grid md:grid-cols-[14rem_1fr] gap-1 md:gap-8">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark pt-1.5">{r.term}</dt>
              <dd className="text-slate leading-relaxed">
                <strong className="font-bold text-ink">{r.lead}</strong> {r.body}
              </dd>
            </div>
          ))}
        </dl>
        <div className="md:hidden">
          <CraftDetails summary="The method in 3 lines">
            <dl className="m-0 space-y-5 p-0">
              {METHOD_ROWS.map((r) => (
                <div key={r.term}>
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark">{r.term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-slate">
                    <strong className="font-bold text-ink">{r.lead}</strong> {r.body}
                  </dd>
                </div>
              ))}
            </dl>
          </CraftDetails>
        </div>
        <div className="mt-8 text-center">
          <Button href="/how-it-works" size="lg" variant="primary">See the full method</Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="!pt-0">
        <div className="max-w-3xl">
          <SectionHeading align="left" eyebrow="Questions" title="Asked often, answered honestly" />
          <FAQAccordion items={FAQS} idPrefix="home-faq" />
          <p className="mt-6 text-[15px] text-slate">
            Still curious?{" "}
            <a
              href="/faq"
              className="font-semibold text-academy-blue underline underline-offset-4 decoration-academy-blue/40 hover:decoration-academy-blue rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
            >
              Read the full FAQ
            </a>
            .
          </p>
        </div>
      </Section>

      {/* Structured data: honest only — no Course/Product/Offer (prices are staged/illustrative). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
