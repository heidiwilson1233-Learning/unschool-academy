import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Refund and cancellation terms for Unschool Academy: free products, finite passes, subscriptions, how to request a refund, and response times.",
  alternates: { canonical: "/legal/refunds" },
  openGraph: {
    title: "Refund & Cancellation Policy | Unschool Academy",
    description:
      "Free products, finite passes, subscriptions: what is refundable, how to request, and how fast we respond.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Refund & Cancellation Policy",
      item: "https://unschool.academy/legal/refunds",
    },
  ],
};

function MicroLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-academy-blue">
      {children}
    </p>
  );
}

function Summary() {
  return (
    <div className="rounded-2xl border border-border bg-paper p-6 sm:p-7 mb-12">
      <MicroLabel>In one minute</MicroLabel>
      <ul className="mt-4 space-y-3 font-display text-lg sm:text-xl leading-snug text-ink">
        <li>The diagnostic sampler and demo quests are free forever. We never charge for them, so there is nothing to refund and nothing to cancel.</li>
        <li>One-time passes are fully refundable within 7 days of purchase when the paid content has not been started. After that, refunds for unused time are pro-rated and decided case by case.</li>
        <li>Subscriptions can be cancelled any time. You keep access until the end of the paid period and are not charged again. Refunds are considered case by case within 7 days of a renewal.</li>
        <li>To ask for a refund, use the contact form and choose &ldquo;Billing&rdquo; as the topic. A real person replies within 2 business days during the pilot.</li>
        <li>Checkout is in test mode, so no real charges are being made today. This policy describes our intended practice and takes full effect when live billing launches.</li>
      </ul>
    </div>
  );
}

const LEDGER: { purchase: string; terms: string; status: string }[] = [
  {
    purchase: "Free: diagnostic, demo quests",
    terms: "Nothing to refund, nothing to cancel. We never charge for them.",
    status: "Live",
  },
  {
    purchase: "One-time passes: 60-day exam pass, quest packs",
    terms:
      "Full refund within 7 days of purchase if the paid content has not been started. After that, refunds for unused time are pro-rated and decided case by case.",
    status: "Intended practice",
  },
  {
    purchase: "Subscriptions: Kids family monthly",
    terms:
      "Cancel any time; you keep access until the end of the paid period and are not charged again. Current-period refunds are considered case by case within 7 days of renewal.",
    status: "Intended practice",
  },
];

function EligibilityLedger() {
  return (
    <section aria-labelledby="ledger-heading" className="mb-12">
      <MicroLabel>The rules</MicroLabel>
      <h2
        id="ledger-heading"
        className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2"
      >
        Which purchases are refundable
      </h2>
      <ul className="mt-6">
        <li
          aria-hidden="true"
          className="hidden sm:grid sm:grid-cols-[1fr_1.6fr_1fr] gap-4 pb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate"
        >
          <span>Type of purchase</span>
          <span>Refund terms</span>
          <span>Status</span>
        </li>
        {LEDGER.map((row) => (
          <li
            key={row.purchase}
            className="grid gap-1 sm:grid-cols-[1fr_1.6fr_1fr] sm:gap-4 border-t border-border py-4"
          >
            <span className="font-semibold text-ink">{row.purchase}</span>
            <span className="text-slate">{row.terms}</span>
            <span className="text-slate">{row.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Sec({
  n,
  label,
  title,
  headingId,
  children,
}: {
  n: string;
  label: string;
  title: string;
  headingId?: string;
  children: ReactNode;
}) {
  return (
    <li className="border-t border-border pt-8">
      <div className="flex items-baseline gap-4">
        <span aria-hidden="true" className="font-mono text-sm font-semibold text-slate">
          {n}
        </span>
        <div>
          <MicroLabel>{label}</MicroLabel>
          <h2
            id={headingId}
            className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2"
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate">{children}</div>
    </li>
  );
}

export default function RefundsPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Summary />
      <EligibilityLedger />
      <ol role="list" className="list-none space-y-10">
        <Sec n="01" label="Free" title="Free products">
          <p>
            The diagnostic sampler and demo quests are free forever. We never charge for them,
            so there is nothing to refund and nothing to cancel.
          </p>
        </Sec>
        <Sec n="02" label="Passes" title="One-time passes">
          <p>
            Passes such as the 60-day exam pass and quest packs are fully refundable within 7 days
            of purchase, as long as you have not started the paid content (answered any paid
            question or played any paid quest). After that, refunds cover unused time only, are
            reduced by the share of the pass already used, and are decided case by case. Write to
            us to request one.
          </p>
        </Sec>
        <Sec n="03" label="Subscriptions" title="Subscriptions">
          <p>
            You can cancel a subscription at any time. You keep access until the end of the paid
            period and are not charged again. Refunds for the current period are considered case
            by case within 7 days of renewal. Self-service cancellation will move into the Plans
            and billing section of your account when accounts launch; until then, cancel through
            the contact form.
          </p>
        </Sec>
        <Sec n="04" label="Request" title="How to request a refund" headingId="how-to-request">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Open the{" "}
              <Link href="/contact" className="underline underline-offset-2 text-academy-blue">
                contact form
              </Link>{" "}
              and choose &ldquo;Billing&rdquo; as the topic.
            </li>
            <li>
              Include your name, the email you used at checkout, what you bought, when you bought
              it, and why you are asking.
            </li>
            <li>Send it. A real person replies within 2 business days during the pilot.</li>
          </ol>
          <p>
            What happens next: we confirm your request, check whether your purchase qualifies
            under the rules above, and process any refund back to the original payment method
            through our payment provider. How quickly the money appears in your account depends
            on your bank, which we do not control. Refund processing applies once live billing
            launches; checkout is in test mode today.
          </p>
        </Sec>
        <Sec n="05" label="Pilot" title="Pilot note">
          <p>
            Checkout is in test mode. No real charges are being made. This policy describes our
            intended practice and takes full effect when live billing launches.
          </p>
        </Sec>
      </ol>
      <nav aria-label="Related policies" className="mt-12 border-t border-border pt-6">
        <MicroLabel>Related policies</MicroLabel>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <li>
            <Link href="/legal/terms" className="underline underline-offset-2 text-academy-blue">
              Terms of Use
            </Link>
          </li>
          <li>
            <Link href="/legal/privacy" className="underline underline-offset-2 text-academy-blue">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              href="/legal/accessibility"
              className="underline underline-offset-2 text-academy-blue"
            >
              Accessibility
            </Link>
          </li>
          <li>
            <Link
              href="/legal/child-privacy"
              className="underline underline-offset-2 text-academy-blue"
            >
              Children&rsquo;s Privacy
            </Link>
          </li>
          <li>
            <Link href="/pricing" className="underline underline-offset-2 text-academy-blue">
              Pricing
            </Link>
          </li>
        </ul>
      </nav>
    </LegalPage>
  );
}
