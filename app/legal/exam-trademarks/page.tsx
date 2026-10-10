import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { LegalPage } from "@/components/legal";

export const metadata: Metadata = {
  title: "Exam Trademarks & Unofficial Status",
  description:
    "Unschool Academy is independent: exam trademarks belong to their owners, our practice is unofficial, and every question is original.",
  alternates: { canonical: "/legal/exam-trademarks" },
  openGraph: {
    title: "Exam Trademarks & Unofficial Status | Unschool Academy",
    description:
      "Independent practice service. Exam names and marks belong to their owners; our questions are original and unofficial.",
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
      name: "Exam Trademarks & Unofficial Status",
      item: "https://unschool.academy/legal/exam-trademarks",
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
      <p className="mt-4 font-display text-xl sm:text-2xl leading-snug text-ink">
        We are an independent practice service: not affiliated with any exam owner, naming exams
        only to say what we prepare you for, every question original, every score unofficial.
      </p>
    </div>
  );
}

const MARKS: { mark: string; owner: string; use: string }[] = [
  {
    mark: "JFT-Basic",
    owner: "Japan Foundation",
    use: "Named in plain text, only to say our practice prepares you for it.",
  },
  {
    mark: "Other exam names",
    owner: "Their respective owners",
    use: "Named in plain text; nothing reproduced, nothing implied.",
  },
  {
    mark: "Unschool Academy",
    owner: "Our name",
    use: "Our own brand. Every third-party mark above belongs to its owner.",
  },
];

function MarksLedger() {
  return (
    <section aria-labelledby="marks-heading" className="mb-12">
      <MicroLabel>The marks</MicroLabel>
      <h2
        id="marks-heading"
        className="font-display text-2xl sm:text-[28px] font-bold tracking-[-0.01em] text-ink mt-2"
      >
        Whose name is whose
      </h2>
      <ul className="mt-6">
        <li
          aria-hidden="true"
          className="hidden sm:grid sm:grid-cols-[1fr_1fr_1.4fr] gap-4 pb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-slate"
        >
          <span>Mark</span>
          <span>Owner</span>
          <span>How we use it</span>
        </li>
        {MARKS.map((row) => (
          <li
            key={row.mark}
            className="grid gap-1 sm:grid-cols-[1fr_1fr_1.4fr] sm:gap-4 border-t border-border py-4"
          >
            <span className="font-semibold text-ink">{row.mark}</span>
            <span className="text-slate">{row.owner}</span>
            <span className="text-slate">{row.use}</span>
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

export default function ExamTrademarksPage() {
  return (
    <LegalPage title="Exam Trademarks & Unofficial Status" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Summary />
      <MarksLedger />
      <ol role="list" className="list-none space-y-10">
        <Sec n="01" label="Affiliation" title="Independent and unofficial">
          <p>
            Unschool Academy is an independent practice and learning service. We are not affiliated
            with, endorsed by, or sponsored by any examination body, including the Japan
            Foundation (JFT-Basic) or any other test owner named in our research.
          </p>
        </Sec>
        <Sec n="02" label="Marks" title="How we use exam names">
          <p>
            Exam names, logos, and program names belong to their respective owners. We use them
            only to describe what our practice prepares you for, which is a standard form of fair
            use. Nothing here implies endorsement.
          </p>
          <p>
            In plain terms: we only name an exam where the name is needed to say what we prepare
            you for, we use no more of the name than that requires, and nothing here suggests the
            exam owner sponsors or endorses us.
          </p>
        </Sec>
        <Sec n="03" label="Practice" title="Original questions, unofficial scores">
          <p>
            All questions are original. Practice scores are unofficial and cannot predict official
            results. We never reproduce official past papers or claim official status.
          </p>
        </Sec>
        <Sec n="04" label="Corrections" title="How to request a correction">
          <p>
            If you represent an examination body and believe any content misrepresents your
            program, write to{" "}
            <a
              href="mailto:support@unschool.academy"
              className="underline underline-offset-2 text-academy-blue"
            >
              support@unschool.academy
            </a>{" "}
            or use our{" "}
            <Link href="/contact" className="underline underline-offset-2 text-academy-blue">
              contact form
            </Link>{" "}
            with the topic &ldquo;Exam practice or content issue&rdquo;. Tell us which page, what
            is wrong, and what a correct statement would be; we will review and correct promptly.
          </p>
        </Sec>
      </ol>
      <p className="mt-10 text-[15px] leading-relaxed text-slate">
        How this applies on the site: every entry in the{" "}
        <Link href="/exams/catalog" className="underline underline-offset-2 text-academy-blue">
          exam catalog
        </Link>{" "}
        is marked with its review status, and exam pages separate official facts from our own
        practice content.
      </p>
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
        </ul>
      </nav>
    </LegalPage>
  );
}
