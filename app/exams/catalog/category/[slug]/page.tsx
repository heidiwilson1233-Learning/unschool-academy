import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Breadcrumbs, Card, Badge, Callout, Button, EmptyState } from "@/components/ui";
import {
  CATEGORY_META,
  getCategoryMeta,
  getExamsByCategory,
  getPublicStatus,
  statusLabel,
  kindLabel,
  examUrl,
} from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORY_META.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const meta = getCategoryMeta(slug);
    if (!meta) return { title: "Category not found" };
    return {
      title: `${meta.name} — Exam Research Catalog`,
      description: `${meta.tagline}. Research entries for ${meta.name.toLowerCase()} exams, honestly labelled by verification status.`,
    };
  });
}

const STATUS_TONES = {
  "practice-ready": "success",
  verified: "info",
  research: "neutral",
} as const;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCategoryMeta(slug);
  if (!meta) notFound();
  const exams = getExamsByCategory(meta.name);

  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Exams", href: "/exams" },
              { label: "Exam catalog", href: "/exams/catalog" },
              { label: meta.name },
            ]}
          />
          <p className="text-sm font-bold uppercase tracking-widest text-academy-teal mb-4">Research catalogue</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink max-w-3xl leading-tight">{meta.name}</h1>
          <p className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">{meta.description}</p>
          <p className="mt-4 text-sm text-slate">
            <strong className="text-ink">{exams.length}</strong> research entries in this category
          </p>
        </div>
      </div>

      <Section>
        <Callout title="Research entries, not programs" tone="info">
          Entries below are research targets. Verification status is shown on each card — nothing here is a purchasable
          program until it passes our validation checklist.
        </Callout>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((e) => {
            const st = getPublicStatus(e);
            return (
              <a key={e.id} href={examUrl(e.id)} className="group">
                <Card hover className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-slate/70">{e.id}</span>
                    <Badge tone={STATUS_TONES[st]}>{statusLabel(st)}</Badge>
                  </div>
                  <h2 className="mt-2 font-bold text-ink leading-snug group-hover:text-academy-blue transition-colors">
                    {e.exam_or_track}
                  </h2>
                  <p className="mt-1 text-sm text-slate">{e.issuing_body}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-slate/10 text-slate font-semibold">{e.region}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate/10 text-slate font-semibold">{kindLabel(e.kind)}</span>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
        {exams.length === 0 && (
          <EmptyState title="No entries" body="This category has no research entries yet." />
        )}
        <div className="mt-10">
          <Button href="/exams/catalog" variant="secondary">
            ← Back to full catalog
          </Button>
        </div>
      </Section>
    </>
  );
}
