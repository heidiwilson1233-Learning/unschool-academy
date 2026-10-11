import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Section, SectionHeading, Breadcrumbs, Badge, Callout } from "@/components/ui";
import { VideoPlaylist } from "@/components/video-playlist";
import { getUnitStudyData, listUnitsWithVideos } from "@/lib/videos";
import { getExamPageData } from "@/lib/exam-template";

/**
 * Unit study page — video lessons + notes + practice, per skill.
 * Static: one page per unit that has curated videos.
 */

export function generateStaticParams() {
  return listUnitsWithVideos();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ exam: string; unit: string }>;
}): Promise<Metadata> {
  const { exam, unit } = await params;
  const data = getUnitStudyData(exam, unit);
  if (!data) return { title: "Unit not found" };
  return {
    title: `${data.unitTitle} — video lessons & practice`,
    description: `Free video lessons with study notes and ${data.totalQuestions} draft practice questions for ${data.unitTitle}.`,
    alternates: { canonical: `/exams/${exam}/units/${unit}` },
    robots: { index: false, follow: true },
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ exam: string; unit: string }>;
}) {
  const { exam, unit } = await params;
  const data = getUnitStudyData(exam, unit);
  if (!data) notFound();
  const examData = getExamPageData(exam);

  return (
    <main>
      <Section className="pt-10">
        <Breadcrumbs
          trail={[
            { label: "Exams", href: "/exams" },
            { label: examData?.title ?? exam, href: `/exams/${exam}` },
            { label: data.unitTitle },
          ]}
        />
        <div className="mt-6 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Unit</Badge>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
              {data.totalVideos} video lessons · {data.totalQuestions} draft questions
            </span>
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-ink text-balance">
            {data.unitTitle}
          </h1>
          {data.unitDescription && (
            <p className="mt-3 text-lg text-slate leading-relaxed">{data.unitDescription}</p>
          )}
        </div>
      </Section>

      <Section id="lessons">
        <VideoPlaylist
          playlists={data.playlists}
          exam={exam}
          unit={unit}
          unitTitle={data.unitTitle}
        />
      </Section>

      {/* Skills in this unit */}
      <Section id="skills">
        <SectionHeading
          align="left"
          eyebrow="Skills"
          title="What you'll practice"
          sub="Every skill pairs its video lessons with draft practice questions — sequenced foundation to exam level."
        />
        <ul className="border-t border-border">
          {data.playlists.map((p) => (
            <li
              key={p.skillId}
              className="flex flex-wrap items-center gap-3 border-b border-border py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink">{p.skillLabel}</p>
                <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate">
                  {p.videos.length} {p.videos.length === 1 ? "video" : "videos"}
                  {" · "}
                  {p.questionCount} draft questions
                  {p.level ? ` · ${p.level}` : ""}
                </p>
              </div>
              {p.questionCount > 0 && (
                <Link
                  href={`/exams/${exam}/practice/${p.skillId}`}
                  className="rounded-full border border-ink px-4 py-2 text-sm font-bold text-ink transition-transform active:scale-95 hover:bg-ink hover:text-paper"
                >
                  Practice →
                </Link>
              )}
            </li>
          ))}
        </ul>
        <Callout tone="info" title="Draft content, honestly labelled">
          All practice questions are original and marked draft pending expert review. Video
          lessons are free YouTube content by their creators — embedded with credit, never
          re-uploaded.
        </Callout>
      </Section>
    </main>
  );
}
