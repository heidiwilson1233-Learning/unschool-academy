import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact support",
  description:
    "Contact Unschool Academy: exam practice, kids accounts, billing, or privacy requests. A real person replies within 2 business days during the pilot.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact support | Unschool Academy",
    description:
      "Exam practice, kids accounts, billing, or privacy requests — a real person replies within 2 business days during the pilot.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "Contact support | Unschool Academy",
    description: "A real person replies within 2 business days during the pilot.",
  },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Contact" },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    item: "https://unschool.academy" + (t.href ?? "/contact"),
  })),
};

/* Self-serve triage: deflect answerable questions before they become tickets. */
const TRIAGE = [
  {
    label: "Quick question",
    text: "Most answers are already written up.",
    href: "/faq",
    link: "Search the FAQ",
  },
  {
    label: "Billing",
    text: "Charges, passes, and refund questions.",
    href: "/legal/refunds",
    link: "Read the refund policy",
  },
  {
    label: "Kids or parent account",
    text: "Co-play, safety, and family settings.",
    href: "/parent",
    link: "Visit the Parent Hub",
  },
  {
    label: "Privacy or data request",
    text: "How we collect, use, and delete data.",
    href: "/legal/child-privacy",
    link: "Read the privacy policy",
  },
];

const DOSSIER: [string, string][] = [
  ["Replies", "Within 2 business days"],
  ["Pilot note", "Human-reviewed. No bots."],
  ["Support hours", "Pilot hours not published yet — email any time."],
];

export default function ContactPage() {
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
          <Breadcrumbs trail={TRAIL} />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Support
          </p>
          <h1 className="text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-3xl">
            Talk to a human.
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            No bot maze. Email us any time and a real person replies within 2 business days. For
            children&rsquo;s privacy requests, visit the{" "}
            <Link href="/parent" className="text-academy-blue font-semibold hover:underline">
              Parent Hub
            </Link>
            .
          </p>
        </div>
      </div>

      <Section>
        <div className="grid gap-10 lg:grid-cols-6 lg:gap-12">
          {/* Triage rail — first on mobile, sticky on desktop */}
          <aside className="lg:col-span-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-10">
              <nav aria-label="Before you write">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
                  Before you write
                </h2>
                <ul className="divide-y divide-border border-y border-border">
                  {TRIAGE.map((t) => (
                    <li key={t.label} className="py-4">
                      <p className="font-bold text-ink text-[15px]">{t.label}</p>
                      <p className="text-sm text-slate mt-0.5 leading-relaxed">{t.text}</p>
                      <Link
                        href={t.href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-academy-blue hover:underline mt-1.5"
                      >
                        {t.link}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
                  What to expect
                </h2>
                <dl className="divide-y divide-border border-y border-border">
                  {DOSSIER.map(([term, desc]) => (
                    <div key={term} className="py-3 flex gap-4 text-[15px]">
                      <dt className="w-28 shrink-0 font-semibold text-ink">{term}</dt>
                      <dd className="text-slate leading-relaxed">{desc}</dd>
                    </div>
                  ))}
                </dl>
                <p role="note" className="text-sm text-slate leading-relaxed mt-4">
                  Our ticket backend isn&rsquo;t live yet. Submitting opens your email app with the
                  message pre-addressed to support. Nothing is sent silently, and nothing is stored.
                </p>
              </div>
            </div>
          </aside>

          {/* The form — the action side of the dossier */}
          <div className="lg:col-span-4 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
