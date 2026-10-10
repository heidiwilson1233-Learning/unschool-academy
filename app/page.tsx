import type { Metadata } from "next";
import { Section, SectionHeading, Button, FAQAccordion, Badge } from "@/components/ui";
import { KidsSampler } from "@/components/samplers";
import { ExamGoalPicker } from "@/components/exam-picker";
import { PICKER_DATA } from "@/lib/picker";
import { Art, StagingNote } from "@/components/site-art";

export const metadata: Metadata = {
  /* Layout template appends " | Unschool Academy" — 55 chars rendered. */
  title: "Practise Until It Makes Sense",
  description:
    "Focused exam preparation and joyful learning for ages 5 through Grade 5 — built around things learners can actually do.",
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/* Honest numbers: every figure is computed from the build's own content files. */
const PROOF = [
  { n: "10", label: "Free JFT-Basic diagnostic · no account, no paywall" },
  { n: "01", label: "Pilot program · JFT-Basic diagnostic live" },
  {
    n: `${PICKER_DATA.totalDraftQuestions}+`,
    label: `Draft questions in research — ${PICKER_DATA.totalResearchExams} exams, labelled draft pending expert review`,
  },
];

const STEPS = [
  { n: "01", title: "Explore", body: "Find the exam or age track that fits. Read verified syllabi and learning goals — plain facts, zero hype." },
  { n: "02", title: "Try", body: "Take the free diagnostic or play a full sample quest. Real questions, real interactions, nothing held back." },
  { n: "03", title: "Learn", body: "Follow a topic-by-topic plan: original practice, honest explanations for every answer — labelled draft or reviewed, never mixed — and hints that teach instead of telling." },
  { n: "04", title: "See progress", body: "Topic-level scores and observed skills — honest evidence of what clicked and what still needs work." },
];

const FAQS = [
  {
    q: "Is Unschool Academy affiliated with the exam boards?",
    a: "No. Unschool Academy is an independent practice and learning service. Exam names belong to their respective owners, and our practice scores are unofficial — they measure your practice performance, not your official result.",
  },
  {
    q: "What does the free diagnostic include?",
    a: "Ten original JFT-Basic-style questions across all four official sections, with instant topic feedback. Explanations are clearly labelled as drafts pending expert review. No account needed, five minutes of your time — and your result is yours, never held behind a paywall.",
  },
  {
    q: "How does Unschool Kids keep children safe?",
    a: "Child profiles live under a parent-owned account. Child mode has no ads, no purchases, no external links, no social features and no open-ended AI chat. Parents control consent, data, billing and deletion from the Parent Hub.",
  },
  {
    q: "Do you really only have one exam program right now?",
    a: "Yes — and we say so proudly. JFT-Basic is our pilot: one complete preparation path — live today as the free diagnostic, with the full path still in staged review. Our 500-exam research catalogue stays internal until each program passes verification and content review. We'd rather do one exam brilliantly than 500 badly.",
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
      {/* HERO — de-JFT: the right panel is now the exam-goal picker (portal moves
          8 + 10: frictionless entry + discovery), not a single-exam sampler.
          Type-as-hero carries the left; the picker is the signature interaction. */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(44rem 30rem at 16% 6%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(38rem 26rem at 88% 22%, rgba(49,91,135,0.09), transparent 62%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-6">
                Unschool Academy | Two ways to learn
              </p>
              <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-ink text-balance">
                <span className="guide-reveal block">Don&apos;t just study.</span>
                <span className="guide-reveal block" style={{ animationDelay: "91ms" }}>
                  Practise until it makes sense.
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
              {/* The picker as a working console inside the browser frame —
                  pattern 10 (real product UI) preserved, sampler moved to /free-practice. */}
              <figure
                id="exam-picker"
                aria-labelledby={PICKER_HEADING_ID}
                className="picker-frame scroll-mt-[140px]"
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
                <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                  One live program today, {PICKER_DATA.totalResearchExams} more being built into full programs. Choose one to see its status.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Honest numbers — computed from the build's content files at build time. */}
          <dl className="mt-14 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 border-y border-border py-8">
            {PROOF.map((p) => (
              <div key={p.n}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="font-display text-4xl md:text-6xl tracking-[-0.03em] text-ink" aria-hidden>
                  {p.n}
                </dd>
                <dd className="mt-2 text-[13px] md:text-sm text-slate leading-snug max-w-[16rem]">
                  {p.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* TWO DOORS — bento: institutional dossier (col-span-4) vs tactile kids cell (col-span-2).
          Exams door reframed for the pipeline: one pilot program, ten in research. */}
      <Section className="!py-14 md:!py-20">
        <ul className="grid md:grid-cols-6 gap-6 list-none p-0 m-0">
          <li className="md:col-span-4">
            <article className="h-full bg-paper border border-border rounded-2xl overflow-hidden shadow-sm">
              <Art
                src="/img/card-jft.webp"
                alt="Study flashcards and an open notebook in warm window light"
                ratio="card"
                className="!rounded-none !border-0 !shadow-none"
              />
              <div className="p-6 md:p-10">
                <Badge tone="info">Unschool Exams</Badge>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
                  Exam prep that shows its work
                </h2>
                <p className="mt-3 text-slate leading-relaxed max-w-xl">
                  JFT-Basic is live in pilot: a free 10-question diagnostic today, with the full
                  practice path in staged review. Behind it, {PICKER_DATA.totalResearchExams} more exam programs are being
                  researched question by question — each one sourced, labelled, and reviewed
                  before it ever reaches you.
                </p>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">01</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Free 10-question diagnostic</strong> — no account, no paywall.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">02</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Original questions</strong> — each explanation labelled draft pending expert review.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">03</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Honest unofficial scores</strong> — we never promise a pass.</span>
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
              <Art
                src="/img/kids-world.webp"
                alt="The Unschool Kids village: Momo's mango garden, Tara's story tree and Bobo's discovery pond under festival bunting"
                ratio="card"
                className="!rounded-none !border-0 !shadow-none"
              />
              <div className="p-6 md:p-8 pt-2">
                <StagingNote />
                <Badge tone="kids">Unschool Kids</Badge>
                <h2 className="mt-4 text-2xl md:text-[1.7rem] font-extrabold tracking-tight text-ink">
                  A village where learning feels like play
                </h2>
                <p className="mt-3 text-slate leading-relaxed text-[15px]">
                  Momo, Tara and Bobo guide children ages 5 through Grade 5 through real interactive
                  quests — counting mangoes, ordering stories, meeting the world. Parent-owned and
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
          sub="A moment from Momo's mango quest — the real interaction, right here. No signup, no paywall, no sales pitch."
        />
        <KidsSampler />
      </Section>

      {/* HOW IT WORKS — horizontal loop rail; spine fills on scroll (CSS view-timeline, zero JS). */}
      <Section className="bg-paper border-y border-border !py-14 md:!py-20">
        <SectionHeading
          align="left"
          eyebrow="Method"
          title="One honest loop, every age"
          sub="The same learning rhythm for a 30-year-old exam candidate and a 4-year-old counter: try, get feedback, try smarter."
        />
        <ol className="relative mt-6 grid gap-10 md:grid-cols-4 md:gap-6 list-none p-0 m-0">
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
              title="Every answer has a source. Every claim has a reviewer."
              sub="Our practice content passes a real pipeline — drafting, fact and language checks, subject-expert review, accessibility check, QA — before it reaches you. Drafts never ship as live content, and reviewers never grade their own work."
            />
            <ul className="mt-8 space-y-4 text-slate">
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>JFT facts verified against the Japan Foundation&apos;s official JFT-Basic pages</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Original questions only — never scraped past papers or question dumps</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Every kids quest passes educator review before it joins the full library — the sampler on this page is a draft, still in staged review</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Versioned content — improving a question never rewrites your past results</span>
              </li>
            </ul>
          </div>
          <figure className="border-l-2 border-academy-teal pl-6 md:pl-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate mb-4">Our defining claim</p>
            <blockquote className="font-display italic text-2xl md:text-[2rem] leading-snug text-ink text-balance">
              &ldquo;Unschool Academy helps you learn by doing — focused exam practice for adult learners,
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
              sub="The diagnostic and sample quests are free forever — no trial clock, no card required. Paid plans are finite, clearly scoped, and easy to cancel."
            />
            <p className="mt-4 text-sm text-slate leading-relaxed border-l-2 border-academy-teal/60 pl-4">
              Prices here are illustrative — checkout is in staged testing, so nothing on this page
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
                <p className="mt-1 text-sm text-slate">JFT diagnostic + sample quests, forever.</p>
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
                <p className="mt-1 text-sm text-slate">All quests, parent dashboard — or ₹399 one-time founding access.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹249<span className="text-base font-semibold text-slate">/mo</span>
              </p>
            </li>
          </ul>
        </div>
      </Section>

      {/* METHOD — the learning architecture, promoted on-site.
          Editorial hairline rows instead of three identical cards (slop audit). */}
      <Section className="!pt-0 !pb-14 md:!pb-20">
        <SectionHeading
          eyebrow="The Unschool Method"
          title="A path, not a pile."
          sub="500 exams in the research catalogue. A 500-book library in progress. One architecture: hierarchy, loop, levels. Here is how learning actually works here."
        />
        <dl className="divide-y divide-border border-y border-border">
          <div className="py-6 md:py-7 grid md:grid-cols-[14rem_1fr] gap-1 md:gap-8">
            <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark pt-1.5">Structure</dt>
            <dd className="text-slate leading-relaxed">
              <strong className="font-bold text-ink">Exam <span aria-hidden>→</span> skill <span aria-hidden>→</span> level.</strong>{" "}
              Every exam breaks into subjects, parts, skills and four levels — L1 Foundation to L4 Exam mastery.
              You never face &ldquo;10,000 questions.&rdquo; You face your next 10.
            </dd>
          </div>
          <div className="py-6 md:py-7 grid md:grid-cols-[14rem_1fr] gap-1 md:gap-8">
            <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark pt-1.5">Loop</dt>
            <dd className="text-slate leading-relaxed">
              <strong className="font-bold text-ink">Diagnose <span aria-hidden>→</span> master <span aria-hidden>→</span> prove.</strong>{" "}
              A 7-step loop: diagnose your level, learn, practice, understand every mistake,
              retain with spaced repetition, master the skill, prove it in mocks.
            </dd>
          </div>
          <div className="py-6 md:py-7 grid md:grid-cols-[14rem_1fr] gap-1 md:gap-8">
            <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal-dark pt-1.5">Kids</dt>
            <dd className="text-slate leading-relaxed">
              <strong className="font-bold text-ink">500 books <span aria-hidden>→</span> quests.</strong>{" "}
              From age 5: Momo, Tara and Bobo turn beloved stories into quests across 5 subjects.
              Adaptive, no fail states, 15 minutes then off-screen play.
            </dd>
          </div>
        </dl>
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
