import type { Metadata } from "next";
import { Section, Breadcrumbs, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "About — Method, Review Standards & Honesty",
  description:
    "About Unschool Academy: our learn-by-doing method, content review pipeline, and what we refuse to claim.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Method, Review Standards & Honesty",
    description:
      "Practice-first learning for exams and young children: our learn-by-doing method, content review pipeline, and what we refuse to claim.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About — Method, Review Standards & Honesty",
    description: "Our learn-by-doing method, content review pipeline, and what we refuse to claim.",
  },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const TRAIL = [{ label: "Home", href: "/" }, { label: "About" }];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: "https://unschool.academy" + t.href } : {}),
  })),
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About — Method, Review Standards & Honesty",
  url: "https://unschool.academy/about",
  about: {
    "@type": "Organization",
    name: "Unschool Academy",
    url: "https://unschool.academy",
  },
};

/* The five gates every module must clear before it ships. Verbatim from the MD method. */
const FIVE_QUESTIONS = [
  "Who needs this",
  "Which skill improves",
  "What the learner actually does",
  "Where the correct answer comes from",
  "What progress we can honestly report",
];

/* The six-gate review pipeline, copy hardened with concrete mechanics only. */
const PIPELINE = [
  {
    n: "01",
    title: "Draft",
    detail: "Written by our content team.",
  },
  {
    n: "02",
    title: "Fact and language check",
    detail: "Answers are checked against their source of correctness.",
  },
  {
    n: "03",
    title: "Subject-expert review",
    detail: "The drafter never approves their own work.",
  },
  {
    n: "04",
    title: "Accessibility check",
    detail: "Checked for contrast, keyboard access, and screen-reader labels.",
  },
  {
    n: "05",
    title: "QA in staging",
    detail: "Tested end to end in staging before publication.",
  },
  {
    n: "06",
    title: "Published — then re-checked",
    detail: "Re-checked whenever learners report errors; corrections are disclosed.",
  },
];

/* Jittered reveal delays — never linear. Mirrors the how-it-works loop. */
const REVEAL_DELAYS = ["0ms", "52ms", "91ms", "64ms", "83ms", "45ms"];

/* Role-level reviewer transparency. No names, no invented credentials. */
const REVIEWERS = [
  {
    role: "Subject reviewers",
    text: "An independent reviewer verifies every exam module before publication. The person who writes a question never approves it.",
  },
  {
    role: "Kids safety",
    text: "Children's content clears a legal safety review before it ships.",
  },
  {
    role: "After publication",
    text: "Content is re-checked whenever learners report errors, and corrections are disclosed.",
  },
];

