import type { Metadata } from "next";
import { Section, Button, Badge, Breadcrumbs } from "@/components/ui";
import { JFT_PROGRAM } from "@/lib/exams";

export const metadata: Metadata = {
  title: "Exams — Live Preparation Programs",
  description:
    "Unschool Academy's live exam preparation programs — one today: JFT-Basic, with a free 10-question diagnostic. Our 500-exam research catalogue is marked as research until each program is reviewed and built.",
  alternates: { canonical: "/exams" },
  openGraph: {
    title: "Exams — Live Preparation Programs",
    description:
      "One program is live today: JFT-Basic. Start the free 10-question diagnostic, no account needed.",
    type: "website",
    url: "/exams",
  },
  twitter: {
    card: "summary",
    title: "Exams — Live Preparation Programs",
    description: "JFT-Basic is live — free 10-question diagnostic, no account needed.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams" },
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
  ],
};

const programItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Live exam preparation programs",
  numberOfItems: 1,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "JFT-Basic",
      url: "https://unschool.academy/exams/jft-basic",
    },
  ],
};

/* The four gates to a live program. MD-honest wording; gate 3 is review-status
   disclosure, not SME signoff (practice content stays labeled draft, pending
   subject-expert review). */
const GATES = [
  {
    n: "01",
    title: "Official facts checked",
    body: "Against the organizer's pages before anything is written.",
    status: "Cleared",
  },
  {
    n: "02",
    title: "Syllabus map reviewed",
    body: "Every topic mapped to the official test format.",
    status: "Cleared",
  },
  {
    n: "03",
    title: "Original practice, review status disclosed",
    body: "Questions are written for this site. Explanations are labeled draft until subject-expert review.",
    status: "Cleared",
  },
  {
    n: "04",
    title: "Working free sample",
    body: "A free sample you can take right now, before anything is paid for.",
    status: "Cleared",
  },
];

const PROGRAM_FEATURES = ["Free diagnostic", "4 topics", "EN + 日本語"];

