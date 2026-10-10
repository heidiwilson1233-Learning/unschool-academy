import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Children's Privacy",
  description:
    "How Unschool Academy protects children's data: parent-owned accounts, minimal data, no ads or behavioural advertising, and full deletion on request.",
  alternates: { canonical: "/legal/child-privacy" },
  openGraph: {
    title: "Children's Privacy | Unschool Academy",
    description:
      "Parent-owned accounts, minimal child data, no ads to children, and full deletion on request.",
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
      name: "Children's Privacy",
      item: "https://unschool.academy/legal/child-privacy",
    },
  ],
};

const KEPT = [
  "a generated profile ID",
  "nickname or avatar",
  "age band",
  "language",
  "learning activity",
];

const NEVER = [
  "full names",
  "dates of birth",
  "schools",
  "home addresses",
  "photos",
  "voice recordings",
  "biometrics",
];

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
      <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink">
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          A verified parent owns the account. A child never creates one.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          We keep a nickname and learning activity. Never names, photos, schools, or voice.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          Child mode has no ads, no purchases, and no open-ended chat. Ever.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          You can review and delete everything. Deletion is confirmed in writing.
        </li>
      </ul>
    </div>
  );
}

function Sec({
  n,
  label,
  title,
  children,
}: {
  n: string;
  label: string;
  title: string;
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
          <h2 className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-slate">{children}</div>
    </li>
  );
}

function Ledger({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <MicroLabel>{title}</MicroLabel>
      <ul className="mt-2">
        {items.map((item) => (
          <li key={item} className="border-t border-border py-2.5 text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RightRow({
  label,
  status,
  children,
}: {
  label: string;
  status?: string;
  children: ReactNode;
}) {
  return (
    <li className="border-t border-border py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold text-ink">{label}</span>
        {status && (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate whitespace-nowrap">
            {status}
          </span>
        )}
      </div>
      <p className="mt-1">{children}</p>
    </li>
  );
}

export default function ChildPrivacyPage() {
  return (
    <LegalPage title="Children's Privacy" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Summary />
      <ol role="list" className="list-none space-y-10">
        <Sec n="01" label="Accounts" title="Your child never creates an account">
          <p>
            Children never create accounts. When accounts launch, a verified adult creates the
            family account, gives consent, and manages every child profile. Consent procedures
            follow jurisdiction-specific legal review (India&rsquo;s DPDP Act; the US COPPA where
            applicable). A checkbox alone is not treated as sufficient.
          </p>
          <p>
            Consent will be asked separately for what we collect and for any sharing. A single
            checkbox will not cover both.
          </p>
        </Sec>
        <Sec n="02" label="Data minimisation" title="We keep five things. We never ask for the rest.">
          <div className="grid gap-8 md:grid-cols-2">
            <Ledger title="Kept on a child profile" items={KEPT} />
            <Ledger title="Never asked, never stored" items={NEVER} />
          </div>
        </Sec>
        <Sec n="03" label="Commercial pressure" title="No ads, no purchases, no open-ended chat">
          <p>
            Child mode contains no ads, no purchases, no external links, no social features, and
            no open-ended AI chat. No behavioural advertising to children, ever.
          </p>
        </Sec>
        <Sec n="04" label="Evidence, not surveillance" title="Learning evidence, not surveillance">
          <p>
            We record what was attempted, and whether it was independent, hinted, or
            demonstrated, so parents can see real evidence. We do not compute ability scores,
            rankings, or developmental diagnoses.
          </p>
        </Sec>
        <Sec
          n="05"
          label="Parent rights"
          title="Your controls, in the Parent Hub"
        >
          <p>
            The <Link href="/parent" className="underline underline-offset-2 text-academy-blue">Parent Hub</Link> is
            planned as the one place where a verified parent manages a child&rsquo;s data. None of
            these controls manage a live child profile yet. Parent accounts open with the Kids beta.
          </p>
          <ul>
            <RightRow label="Review activity">
              See what was attempted and whether each step was independent, hinted, or
              demonstrated.
            </RightRow>
            <RightRow label="Set session boundaries">
              Planned controls for session length and quiet hours.
            </RightRow>
            <RightRow label="Export the family's data" status="Planned">
              Machine-readable export, available once accounts are live.
            </RightRow>
            <RightRow label="Revoke consent">
              Withdrawing consent stops further collection from the child&rsquo;s profile.
            </RightRow>
            <RightRow label="Request deletion" status="Confirmed in writing">
              Deletion removes child records, and you receive written confirmation once it is
              complete.
            </RightRow>
          </ul>
        </Sec>
        <Sec n="06" label="Contact" title="Questions about your child's privacy">
          <p>
            For anything about children&rsquo;s privacy, use the{" "}
            <Link href="/contact" className="underline underline-offset-2 text-academy-blue">
              contact form
            </Link>{" "}
            and choose <strong>&ldquo;Privacy or data request&rdquo;</strong> as the topic. Privacy
            questions are answered first.
          </p>
        </Sec>
      </ol>
      <nav aria-label="Related policies" className="mt-12 border-t border-border pt-6">
        <MicroLabel>Related policies</MicroLabel>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <li>
            <Link href="/legal/privacy" className="underline underline-offset-2 text-academy-blue">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/legal/terms" className="underline underline-offset-2 text-academy-blue">
              Terms of Use
            </Link>
          </li>
        </ul>
      </nav>
    </LegalPage>
  );
}
