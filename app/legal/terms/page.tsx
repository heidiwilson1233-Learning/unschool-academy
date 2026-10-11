import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of Use for Unschool Academy: what the service is, who may hold an account, fair use, payments in test mode, content ownership, and how terms change.",
  alternates: { canonical: "/legal/terms" },
  openGraph: {
    title: "Terms of Use | Unschool Academy",
    description:
      "Accounts, acceptable use, test-mode payments, content, and liability: the plain-language terms for using Unschool Academy during the pilot.",
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
      name: "Terms of Use",
      item: "https://unschool.academy/legal/terms",
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

function InLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="underline underline-offset-2 text-academy-blue">
      {children}
    </Link>
  );
}

function Summary() {
  return (
    <div className="rounded-2xl border border-border bg-paper p-6 sm:p-7 mb-12">
      <MicroLabel>In one minute</MicroLabel>
      <ul className="mt-4 space-y-3 font-display text-lg sm:text-xl leading-snug text-ink">
        <li>
          These terms are a staged draft, pending legal review. They describe intended practice,
          not final legal advice.
        </li>
        <li>
          Unschool Academy offers practice and learning content. We are not an accredited school,
          a certifying authority, or an official exam provider.
        </li>
        <li>
          Adult learner accounts are for people 16 or older. Children&rsquo;s profiles sit under a
          parent&rsquo;s account; we do not offer accounts to children directly.
        </li>
        <li>
          Checkout is in test mode. No real charges are being made. Live billing terms will be
          published before any real charge.
        </li>
        <li>
          Practice scores are unofficial and for learning only. They are not predictions of exam
          results.
        </li>
      </ul>
    </div>
  );
}

/** Reader-split bento: the two readers who actually read this page, separated up front. */
function ReaderSplit() {
  return (
    <section aria-labelledby="readers-heading" className="mb-12">
      <MicroLabel>Start here</MicroLabel>
      <h2
        id="readers-heading"
        className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2"
      >
        Who these terms cover
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-6">
        <div className="sm:col-span-3 border-t border-border pt-5">
          <MicroLabel>Reader</MicroLabel>
          <h3 className="font-display text-xl font-bold text-ink mt-2">
            If you&rsquo;re an adult learner
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate">
            Sections 01, 03, and 07 matter most to you: what the service is, fair use, and how
            terms change. Free diagnostics and sample quests need no account and carry no charge.
          </p>
        </div>
        <div className="sm:col-span-3 border-t border-border pt-5">
          <MicroLabel>Reader</MicroLabel>
          <h3 className="font-display text-xl font-bold text-ink mt-2">
            If you&rsquo;re a parent or guardian
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate">
            Children&rsquo;s profiles live only under a parent&rsquo;s account; see our{" "}
            <InLink href="/legal/child-privacy">Children&rsquo;s Privacy</InLink> page. Practice
            scores are learning signals, not predictions. Questions about any clause?{" "}
            <InLink href="/contact">Ask us directly</InLink>.
          </p>
        </div>
      </div>
      <p className="mt-6 border-t border-border pt-4 text-[15px] leading-relaxed text-slate">
        <strong className="font-semibold text-ink">Applies to everyone:</strong> acceptable use,
        payments in test mode, content ownership, and liability limits.
      </p>
    </section>
  );
}

