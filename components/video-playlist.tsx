"use client";

import { useState } from "react";
import Link from "next/link";
import type { SkillPlaylist, CuratedVideo } from "@/lib/videos";
import { Badge } from "@/components/ui";
import { PaperCard, WashiTape, HandUnderline, Marginalia } from "@/components/craft";

/**
 * VideoPlaylist — the video-lesson module.
 * One playlist per skill: embedded YouTube player + study notes + practice link.
 * Doctrine: embeds only (youtube-nocookie), never re-uploaded, always attributed.
 */

function VideoThumb({ video, active }: { video: CuratedVideo; active: boolean }) {
  return (
    <span className="relative block w-28 shrink-0 overflow-hidden rounded-lg border border-border">
      {video.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <span className="block aspect-video w-full bg-sand" aria-hidden="true" />
      )}
      <span
        className={`absolute inset-0 flex items-center justify-center ${
          active ? "bg-ink/30" : "bg-ink/10"
        }`}
        aria-hidden="true"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/95 text-ink shadow">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M3 1.5v9l7.5-4.5z" />
          </svg>
        </span>
      </span>
    </span>
  );
}

function SkillPlayer({
  playlist,
  exam,
  unit,
}: {
  playlist: SkillPlaylist;
  exam: string;
  unit: string;
}) {
  const [idx, setIdx] = useState(0);
  const video = playlist.videos[idx];
  if (!video) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Player + notes */}
      <div className="lg:col-span-8">
        <PaperCard className="overflow-hidden">
          <div className="relative">
            <WashiTape className="left-6 -top-3 rotate-[-4deg]" />
            <div className="aspect-video w-full bg-ink">
              <iframe
                key={video.id}
                src={video.embedUrl!}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {video.level && <Badge tone="success">{video.level}</Badge>}
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate">
                {playlist.skillLabel}
              </span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-ink">{video.title}</h3>
            <p className="mt-1 text-sm text-slate">
              by <span className="font-semibold text-ink">{video.channel}</span>
              {" · "}
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-dotted underline-offset-2 hover:text-ink"
              >
                Watch on YouTube
              </a>
            </p>

            {video.keyPoints.length > 0 && (
              <details className="group mt-4 rounded-xl border border-border bg-cream/60" open>
                <summary className="cursor-pointer list-none px-4 py-3 font-bold text-ink flex items-center justify-between">
                  <span>
                    Study notes{" "}
                    <span className="font-mono text-xs font-semibold text-slate">
                      {video.keyPoints.length} points
                    </span>
                  </span>
                  <span className="text-slate transition-transform group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <ol className="px-4 pb-4 space-y-2">
                  {video.keyPoints.map((p, i) => (
                    <li key={i} className="flex gap-2.5 text-[15px] text-ink/90 leading-relaxed">
                      <span className="font-mono text-xs font-bold text-academy-teal pt-1 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {p}
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {playlist.questionCount > 0 ? (
                <Link
                  href={`/exams/${exam}/practice/${playlist.skillId}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-paper transition-transform active:scale-95"
                >
                  Practice this skill — {playlist.questionCount} questions
                  <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                  Practice questions in review
                </span>
              )}
              {video.durationNote && (
                <span className="font-mono text-[11px] text-slate">ⓘ {video.durationNote}</span>
              )}
            </div>
          </div>
        </PaperCard>
      </div>

      {/* Playlist rail */}
      <div className="lg:col-span-4">
        <div className="flex items-baseline justify-between">
          <h4 className="font-bold text-ink">
            Playlist{" "}
            <span className="font-mono text-xs font-semibold text-slate">
              {playlist.videos.length} {playlist.videos.length === 1 ? "video" : "videos"}
            </span>
          </h4>
          <Marginalia className="hidden md:block">free lessons</Marginalia>
        </div>
        <ol className="mt-3 space-y-2">
          {playlist.videos.map((v, i) => (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => setIdx(i)}
                aria-current={i === idx}
                className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition-all active:scale-[0.98] ${
                  i === idx
                    ? "border-ink bg-ink/[0.04] shadow-sm"
                    : "border-border bg-paper hover:border-slate"
                }`}
              >
                <VideoThumb video={v} active={i === idx} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">{v.title}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate">{v.channel}</span>
                  {v.lessonTopic && v.lessonTopic !== v.title && (
                    <span className="mt-0.5 block truncate text-xs text-slate/80">
                      {v.lessonTopic}
                    </span>
                  )}
                </span>
                <span
                  className="ml-auto font-mono text-xs font-bold text-slate shrink-0"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex justify-between">
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => setIdx(Math.max(0, idx - 1))}
            className="rounded-full border border-border px-4 py-2 text-sm font-bold text-ink disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            type="button"
            disabled={idx === playlist.videos.length - 1}
            onClick={() => setIdx(Math.min(playlist.videos.length - 1, idx + 1))}
            className="rounded-full border border-border px-4 py-2 text-sm font-bold text-ink disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaylist({
  playlists,
  exam,
  unit,
  unitTitle,
}: {
  playlists: SkillPlaylist[];
  exam: string;
  unit: string;
  unitTitle: string;
}) {
  const [skill, setSkill] = useState(0);
  if (playlists.length === 0) return null;
  const active = playlists[Math.min(skill, playlists.length - 1)];

  return (
    <section aria-label={`Video lessons for ${unitTitle}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-bold text-ink">
          Watch <HandUnderline>first</HandUnderline>, then practice
        </h2>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate">
          Free YouTube lessons · embedded with credit
        </span>
      </div>

      {/* Skill tabs */}
      {playlists.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Skills">
          {playlists.map((p, i) => (
            <button
              key={p.skillId}
              role="tab"
              aria-selected={i === skill}
              onClick={() => setSkill(i)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                i === skill
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-paper text-ink hover:border-slate"
              }`}
            >
              {p.skillLabel}
              <span className="ml-1.5 font-mono text-xs opacity-70">{p.videos.length}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-5">
        {active && <SkillPlayer key={active.skillId} playlist={active} exam={exam} unit={unit} />}
      </div>

      <p className="mt-5 max-w-2xl text-xs leading-relaxed text-slate">
        {active?.videos[0]?.credit ?? "Free educational videos, embedded with credit."}{" "}
        Videos stream from YouTube — we never re-upload or claim them. Lesson order follows the
        skill sequence: watch, read the notes, then practice.
      </p>
    </section>
  );
}
