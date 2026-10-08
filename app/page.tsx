import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, FAQAccordion, Badge } from "@/components/ui";
import { JftSampler, KidsSampler } from "@/components/samplers";
import { Momo, Tara, Bobo } from "@/components/characters";

export const metadata: Metadata = {
  title: "Unschool Academy — Don't just study. Practise until it makes sense.",
  description:
    "Focused exam preparation and joyful learning for ages 2 through Grade 5 — built around things learners can actually do.",
};

const STEPS = [
  { n: "01", title: "Explore", body: "Find the exam or age track that fits. Read verified syllabi and learning goals — plain facts, zero hype." },
  { n: "02", title: "Try", body: "Take the free diagnostic or play a full sample quest. Real questions, real interactions, nothing held back." },
  { n: "03", title: "Learn", body: "Follow a topic-by-topic plan: original practice, clear explanations for every answer, hints that teach instead of telling." },
  { n: "04", title: "See progress", body: "Topic-level scores and observed skills — honest evidence of what clicked and what still needs work." },
];

const FAQS = [
  {
    q: "Is Unschool Academy affiliated with the exam boards?",
    a: "No. Unschool Academy is an independent practice and learning service. Exam names belong to their respective owners, and our practice scores are unofficial — they measure your practice performance, not your official result.",
  },
  {
    q: "What does the free diagnostic include?",
    a: "Ten original JFT-Basic-style questions across all four official sections, with instant topic feedback and reviewed explanations. No account needed, five minutes of your time, and your result is never held behind a paywall.",
  },
  {
    q: "How does Unschool Kids keep children safe?",
    a: "Child profiles live under a parent-owned account. Child mode has no ads, no purchases, no external links, no social features and no open-ended AI chat. Parents control consent, data, billing and deletion from the Parent Hub.",
  },
  {
    q: "Do you really only have one exam program right now?",
    a: "Yes — and we say so proudly. JFT-Basic is our pilot: one complete, reviewed preparation path. Our 500-exam research catalogue stays internal until each program passes verification and content review. We'd rather do one exam brilliantly than 500 badly.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-academy-blue/10 via-canvas to-canvas pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-academy-teal mb-4">
            Two doors. One promise: learn by doing.
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink max-w-3xl leading-[1.08]">
            Don&apos;t just study. Practise until it makes sense.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate leading-relaxed max-w-2xl">
            Crack your exam with practice that shows its work — or watch your four-year-old learn
            counting from a mango thief. Every lesson here is something you <span className="font-semibold text-ink">do</span>, never
            something you merely read.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/exams" size="lg">Explore Exams</Button>
            <Button href="/kids" size="lg" variant="kids">Explore Kids</Button>
          </div>
          <p className="mt-3 text-sm text-slate">Free 10-question diagnostic — no account needed.</p>
        </div>
      </div>

      {/* TWO PRODUCT CARDS */}
      <Section className="pt-4">
        <div className="grid md:grid-cols-2 gap-6">
          <Card hover className="relative overflow-hidden">
            <Badge tone="info">Unschool Exams</Badge>
            <h2 className="mt-4 text-2xl md:text-3xl font-extrabold text-ink">Exam prep that shows its work</h2>
            <p className="mt-3 text-slate leading-relaxed">
              Starting with JFT-Basic everyday Japanese: a free 10-question diagnostic, topic-mapped
              practice with reviewed explanations, and timed mocks. Every score is deterministic —
              real maths on your real answers, never invented percentiles.
            </p>
            <ul className="mt-5 space-y-2 text-[15px] text-slate">
              <li>✓ Free 10-question diagnostic — no account, no paywall</li>
              <li>✓ Original questions, each with a reviewed explanation</li>
              <li>✓ Honest unofficial scores — we never promise a pass</li>
            </ul>
            <div className="mt-6">
              <Button href="/exams/jft-basic">Start with JFT-Basic</Button>
            </div>
          </Card>
          <Card hover className="relative overflow-hidden !bg-kids-cream !border-kids-orange/30">
            <Badge tone="kids">Unschool Kids</Badge>
            <div className="flex gap-3 mt-4" aria-hidden>
              <Momo className="w-16 h-16 animate-idle" />
              <Tara className="w-16 h-16 animate-idle" />
              <Bobo className="w-16 h-16 animate-idle" />
            </div>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-ink">A village where learning feels like play</h2>
            <p className="mt-3 text-slate leading-relaxed">
              Momo, Tara and Bobo guide children from age 2 to Grade 5 through real interactive
              quests — counting mangoes, ordering stories, meeting the world — with gentle hints,
              warm encouragement, and off-screen adventures. Parent-owned and ad-free, always.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/kids" variant="kids">Enter Kids World</Button>
              <Button href="/kids/for-parents" variant="ghost">For parents</Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* LIVE SAMPLERS */}
      <Section className="!py-10">
        <SectionHeading
          eyebrow="Try it now"
          title="Taste it before you trust it"
          sub="No signup, no paywall, no sales pitch. Below is the real thing — a question from our JFT pilot and a moment from Momo's mango quest."
        />
        <div className="grid md:grid-cols-2 gap-6">
          <JftSampler />
          <KidsSampler />
        </div>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="bg-paper border-y border-border">
        <SectionHeading
          eyebrow="Method"
          title="One honest loop, every age"
          sub="The same learning rhythm for a 30-year-old exam candidate and a 4-year-old counter: try, get feedback, try smarter."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="relative">
              <p className="text-5xl font-extrabold text-academy-blue/15" aria-hidden>{s.n}</p>
              <h3 className="text-xl font-bold text-ink -mt-6 mb-2">{s.title}</h3>
              <p className="text-slate leading-relaxed text-[15px]">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/how-it-works" variant="secondary">Read the full method</Button>
        </div>
      </Section>

      {/* REVIEW STANDARDS */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Review standards"
              title="Every answer has a source. Every claim has a reviewer."
              sub="Our practice content passes a real pipeline — drafting, fact and language checks, subject-expert review, accessibility check, QA — before it reaches you. Drafts never ship as live content, and reviewers never grade their own work."
            />
            <ul className="space-y-3 text-slate">
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> JFT facts verified against the Japan Foundation&apos;s official JFT-Basic pages</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> Original questions only — never scraped past papers or question dumps</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> Kids quests reviewed by educators before any child sees them</li>
              <li className="flex gap-3"><span className="text-academy-teal font-bold">✓</span> Versioned content — improving a question never rewrites your past results</li>
            </ul>
          </div>
          <Card className="bg-gradient-to-br from-academy-blue to-academy-teal !border-0 text-white">
            <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">Our defining claim</p>
            <p className="text-2xl md:text-3xl font-extrabold leading-snug">
              &ldquo;Unschool Academy helps you learn by doing — focused exam practice for adult learners,
              imaginative real learning for young children.&rdquo;
            </p>
            <p className="mt-4 text-white/70 text-sm">Pilot status: JFT-Basic diagnostic live. Paid paths and Kids quests in staged review.</p>
          </Card>
        </div>
      </Section>

      {/* PRICING TEASER */}
      <Section className="!pt-0">
        <Card className="text-center !p-10 md:!p-14">
          <SectionHeading
            eyebrow="Pricing"
            title="Start free. Pay only for depth."
            sub="The diagnostic and sample quests are free forever — no trial clock, no card required. Paid plans are finite, clearly scoped, and easy to cancel. Prices shown are illustrative while checkout is in staged testing."
          />
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="border border-border rounded-2xl p-6">
              <p className="font-bold text-ink">Free</p>
              <p className="text-3xl font-extrabold mt-1">₹0</p>
              <p className="text-sm text-slate mt-2">JFT diagnostic + sample quests, forever.</p>
            </div>
            <div className="border-2 border-academy-blue rounded-2xl p-6 relative">
              <span className="absolute -top-3 left-6 bg-academy-blue text-white text-xs font-bold px-3 py-1 rounded-full">Pilot</span>
              <p className="font-bold text-ink mt-2">JFT-Basic 60-day pass</p>
              <p className="text-3xl font-extrabold mt-1">₹699</p>
              <p className="text-sm text-slate mt-2">Full practice path + timed mocks. Pilot pricing.</p>
            </div>
            <div className="border border-border rounded-2xl p-6">
              <p className="font-bold text-ink">Kids family</p>
              <p className="text-3xl font-extrabold mt-1">₹249<span className="text-base font-semibold text-slate">/mo</span></p>
              <p className="text-sm text-slate mt-2">All quests, parent dashboard. Or ₹399 one-time pack.</p>
            </div>
          </div>
          <div className="mt-8">
            <Button href="/pricing" variant="secondary">Compare all plans</Button>
          </div>
        </Card>
      </Section>

      {/* FAQ */}
      <Section className="!pt-0">
        <div className="max-w-3xl mx-auto">
          <SectionHeading eyebrow="Questions" title="Asked often, answered honestly" />
          <FAQAccordion items={FAQS} />
        </div>
      </Section>
    </>
  );
}
