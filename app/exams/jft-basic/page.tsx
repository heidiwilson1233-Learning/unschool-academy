import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, FAQAccordion, Callout } from "@/components/ui";
import { JFT_PROGRAM, TOPIC_INFO } from "@/lib/exams";

export const metadata: Metadata = {
  title: "JFT-Basic Practice — Everyday Japanese",
  description:
    "Prepare for the JFT-Basic Japanese test with original practice: free 10-question diagnostic, topic-mapped practice with explanations, and timed mocks. Independent preparation, not affiliated with the Japan Foundation.",
};

const FAQS = [
  {
    q: "Is this an official JFT-Basic product?",
    a: "No. Unschool Academy is independent and not affiliated with the Japan Foundation. Our questions are original practice items written for everyday Japanese — not official past papers, which we never reproduce.",
  },
  {
    q: "Will my diagnostic score predict my official result?",
    a: "No. Your score measures performance on our 10 original practice questions. It shows which topics need work; it cannot predict an official JFT-Basic result or any immigration outcome.",
  },
  {
    q: "How is JFT-Basic different from JLPT?",
    a: "They are different tests by different organizers with different purposes. JFT-Basic assesses everyday Japanese needed for daily life in Japan; the JLPT's five levels (N5–N1) measure general Japanese proficiency. One is not a substitute for the other.",
  },
  {
    q: "What do the paid plans include?",
    a: "The 60-day pilot pass adds the full topic practice path (all four topics, many more reviewed questions) and timed mock tests. Exact question counts are published only for reviewed, live content.",
  },
];

