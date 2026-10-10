import type { Metadata } from "next";
import DiagnosticPlayer from "@/components/diagnostic-player";
import { Breadcrumbs, Callout, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free JFT-Basic Diagnostic — 10 Questions",
  description:
    "Free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, a skill-by-skill gap map, and draft-labeled explanations. No account needed.",
  alternates: { canonical: "/exams/jft-basic/diagnostic" },
  openGraph: {
    title: "Free JFT-Basic Diagnostic — 10 Questions",
    description:
      "Free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, a skill-by-skill gap map, and draft-labeled explanations. No account needed.",
    type: "website",
    url: "/exams/jft-basic/diagnostic",
  },
  twitter: {
    card: "summary",
    title: "Free JFT-Basic Diagnostic — 10 Questions",
    description:
      "Free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, a skill-by-skill gap map, and draft-labeled explanations. No account needed.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
  { label: "Free diagnostic" },
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

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const OUTCOMES = [
  {
    n: "01",
    title: "A skill-by-skill gap map",
    body: "Each question is tagged to the JFT-Basic skill it measures. You get Can Do vs Needs Help, skill by skill.",
  },
  {
    n: "02",
    title: "Explanations that teach the why",
    body: "Every answer comes with an explanation, clearly labeled as a draft pending expert review.",
  },
  {
    n: "03",
    title: "A starter plan, weakest skill first",
    body: "Concrete next steps from your answers — practice links included, no account needed.",
  },
];

export default function DiagnosticPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {/* Authored type-as-hero header: grain + ambient radials on a paper surface. */}
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
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={TRAIL} />
          <p className="guide-reveal text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark mb-4">
            Free · No account
          </p>
          <h1 className="guide-reveal font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] tracking-[-0.03em] text-balance text-ink">
            Where does your Japanese actually stand?
          </h1>
          <p className="guide-reveal mt-4 text-lg text-slate leading-relaxed max-w-2xl">
            10 original everyday-Japanese questions · about 5 minutes · no timer · no account.
          </p>
          <ul className="guide-reveal mt-8 border-t-2 border-ink">
            {OUTCOMES.map((o) => (
              <li key={o.n} className="flex gap-5 py-4 border-b border-border">
                <span aria-hidden="true" className="text-xs font-bold tracking-widest text-slate pt-1 shrink-0">
                  {o.n}
                </span>
                <div>
                  <p className="font-bold text-ink">{o.title}</p>
                  <p className="text-sm text-slate mt-1 leading-relaxed">{o.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="guide-reveal mt-6">
            <Callout title="Draft questions, verified exam facts" tone="warning">
              These are original practice questions written for this pilot — still pending review by
              a qualified Japanese-language reviewer. The official exam facts on this site were
              verified against the Japan Foundation&apos;s JFT-Basic pages on 2026-10-08. Your score
              is an unofficial practice measure — it cannot predict an official result.
            </Callout>
          </div>
        </div>
      </div>
      <Section className="!py-10">
        <div className="max-w-4xl mx-auto">
          <DiagnosticPlayer />
          <noscript>
            <p className="text-slate text-center mt-4">
              This diagnostic needs JavaScript — please enable it to take the 10 questions.
            </p>
          </noscript>
        </div>
      </Section>
    </>
  );
}
