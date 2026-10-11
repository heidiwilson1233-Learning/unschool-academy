/**
 * Skill mastery — the student per-skill mastery view (portal-doctrine move 3).
 *
 * Server component: reads the curriculum JSON via lib/syllabus.ts (build-time
 * validated) and passes a serializable projection to the client tree. Answer
 * keys never enter the client bundle — syllabus rows carry only labels,
 * practice slugs, and study order.
 *
 * The tree itself is personal data rendered from this device's localStorage,
 * so the parent app layout keeps this page noindex.
 */
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui";
import MasteryTree from "@/components/mastery-tree";
import { SYLLABUS } from "@/lib/syllabus";
import type { MasterySkillInput } from "@/lib/mastery";

const SKILL_COUNT = SYLLABUS.studyOrder.length;

export const metadata: Metadata = {
  title: "Skill mastery — Unschool Academy",
  description: `Your per-skill mastery map for JFT-Basic: not started to mastered for all ${SKILL_COUNT} skills, computed from your diagnostic and practice sessions on this device.`,
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function MasteryPage() {
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
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14">
        <Breadcrumbs
          trail={[
            { label: "Home", href: "/" },
            { label: "My exam progress", href: "/app/exams" },
            { label: "Skill mastery" },
          ]}
        />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate">
          Learner dashboard · JFT-Basic · {SKILL_COUNT} curriculum skills
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight text-ink text-balance">
          Your skill map.
        </h1>
        <p className="mt-4 text-slate max-w-2xl leading-relaxed">
          Every practice session and diagnostic on this device feeds one tree:
          eleven JFT-Basic skills, ranked from not started to mastered. No
          account, no sign-in — the map lives in this browser.
        </p>
        <div className="mt-10">
          <MasteryTree skills={skills} />
        </div>
      </div>
    </div>
  );
}
