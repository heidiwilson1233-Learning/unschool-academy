import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Unschool Academy handles your data: what we collect, what we never do, your rights, retention, security, and cookies.",
  alternates: { canonical: "/legal/privacy" },
  openGraph: {
    title: "Privacy Policy | Unschool Academy",
    description:
      "What we collect, what we never do, your rights, retention, security, and cookies.",
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
      name: "Privacy Policy",
      item: "https://unschool.academy/legal/privacy",
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
      <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ink">
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          We collect what the service needs: account details, learning activity, purchases, and
          support messages. Nothing else.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          We never sell personal data. We never see or store card numbers.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          Deletion is available now in Account settings. Data export arrives with accounts.
        </li>
        <li className="flex gap-3">
          <span aria-hidden="true" className="text-academy-teal font-bold">·</span>
          This is a staged draft describing intended practice, pending legal review. The details
          below say what is true today and what is planned.
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

const INVENTORY: { data: string; why: string; howLong: string }[] = [
  {
    data: "Account data: name, email",
    why: "To sign you in and run your account.",
    howLong: "While your account is active.",
  },
  {
    data: "Learning activity: attempts, answers, quest progress",
    why: "To score practice, show progress, and plan next steps.",
    howLong: "While your account is active; deleted or anonymized after closure.",
  },
  {
    data: "Purchase records",
    why: "For receipts, refunds, and support.",
    howLong: "As long as tax and accounting rules require.",
  },
  {
    data: "Support messages",
    why: "To answer you.",
    howLong: "While the thread is open, then archived.",
  },
  {
    data: "Children's profiles: nickname or avatar, age band, language, learning activity",
    why: "To run kids mode and show parents real evidence of learning.",
    howLong: "The shortest schedule of all; deleted first.",
  },
];

const NEVER = [
  "Selling personal data, to anyone, for any reason",
  "Card numbers: payments are handled by our payment provider when checkout goes live; we never see or store them",
  "Marketing segmentation or behavioral advertising using children's data",
  "Advertising trackers on child-mode pages",
  "Full names, birthdays, schools, photos, or voice recordings of children",
];

function InventoryTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[15px] leading-relaxed">
        <caption className="sr-only">
          What we collect, why we keep it, and how long we keep it
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th scope="col" className="pb-3 pr-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">
              What we collect
            </th>
            <th scope="col" className="pb-3 pr-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">
              Why we keep it
            </th>
            <th scope="col" className="pb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">
              How long
            </th>
          </tr>
        </thead>
        <tbody>
          {INVENTORY.map((row) => (
            <tr key={row.data} className="border-b border-border align-top">
              <th scope="row" className="py-3.5 pr-4 font-semibold text-ink">
                {row.data}
              </th>
              <td className="py-3.5 pr-4">{row.why}</td>
              <td className="py-3.5">{row.howLong}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NeverLedger() {
  return (
    <div>
      <MicroLabel>We never do these</MicroLabel>
      <ul className="mt-2">
        {NEVER.map((item) => (
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
  status: string;
  children: ReactNode;
}) {
  return (
    <li className="border-t border-border py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold text-ink">{label}</span>
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate whitespace-nowrap">
          {status}
        </span>
      </div>
      <p className="mt-1">{children}</p>
    </li>
  );
}

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Summary />
      <ol role="list" className="list-none space-y-10">
        <Sec n="01" label="Collection" title="What we keep, and why">
          <p>
            We keep five kinds of data. The table below says what each one is, why we keep it,
            and how long it stays.
          </p>
          <InventoryTable />
          <NeverLedger />
        </Sec>
        <Sec n="02" label="Purposes" title="Why we process data">
          <p>We use data to provide the service, and for nothing else:</p>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-academy-teal">
            <li>Run accounts, score practice, and show progress.</li>
            <li>Process payments and handle refunds.</li>
            <li>Answer support messages.</li>
            <li>Improve content in aggregate, never by profiling individuals.</li>
          </ul>
          <p>
            We do not send marketing emails today. If we ever do, they will be opt-in only, with
            one-click unsubscribe.
          </p>
        </Sec>
        <Sec n="03" label="Rights" title="Your rights, and how to use them">
          <p>
            Every right below says whether it is available now or planned. We respond to requests
            within 30 days.
          </p>
          <ul>
            <RightRow label="Request deletion" status="Available now">
              Go to <Link href="/account" className="underline underline-offset-2 text-academy-blue">Account settings</Link> and
              choose Delete my account. You receive written confirmation once deletion is complete.
            </RightRow>
            <RightRow label="Export your data" status="Planned">
              A machine-readable export arrives with accounts and will live in Account settings,
              in the same place as deletion.
            </RightRow>
            <RightRow label="Children's data requests" status="Contact us">
              Families write through the{" "}
              <Link href="/contact" className="underline underline-offset-2 text-academy-blue">
                contact form
              </Link>{" "}
              and choose <strong>&ldquo;Privacy or data request&rdquo;</strong> as the topic.
              Parent Hub controls arrive with the Kids beta.
            </RightRow>
          </ul>
        </Sec>
        <Sec n="04" label="Retention" title="How long we keep it">
          <p>
            We keep personal data only as long as it is needed to provide the service. After you
            close your account, we keep what support and the law require, then delete or
            anonymize the rest.
          </p>
          <p>
            Children&rsquo;s records are on the shortest schedule: they are deleted first and
            fastest.
          </p>
        </Sec>
        <Sec n="05" label="Security" title="How we protect it">
          <p>
            Your data is encrypted when it travels and when it is stored. Every protected page
            checks on our servers that you are signed in and allowed in. We keep secrets out of
            client code.
          </p>
          <p>
            No system is perfect. We disclose breaches as the law requires.
          </p>
        </Sec>
        <Sec n="06" label="Cookies" title="Cookies">
          <p id="cookies">
            Essential cookies keep you signed in and remember your preferences. We do not run
            advertising trackers.
          </p>
          <p>
            If we add analytics cookies later, they will be consent-based, and the choice control
            will be announced here. Child-mode pages run without advertising trackers.
          </p>
        </Sec>
        <Sec n="07" label="Contact" title="Questions about your data">
          <p>
            Use the{" "}
            <Link href="/contact" className="underline underline-offset-2 text-academy-blue">
              contact form
            </Link>{" "}
            and choose <strong>&ldquo;Privacy or data request&rdquo;</strong> as the topic.
            Privacy questions are answered first.
          </p>
          <p>
            For how we handle children&rsquo;s data specifically, see{" "}
            <Link href="/legal/child-privacy" className="underline underline-offset-2 text-academy-blue">
              Children&rsquo;s Privacy
            </Link>
            .
          </p>
        </Sec>
      </ol>
      <nav aria-label="Related policies" className="mt-12 border-t border-border pt-6">
        <MicroLabel>Related policies</MicroLabel>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <li>
            <Link href="/legal/child-privacy" className="underline underline-offset-2 text-academy-blue">
              Children&rsquo;s Privacy
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
