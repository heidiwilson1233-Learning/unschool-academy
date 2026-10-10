import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs, Button, Badge, Section, SectionHeading, Card, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Unschool Method — How Learning Works Here",
  description:
    "Exam → subject → part → skill → level. A 7-step learning loop, four levels from foundation to exam mastery, and a kids world grown from 500 books. This is the Unschool Academy learning architecture.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "The Unschool Method — How Learning Works Here",
    description: "The learning architecture: hierarchy, loop, levels, and the kids world.",
    type: "website",
    url: "/how-it-works",
  },
};

const TRAIL = [{ label: "Home", href: "/" }, { label: "How it Works" }];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const LOOP = [
  { n: "1", title: "Diagnose", body: "A 15-minute adaptive test finds your true level per skill. No generic 'beginner' bucket — you start exactly where you are." },
  { n: "2", title: "Learn", body: "Watch the lesson video, read the key points, study one worked example. Every lesson is curated or researched, never invented." },
  { n: "3", title: "Practice", body: "10 questions at your level. Not 10,000 to drown in — your next 10. The bank is the reservoir; the path is the product." },
  { n: "4", title: "Understand", body: "Every wrong answer opens the full explanation: why the right answer is right, why each distractor is wrong. Hints come before answers, never after." },
  { n: "5", title: "Retain", body: "Wrong answers collect into your personal error-log deck, resurfaced by spaced repetition — 1 day, 3 days, 7 days, 30 days." },
  { n: "6", title: "Master", body: "Score 80%+ on a skill's level set to unlock the next level. Your mastery dashboard shows every skill as a bar you fill." },
  { n: "7", title: "Prove", body: "Full mock tests under real exam timing. Score, weak-skill report — and the loop sends you back to Learn for exactly those skills." },
];

