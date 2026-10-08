import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Breadcrumbs, Badge, Callout, Button, Card } from "@/components/ui";
import {
  getAllExams,
  getExamById,
  getOverlay,
  getPublicStatus,
  getValidation,
  statusLabel,
  kindLabel,
  getCategoryByName,
  categoryUrl,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getAllExams().map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const entry = getExamById(id);
  if (!entry) return { title: "Exam not found" };
  const status = getPublicStatus(entry);
  return {
    title: `${entry.exam_or_track} — ${statusLabel(status)} | Unschool Academy`,
    description: `${entry.exam_or_track} (${entry.id}): ${statusLabel(status).toLowerCase()} in Unschool Academy's research catalogue. ${entry.issuing_body}.`,
    // Research and retired entries are internal working notes, not SEO landing pages.
    robots: status === "research" || status === "retired" ? { index: false, follow: true } : undefined,
  };
}

function FactRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-border last:border-0">
      <dt className="sm:w-44 shrink-0 text-sm font-bold text-slate">{label}</dt>
      <dd className="text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = getExamById(id);
  if (!entry) notFound();

  const overlay = getOverlay(entry.id);
  const validation = getValidation(entry.id);
  const status = getPublicStatus(entry);
  const cat = getCategoryByName(entry.category);

  const statusTone = status === "practice-ready" ? "success" : status === "verified" ? "info" : status === "retired" ? "warning" : "neutral";

  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Exams", href: "/exams" },
              { label: "Exam catalog", href: "/exams/catalog" },
              ...(cat ? [{ label: cat.name, href: categoryUrl(cat.slug) }] : []),
              { label: entry.id },
            ]}
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate">{entry.id}</span>
            <Badge tone={statusTone}>{statusLabel(status)}</Badge>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-ink leading-tight">
            {entry.exam_or_track}
          </h1>
          <p className="mt-3 text-lg text-slate">
            {entry.issuing_body}
            {entry.issuing_body !== entry.exam_family ? ` · ${entry.exam_family}` : ""} · {entry.region}
          </p>
        </div>
      </div>

      <Section>
        <div className="max-w-4xl mx-auto">
          {status === "retired" && (
            <Callout title="Retired or renamed — verify before planning" tone="warning">
              Our 2026-10-08 research pass found this exam is retired, renamed, or being phased out.{" "}
              {validation?.note && <span className="block mt-2 text-slate">{validation.note}</span>}
              <span className="block mt-2">Do not plan a study schedule around this entry — check the official organizer for the current exam.</span>
            </Callout>
          )}
          {status === "research" && (
            <Callout title="Research entry — not a program" tone="warning">
              We are still verifying the facts for this exam. There is <strong>no practice, no mock test, and nothing
              to buy</strong> here yet. Entries graduate to real programs only after passing our validation checklist:
              official name, organizer, format, scoring, and a qualified reviewer.
            </Callout>
          )}
          {status === "verified" && (
            <Callout title={`Facts verified ${overlay.verifiedAt ?? ""}`} tone="info">
              The exam details below passed our validation checklist. Practice material is still in preparation —
              questions are authored and reviewed one exam at a time.
            </Callout>
          )}

          {/* Verified facts (only when an overlay provides them) */}
          {overlay.verifiedFacts && (
            <Card className="mt-6">
              <h2 className="font-extrabold text-ink text-lg">Verified facts</h2>
              <dl className="mt-2">
                {Object.entries(overlay.verifiedFacts).map(([k, v]) => (
                  <FactRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={v} />
                ))}
              </dl>
              <p className="mt-3 text-xs text-slate">Last verified {overlay.verifiedAt} against official sources.</p>
            </Card>
          )}

          {/* Catalog facts */}
          <Card className="mt-6">
            <h2 className="font-extrabold text-ink text-lg">Catalogue record</h2>
            <dl className="mt-2">
              <FactRow label="Entry ID" value={<span className="font-mono">{entry.id}</span>} />
              <FactRow label="Category" value={entry.category} />
              <FactRow label="Region" value={entry.region} />
              <FactRow label="Issuing body" value={entry.issuing_body} />
              <FactRow label="Exam family" value={entry.exam_family} />
              <FactRow label="Track type" value={kindLabel(entry.kind)} />
              <FactRow
                label="Official directory"
                value={
                  entry.official_directory_url ? (
                    <a
                      href={entry.official_directory_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-academy-blue font-semibold hover:underline break-all"
                    >
                      {entry.official_directory_url} ↗
                    </a>
                  ) : (
                    <span className="text-slate">No authoritative source recorded yet — research in progress.</span>
                  )
                }
              />
            </dl>
          </Card>

          {/* Validation status — shown plainly */}
          <Card className="mt-6">
            <h2 className="font-extrabold text-ink text-lg">Validation status</h2>
            <dl className="mt-2">
              <FactRow label="Validation" value={entry.validation_status} />
              <FactRow label="Launch status" value={entry.launch_status} />
              <FactRow
                label="Question bank"
                value={
                  entry.question_bank_status === "Not authored"
                    ? "Not authored — no practice questions exist for this exam yet."
                    : entry.question_bank_status
                }
              />
              <FactRow label="Demand rank" value={entry.demand_rank === "Not ranked" ? "Not ranked — we don't invent rankings." : entry.demand_rank} />
            </dl>
          </Card>

          {/* Practice CTA or honest wait */}
          <div className="mt-8">
            {overlay.practiceReady && overlay.practiceHref ? (
              <div className="flex flex-wrap gap-3">
                <Button href={overlay.practiceHref} size="lg">
                  Start practicing →
                </Button>
                <Button href="/exams/jft-basic/diagnostic" variant="secondary" size="lg">
                  Free diagnostic
                </Button>
              </div>
            ) : (
              <Callout title="Want practice for this exam?" tone="info">
                Tell us which exams matter to you — verification and question authoring happen in order of real demand,
                and every question is reviewed by a qualified subject expert before it ships.{" "}
                <a href="/contact" className="font-semibold text-academy-blue hover:underline">
                  Request this exam →
                </a>
              </Callout>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
