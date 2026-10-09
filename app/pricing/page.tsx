import type { Metadata } from "next";
import { Section, Breadcrumbs, Button } from "@/components/ui";
import { CheckoutButton } from "@/components/checkout-button";
import { Art, StagingNote } from "@/components/site-art";

const TRAIL = [{ label: "Home", href: "/" }, { label: "Pricing" }];

export const metadata: Metadata = {
  title: "Pilot Pricing — Free to Start, Paid Passes in Test Mode",
  description:
    "Unschool Academy pricing: free diagnostics and sample quests forever. JFT-Basic passes and Kids family plans at pilot pricing; checkout is in test mode.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pilot Pricing — Free to Start, Paid Passes in Test Mode | Unschool Academy",
    description:
      "Free diagnostics and sample quests forever. JFT-Basic passes and Kids family plans at pilot pricing; checkout is in test mode, no real charges.",
    type: "website",
    url: "/pricing",
  },
  twitter: {
    card: "summary",
    title: "Pilot Pricing — Free to Start, Paid Passes in Test Mode | Unschool Academy",
    description:
      "Free diagnostics and sample quests forever. JFT-Basic and Kids plans at pilot pricing; checkout is in test mode.",
  },
};

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

const CONTENT_STATE: Array<[string, string]> = [
  ["Free", "10-question diagnostic. No account needed."],
  ["Practice bank", "20 original questions. Drafts pending expert review."],
  ["Timed mock", "30 minutes, drawn from the same draft set."],
  ["Kids library", "6 quest briefs in the bank. 2 playable today."],
  ["Checkout", "Test mode. No real charges while the pilot runs."],
  ["Refunds", "Per the refund policy. Cancel anytime."],
];