const LEVELS = [
  { n: "L1", name: "Foundation", desc: "Concepts, terminology, first principles. The ground everything stands on.", tone: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { n: "L2", name: "Intermediate", desc: "Application. Using the concept on real problems.", tone: "bg-amber-50 border-amber-200 text-amber-900" },
  { n: "L3", name: "Advanced", desc: "Multi-concept, exam-hard problems. Where toppers are made.", tone: "bg-orange-50 border-orange-200 text-orange-900" },
  { n: "L4", name: "Exam mastery", desc: "Timed, full-pattern mocks. Proof, not practice.", tone: "bg-ink text-white border-ink" },
];

const HIERARCHY = [
  { t: "Exam", d: "One of 506 — JEE Main, IELTS, UPSC, SAT…" },
  { t: "Subject", d: "The exam's official subjects — Physics, Chemistry, Maths" },
  { t: "Part", d: "Syllabus units — Mechanics, Electromagnetism, Optics" },
  { t: "Skill", d: "The testable micro-topic — Kinematics. The atomic unit." },
  { t: "Level", d: "L1 → L2 → L3 → L4. Beginner to exam-ready, in order." },
];

const KIDS_METHOD = [
  "The child chooses the character and the story; the system chooses the difficulty underneath.",
  "3 correct in a row → silently harder. A struggle → hints, never a red X.",
  "Characters remember: “Last time we counted to 10! Shall we try 12?”",
  "One 15-minute quest chain → celebration → off-screen play. Then it ends.",
  "500 books × 7 quest kinds ≈ 4,000 quests. One new book every week.",
];

function StepLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 font-semibold text-academy-blue hover:underline">
      {children}<span aria-hidden>→</span>
    </Link>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div aria-hidden className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mt-2 mb-5">
            The Unschool Method
          </p>
          <h1 className="text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-ink text-balance max-w-5xl">
            A path, not a pile.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            500,000 questions mean nothing without a way through them. So we built the way first:
            a hierarchy that organizes every exam, a loop that turns practice into learning,
            and levels that take you from zero to exam-ready. Here's the whole architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/exams" size="lg" variant="primary">Browse 506 exams</Button>
            <Button href="/kids" size="lg" variant="secondary">See the kids world</Button>
          </div>
        </div>
      </div>

      {/* HIERARCHY */}
      <Section>
        <SectionHeading eyebrow="The hierarchy" title="Every exam, same skeleton" sub="Exam → subject → part → skill → level. Learn it once, and you can navigate any of the 506 exams." tone="kids" />
        <div className="mx-auto max-w-3xl">
          {HIERARCHY.map((h, i) => (
            <div key={h.t} className="relative pl-10 pb-8 last:pb-0">
              {i < HIERARCHY.length - 1 && <div aria-hidden className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />}
              <span aria-hidden className="absolute left-[8px] top-1.5 h-4 w-4 rounded-full bg-paper border-2 border-academy-teal" />
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-xl font-extrabold text-ink">{h.t}</span>
                <span className="text-slate">{h.d}</span>
              </div>
            </div>
          ))}
          <Callout title="The key idea" tone="kids">
            A learner never browses "10,000 questions." They see <em>their next 10</em> — the path is the product, the bank is the reservoir.
          </Callout>
        </div>
      </Section>

      {/* LOOP */}
      <Section>
        <SectionHeading eyebrow="The learning loop" title="Seven steps. Then again." sub="Questions alone don't teach. This loop turns the bank into learning — same loop for every exam, every subject, every skill." tone="kids" />
        <ol className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOOP.map((s) => (
            <Card key={s.n} className="!p-6">
              <p className="text-4xl font-extrabold tracking-tight text-academy-teal-dark">{s.n}</p>
              <p className="mt-2 text-xl font-extrabold text-ink">{s.title}</p>
              <p className="mt-2 text-slate leading-relaxed">{s.body}</p>
            </Card>
          ))}
          <Card className="!p-6 bg-ink !border-ink flex flex-col justify-center">
            <p className="text-xl font-extrabold text-white">Weak skills loop back to Learn.</p>
            <p className="mt-2 text-white/70">The cycle repeats until mastery — then the next skill unlocks.</p>
            <div className="mt-4"><StepLink href="/exams"><span className="text-white">Try the diagnostic →</span></StepLink></div>
          </Card>
        </ol>
      </Section>

      {/* LEVELS */}
      <Section>
        <SectionHeading eyebrow="Beginner → advanced" title="Four levels, no skipping" sub="Content is produced in level order: L1 across all units before L2 begins. The diagnostic drops you at your true level." tone="kids" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEVELS.map((l) => (
            <div key={l.n} className={`rounded-2xl border-2 p-6 ${l.tone}`}>
              <p className="text-3xl font-extrabold">{l.n}</p>
              <p className="mt-1 text-lg font-bold">{l.name}</p>
              <p className="mt-2 text-sm opacity-80 leading-relaxed">{l.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* KIDS */}
      <Section>
        <SectionHeading eyebrow="The kids world" title="Smart learning from age 5" sub="A separate world with its own method: character-led, story-first, grown from 500 books." tone="kids" />
        <div className="grid md:grid-cols-2 gap-4">
          {KIDS_METHOD.map((m, i) => (
            <Card key={i} className="!p-6">
              <p className="text-ink leading-relaxed"><span className="font-extrabold text-kids-orange-deep mr-2">{i + 1}.</span>{m}</p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid sm:grid-cols-5 gap-3">
          {["📖 Words", "🔢 Numbers", "🔍 World", "💛 Values", "🎨 Create"].map((s) => (
            <Card key={s} className="!p-4 text-center"><p className="font-bold text-ink">{s}</p></Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button href="/kids" size="lg" variant="kids">Enter the kids world</Button>
        </div>
      </Section>

      {/* HONESTY */}
      <Section>
        <SectionHeading eyebrow="Honest by design" title="What we won't do" tone="kids" />
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="!p-6"><p className="font-bold text-ink">No invented facts</p><p className="mt-2 text-slate text-sm leading-relaxed">Every question carries its source — the book or official document it was researched from. Nothing invented, ever.</p></Card>
          <Card className="!p-6"><p className="font-bold text-ink">Draft until reviewed</p><p className="mt-2 text-slate text-sm leading-relaxed">All content ships marked draft pending expert review. The label is visible. No "reviewed" claims without a human expert.</p></Card>
          <Card className="!p-6"><p className="font-bold text-ink">No dark patterns for kids</p><p className="mt-2 text-slate text-sm leading-relaxed">No streaks, no leaderboards, no guilt for leaving. 15 minutes, then off-screen play.</p></Card>
        </div>
        <div className="mt-10 text-center">
          <Badge tone="kids">The method, in one page</Badge>
          <p className="mt-4 text-slate max-w-xl mx-auto">Hierarchy → loop → levels → honesty. That's the whole machine. Now go use it.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/exams" size="lg" variant="primary">Start learning</Button>
            <Button href="/kids/tracks/school-starters" size="lg" variant="kids">Start at age 5</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
