import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, FAQAccordion, Callout } from "@/components/ui";
import { JFT_PROGRAM, TOPIC_INFO, DIAGNOSTIC_SAMPLE_QUESTION } from "@/lib/exams";
import { PRACTICE_TOPICS, practiceByTopic, PRACTICE_QUESTIONS, MOCK_QUESTION_IDS } from "@/lib/practice";

/** Live counts from the curriculum bank — never hardcoded. */
const PRACTICE_COUNT = PRACTICE_QUESTIONS.length;
const MOCK_COUNT = MOCK_QUESTION_IDS.length;
import { Art } from "@/components/site-art";

export const metadata: Metadata = {
  title: "JFT-Basic Practice — Everyday Japanese",
  description:
    "Prepare for the JFT-Basic Japanese test with original practice: free 10-question diagnostic, topic-mapped practice with explanations, and timed mocks. Independent preparation, not affiliated with the Japan Foundation.",
  alternates: { canonical: "/exams/jft-basic" },
  openGraph: {
    title: "JFT-Basic Practice — Everyday Japanese",
    description:
      `Free 10-question diagnostic, ${PRACTICE_COUNT} topic practice questions, and a 30-minute timed mock. Independent JFT-Basic preparation, not affiliated with the Japan Foundation.`,
    type: "website",
    url: "/exams/jft-basic",
  },
  twitter: {
    card: "summary_large_image",
    title: "JFT-Basic Practice — Everyday Japanese",
    description:
      "Free 10-question diagnostic and timed mocks. Independent JFT-Basic preparation.",
  },
};

/* The sample card below shows the deliberately disclosed demo question only —
   the other 9 diagnostic answer keys stay out of this page's bundle. */
const SAMPLE_QUESTION = DIAGNOSTIC_SAMPLE_QUESTION;
const SAMPLE_CORRECT = SAMPLE_QUESTION.options.find(
  (o) => o.id === SAMPLE_QUESTION.correctId
);

const FAQS = [
  {
    q: "Is this an official JFT-Basic product?",
    a: "No. Unschool Academy is independent and not affiliated with the Japan Foundation. Our questions are original practice items written for everyday Japanese. They are not official past papers, and we never reproduce those.",
  },
  {
    q: "Will my diagnostic score predict my official result?",
    a: "No. Anyone who says otherwise is selling you something. Your score measures performance on our 10 original practice questions. It shows which topics need work. It cannot predict an official JFT-Basic result or any immigration outcome.",
  },
  {
    q: "How is JFT-Basic different from JLPT?",
    a: "They are different tests by different organizers with different purposes. JFT-Basic assesses everyday Japanese needed for daily life in Japan; the JLPT's five levels (N5–N1) measure general Japanese proficiency. One is not a substitute for the other.",
  },
  {
    q: "What do the paid plans include?",
    a: `The 60-day pilot pass adds the full topic practice path (all four topics, ${PRACTICE_COUNT} questions) and the ${MOCK_COUNT}-question timed mock. All questions are original drafts pending Japanese SME review. Exact question counts are published only for reviewed, live content.`,
  },
];

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic" },
];

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/* JSON-LD is exactly parallel to the rendered content. */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Exams", item: "https://unschool.academy/exams" },
    { "@type": "ListItem", position: 3, name: "JFT-Basic", item: "https://unschool.academy/exams/jft-basic" },
  ],
};

/* Built from the same FAQS array the accordion renders, so visible copy and
   structured data cannot drift apart. */
const faqPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

const CTA_LABELS: Record<string, string> = {
  "Script and Vocabulary": "Practice vocabulary",
  "Conversation and Expression": "Practice conversation",
  "Listening Comprehension": "Practice listening",
  "Reading Comprehension": "Practice reading",
};

