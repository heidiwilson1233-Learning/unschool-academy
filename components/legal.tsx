import type { ReactNode } from "react";
import { Section, Breadcrumbs, PageHero } from "@/components/ui";

export function LegalPage({
  title,
  updated,
  updatedDateTime = "2026-10",
  children,
}: {
  title: string;
  updated: string;
  /** Machine-readable month of the last update, e.g. "2026-10". */
  updatedDateTime?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={title}
        sub={
          <>
            Last updated: <time dateTime={updatedDateTime}>{updated}</time>. Plain-language
            summary first, details below.
          </>
        }
      />
      <Section>
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: title }]} />
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8" role="note">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Draft notice:</strong> these policies are staged drafts pending legal review in
              our operating jurisdictions. They describe intended practice, not yet legal advice.
            </p>
          </div>
          <article className="prose-ua space-y-5 text-slate leading-relaxed">{children}</article>
        </div>
      </Section>
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-xl font-bold text-ink pt-4">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}
