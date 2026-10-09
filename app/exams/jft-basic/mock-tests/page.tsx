import type { Metadata } from "next";
import { Section, Button, Breadcrumbs, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "JFT-Basic Mock Tests | Timed Practice",
  description:
    "Timed JFT-Basic Japanese mock test: 20 original questions, 30 minutes, hidden answers until submit, server-enforced timer. Unofficial practice.",
  openGraph: {
    title: "JFT-Basic Mock Tests | Timed Practice",
    description:
      "Timed JFT-Basic Japanese mock test: 20 original questions, 30 minutes, hidden answers until submit, server-enforced timer. Unofficial practice.",
  },
  twitter: {
    card: "summary",
    title: "JFT-Basic Mock Tests | Timed Practice",
    description:
      "Timed JFT-Basic Japanese mock test: 20 original questions, 30 minutes, hidden answers until submit, server-enforced timer. Unofficial practice.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
  { label: "Mock tests" },
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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const SPECS = [
  "30-minute timer, enforced on our server",
  "No hints while you answer",
  "Topic-by-topic breakdown after submit",
  "Explanations for every question (draft, pending expert review)",
];

const RITUAL = [
  {
    n: "01",
    title: "Start",
    body: "The timer begins the moment the questions load. Find a quiet 30 minutes.",
  },
  {
    n: "02",
    title: "Answer under the clock",
    body: "No hints. Your answers stay sealed until you submit. If time runs out, the mock auto-submits.",
  },
  {
    n: "03",
    title: "See the breakdown",
    body: "A score, topic by topic, with explanations marked draft pending expert review.",
  },
];

export default function MockTestsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Editorial hero: type carries it, ambient light + grain behind it ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.16]" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark mb-4">
            JFT-Basic · Timed practice
          </p>
          <h1 className="max-w-4xl text-5xl md:text-7xl font-extrabold tracking-[-0.04em] leading-[0.95] text-ink text-balance">
            Feel the clock before the clock matters
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate leading-relaxed">
            20 original questions. 30 minutes. No hints, no answers until you submit.
            The timer runs on our server, not just your screen.
          </p>
        </div>
      </div>

      <Section className="!pt-10">
        <Breadcrumbs trail={TRAIL} />

        {/* ---------- Bento: exam dossier (live action) + slim ritual rail ---------- */}
        <div className="grid md:grid-cols-6 gap-6">
          {/* Mock 1 — institutional dossier, not a card */}
          <div className="md:col-span-4 relative overflow-hidden rounded-2xl border border-border bg-paper">
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-academy-teal" />
            <div className="p-6 md:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                Mock 1 · 20 questions · 30 minutes · server-enforced timer
              </p>
              <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
                Everyday Japanese, all four sections
              </h2>
              <p className="mt-3 text-slate text-[15px] leading-relaxed max-w-xl">
                Script and vocabulary, conversation, listening, and reading in one sitting.
                Answers stay hidden until you submit. If time runs out, the mock auto-submits.
              </p>
              <ul className="mt-6 divide-y divide-border border-y border-border">
                {SPECS.map((s) => (
                  <li key={s} className="py-3 text-sm text-slate">
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Button href="/exams/jft-basic/mock-tests/take" size="lg">
                  Start mock 1
                </Button>
                <p className="mt-3 text-xs text-slate">
                  Unofficial practice. A score here can&apos;t predict an official JFT-Basic result.
                </p>
              </div>
            </div>
          </div>

          {/* Rail: the 30-minute ritual + Mock 2 off-ramp */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="rounded-2xl border border-border bg-canvas p-6 md:p-7">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-ink">
                The 30-minute ritual
              </h2>
              <ol className="mt-4 divide-y divide-border">
                {RITUAL.map((r) => (
                  <li key={r.n} className="py-3.5">
                    <p className="flex items-baseline gap-3">
                      <span className="font-mono text-xs font-bold text-academy-teal-dark">{r.n}</span>
                      <span className="font-bold text-ink text-[15px]">{r.title}</span>
                    </p>
                    <p className="mt-1.5 text-sm text-slate leading-relaxed">{r.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-border bg-paper p-6">
              <p className="text-sm font-bold text-ink">Mock 2 · In review</p>
              <p className="mt-2 text-sm text-slate leading-relaxed">
                The second mock is being drafted. We publish a mock only when every
                question has passed review. No filler.
              </p>
              <div className="mt-3">
                <Button href="/exams/jft-basic/topics" variant="secondary" size="sm">
                  Practice by topic for now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Callout title="Unofficial, always" tone="warning">
          Mock scores are unofficial practice results. They cannot predict an official
          JFT-Basic result. If anyone sells you a &ldquo;guaranteed pass&rdquo; mock, walk away.
        </Callout>
      </Section>
    </>
  );
}
