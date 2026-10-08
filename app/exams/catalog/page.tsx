import type { Metadata } from "next";
import { Section, PageHero, Breadcrumbs, Callout } from "@/components/ui";
import CatalogBrowser from "@/components/catalog-browser";
import { CATEGORY_META, categoryUrl } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Exam Catalog — 500 Research Entries, Honestly Labelled",
  description:
    "Browse Unschool Academy's 500-exam research catalogue by category, region and track type. Research entries are never advertised as available programs until verified.",
};

export default function CatalogHubPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "Exam catalog" }]} />
          <PageHero
            eyebrow="Unschool Exams · Research catalogue"
            tone="exam"
            title="500 exams, catalogued honestly"
            sub="This is our research backlog made visible: 500 exam and preparation tracks across 10 categories. An entry here is a research target — not a promise. Only verified entries graduate to real preparation programs."
          />
        </div>
      </div>

      <Section>
        <Callout title="How to read this catalogue" tone="info">
          <strong>Research entry</strong> means we are still verifying the facts — no practice, no mocks, no purchase.
          <strong> Facts verified</strong> means the exam details passed our checklist.
          <strong> Practice available</strong> means reviewed practice actually exists on this site. We never invent
          rankings, fees, or pass guarantees.
        </Callout>

        <div className="mt-8">
          <CatalogBrowser />
        </div>
      </Section>

      <Section className="!pt-0">
        <h2 className="text-xl font-extrabold text-ink mb-4">Browse by category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORY_META.map((c) => (
            <a
              key={c.slug}
              href={categoryUrl(c.slug)}
              className="rounded-2xl border border-border bg-white p-5 hover:border-academy-blue hover:shadow-md transition-all group"
            >
              <h3 className="font-bold text-ink group-hover:text-academy-blue transition-colors">{c.name}</h3>
              <p className="mt-1 text-sm text-slate">{c.tagline}</p>
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
