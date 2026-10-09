import type { Metadata } from "next";
import { Section, Card, Button, Breadcrumbs } from "@/components/ui";
import { FaqInteractive } from "@/components/faq-interactive";
import { TABS, FAQS } from "./data";

export const metadata: Metadata = {
  title: "FAQ — Exams, Kids, Payments & Policies",
  description:
    "Straight answers about Unschool Academy: the free diagnostic, original practice questions, kids' safety, test-mode billing, and content review.",
  alternates: { canonical: "/faq" },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const TOTAL = TABS.reduce((n, t) => n + FAQS[t].length, 0);

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://unschool.academy/faq" },
  ],
};

/* Real Q&A, honest schema: every answer is a genuine site claim, no invented
   facts — FAQPage here buys semantic understanding, not a rich-result promise. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: TABS.flatMap((tab) =>
    FAQS[tab].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      {/* Authored hero (server-rendered): type-as-hero, grain + ambient glows, no gradient hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: GRAIN,
            opacity: 0.16,
            mixBlendMode: "multiply",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(42rem 20rem at 18% 0%, rgba(45,127,158,0.14), transparent 70%), radial-gradient(36rem 18rem at 88% 30%, rgba(47,111,181,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-12 md:pb-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Help center · {TOTAL} answers
          </p>
          <h1 className="text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-3xl">
            Straight answers.
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            Organized by topic. If yours isn’t here, ask us. A human replies within 2 business days.
          </p>
        </div>
      </div>

      <Section>
        <FaqInteractive />

        {/* Escalation — Khan/Udemy pattern: never end a help page on a dead end */}
        <div className="max-w-3xl mx-auto mt-14">
          <Card className="relative overflow-hidden">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
              Not covered here
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-3">
              Still have a question?
            </h2>
            <p className="text-slate leading-relaxed mb-6">
              Write to us through the contact form. A human replies within 2 business days — no bot
              maze, no ticket black hole.
            </p>
            <Button variant="primary" href="/contact">
              Contact us
            </Button>
          </Card>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
