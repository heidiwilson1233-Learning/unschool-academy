import type { Metadata } from "next";
import Link from "next/link";
import { Section, Button, Badge, Breadcrumbs, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Parent Hub — Child Profiles, Evidence & Controls",
  description:
    "The Unschool Academy Parent Hub: planned controls for child profiles, learning evidence, consent and data export, billing, and session boundaries — now in staged rollout.",
  alternates: { canonical: "/parent" },
  openGraph: {
    title: "Parent Hub — Child Profiles, Evidence & Controls",
    description:
      "What the Parent Hub will give verified parents: child profiles, learning evidence, consent controls, and billing — now in staged rollout.",
    type: "website",
    url: "/parent",
  },
  twitter: {
    card: "summary",
    title: "Parent Hub — Child Profiles, Evidence & Controls",
    description: "Planned parent controls: profiles, evidence, consent, billing. In staged rollout.",
  },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "Parent Hub" },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    { "@type": "ListItem", position: 2, name: "Kids", item: "https://unschool.academy/kids" },
    { "@type": "ListItem", position: 3, name: "Parent Hub", item: "https://unschool.academy/parent" },
  ],
};

/* Sample evidence rows — explicitly labeled sample data, MD-exact evidence wording. */
const SAMPLE_EVIDENCE = [
  { quest: "Mango counting quest", how: "Practised with no help", date: "9 Oct 2026" },
  { quest: "Story ordering quest", how: "Used a hint", date: "2 Oct 2026" },
];

function CellShell({
  children,
  span,
  labelledBy,
}: {
  children: React.ReactNode;
  span: string;
  labelledBy: string;
}) {
  return (
    <li
      aria-labelledby={labelledBy}
      className={`${span} rounded-2xl border border-border bg-paper p-6 md:p-8 shadow-sm`}
    >
      {children}
    </li>
  );
}

function CellHeader({ id, title }: { id: string; title: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
      <h2 id={id} className="font-display text-2xl md:text-[1.7rem] leading-snug text-ink">
        {title}
      </h2>
      <Badge tone="neutral">Planned</Badge>
    </div>
  );
}

function MockCaption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
      {children}
    </p>
  );
}