export default function ExamsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(programItemListJsonLd) }}
      />

      {/* ---------- Authored hero: type carries it, light surfaces only ---------- */}
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
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal">
            Exam preparation · 1 live program
          </p>
          <h1 className="mt-4 text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-4xl">
            JFT-Basic preparation that shows its work
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            One program is live today: JFT-Basic. It is fully built — start the free diagnostic
            right now. Our 500-exam research catalogue stays marked as research until a program
            is reviewed and built.
          </p>
          <div className="mt-8">
            <Button href="/exams/jft-basic/diagnostic" size="lg">
              Start the free diagnostic
            </Button>
            <p className="mt-3 text-sm text-slate">
              Free · 10 questions · 5 minutes · no account needed
            </p>
          </div>
        </div>
      </div>

      {/* ---------- The one live program: bento dossier ---------- */}
      <Section aria-labelledby="live-h">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal">
          Live programs
        </p>
        <h2
          id="live-h"
          className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-ink"
        >
          What you can start today
        </h2>
        <p className="mt-3 text-slate leading-relaxed max-w-2xl">
          Reviewed and ready. Research-stage exams never appear as live products.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-6">
          {/* Dossier cell: col-span-4, hairline rules, no shadows */}
          <article className="lg:col-span-4 border border-border bg-white rounded-2xl p-7 md:p-9 guide-reveal">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-5 border-b border-border">
              <Badge tone="success">
                <span className="text-academy-teal-dark" aria-hidden="true">
                  ●
                </span>{" "}
                Live pilot
              </Badge>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                Exam facts verified {JFT_PROGRAM.lastVerified}
              </p>
            </div>

            <h3 className="mt-6 text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
              JFT-Basic
            </h3>
            <p className="mt-1 text-[15px] text-slate">
              Everyday Japanese · Organized by the Japan Foundation
            </p>

            <p className="mt-4 text-[15px] text-slate leading-relaxed max-w-xl">
              Prepare for the JFT-Basic test of everyday Japanese. Free 10-question diagnostic,
              topic practice with explanations, and timed mocks.
            </p>
            <p className="mt-3 text-sm text-slate leading-relaxed max-w-xl">
              Independent preparation, not affiliated with the Japan Foundation. Exam facts
              checked against the Foundation&apos;s official pages; practice questions are
              original. Explanations are labeled draft, pending subject-expert review.
            </p>

            <ul className="mt-6 divide-y divide-border border-y border-border">
              <li className="py-3.5 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink text-[15px]">Free diagnostic</span>
                <span className="text-sm text-slate">10 original questions, instant topic breakdown, no account</span>
              </li>
              <li className="py-3.5 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink text-[15px]">Topic practice</span>
                <span className="text-sm text-slate">4 topics; explanations labeled draft, pending expert review</span>
              </li>
              <li className="py-3.5 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold text-ink text-[15px]">Timed mocks</span>
                <span className="text-sm text-slate">20 questions, 30 minutes, server-enforced timer</span>
              </li>
            </ul>

            <ul
              role="group"
              aria-label="Program features"
              className="mt-5 flex flex-wrap gap-2"
            >
              {PROGRAM_FEATURES.map((f) => (
                <li
                  key={f}
                  className="px-3 py-1.5 text-xs font-semibold text-slate border border-border rounded-full"
                >
                  {f}
                </li>
              ))}
            </ul>
          </article>

          {/* Rail: start-now card, col-span-2 */}
          <aside className="lg:col-span-2 guide-reveal" style={{ animationDelay: "68ms" }}>
            <div className="h-full border border-border bg-canvas rounded-2xl p-7 flex flex-col">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                Start here
              </p>
              <p className="mt-3 text-ink font-bold text-xl leading-snug">
                Five minutes, ten questions, your Japanese measured.
              </p>
              <p className="mt-2 text-sm text-slate leading-relaxed">
                The diagnostic is the working sample: it costs nothing and shows exactly how
                the practice treats you.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href="/exams/jft-basic/diagnostic">
                  Start the free diagnostic
                </Button>
                <a
                  href="/exams/jft-basic"
                  className="text-sm font-semibold text-academy-teal hover:text-academy-teal-dark underline underline-offset-4"
                >
                  View the program
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {/* ---------- The wow: earned-place pipeline, CSS-only scroll narrative ---------- */}
      <Section aria-labelledby="pipeline-h" className="!pt-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal">
          Our publishing promise
        </p>
        <h2
          id="pipeline-h"
          className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-ink"
        >
          What it takes to be listed here
        </h2>
        <p className="mt-3 text-slate leading-relaxed max-w-2xl">
          A program reaches this page only after four gates. One has passed them all; the
          other 500 exams stay marked as research.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-6">
          {/* Gate spine: col-span-4 */}
          <ol className="lg:col-span-4 relative border border-border bg-white rounded-2xl p-7 md:p-9">
            <li
              aria-hidden
              className="absolute left-[2.55rem] md:left-[3.05rem] top-10 bottom-10 w-px bg-border"
            >
              <span className="loop-fill block h-full w-px bg-academy-teal" />
            </li>
            {GATES.map((g) => (
              <li key={g.n} className="step-reveal relative flex gap-5 md:gap-7 py-5 first:pt-0 last:pb-0">
                <span className="relative z-10 shrink-0 font-mono text-xs font-bold text-academy-teal-dark bg-canvas border border-border rounded-full h-9 w-14 flex items-center justify-center">
                  {g.n}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-bold text-ink">{g.title}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-academy-teal-dark">
                      {g.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] text-slate leading-relaxed">{g.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Type moment + research link: col-span-2, row-span-2 quiet cell */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="border border-border bg-canvas rounded-2xl p-7 step-reveal">
              <p
                className="font-display text-[clamp(2.5rem,4vw,3.75rem)] leading-[1.02] tracking-[-0.02em] text-ink"
              >
                01 live ·<br />500 marked as research
              </p>
              <p className="mt-4 text-sm text-slate leading-relaxed">
                Research entries are not purchasable. They are our backlog made visible, and
                they stay labeled until the gates above are cleared.
              </p>
              <div className="mt-5">
                <Button href="/exams/catalog" variant="secondary" size="sm">
                  Browse the research catalogue{" "}
                  <span aria-hidden="true">→</span>
                </Button>
              </div>
            </div>
            <div className="border border-border rounded-2xl p-7 bg-white step-reveal">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate">
                The waiting room
              </p>
              <p className="mt-3 text-[15px] text-slate leading-relaxed">
                Next programs are evaluated one at a time. JLPT N5/N4 and other exams are
                weighed against syllabus stability, licensing, reviewer availability and real
                demand. We publish only what we have built and reviewed.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------- Final band: light, type-as-hero, no gradient ---------- */}
      <Section className="!pt-4">
        <div className="relative overflow-hidden border-t border-border">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(40rem 20rem at 50% 0%, rgba(20,125,117,0.10), transparent 65%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.14] mix-blend-multiply"
            style={{ backgroundImage: GRAIN }}
          />
          <div className="relative max-w-3xl mx-auto text-center py-16 md:py-20 px-4">
            <h2 className="text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink text-balance">
              Find out where your Japanese stands
            </h2>
            <p className="mt-4 text-slate text-[15px] leading-relaxed">
              A free 10-question diagnostic with an instant topic breakdown. No account
              required.
            </p>
            <div className="mt-7">
              <Button href="/exams/jft-basic/diagnostic" size="lg">
                Start the free diagnostic
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
