import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Section, Card, Breadcrumbs, PageHero, Callout, Badge } from "@/components/ui";
import { currentUser, hasRole, isSupabaseConfigured } from "@/lib/supabase";
import { DIAGNOSTIC_QUESTIONS } from "@/lib/exams";
import { PRACTICE_QUESTIONS } from "@/lib/practice";
import { getAllExams, getPublicStatus } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Admin — Content Review",
  description: "Staff content review: catalog validation, question review queue, and audit.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const configured = isSupabaseConfigured();
  const user = await currentUser();
  // Gate: without a backend there are no roles; the board is visible but read-only
  // and clearly labeled. With a backend, only admins may enter.
  if (configured) {
    if (!user) redirect("/login");
    if (!(await hasRole(user.id, "admin"))) redirect("/");
  }

  const exams = getAllExams();
  const counts = {
    research: exams.filter((e) => getPublicStatus(e) === "research").length,
    verified: exams.filter((e) => getPublicStatus(e) === "verified").length,
    practiceReady: exams.filter((e) => getPublicStatus(e) === "practice-ready").length,
  };
  const questions = [
    ...DIAGNOSTIC_QUESTIONS.map((q) => ({ id: q.id, kind: "diagnostic", topic: q.topic })),
    ...PRACTICE_QUESTIONS.map((q) => ({ id: q.id, kind: "practice", topic: q.topic })),
  ];

  return (
    <>
      <PageHero eyebrow="Staff only" title="Content review board" sub="Validation pipeline: research → verified → practice-ready. Drafts never ship without a qualified reviewer." />
      <Section>
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Admin" }]} />
          {!configured && (
            <Callout title="Review mode — no backend" tone="warning">
              This board reads the same data as the public site. Approvals and edits need the Supabase
              backend plus an admin role; until then everything here is read-only.
            </Callout>
          )}

          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <Card>
              <p className="text-3xl font-extrabold text-ink">{counts.research}</p>
              <p className="text-sm text-slate mt-1">Research entries (not verified)</p>
            </Card>
            <Card>
              <p className="text-3xl font-extrabold text-ink">{counts.verified}</p>
              <p className="text-sm text-slate mt-1">Facts verified</p>
            </Card>
            <Card>
              <p className="text-3xl font-extrabold text-ink">{counts.practiceReady}</p>
              <p className="text-sm text-slate mt-1">Practice-ready programs</p>
            </Card>
          </div>

          <h2 className="text-xl font-extrabold text-ink mt-10 mb-4">Question review queue</h2>
          <p className="text-sm text-slate mb-4">
            {questions.length} questions on the site — <strong className="text-ink">all draft</strong>, pending
            Japanese subject-matter-expert review. The pipeline: drafted → fact/language checked → SME reviewed →
            accessibility checked → QA staging → published.
          </p>
          <div className="rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas text-left">
                  <th className="px-4 py-3 font-bold text-ink">ID</th>
                  <th className="px-4 py-3 font-bold text-ink">Kind</th>
                  <th className="px-4 py-3 font-bold text-ink">Topic</th>
                  <th className="px-4 py-3 font-bold text-ink">Status</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-t border-border">
                    <td className="px-4 py-2.5 font-mono text-xs">{q.id}</td>
                    <td className="px-4 py-2.5 capitalize">{q.kind}</td>
                    <td className="px-4 py-2.5">{q.topic}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone="neutral">Draft — SME review pending</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-extrabold text-ink mt-10 mb-4">Catalog validation</h2>
          <p className="text-sm text-slate mb-4">
            Per-exam validation checklist lives in <span className="font-mono text-xs">research/exam-catalog/</span> —
            official name, organizer, format, scoring, trademark notes. Browse the public catalog:{" "}
            <Link href="/exams/catalog" className="text-academy-blue font-semibold hover:underline">
              /exams/catalog →
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
