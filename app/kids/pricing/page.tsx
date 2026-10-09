import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Section, Breadcrumbs, Button } from "@/components/ui";
import { CheckoutButton } from "@/components/checkout-button";

export const metadata: Metadata = {
  title: "Kids Learning Plans & Pricing — Unschool Academy",
  description:
    "Compare Unschool Kids plans: free sample quests forever, a ₹249/month family plan with every quest plus the parent dashboard, or a ₹399 one-time quest pack. Adult-only billing, cancel anytime.",
  alternates: { canonical: "/kids/pricing" },
  openGraph: {
    title: "Kids Learning Plans & Pricing — Unschool Academy",
    description:
      "Free sample quests forever, or ₹249/month for every quest plus the parent dashboard. Adult-only billing, cancel anytime.",
    type: "website",
    url: "/kids/pricing",
  },
  twitter: {
    card: "summary",
    title: "Kids Learning Plans & Pricing — Unschool Academy",
    description:
      "Free sample quests forever, or ₹249/month for every quest plus the parent dashboard. Adult-only billing.",
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
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const MONTHLY_FEATURES = [
  "Every quest in the full library, all age tracks",
  "Child profiles for the whole family — one plan covers every child",
  "Parent dashboard with progress summaries per child",
  "Printable and off-screen activity ideas",
];

const PACK_FEATURES = [
  "A fixed set of quests — yours forever, no subscription",
  "Parent dashboard included",
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
            mid-story to force a payment. Paid plans add the full library and the parent
            dashboard.
          </p>
        </div>
      </div>

      <Section>
        {/* ---------- Free on-ramp: the starting line, not a third equal option ---------- */}
        <div className="rounded-2xl border-2 border-b-4 border-kids-orange-deep bg-paper p-6 md:p-8 mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="md:flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-kids-orange-ink mb-3">
                Start here — free
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                Play a complete sample quest before you decide anything
              </h2>
              <p className="mt-3 text-slate leading-relaxed max-w-xl">
                One complete sample quest per age track, off-screen activity ideas, and no
                account needed for samples. Watch your child play — then pick a plan only
                if the quests feel right.
              </p>
            </div>
            <div className="shrink-0">
              <Button href="/kids/sample/momo-mangoes" variant="kids" size="lg">
                Play a free quest
              </Button>
              <p className="mt-2 text-sm font-semibold text-ink">
                ₹0 <span className="font-normal text-slate">· no card, no account</span>
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Decision aid: one question, two chunky answers ---------- */}
        <div className="mb-10 md:mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Which plan fits your family?
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-tight text-ink text-balance max-w-3xl">
            New quests every month, or one set that stays forever?
          </h2>
          <div className="mt-7 flex flex-col sm:flex-row gap-4">
            <Button href="#plan-monthly" variant="kids" size="lg">
              Fresh quests over time
            </Button>
            <Button href="#plan-pack" variant="secondary" size="lg">
              One forever set
            </Button>
          </div>
          <p className="mt-5 text-[15px] text-slate leading-relaxed max-w-2xl">
            The ₹399 pack costs about the same as a month and a half of the family plan.
            Choose monthly if you want new quests and the parent dashboard over time;
            choose the pack if one complete set is enough.
          </p>
        </div>

        {/* ---------- Bento: monthly dossier + pack rail ---------- */}
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
              <p className="mt-4 text-6xl md:text-7xl font-extrabold tracking-[-0.04em] leading-none text-ink">
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
                  label="Continue to parent checkout — ₹249/mo"
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
            <h2
              id="plan-pack-title"
              className="text-xl md:text-2xl font-extrabold tracking-tight text-ink"
            >
              Quest pack
            </h2>
            <p className="mt-3 text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-none text-ink">
              ₹399
              <span className="ml-2 align-middle text-base font-semibold tracking-normal text-slate">
                one-time
              </span>
            </p>
            <div className="mt-6 border-t border-border pt-5">
              <FeatureList items={PACK_FEATURES} />
            </div>
            <div className="mt-8">
              <CheckoutButton
                productId="kids-family-lifetime"
                label="Buy the quest pack — ₹399"
              />
              <p className="mt-3 text-sm text-slate">
                Pilot billing: no real charges yet. Yours forever once paid.
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
                Pricing, plans, and purchase buttons never appear in the kids&rsquo; area —
                this page is for parents. Checkout happens on your parent account with
                clear terms and receipts. Billing is in test mode during the pilot, so
                no real charges can happen yet.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