export default function ParentHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Authored hero ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-kids-cream">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(46rem 22rem at 14% -10%, rgba(242,166,108,0.20), transparent 65%), radial-gradient(38rem 20rem at 90% 12%, rgba(20,125,117,0.10), transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.16] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-12 md:pb-16">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink mb-4">
            For parents
          </p>
          <h1 className="font-display text-[clamp(2.75rem,7vw,5rem)] tracking-[-0.02em] leading-[1.02] text-ink text-balance max-w-4xl">
            Parent <em className="italic">Hub</em>
          </h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">
            One calm, private place for your family&apos;s learning. Profiles, learning evidence,
            privacy choices, and billing. The controls below are planned; parent accounts open
            with the Kids beta.
          </p>
        </div>
      </div>

      <Section>
        <div className="mx-auto max-w-6xl">
          <Callout title="Staged rollout" tone="warning">
            The Parent Hub is in staged rollout. The controls below describe what it will
            provide. None of them manage a live child profile yet. Parent accounts open with
            the Kids beta.
          </Callout>

          {/* ---------- Bento of the five planned controls ---------- */}
          <ul className="grid grid-cols-6 gap-5 mt-10" aria-label="Planned Parent Hub controls">
            <CellShell span="col-span-6 lg:col-span-4" labelledBy="ph-evidence">
              <CellHeader id="ph-evidence" title="Learning evidence" />
              <p className="text-slate text-[15px] leading-relaxed">
                What was practised, and how: &ldquo;Practised with no help&rdquo;, &ldquo;Used a
                hint&rdquo;, or &ldquo;Needed an adult demonstration&rdquo;, with the date. No
                scores, no ranks.
              </p>
              <div
                className="mt-5 rounded-xl border border-border bg-canvas/60 p-4"
                aria-label="Sample of how learning evidence will look"
              >
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    Sample learning evidence: quest, how it went, and date
                  </caption>
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className="py-2 pr-3 font-semibold text-ink text-xs uppercase tracking-wide">
                        Quest
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold text-ink text-xs uppercase tracking-wide">
                        How it went
                      </th>
                      <th scope="col" className="py-2 font-semibold text-ink text-xs uppercase tracking-wide text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_EVIDENCE.map((row) => (
                      <tr key={row.quest} className="border-b border-border/60 last:border-0">
                        <td className="py-2.5 pr-3 text-ink">{row.quest}</td>
                        <td className="py-2.5 pr-3 text-slate">{row.how}</td>
                        <td className="py-2.5 text-slate text-right whitespace-nowrap">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <MockCaption>Planned — sample data</MockCaption>
            </CellShell>

            <CellShell span="col-span-6 sm:col-span-3 lg:col-span-2" labelledBy="ph-profiles">
              <CellHeader id="ph-profiles" title="Child profiles" />
              <p className="text-slate text-[15px] leading-relaxed">
                One profile per child: nickname or icon, age band or grade, language, and
                learning state.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-canvas/60 p-4">
                <p className="text-sm text-ink">
                  <span className="font-semibold">Nickname</span>
                  <span className="text-slate"> · Age band 3–5 · English</span>
                </p>
                <p className="mt-2 text-xs text-slate">
                  Never collected: full names, school addresses, birthdays, photos.
                </p>
              </div>
              <MockCaption>Planned — sample data</MockCaption>
            </CellShell>

            <CellShell span="col-span-6 sm:col-span-3 lg:col-span-3" labelledBy="ph-consent">
              <CellHeader id="ph-consent" title="Consent &amp; privacy" />
              <p className="text-slate text-[15px] leading-relaxed">
                Review or revoke consent, export your family&apos;s data, or request deletion.
                Confirmation plus a full audit trail.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center justify-center rounded-2xl border-2 border-b-4 border-kids-orange-deep bg-kids-orange px-4 py-2 text-sm font-semibold text-ink select-none">
                  Export our data
                </span>
                <span className="inline-flex items-center justify-center rounded-2xl border-2 border-border bg-white px-4 py-2 text-sm font-semibold text-slate select-none">
                  Delete everything
                </span>
              </div>
              <MockCaption>Planned — confirmation always required</MockCaption>
            </CellShell>

            <CellShell span="col-span-6 sm:col-span-3 lg:col-span-3" labelledBy="ph-session">
              <CellHeader id="ph-session" title="Session controls" />
              <p className="text-slate text-[15px] leading-relaxed">
                Set session boundaries per child, with pause and a manual continue option. No
                streaks, no pressure to return daily.
              </p>
              <div className="mt-5 rounded-xl border border-border bg-canvas/60 p-4">
                <p className="text-sm text-ink font-semibold">Weekdays · 45 min · Pause available</p>
                <p className="mt-1 text-xs text-slate">
                  A gentle wind-down, never an abrupt cutoff.
                </p>
              </div>
              <MockCaption>Planned — sample setting</MockCaption>
            </CellShell>

            <CellShell span="col-span-6" labelledBy="ph-billing">
              <div className="lg:flex lg:items-start lg:gap-10">
                <div className="lg:max-w-md">
                  <CellHeader id="ph-billing" title="Billing" />
                  <p className="text-slate text-[15px] leading-relaxed">
                    Plans, invoices, failed-payment handling, and one-click cancellation, all in
                    the adult-only zone. Children never see any of this.
                  </p>
                  <MockCaption>Planned — sample receipt</MockCaption>
                </div>
                <div className="mt-5 lg:mt-0 flex-1 rounded-xl border border-border bg-canvas/60 p-4">
                  <dl>
                    <div className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5">
                      <dt className="text-sm text-ink">Family plan · 1 Oct 2026</dt>
                      <dd className="text-xs text-slate font-mono">Receipt #UA-0001</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-sm text-slate">Cancel anytime · one click · no questions</dt>
                      <dd className="text-xs text-slate">Adult only</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CellShell>
          </ul>

          {/* ---------- MD-verbatim trust strip ---------- */}
          <div className="mt-12 border-y border-border py-6" role="note" aria-label="What we never ask for">
            <p className="text-center text-sm md:text-base text-slate">
              <span className="font-semibold text-ink">We never ask for: </span>
              full names <span aria-hidden>·</span> birthdays <span aria-hidden>·</span> photos{" "}
              <span aria-hidden>·</span> school address
            </p>
          </div>

          {/* ---------- CTA ---------- */}
          <div className="mt-12 text-center">
            <Button href="/signup" variant="kids" size="lg">
              Create parent account
            </Button>
            <p className="mt-4">
              <Link
                href="/kids/for-parents"
                className="font-semibold text-kids-orange-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-deep rounded"
              >
                Read the parent guide <span aria-hidden>→</span>
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
