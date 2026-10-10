import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section, Breadcrumbs, Button } from "@/components/ui";
import { CheckoutButton } from "@/components/checkout-button";

export const metadata: Metadata = {
  title: "Kids Learning Plans & Pricing — Unschool Academy",
  description:
    "Two free sample quests, no account needed. Family Plan: ₹249/month for up to 3 children, or ₹399 one-time Founding plan. Pilot billing, no real charges.",
  alternates: { canonical: "/kids/pricing" },
  openGraph: {
    title: "Kids Learning Plans & Pricing — Unschool Academy",
    description:
      "Two free sample quests, no account needed. ₹249/month family plan for up to 3 children, or ₹399 one-time Founding plan. Pilot billing, no real charges.",
    type: "website",
    url: "/kids/pricing",
  },
  twitter: {
    card: "summary",
    title: "Kids Learning Plans & Pricing — Unschool Academy",
    description:
      "Two free sample quests, no account needed. ₹249/month or ₹399 one-time Founding plan. Pilot billing, no real charges.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "Pricing" },
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
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/200/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const MONTHLY_FEATURES = [
  "Full access to the quest library as it grows, across every age track. Pilot pricing while it fills out",
  "Up to 3 child profiles. One plan covers the whole family",
  "Parent dashboard with progress summaries per child",
  "Printable and off-screen activity ideas",
];

const FOUNDING_FEATURES = [
  "A fixed set of quests. One payment, no subscription",
  "Up to 3 child profiles. Siblings included",
  "Parent dashboard with progress summaries per child",
  "Off-screen activity ideas for every quest",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3 text-[15px] text-slate">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-kids-orange-ink" strokeWidth={3} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Authored numbered rows for the founding card: deliberately not a twin of the monthly checklist. */
function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-6 text-[15px] text-slate">
      {items.map((item, i) => (
        <li
          key={item}
          className="flex items-baseline gap-4 border-b border-border py-3 last:border-b-0"
        >
          <span aria-hidden className="font-mono text-xs font-bold text-kids-orange-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function KidsPricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Authored hero: type-as-hero, ambient light + grain, light surfaces ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-kids-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(242,166,108,0.28), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(185,165,229,0.30), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink mb-5">
            For parents · Adult-only billing
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-4xl">
            Family plans, in plain family terms
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            Sample quests are free, and they are complete stories. No quest is ever cut off
            mid-story to force a payment. Paid plans add the full library as it grows and
            the parent dashboard.
          </p>
        </div>
      </div>

      <Section>
        {/* ---------- Free on-ramp: the starting line, not a third equal option ---------- */}
        <div className="rounded-2xl border-2 border-b-4 border-kids-orange-deep bg-paper p-6 md:p-8 mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="md:flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink mb-3">
                Start here · free
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                Play two complete sample quests before you decide anything
              </h2>
              <p className="mt-3 text-slate leading-relaxed max-w-xl">
                Two complete sample quests: Momo&rsquo;s counting adventure and
                Tara&rsquo;s story. No account, no card, no paywall mid-story. Watch
                your child play, then pick a plan only if the quests feel right.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-3">
              <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">
                Play Momo&rsquo;s quest
              </Button>
              <Button href="/kids/sample/tara-story" variant="secondary" size="lg">
                Play Tara&rsquo;s story
              </Button>
              <p className="text-sm font-semibold text-ink">
                ₹0 <span className="font-normal text-slate">· no card, no account</span>
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Decision aid: one question, real family math ---------- */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Which plan fits your family?
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-tight text-ink text-balance max-w-3xl">
            A library that keeps growing, or one set that stays?
          </h2>
          <div className="mt-7 flex flex-col sm:flex-row gap-4">
            <Button href="#plan-monthly" variant="kids" size="lg">
              Fresh quests over time
            </Button>
            <Button href="#plan-pack" variant="secondary" size="lg">
              One forever set
            </Button>
          </div>

          {/* Family math: honest arithmetic straight from the catalog prices */}
          <dl className="mt-8 grid sm:grid-cols-2 gap-0 max-w-3xl border-t border-b border-border divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="py-5 sm:pr-6">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate">
                Family monthly, with 3 children
              </dt>
              <dd
                className="mt-2 text-4xl font-extrabold tracking-[-0.03em] text-ink"
                aria-label="83 rupees per child, per month"
              >
                ₹83<span className="ml-2 align-middle text-sm font-semibold tracking-normal text-slate">per child, per month</span>
              </dd>
            </div>
            <div className="py-5 sm:pl-6">
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-slate">
                Founding plan, with 3 children
              </dt>
              <dd
                className="mt-2 text-4xl font-extrabold tracking-[-0.03em] text-ink"
                aria-label="133 rupees per child, one payment"
              >
                ₹133<span className="ml-2 align-middle text-sm font-semibold tracking-normal text-slate">per child, one payment</span>
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-[15px] text-slate leading-relaxed max-w-2xl">
            The ₹399 Founding plan costs about as much as a month and a half of the
            family plan (₹399 ÷ ₹249 ≈ 1.6 months). If your family plays longer than
            about two months, the Founding plan costs less. Stay monthly if you want
            the library to keep arriving over time.
          </p>
        </div>

        {/* ---------- Bento: monthly dossier + founding rail ---------- */}
        <div className="grid md:grid-cols-6 gap-6">
          <article
            id="plan-monthly"
            aria-labelledby="plan-monthly-title"
            className="md:col-span-4 scroll-mt-24 rounded-2xl border border-border bg-paper overflow-hidden"
          >
            <div className="h-[3px] bg-kids-orange-deep" aria-hidden />
            <div className="p-7 md:p-10">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink">
                  Pilot pricing
                </p>
              </div>
              <h2
                id="plan-monthly-title"
                className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-ink"
              >
                Family monthly
              </h2>
              <p
                className="mt-4 text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none text-ink"
                aria-label="249 rupees per month"
              >
                ₹249
                <span className="ml-2 align-middle text-base font-semibold tracking-normal text-slate">
                  per month
                </span>
              </p>
              <div className="mt-6 border-t border-border pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate mb-1">
                  What&rsquo;s included
                </p>
                <FeatureList items={MONTHLY_FEATURES} />
              </div>
              <div className="mt-8">
                <CheckoutButton
                  productId="kids-family-monthly"
                  label="Continue to parent checkout · ₹249/mo"
                />
                <p className="mt-3 text-sm text-slate">
                  Pilot billing: no real charges yet. Cancel anytime from your parent account.
                </p>
              </div>
            </div>
          </article>

          <article
            id="plan-pack"
            aria-labelledby="plan-pack-title"
            className="md:col-span-2 scroll-mt-24 rounded-2xl border border-border bg-kids-cream/60 p-7 md:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink mb-2">
              One payment · the ₹399 set
            </p>
            <h2
              id="plan-pack-title"
              className="text-xl md:text-2xl font-extrabold tracking-tight text-ink"
            >
              Founding plan
            </h2>
            <p
              className="mt-3 text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-none text-ink"
              aria-label="399 rupees, one time"
            >
              ₹399
              <span className="ml-2 align-middle text-base font-semibold tracking-normal text-slate">
                one-time
              </span>
            </p>
            <div className="mt-2 border-t border-border pt-2">
              <NumberedList items={FOUNDING_FEATURES} />
            </div>
            <div className="mt-6">
              <CheckoutButton
                productId="kids-family-lifetime"
                label="Get founding access · ₹399"
              />
              <p className="mt-3 text-sm text-slate">
                Pilot billing: no real charges yet. One payment, no subscription.
              </p>
            </div>
          </article>
        </div>

        {/* ---------- Adult-only billing trust rail ---------- */}
        <div role="note" className="mt-12 md:mt-16 border border-border rounded-2xl bg-paper p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span aria-hidden className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-kids-orange-deep" />
            <div>
              <h2 className="font-extrabold text-ink text-lg tracking-tight">
                Billing is always adult-only
              </h2>
              <p className="mt-2 text-slate leading-relaxed text-[15px] max-w-2xl">
                Pricing, plans, and purchase buttons never appear in the kids&rsquo;
                area. This page is for parents. Checkout happens on your parent
                account with clear terms. Billing is in test mode during the pilot,
                so no real charges can happen yet, and you can cancel the monthly
                plan anytime from your parent account.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
