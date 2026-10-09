import type { Metadata } from "next";
import DiagnosticPlayer from "@/components/diagnostic-player";
import { Breadcrumbs, Callout, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free JFT-Basic Diagnostic — 10 Questions",
  description:
    "Take the free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, instant topic feedback, reviewed explanations. No account needed.",
  openGraph: {
    title: "Free JFT-Basic Diagnostic — 10 Questions",
    description:
      "Take the free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, instant topic feedback, reviewed explanations. No account needed.",
  },
  twitter: {
    card: "summary",
    title: "Free JFT-Basic Diagnostic — 10 Questions",
    description:
      "Take the free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, instant topic feedback, reviewed explanations. No account needed.",
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

const OUTCOMES = [
  "Topic-by-topic feedback — see exactly which of the 4 sections need work",
  "Reviewed explanations — every answer teaches the why",
  "Your starter plan — concrete next steps from your score",
];

export default function DiagnosticPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-sm font-bold uppercase tracking-widest text-academy-teal mb-3">Free · No account</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
            Where does your Japanese actually stand?
          </h1>
          <p className="mt-3 text-lg text-slate leading-relaxed max-w-2xl">
            10 original everyday-Japanese questions · about 5 minutes · no timer · no account.
          </p>
          <ul className="mt-4 space-y-2">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex items-start gap-2 text-slate">
                <span aria-hidden="true" className="text-academy-teal-dark font-bold">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <Callout title="Draft questions, verified exam facts" tone="warning">
            These are original practice questions written for this pilot — still pending review by
            a qualified Japanese-language reviewer. The official exam facts on this site were
            verified against the Japan Foundation&apos;s JFT-Basic pages on 2026-10-08. Your score
            is an unofficial practice measure — it cannot predict an official result.
          </Callout>
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