export default function JftBasicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />

      {/* Authored type-as-hero header: grain + ambient radials on a paper
          surface, keyword-bearing kicker, one primary action. */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(42rem 30rem at 12% -8%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(36rem 26rem at 88% 12%, rgba(49,91,135,0.10), transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Breadcrumbs trail={TRAIL} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="guide-reveal text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-4 font-mono">
                JFT-Basic · Free practice
              </p>
              <h1 className="guide-reveal font-display text-[clamp(2.75rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] text-ink text-balance">
                Practice the Japanese you&apos;ll use on Monday morning
              </h1>
              <p className="guide-reveal mt-5 text-lg text-slate max-w-2xl leading-relaxed">
                {JFT_PROGRAM.tagline}. The JFT-Basic is run by the Japan Foundation for people planning
                to live and work in Japan. So we drill the everyday language the test actually measures:
                reading a notice, following a conversation, catching the point of an announcement.
              </p>
              <div className="guide-reveal mt-4 flex flex-wrap items-center gap-2">
                <Badge tone="success">Live pilot</Badge>
                <Badge tone="info">Exam facts verified {JFT_PROGRAM.lastVerified}</Badge>
              </div>
              <Callout title="Independent preparation" tone="info">
                Unschool Academy is not affiliated with the Japan Foundation. For official test
                information, see the{" "}
                <a href={JFT_PROGRAM.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-academy-blue hover:underline">
                  official JFT-Basic pages
                </a>
                <span className="sr-only"> (opens in new tab)</span>
                . Exam facts below were verified against those pages on {JFT_PROGRAM.lastVerified}.
              </Callout>
              <div className="mt-7">
                <Button href="/exams/jft-basic/diagnostic" size="lg">Try the free diagnostic</Button>
                <p className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-slate">
                  10 questions · about 5 minutes · no account
                </p>
                <p className="mt-4 text-sm">
                  <a
                    href={JFT_PROGRAM.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-academy-blue font-semibold hover:underline"
                  >
                    Official JFT-Basic information <span aria-hidden="true">↗</span>
                  </a>
                  <span className="sr-only"> (opens in new tab)</span>
                </p>
              </div>
            </div>
            <Art
              src="/img/jft-hero.webp"
              alt="A Tokyo side street at dusk with warm lantern bokeh, a student with a notebook softly out of focus in the foreground"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Honest content-state strip: real, verifiable counts. */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6 text-sm">
            <div className="flex items-baseline gap-3">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Diagnostic</dt>
              <dd className="font-bold text-ink tabular-nums">10 questions</dd>
            </div>
            <div className="flex items-baseline gap-3">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Practice</dt>
              <dd className="font-bold text-ink tabular-nums">{PRACTICE_COUNT} questions · 4 topics</dd>
            </div>
            <div className="flex items-baseline gap-3">
              <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate">Mock</dt>
              <dd className="font-bold text-ink tabular-nums">{MOCK_COUNT} questions · 30 minutes</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sticky subnav */}
      <nav aria-label="JFT-Basic sections" className="sticky top-[72px] z-30 bg-paper border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex gap-1 overflow-x-auto thin-scroll">
          {[
            ["Overview", "#overview"],
            ["The official test", "#official-test"],
            ["Topics", "#topics"],
            ["Practice", "#practice"],
            ["Pricing", "#pricing"],
            ["FAQs", "#faqs"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="px-4 py-3 text-sm font-semibold text-slate hover:text-academy-blue whitespace-nowrap">
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* The diagnostic funnel: what five minutes actually buys you. */}
      <Section id="overview">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono">
          The program
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance mb-10 md:mb-12">
          What your five minutes buy you
        </h2>
        <ol className="grid sm:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              n: "01",
              title: "Answer 10 original questions",
              body: "About five minutes. No timer, no account, no fake result gate.",
            },
            {
              n: "02",
              title: "See your topic-by-topic gap map",
              body: "Your score broken down across the four test sections, weakest first.",
            },
            {
              n: "03",
              title: "Follow the starter plan",
              body: "A concrete next step for each weak topic. Not a percentile invented to flatter you.",
            },
          ].map((s) => (
            <li key={s.n} className="border-t-2 border-ink pt-5">
              <p className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal" aria-hidden="true">
                {s.n}
              </p>
              <h3 className="mt-2 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[15px] text-slate leading-relaxed">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Topic index: hairline-ruled rows with real counts, not identical cards. */}
      <Section id="topics" className="bg-paper border-y border-border">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono">
          The four sections
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance mb-10 md:mb-12">
          Practice each section on its own
        </h2>
        <ul className="border-y border-border divide-y divide-border">
          {PRACTICE_TOPICS.map((t, i) => {
            const count = practiceByTopic(t).length;
            return (
              <li key={t}>
                <Link
                  href={`/exams/jft-basic/practice/${SLUGS[t]}`}
                  aria-label={`Practice ${t} — ${count} questions, answers checked as you go`}
                  className="group flex items-center gap-5 md:gap-8 py-6 md:py-7 px-2 md:px-4 -mx-2 md:-mx-4 rounded-xl transition-colors duration-200 ease-signature hover:bg-canvas active:scale-[0.995]"
                >
                  <span
                    aria-hidden
                    className="shrink-0 w-12 md:w-16 text-4xl md:text-5xl font-extrabold tabular-nums text-academy-blue/25 select-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xl md:text-2xl font-bold text-ink">{t}</span>
                    <span className="block text-slate text-[15px] mt-1 leading-relaxed">
                      {TOPIC_INFO[t]}
                    </span>
                    <span className="block mt-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                      {count} questions · check as you go · 1 hint per question
                    </span>
                  </span>
                  <span className="shrink-0 hidden sm:inline-flex items-center gap-2 font-semibold text-academy-blue whitespace-nowrap">
                    {CTA_LABELS[t]}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 ease-signature group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-sm text-slate">
          Not sure where you are weakest?{" "}
          <Link href="/exams/jft-basic/diagnostic" className="text-academy-blue font-semibold hover:underline">
            Start with the free diagnostic
          </Link>{" "}
          and let it rank your topics.
        </p>
      </Section>

      <Section id="official-test">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono">
          The official test
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
          What the JFT-Basic actually is
        </h2>
        <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-3xl">
          Verified {JFT_PROGRAM.lastVerified} against the Japan Foundation&apos;s official JFT-Basic pages.
          Our practice mirrors these four sections. Our scores do not predict official results.
        </p>
        <div className="mt-10 grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-ink mb-3">Purpose</h3>
            <p className="text-slate leading-relaxed text-[15px]">{JFT_PROGRAM.officialFacts.purpose}</p>
            <p className="text-slate leading-relaxed text-[15px] mt-3">
              <span className="font-semibold text-ink">Used for residence applications:</span>{" "}
              {JFT_PROGRAM.officialFacts.usedFor.join(", ")}.
            </p>
            <h3 className="text-xl font-bold text-ink mt-8 mb-3">Format</h3>
            <ul className="space-y-2 text-[15px] text-slate">
              <li>{JFT_PROGRAM.officialFacts.format} · {JFT_PROGRAM.officialFacts.questions} questions · {JFT_PROGRAM.officialFacts.duration}</li>
              <li>{JFT_PROGRAM.officialFacts.listeningRules}</li>
              <li>No oral or written-expression questions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink mb-3">Scoring &amp; levels</h3>
            <p className="text-slate text-[15px] leading-relaxed">{JFT_PROGRAM.officialFacts.scoring}. There is no per-section minimum. Proficiency is assessed across all four sections together.</p>
            <ul className="mt-4 border-t border-border divide-y divide-border">
              {JFT_PROGRAM.officialFacts.levels.map((l) => (
                <li key={l.level} className="flex items-center justify-between py-3">
                  <span className="font-bold text-ink">{l.level}</span>
                  <span className="text-slate text-sm tabular-nums">score {l.range}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate">Below 145 appears as “*”. Levels follow the CEFR framework.</p>
            <h3 className="text-xl font-bold text-ink mt-8 mb-3">Results &amp; retakes</h3>
            <p className="text-slate text-[15px] leading-relaxed">{JFT_PROGRAM.officialFacts.results} {JFT_PROGRAM.officialFacts.retake}.</p>
          </div>
        </div>
        <p className="mt-8 text-sm text-slate">
          Source:{" "}
          <a href={JFT_PROGRAM.officialUrl} target="_blank" rel="noopener noreferrer" className="text-academy-blue font-semibold hover:underline">
            Japan Foundation — JFT-Basic official pages
            <span className="sr-only"> (opens in new tab)</span>
          </a>
          . Re-verified at least every 30 days before publication.
        </p>
      </Section>

      <Section id="practice" className="bg-paper border-y border-border">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono">
          Free diagnostic
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
          See where you stand in five minutes
        </h2>
        <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-3xl">
          Ten original questions. An instant topic-by-topic breakdown. Explanations for every answer,
          labeled as drafts pending SME review. No account, no paywall, no fake result gate.
        </p>
        <div className="mt-7">
          <Button href="/exams/jft-basic/diagnostic" size="lg">Start diagnostic</Button>
          <p className="mt-4 text-sm text-slate">
            Prefer a different entry?{" "}
            <Link href="/exams/jft-basic/topics" className="text-academy-blue font-semibold hover:underline">Practice by topic</Link>
            {" · "}
            <Link href="/exams/jft-basic/mock-tests" className="text-academy-blue font-semibold hover:underline">Timed mocks</Link>
            {" · "}
            <Link href="/exams/jft-basic/syllabus" className="text-academy-blue font-semibold hover:underline">Syllabus map</Link>
            {" · "}
            <Link href="/exams/how-practice-works" className="text-academy-blue font-semibold hover:underline">How scoring works</Link>
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-bold text-ink mb-3">What your result tells you</h3>
            <ul className="space-y-3 text-[15px] text-slate">
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> Your score by topic. Exactly where you&apos;re strong and where to focus next</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> A plain-language explanation for every question, drafted in-house and pending Japanese SME review</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> A concrete next step. Not a percentile invented to flatter you</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-bold text-ink mb-3">What it honestly cannot tell you</h3>
            <ul className="space-y-3 text-[15px] text-slate">
              <li className="flex gap-3"><span className="text-amber-600 font-bold" aria-hidden="true">✗</span> Your official JFT-Basic result or your chances of passing</li>
              <li className="flex gap-3"><span className="text-amber-600 font-bold" aria-hidden="true">✗</span> Anything about immigration or visa eligibility. Ask an expert, not a quiz</li>
            </ul>
          </Card>
        </div>

        <Card className="mt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-bold text-ink text-lg">Try one real question</h3>
            <Badge tone="neutral">Sample · draft, pending SME review</Badge>
          </div>
          <p className="text-sm text-slate mb-2">
            {SAMPLE_QUESTION.topic} — from the free 10-question diagnostic
          </p>
          <p className="text-ink leading-relaxed">{SAMPLE_QUESTION.stem}</p>
          {SAMPLE_QUESTION.stemJp && (
            <p lang="ja" className="mt-2 text-ink leading-relaxed">
              {SAMPLE_QUESTION.stemJp}
            </p>
          )}
          <ul className="mt-4 space-y-2">
            {SAMPLE_QUESTION.options.map((o) => (
              <li
                key={o.id}
                className="border border-border rounded-xl px-4 py-2.5 text-[15px] text-slate"
              >
                <span className="font-bold text-ink mr-2">{o.id.toUpperCase()}.</span>
                {o.text}
                {o.textJp && <span lang="ja" className="text-ink"> — {o.textJp}</span>}
              </li>
            ))}
          </ul>
          <details className="mt-4 border border-border rounded-xl px-4 py-3">
            <summary className="cursor-pointer font-semibold text-academy-blue">
              Show answer and explanation
            </summary>
            <p className="mt-2 text-[15px] text-slate">
              Correct answer:{" "}
              <strong className="text-ink">
                {SAMPLE_CORRECT?.id.toUpperCase()}. {SAMPLE_CORRECT?.text}
              </strong>
            </p>
            <p className="mt-1 text-[15px] text-slate">{SAMPLE_QUESTION.explanation}</p>
            <p className="mt-2 text-[15px] text-slate">
              Got it wrong? That is the diagnostic working. It just found your first topic to fix.
            </p>
          </details>
          <p className="mt-4 text-sm text-slate">
            In the diagnostic, this question plays as audio with the transcript shown. The format is the
            same across all ten questions.{" "}
            <Link
              href="/exams/jft-basic/diagnostic"
              className="text-academy-blue font-semibold hover:underline"
            >
              Try the full diagnostic free
            </Link>
            .
          </p>
        </Card>
      </Section>

      <Section id="pricing">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-academy-teal mb-3 font-mono text-center">
          Pilot pricing (illustrative)
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance text-center">
          Free to start. Simple pilot pricing.
        </h2>
        <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-2xl mx-auto text-center">
          Pilot prices while the program is in review. Every plan states exactly which content it
          unlocks. No vague bundles, nothing infinite.
        </p>

        <div className="mt-12 grid lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
          {/* 60-day pass dossier */}
          <div className="lg:col-span-4 border-t-2 border-ink pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-extrabold tracking-tight text-ink">60-day pass</h3>
              <Badge tone="info">Pilot · test mode</Badge>
            </div>
            <p className="mt-3 text-5xl font-extrabold tracking-[-0.03em] text-ink" aria-label="₹699, one-time illustrative payment for 60 days of access">
              ₹699
              <span className="ml-3 align-middle text-sm font-semibold tracking-normal text-slate">
                one-time · illustrative
              </span>
            </p>
            <dl className="mt-6 border-t border-border divide-y divide-border">
              <div className="py-3.5 flex flex-col sm:flex-row sm:gap-6">
                <dt className="shrink-0 w-40 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate pt-0.5">What&apos;s included</dt>
                <dd className="text-[15px] text-slate leading-relaxed">Topic practice path: {PRACTICE_COUNT} original questions across 4 topics (drafts pending expert review). 30-minute timed mock drawn from the same draft set.</dd>
              </div>
              <div className="py-3.5 flex flex-col sm:flex-row sm:gap-6">
                <dt className="shrink-0 w-40 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate pt-0.5">Roadmap</dt>
                <dd className="text-[15px] text-slate leading-relaxed">Study plan + attempt history: building during the pilot.</dd>
              </div>
              <div className="py-3.5 flex flex-col sm:flex-row sm:gap-6">
                <dt className="shrink-0 w-40 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate pt-0.5">Access</dt>
                <dd className="text-[15px] text-slate leading-relaxed">60 days access from purchase. No real charges during the pilot.</dd>
              </div>
            </dl>
            <div className="mt-6"><Button href="/signup">Join the pilot</Button></div>
          </div>
          {/* Free rail */}
          <div className="lg:col-span-2 border-t-2 border-border pt-6">
            <h3 className="text-xl font-extrabold tracking-tight text-ink">Free</h3>
            <p className="mt-3 text-5xl font-extrabold tracking-[-0.03em] text-ink" aria-label="₹0, free">
              ₹0
            </p>
            <ul className="mt-6 space-y-2.5 text-[15px] text-slate">
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> 10-question diagnostic</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> {PRACTICE_COUNT} topic practice questions (draft)</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> 30-minute timed mock</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold" aria-hidden="true">✓</span> Topic breakdown + draft explanations</li>
            </ul>
            <div className="mt-6"><Button href="/exams/jft-basic/diagnostic" variant="secondary">Start free</Button></div>
          </div>
        </div>

        {/* 7-day revision row */}
        <div className="mt-10 max-w-5xl mx-auto border-t border-border pt-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-ink">
              7-day revision sprint · ₹199{" "}
              <span className="text-sm font-semibold text-slate">one-time · illustrative</span>
            </h3>
            <p className="mt-1.5 text-[15px] text-slate leading-relaxed max-w-md">
              Revision drills across the four topics. Draft questions, pending SME review. 7 days of access.
            </p>
          </div>
          <Button href="/signup" variant="secondary">Get early access</Button>
        </div>

        <p className="text-center text-sm text-slate mt-8 max-w-2xl mx-auto">
          Prices shown are illustrative pilot prices: unvalidated test hypotheses, not final pricing.
          We will confirm final prices before any real payment. Checkout is in test mode during the
          pilot. No real charges. Paid access activates after payment integration completes.
        </p>
      </Section>

      <Section id="faqs" className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="FAQ" title="JFT-Basic questions, answered" />
          <FAQAccordion items={FAQS} />
          <p className="mt-8 text-sm text-slate">
            Reviewers &amp; sources: questions drafted in-house, pending Japanese SME review.
            Official exam information:{" "}
            <Link href={JFT_PROGRAM.officialUrl} className="text-academy-blue hover:underline">
              Japan Foundation JFT-Basic
            </Link>
            . Last content review: not yet completed. This page is a staged draft.
          </p>
        </div>
      </Section>
    </>
  );
}