function SpecRows({ rows }: { rows: Array<[string, string]> }) {
  return (
    <dl>
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[9rem_1fr] gap-4 border-t border-border py-3.5 text-[15px] first:border-t-0 first:pt-0 last:pb-0"
        >
          <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate pt-0.5">
            {label}
          </dt>
          <dd className="text-ink leading-relaxed">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function TestModeNote() {
  return (
    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate">
      Test mode · no real charge
    </p>
  );
}

function FreeRail({
  eyebrow,
  title,
  body,
  cta,
  href,
  bridge,
}: {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  bridge: string;
}) {
  return (
    <aside
      aria-label={title}
      className="md:col-span-2 rounded-2xl border border-border bg-canvas p-6 md:p-7 self-start"
    >
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
        {eyebrow}
      </p>
      <h3 className="text-xl font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-3 text-[15px] text-slate leading-relaxed">{body}</p>
      <div className="mt-5">
        <Button href={href} variant="secondary" size="sm">
          {cta}
        </Button>
      </div>
      <p className="mt-5 border-t border-border pt-4 text-sm text-slate leading-relaxed">
        {bridge}
      </p>
    </aside>
  );
}

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Authored hero: type-as-hero, ambient light + grain, light surfaces ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(20,125,117,0.16), transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-32 left-[-8%] h-[380px] w-[380px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(242,166,108,0.22), transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs trail={TRAIL} />
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-academy-teal-dark mb-5">
            Pilot pricing · In review · INR · Test-mode checkout
          </p>
          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-extrabold tracking-[-0.04em] leading-[0.98] text-ink text-balance max-w-5xl">
            Free forever to start.
            <br />
            Paid passes, pilot-priced.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            While programs are in review, every plan below states what content it
            unlocks, how long access lasts, and how to cancel — before you pay a
            single rupee. Checkout is in test mode, so nothing is charged.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 border-t border-border pt-6">
            {CONTENT_STATE.map(([label, value]) => (
              <div key={label} className="py-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                  {label}
                </p>
                <p className="mt-1 text-[15px] text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Program dossier 01 — JFT-Basic (exams) ---------- */}
      <Section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
          Program 01 · Exams
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-tight text-ink text-balance max-w-3xl">
          JFT-Basic plans
        </h2>
        <div className="mt-10 grid md:grid-cols-6 gap-6 md:gap-8">
          <article
            aria-labelledby="pass-title"
            className="md:col-span-4 rounded-2xl border border-border bg-paper overflow-hidden self-start"
          >
            <div className="h-[3px] bg-academy-teal" aria-hidden />
            <Art
              src="/img/card-jft.webp"
              alt="Study flashcards and an open notebook in warm window light"
              ratio="card"
              className="!rounded-none !border-0 !shadow-none"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="p-7 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark">
                Exam program · JFT-Basic · Pilot
              </p>
              <h3
                id="pass-title"
                className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-ink"
              >
                The 60-day pass
              </h3>
              <p
                className="mt-4 text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none text-ink"
                aria-label="₹699, one-time payment for 60 days of access"
              >
                ₹699
                <span className="ml-3 align-middle text-base font-semibold tracking-normal text-slate">
                  one-time · 60 days access
                </span>
              </p>
              <div className="mt-8">
                <SpecRows
                  rows={[
                    [
                      "What's included",
                      "Topic practice path: 20 original questions across 4 topics (drafts pending expert review). 30-minute timed mock drawn from the same draft set. Study plan + attempt history.",
                    ],
                    [
                      "Access & billing",
                      "One-time charge of ₹699. 60 days of access from purchase. Cancel anytime; refunds follow the refund policy.",
                    ],
                  ]}
                />
              </div>
              <div className="mt-7">
                <CheckoutButton
                  productId="jft-basic-pass"
                  label="Get the 60-day pass"
                />
                <TestModeNote />
              </div>
              <div className="mt-9 border-t border-border pt-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate mb-2">
                  Exam in a week?
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    <h4 className="text-lg font-extrabold tracking-tight text-ink">
                      7-day revision sprint · ₹199{" "}
                      <span className="text-sm font-semibold text-slate">
                        one-time
                      </span>
                    </h4>
                    <p className="mt-1.5 text-[15px] text-slate leading-relaxed max-w-md">
                      Focused revision pack with timed drills for your weakest
                      topics. 7 days of access.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <CheckoutButton
                      productId="jft-basic-revision"
                      label="Get the 7-day revision"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-9 border-t border-border pt-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate mb-4">
                  Pilot math
                </p>
                <figure>
                  <div className="space-y-3" aria-hidden>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-ink">60-day pass</span>
                        <span className="text-slate">₹699</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-academy-teal/90 w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-semibold text-ink">7-day revision</span>
                        <span className="text-slate">₹199</span>
                      </div>
                      <div
                        className="h-2.5 rounded-full bg-academy-teal/40"
                        style={{ width: "28.5%" }}
                      />
                    </div>
                  </div>
                  <figcaption className="mt-4 text-sm text-slate leading-relaxed">
                    ₹699 works out to about ₹12 a day across the 60 days; ₹199
                    is about ₹28 a day for the final-week sprint. Pick the
                    rhythm that matches your exam date, not the sticker price.
                  </figcaption>
                </figure>
              </div>
            </div>
          </article>
          <FreeRail
            eyebrow="Free forever · No account"
            title="Start with the diagnostic"
            body="10 original questions. Topic breakdown in minutes, free, no account needed."
            cta="Start the free diagnostic"
            href="/exams/jft-basic/diagnostic"
            bridge="The pass continues where the diagnostic leaves off: the full practice path, the timed mock, and your attempt history."
          />
        </div>
      </Section>

      {/* ---------- Program dossier 02 — Kids (family) ---------- */}
      <Section className="pt-0">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink mb-3">
          Program 02 · Kids
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-tight text-ink text-balance max-w-3xl">
          Family plans, for parents only
        </h2>
        <div className="mt-10 grid md:grid-cols-6 gap-6 md:gap-8">
          <article
            aria-labelledby="family-title"
            className="md:col-span-4 rounded-2xl border border-border bg-paper overflow-hidden self-start"
          >
            <div className="h-[3px] bg-kids-orange-deep" aria-hidden />
            <div>
              <Art
                src="/img/card-kids.webp"
                alt="Momo, Tara and Bobo reading picture books together under a round tree"
                ratio="card"
                className="!rounded-none !border-0 !shadow-none"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <StagingNote className="px-7 md:px-10" />
            </div>
            <div className="p-7 md:p-10 pt-2">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink">
                Kids program · Family plans · Pilot
              </p>
              <h3
                id="family-title"
                className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-ink"
              >
                Family monthly
              </h3>
              <p
                className="mt-4 text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none text-ink"
                aria-label="₹249 per month, subscription, cancel anytime"
              >
                ₹249
                <span className="ml-3 align-middle text-base font-semibold tracking-normal text-slate">
                  per month · cancel anytime
                </span>
              </p>
              <div className="mt-8">
                <SpecRows
                  rows={[
                    [
                      "What's included",
                      "Every quest as reviews complete: 6 briefs in the bank, 2 playable today. Parent dashboard with progress summaries. Up to 3 child profiles on one plan.",
                    ],
                    [
                      "Access & billing",
                      "Renews monthly at ₹249. Cancel anytime; refunds follow the refund policy.",
                    ],
                  ]}
                />
              </div>
              <div className="mt-7">
                <CheckoutButton
                  productId="kids-family-monthly"
                  label="Continue to parent checkout · ₹249/mo"
                />
                <TestModeNote />
              </div>
              <div className="mt-9 border-t border-border pt-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate mb-2">
                  Prefer one payment?
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                  <div>
                    <h4 className="text-lg font-extrabold tracking-tight text-ink">
                      Founding family · ₹399{" "}
                      <span className="text-sm font-semibold text-slate">
                        one-time
                      </span>
                    </h4>
                    <p className="mt-1.5 text-[15px] text-slate leading-relaxed max-w-md">
                      Founding-member access for up to 3 child profiles. No
                      subscription.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <CheckoutButton
                      productId="kids-family-lifetime"
                      label="Get founding access · ₹399"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
          <FreeRail
            eyebrow="Free forever"
            title="Try a complete sample quest"
            body="2 playable quests today: Momo & the Mangoes and Tara's story. Off-screen activity ideas included."
            cta="Play a free quest"
            href="/kids/sample/momo-mangoes"
            bridge="Family plans add every quest as reviews complete, plus the parent dashboard."
          />
        </div>
        <p className="mt-8 text-[15px] text-slate">
          Full comparison in family terms on the{" "}
          <a
            href="/kids/pricing"
            className="font-semibold text-academy-blue hover:underline"
          >
            Kids pricing page
          </a>
          .
        </p>
      </Section>

      {/* ---------- Contract strip: honest billing, no box ---------- */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Honest billing
          </p>
          <p className="text-lg md:text-xl text-ink leading-relaxed max-w-3xl text-balance">
            Prices are pilot hypotheses in INR; final currency and taxes depend
            on your country. Checkout is in test mode, so no real charges while
            the pilot runs. Refunds follow our{" "}
            <a
              href="/legal/refunds"
              className="font-semibold text-academy-blue hover:underline"
            >
              refund policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
