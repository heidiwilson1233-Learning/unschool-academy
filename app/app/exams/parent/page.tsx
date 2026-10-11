/**
 * Pilot parent view (portal-doctrine move 3, parent half).
 *
 * Server component: page metadata + authored hero. Reads the curriculum JSON
 * (build-validated) and passes a serializable skill projection to the client
 * view. Personal data renders from this device's localStorage, so the parent
 * app layout keeps this page noindex.
 */
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import ParentView from "@/components/parent-view";
import { SYLLABUS } from "@/lib/syllabus";
import type { MasterySkillInput } from "@/lib/mastery";

export const metadata: Metadata = {
  title: "Parent view (pilot) — Unschool Academy",
  description:
    "The pilot parent view for JFT-Basic: activity, recent scores, skills progress, and an auto-generated monthly summary, read from sessions stored in this browser.",
  /* Defense in depth: this page renders personal data — it must never index,
     even if the parent layout's robots are ever edited. */
  robots: { index: false, follow: false },
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function ParentPage() {
  const skills: MasterySkillInput[] = SYLLABUS.studyOrder.map((s) => ({
    id: s.id,
    label: s.label,
    practiceSlug: s.practiceSlug,
    section: SYLLABUS.sections.find((sec) => sec.skills.some((k) => k.id === s.id))?.section ?? "",
    level: s.level,
    levelName: s.levelName,
    sequence: s.sequence,
  }));
  return (
    <div className="relative overflow-hidden bg-canvas min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "My exam progress", href: "/app/exams" },
            { label: "Parent view" },
          ]}
        />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
          Pilot parent view · JFT-Basic
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-extrabold tracking-tight text-ink text-balance">
          How they&rsquo;re doing.
        </h1>
        <p className="mt-4 text-slate max-w-2xl leading-relaxed">
          For parents and guardians. Everything here lives in this browser. A Parent Hub
          with accounts is on the roadmap — for now, no account or sign-in is needed.
        </p>
      </div>
      <ParentView skills={skills} />
    </div>
  );
}