function OnThisPage() {
  const items: { id: string; label: string }[] = [
    { id: "what-it-is", label: "What the Academy is" },
    { id: "accounts", label: "Who may hold an account" },
    { id: "fair-use", label: "Fair use of the service" },
    { id: "payments", label: "Payments during the pilot" },
    { id: "content", label: "Content and trademarks" },
    { id: "liability", label: "What scores mean, and liability limits" },
    { id: "changes", label: "How terms change" },
  ];
  return (
    <nav aria-label="On this page" className="mb-12">
      <MicroLabel>On this page</MicroLabel>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="underline underline-offset-2 text-academy-blue">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Sec({
  n,
  label,
  title,
  headingId,
  gloss,
  children,
}: {
  n: string;
  label: string;
  title: string;
  headingId: string;
  gloss: string;
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
      <p className="mt-4 font-display text-[17px] italic leading-snug text-ink/90">
        <span className="font-sans not-italic text-[13px] font-semibold uppercase tracking-[0.12em] text-slate">
          In plain English
        </span>{" "}
        {gloss}
      </p>
      <div className="mt-3 space-y-4 text-[15px] leading-relaxed text-slate">{children}</div>
    </li>
  );
}

function ChangeLedger() {
  return (
    <div className="mt-8">
      <MicroLabel>Change log</MicroLabel>
      <ul className="mt-4">
        <li className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4 border-t border-border py-3 text-[15px]">
          <span className="font-mono text-sm font-semibold text-slate">October 2026</span>
          <span className="text-slate">
            First published draft. No substantive changes yet.
          </span>
        </li>
        <li className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4 border-t border-border py-3 text-[15px]">
          <span className="font-mono text-sm font-semibold text-slate">Future</span>
          <span className="text-slate">
            When these terms take full effect, each change will get a dated summary in this log.
          </span>
        </li>
      </ul>
    </div>
  );
}

function ClosingBlocks() {
  return (
    <>
      <div className="mt-12 border-t border-border pt-8">
        <MicroLabel>Questions</MicroLabel>
        <h2 className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2">
          Questions about these terms?
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-slate">
          Open the <InLink href="/contact">contact form</InLink> and choose &ldquo;General&rdquo;
          as the topic. A real person replies within 2 business days during the pilot.
        </p>
      </div>
      <div className="mt-8 border-t border-border pt-6">
        <p className="text-[15px] leading-relaxed text-slate">
          Wondering how the learning itself works? See{" "}
          <InLink href="/how-it-works">how it works</InLink>, with honest numbers and the review
          standards behind our content.
        </p>
      </div>
    </>
  );
}

function RelatedPolicies() {
  const links: { href: string; label: string }[] = [
    { href: "/legal/privacy", label: "Privacy Policy" },
    { href: "/legal/refunds", label: "Refund & Cancellation Policy" },
    { href: "/legal/child-privacy", label: "Children's Privacy" },
    { href: "/legal/accessibility", label: "Accessibility" },
    { href: "/legal/exam-trademarks", label: "Exam Trademarks & Unofficial Status" },
    { href: "/pricing", label: "Pricing" },
  ];
  return (
    <nav aria-label="Related policies" className="mt-12 border-t border-border pt-6">
      <MicroLabel>Related policies</MicroLabel>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <InLink href={link.href}>{link.label}</InLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Summary />
      <ReaderSplit />
      <OnThisPage />
      <ol role="list" className="list-none space-y-10">
        <Sec
          n="01"
          label="The service"
          title="What the Academy is"
          headingId="what-it-is"
          gloss="a practice and learning service, not a school or an exam board."
        >
          <p>
            Unschool Academy is a practice and learning service: exam preparation for adult
            learners, and interactive learning quests for children under parent-managed accounts.
            We are not an accredited school, a certifying authority, or an official exam provider.
          </p>
        </Sec>
        <Sec
          n="02"
          label="Accounts"
          title="Who may hold an account"
          headingId="accounts"
          gloss="adult accounts for adults; children's profiles live under a parent's account."
        >
          <p>
            Adult learner accounts are for people 16 or older, or of the age of digital consent
            where you live. Children&rsquo;s profiles are created and managed only by a parent or
            guardian; we do not offer accounts to children directly. For how children&rsquo;s data
            is handled, see our <InLink href="/legal/child-privacy">Children&rsquo;s Privacy</InLink>{" "}
            page.
          </p>
        </Sec>
        <Sec
          n="03"
          label="Fair use"
          title="Fair use of the service"
          headingId="fair-use"
          gloss="use the content to learn, not to copy, resell, or game the system."
        >
          <p>
            Do not scrape, copy, or resell our content. Do not access other people&rsquo;s data,
            manipulate scores, or interfere with the service. Once accounts launch, we may suspend
            or close accounts that abuse the platform.
          </p>
        </Sec>
        <Sec
          n="04"
          label="Payments"
          title="Payments during the pilot"
          headingId="payments"
          gloss="no real charges yet; refund rules live on their own page."
        >
          <p>
            Paid plans, what they unlock, how long they last, and how to cancel are described on
            the <InLink href="/pricing">pricing page</InLink>. Checkout is in test mode during the
            pilot, so no real charges are being made. Live billing terms will be published before
            any real charge. See the <InLink href="/legal/refunds">refund and cancellation policy</InLink>{" "}
            for refund rules.
          </p>
        </Sec>
        <Sec
          n="05"
          label="Content"
          title="Content and trademarks"
          headingId="content"
          gloss="our questions and artwork are ours; exam names belong to their owners."
        >
          <p>
            Practice questions, quests, characters, and artwork are original works of Unschool
            Academy. Exam names belong to their respective owners; see our{" "}
            <InLink href="/legal/exam-trademarks">exam trademarks notice</InLink>.
          </p>
        </Sec>
        <Sec
          n="06"
          label="Liability"
          title="What scores mean, and limits on liability"
          headingId="liability"
          gloss="practice scores are practice scores; they do not decide your exam result."
        >
          <p>
            Practice scores are unofficial and for learning only; they are not predictions or
            guarantees of results. As far as the law allows, we are not liable for exam results,
            admissions, immigration decisions, or developmental claims.
          </p>
        </Sec>
        <Sec
          n="07"
          label="Changes"
          title="How terms change"
          headingId="changes"
          gloss="changes will be announced here, with a dated summary each time."
        >
          <p>
            We may update these terms. We will announce changes on this page, with the new date
            at the top. If you keep using the service after the updated terms take effect, you
            accept them.
          </p>
          <ChangeLedger />
        </Sec>
      </ol>
      <ClosingBlocks />
      <RelatedPolicies />
    </LegalPage>
  );
}