const LIMITS = [
  "Not an accredited school, certifying authority, or official exam provider.",
  "Not affiliated with any examination body unless specifically stated.",
  "We make no promise of scores, admissions, visas, or faster child development.",
  "Not a fully autonomous AI teacher: AI assists production, humans review and approve.",
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />

      {/* ---------- Authored hero ---------- */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(52rem 26rem at 12% -10%, rgba(49,91,135,0.14), transparent 60%), radial-gradient(44rem 24rem at 88% 8%, rgba(20,125,117,0.12), transparent 60%)`,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal mb-4">
            Our standards
          </p>
          <h1 className="text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-4xl">
            Learning that shows its work.
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            Unschool Academy is practice-first: focused exam preparation for adults, imaginative
            real learning for young children. This page lists what we claim — and what we refuse
            to.
          </p>
        </div>
      </div>

      {/* ---------- Method: offset editorial split ---------- */}
      <Section>
        <div aria-labelledby="method-h" className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2
              id="method-h"
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink"
            >
              Doing beats reading
            </h2>
            <p className="mt-6 text-slate leading-relaxed">
              Every module must answer five questions before it ships: who needs this, which
              skill improves, what the learner actually does, where the correct answer comes
              from, and what progress we can honestly report. If a lesson can&apos;t answer all
              five, it doesn&apos;t ship.
            </p>
            <p className="mt-4 text-slate leading-relaxed">
              We are a fully remote team: courses are built, reviewed, and supported entirely
              online. That doesn&apos;t mean we&apos;re hands-off — every lesson passes expert
              review, support replies come from humans, and children&apos;s content clears a
              legal safety review before it ships.
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="border border-border rounded-2xl bg-paper p-6 md:p-7 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
                Five questions every module answers
              </h3>
              <ol className="mt-4 divide-y divide-border">
                {FIVE_QUESTIONS.map((q, i) => (
                  <li key={q} className="flex items-baseline gap-4 py-3">
                    <span
                      aria-hidden
                      className="font-mono text-sm font-bold text-academy-blue shrink-0"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] text-ink">{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Review pipeline: scroll narrative (one wow) ---------- */}
      <Section className="bg-paper border-y border-border">
        <div aria-labelledby="pipeline-h" className="max-w-6xl">
          <h2
            id="pipeline-h"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink"
          >
            How content earns publication
          </h2>
          <p className="mt-4 text-lg text-slate leading-relaxed max-w-2xl">
            The six gates every lesson, question, and quest passes before it ships.
          </p>

          <div className="relative mt-12">
            <div
              aria-hidden
              className="absolute top-3 bottom-3 left-4 md:left-6 w-px bg-border"
            >
              <div className="loop-fill absolute inset-0 bg-academy-teal" />
            </div>

            <ol className="relative">
              {PIPELINE.map((s, i) => (
                <li
                  key={s.n}
                  className="step-reveal relative pl-12 md:pl-20 pb-14 md:pb-16 last:pb-0"
                  style={{ animationDelay: REVEAL_DELAYS[i] }}
                >
                  <span
                    aria-hidden
                    className="absolute left-[9px] md:left-[17px] top-1.5 h-4 w-4 rounded-full bg-paper border-2 border-academy-teal"
                  />
                  <span className="sr-only">Step {i + 1} of {PIPELINE.length}: </span>
                  <div className="flex items-baseline gap-4 md:gap-5">
                    <span
                      aria-hidden
                      className="text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-ink leading-none"
                    >
                      {s.n}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-slate leading-relaxed max-w-xl">{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* ---------- Reviewer transparency (role-level, nothing invented) ---------- */}
          <div className="mt-14 border border-border rounded-2xl bg-canvas p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-ink">
              Who reviews your questions?
            </h3>
            <ul className="mt-2 divide-y divide-border">
              {REVIEWERS.map((r) => (
                <li key={r.role} className="py-4 last:pb-0">
                  <p className="font-bold text-ink text-[15px]">{r.role}</p>
                  <p className="mt-1 text-slate text-[15px] leading-relaxed">{r.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-slate leading-relaxed border-t border-border pt-5">
              You will not find reviewer names or framed credentials on this page — we
              don&apos;t publish claims we can&apos;t verify. That silence is deliberate, not an
              omission.
            </p>
          </div>
        </div>
      </Section>

      {/* ---------- What we are not ---------- */}
      <Section>
        <div aria-labelledby="limits-h" className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-widest text-academy-teal mb-3">
            What we are not
          </p>
          <h2
            id="limits-h"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink"
          >
            Plain about our limits
          </h2>
          <p className="mt-4 text-lg text-slate leading-relaxed">
            We&apos;d rather tell you what we are not than sell you what we aren&apos;t.
          </p>

          <div className="mt-8 border border-border rounded-2xl bg-paper shadow-sm overflow-hidden">
            <ul className="divide-y divide-border">
              {LIMITS.map((t) => (
                <li key={t} className="px-6 md:px-8 py-4 text-slate text-[15px] leading-relaxed">
                  {t}
                </li>
              ))}
            </ul>
            <div className="border-t border-border bg-canvas px-6 md:px-8 py-4">
              <p className="text-sm text-slate">
                Exam names belong to their respective owners.{" "}
                <a
                  href="/legal/exam-trademarks"
                  className="font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded"
                >
                  Read our trademark and affiliation notice
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Closing: the MD's "Learn more" slot ---------- */}
      <Section className="pt-0">
        <div className="border border-border rounded-2xl bg-canvas p-8 md:p-12 text-center shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
            Learn more about how it works
          </h2>
          <p className="mt-3 text-slate leading-relaxed max-w-xl mx-auto">
            See the method in action — try a sample, or ask us anything directly.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Button href="/how-it-works" size="lg">
              How our practice works
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Ask us anything
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
