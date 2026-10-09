import type { Metadata } from "next";
import { Section, Breadcrumbs } from "@/components/ui";
import { JftSampler, KidsSampler } from "@/components/samplers";

export const metadata: Metadata = {
  title: "Free Practice — Try It First",
  description:
    "Free Unschool Academy practice: the JFT-Basic diagnostic sampler and a Momo kids quest sampler. Real interactions, no account, no paywall.",
  alternates: { canonical: "/free-practice" },
  openGraph: {
    title: "Free Practice — Try It First | Unschool Academy",
    description:
      "Try a real JFT-Basic question and a real Momo kids counting interaction — free, no account, no paywall.",
    type: "website",
    url: "/free-practice",
  },
  twitter: {
    card: "summary",
    title: "Free Practice — Try It First | Unschool Academy",
    description:
      "A real JFT-Basic question and a real Momo kids interaction — free, no account, no paywall.",
  },
};

const TRAIL = [{ label: "Home", href: "/" }, { label: "Free Practice" }];

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

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const FREE_FACTS = [
  {
    n: "01",
    title: "No account",
    body: "Everything on this page runs without signing in.",
  },
  {
    n: "02",
    title: "No card",
    body: "Free means free. Nothing here asks for payment details.",
  },
  {
    n: "03",
    title: "No timers",
    body: "No trial countdowns, no paywalled results, no locked explanations.",
  },
];

const SCIENCE_ROWS = [
  {
    n: "01",
    title: "Recall beats re-reading",
    body: "Answering from memory strengthens the memory itself. A sampler you attempt teaches more than a page you skim.",
  },
  {
    n: "02",
    title: "Feedback right away",
    body: "Knowing immediately what was right, and why, is what turns a guess into learning. Both samplers answer you on the spot.",
  },
  {
    n: "03",
    title: "Low stakes, real reps",
    body: "One question, no scoreboard. The habit of trying forms before the pressure of a real test does.",
  },
];

export default function FreePracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Authored hero — type carries it; the samplers sit just below the fold. */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(42rem 22rem at 12% 0%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(36rem 20rem at 88% 20%, rgba(49,91,135,0.10), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-16 md:pb-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark mb-4">
            Free · No account · No paywall
          </p>
          <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink text-balance">
            Practice first. Decide later.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
            Everything below is genuinely free — no trial timers, no result
            paywalls, no card details. If the free experience doesn&rsquo;t
            convince you, nothing we sell will.
          </p>
        </div>
      </header>

      {/* Bento: one audience-split playground, not two identical sections. */}
      <Section>
        <Breadcrumbs trail={TRAIL} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-6 md:gap-8">
          {/* Adult surface — institutional register: hairline rules, mono labels. */}
          <article className="md:col-span-4 rounded-2xl border border-border bg-paper p-6 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
              Sample · JFT-Basic · From the pilot
            </p>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-ink text-balance">
              JFT-Basic free practice
            </h2>
            <p className="mt-3 text-slate leading-relaxed">
              A question from the pilot, then the full 10-question diagnostic
              with server scoring and draft explanations pending expert review.
            </p>
            <div className="mt-6">
              <JftSampler />
            </div>
          </article>

          {/* Kids surface — Duolingo register: tactile, chunky, warm. */}
          <article className="md:col-span-2 md:row-span-2 rounded-2xl border-2 border-kids-orange/40 bg-kids-cream p-6 md:p-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink">
              Kids · Ages 3–5
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink text-balance">
              A moment from Momo&rsquo;s quest
            </h2>
            <p className="mt-3 text-slate leading-relaxed">
              The actual counting game from our ages 3–5 prototype — then the
              full quest with hints and a transfer challenge (same skill, new
              scene).
            </p>
            <div className="mt-6">
              <KidsSampler />
            </div>
          </article>

          {/* Honesty rail — the "what free means" marginalia. */}
          <aside
            aria-label="What free means here"
            className="md:col-span-4 rounded-2xl border border-border bg-canvas p-6 md:p-8"
          >
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              What &ldquo;free&rdquo; means here
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {FREE_FACTS.map((f) => (
                <li key={f.n} className="flex gap-4 py-4 first:pt-1 last:pb-0">
                  <span
                    aria-hidden
                    className="font-mono text-sm font-bold text-academy-teal-dark pt-0.5"
                  >
                    {f.n}
                  </span>
                  <div>
                    <p className="font-bold text-ink">{f.title}</p>
                    <p className="mt-0.5 text-slate">{f.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>

      {/* Learning-science strip — why sampling works. */}
      <Section className="border-t border-border">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
          Why a sample teaches
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl md:text-3xl font-extrabold tracking-tight text-ink text-balance">
          Trying is the method, not the marketing
        </h2>
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {SCIENCE_ROWS.map((r) => (
            <li key={r.n} className="grid gap-1 py-5 md:grid-cols-[4rem_1fr_2fr] md:gap-6 md:py-6">
              <span
                aria-hidden
                className="font-mono text-sm font-bold text-academy-teal-dark"
              >
                {r.n}
              </span>
              <p className="font-bold text-ink text-lg tracking-tight">
                {r.title}
              </p>
              <p className="text-slate leading-relaxed">{r.body}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