export default function JftBasicPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "JFT-Basic" }]} />
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge tone="success">Live pilot</Badge>
            <Badge tone="info">Exam facts verified {JFT_PROGRAM.lastVerified}</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink max-w-3xl">
            JFT-Basic <span className="text-slate font-bold">practice</span>
          </h1>
          <p className="mt-4 text-lg text-slate max-w-2xl leading-relaxed">
            {JFT_PROGRAM.tagline}. The JFT-Basic is run by the Japan Foundation and assesses the
            everyday Japanese needed by people planning to live and work in Japan.
          </p>
          <Callout title="Independent preparation" tone="info">
            Unschool Academy is not affiliated with the Japan Foundation. For official test
            information, see the{" "}
            <a href={JFT_PROGRAM.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-academy-blue hover:underline">
              official JFT-Basic pages
            </a>
            . Exam facts below were verified against those pages on {JFT_PROGRAM.lastVerified}.
          </Callout>
          <div className="mt-6 flex flex-wrap gap-4">
            <Button href="/exams/jft-basic/diagnostic" size="lg">Try free diagnostic</Button>
            <Button href={JFT_PROGRAM.officialUrl} variant="secondary" size="lg">
              Official exam information ↗
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky subnav */}
      <nav aria-label="JFT-Basic sections" className="sticky top-[72px] z-30 bg-paper/95 backdrop-blur border-b border-border">
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

      <Section id="overview">
        <SectionHeading
          align="left"
          eyebrow="The program"
          title="Practice built for everyday Japanese"
          sub="Four topics, one diagnostic, and a practice path that tells you exactly where you stand — with explanations for every answer."
        />
        <div id="topics" className="grid sm:grid-cols-2 gap-4">
          {(Object.keys(TOPIC_INFO) as (keyof typeof TOPIC_INFO)[]).map((topic) => (
            <Card key={topic} hover>
              <h3 className="font-bold text-ink text-lg">{topic}</h3>
              <p className="text-slate text-[15px] mt-1">{TOPIC_INFO[topic]}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="official-test" className="bg-paper border-y border-border">
        <SectionHeading
          align="left"
          eyebrow="The official test"
          title="What the JFT-Basic actually is"
          sub={`Verified ${JFT_PROGRAM.lastVerified} against the Japan Foundation's official JFT-Basic pages. Our practice mirrors these four sections — our scores don't predict official results.`}
        />
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-ink mb-3">Purpose</h3>
            <p className="text-slate leading-relaxed text-[15px]">{JFT_PROGRAM.officialFacts.purpose}</p>
            <p className="text-slate leading-relaxed text-[15px] mt-3">
              <span className="font-semibold text-ink">Used for residence applications:</span>{" "}
              {JFT_PROGRAM.officialFacts.usedFor.join(", ")}.
            </p>
            <h3 className="text-xl font-bold text-ink mt-6 mb-3">Format</h3>
            <ul className="space-y-2 text-[15px] text-slate">
              <li>• {JFT_PROGRAM.officialFacts.format} · {JFT_PROGRAM.officialFacts.questions} questions · {JFT_PROGRAM.officialFacts.duration}</li>
              <li>• {JFT_PROGRAM.officialFacts.listeningRules}</li>
              <li>• No oral or written-expression questions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink mb-3">Scoring & levels</h3>
            <p className="text-slate text-[15px] leading-relaxed">{JFT_PROGRAM.officialFacts.scoring}. There is no per-section minimum — proficiency is assessed across all four sections together.</p>
            <div className="mt-4 space-y-2">
              {JFT_PROGRAM.officialFacts.levels.map((l) => (
                <div key={l.level} className="flex items-center justify-between bg-canvas border border-border rounded-xl px-4 py-2.5">
                  <span className="font-bold text-ink">{l.level}</span>
                  <span className="text-slate text-sm tabular-nums">score {l.range}</span>
                </div>
              ))}
              <p className="text-xs text-slate">Below 145 appears as “*”. Levels follow the CEFR framework.</p>
            </div>
            <h3 className="text-xl font-bold text-ink mt-6 mb-3">Results & retakes</h3>
            <p className="text-slate text-[15px] leading-relaxed">{JFT_PROGRAM.officialFacts.results}. {JFT_PROGRAM.officialFacts.retake}.</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate">
          Source:{" "}
          <a href={JFT_PROGRAM.officialUrl} target="_blank" rel="noopener noreferrer" className="text-academy-blue font-semibold hover:underline">
            Japan Foundation — JFT-Basic official pages
          </a>
          . Re-verified at least every 30 days before publication.
        </p>
      </Section>

      <Section id="practice" className="bg-paper border-y border-border">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Free forever"
              title="Start with the diagnostic"
              sub="Ten original questions. Instant topic breakdown. Reviewed explanations. No account, no paywall, no fake result gate."
            />
            <div className="flex flex-wrap gap-4">
              <Button href="/exams/jft-basic/diagnostic" size="lg">Start diagnostic</Button>
              <Button href="/exams/jft-basic/topics" variant="secondary">Practice by topic</Button>
              <Button href="/exams/jft-basic/mock-tests" variant="secondary">Timed mocks</Button>
              <Button href="/exams/how-practice-works" variant="ghost">How scoring works</Button>
            </div>
          </div>
          <Card>
            <h3 className="font-bold text-ink mb-3">What your result tells you</h3>
            <ul className="space-y-3 text-[15px] text-slate">
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> Your score by topic — where you're strong, where to focus</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> A plain-English (and 日本語) explanation for every question</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> A concrete next step, not a percentile pulled from thin air</li>
            </ul>
            <h3 className="font-bold text-ink mt-6 mb-3">What it cannot tell you</h3>
            <ul className="space-y-3 text-[15px] text-slate">
              <li className="flex gap-3"><span className="text-amber-600 font-bold">✗</span> Your official JFT-Basic result or pass likelihood</li>
              <li className="flex gap-3"><span className="text-amber-600 font-bold">✗</span> Anything about immigration or visa eligibility</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section id="pricing">
        <SectionHeading
          eyebrow="Pilot pricing"
          title="Free diagnostic. Paid depth."
          sub="Pilot prices while the program is in review. Every plan states exactly what reviewed content it includes."
        />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <h3 className="font-bold text-ink text-lg">Free</h3>
            <p className="text-3xl font-extrabold mt-2">₹0</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ 10-question diagnostic</li>
              <li>✓ Topic breakdown + explanations</li>
              <li>✓ Sample practice questions</li>
            </ul>
            <div className="mt-6"><Button href="/exams/jft-basic/diagnostic" variant="secondary" size="sm">Start free</Button></div>
          </Card>
          <Card className="!border-2 !border-academy-blue relative">
            <span className="absolute -top-3 left-6 bg-academy-blue text-white text-xs font-bold px-3 py-1 rounded-full">Pilot</span>
            <h3 className="font-bold text-ink text-lg mt-1">60-day pass</h3>
            <p className="text-3xl font-extrabold mt-2">₹699</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Full topic practice path</li>
              <li>✓ Timed mock tests</li>
              <li>✓ Study plan + progress history</li>
              <li>✓ 60 days access, cancellable</li>
            </ul>
            <div className="mt-6"><Button href="/signup" size="sm">Get the pass</Button></div>
          </Card>
          <Card>
            <h3 className="font-bold text-ink text-lg">7-day revision</h3>
            <p className="text-3xl font-extrabold mt-2">₹199</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Focused revision pack</li>
              <li>✓ Timed drills</li>
              <li>✓ 7 days access</li>
            </ul>
            <div className="mt-6"><Button href="/signup" variant="secondary" size="sm">Get revision pack</Button></div>
          </Card>
        </div>
        <p className="text-center text-sm text-slate mt-6 max-w-2xl mx-auto">
          Checkout is in test mode during the pilot — no real charges. Paid access activates after
          payment integration completes.
        </p>
      </Section>

      <Section id="faqs" className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="FAQ" title="JFT-Basic questions, answered" />
          <FAQAccordion items={FAQS} />
          <p className="mt-8 text-sm text-slate">
            Reviewers & sources: questions drafted in-house, pending Japanese SME review.
            Official exam information:{" "}
            <Link href={JFT_PROGRAM.officialUrl} className="text-academy-blue hover:underline">
              Japan Foundation JFT-Basic
            </Link>
            . Last content review: not yet completed — this page is a staged draft.
          </p>
        </div>
      </Section>
    </>
  );
}
