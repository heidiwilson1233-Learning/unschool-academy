/**
 * Video lesson data layer — reads per-unit videos.json (curated free YouTube
 * lessons) and exposes them grouped by skill for the VideoPlaylist module.
 *
 * Doctrine: embeds only, never re-uploaded, always attributed. Videos are
 * curated by the content pipeline (see improvement-drive/5000-PER-DAY-PLAN.md).
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "curriculum");

export interface CuratedVideo {
  /** Stable key: unit + index. */
  id: string;
  title: string;
  channel: string;
  credit: string;
  /** Original watch URL (kept for attribution link). */
  url: string;
  /** 11-char YouTube video id, or null when unparseable (entry skipped). */
  youtubeId: string | null;
  /** Privacy-enhanced embed URL. */
  embedUrl: string | null;
  /** Thumbnail (YouTube CDN). */
  thumbnail: string | null;
  lessonTopic: string;
  skill: string | null;
  level: string | null;
  /** Study notes — rendered as the "Notes" panel. */
  keyPoints: string[];
  attachedQuestionIds: string[];
  durationNote: string | null;
}

export interface SkillPlaylist {
  skillId: string;
  skillLabel: string;
  level: string | null;
  videos: CuratedVideo[];
  questionCount: number;
}

function parseYoutubeId(url: string): string | null {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    url.match(/\/embed\/([A-Za-z0-9_-]{11})/) ||
    url.match(/\/shorts\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function readJson<T>(file: string): T | null {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return null;
  }
}

/** Raw videos.json entries vary slightly across units — normalize defensively. */
export function getUnitVideos(exam: string, unit: string): CuratedVideo[] {
  const raw = readJson<Record<string, unknown>[]>(
    path.join(CONTENT_DIR, exam, "units", unit, "videos.json")
  );
  if (!Array.isArray(raw)) return [];
  return raw
    .map((v, i) => {
      const url = String(v["video_url"] ?? v["url"] ?? "");
      const youtubeId = parseYoutubeId(url);
      const skill =
        (v["skill"] as string | undefined) ??
        (v["skill_id"] as string | undefined) ??
        null;
      return {
        id: `${unit}-v${i}`,
        title: String(v["title"] ?? "Untitled lesson"),
        channel: String(v["channel"] ?? "YouTube"),
        credit: String(
          v["credit"] ??
            `${v["channel"] ?? "YouTube"} (YouTube) — free educational content, embedded not re-uploaded`
        ),
        url,
        youtubeId,
        embedUrl: youtubeId
          ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`
          : null,
        thumbnail: youtubeId
          ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
          : null,
        lessonTopic: String(v["lesson_topic"] ?? v["lessonTopic"] ?? v["title"] ?? ""),
        skill,
        level: (v["level"] as string | undefined) ?? null,
        keyPoints: Array.isArray(v["key_points"])
          ? (v["key_points"] as unknown[]).map(String)
          : [],
        attachedQuestionIds: Array.isArray(v["attached_question_ids"])
          ? (v["attached_question_ids"] as unknown[]).map(String)
          : [],
        durationNote: (v["duration_note"] as string | undefined) ?? null,
      } as CuratedVideo;
    })
    /* Skip entries we cannot embed — playlist must never show a dead slot. */
    .filter((v) => v.youtubeId && v.embedUrl);
}

/** Count draft questions per skill in a unit (for the "practice this skill" links). */
function countQuestionsBySkill(exam: string, unit: string): Map<string, number> {
  const counts = new Map<string, number>();
  try {
    const dir = path.join(CONTENT_DIR, exam, "units", unit);
    for (const f of readdirSync(dir)) {
      if (!f.startsWith("questions-") || !f.endsWith(".json")) continue;
      const qs = readJson<Record<string, unknown>[]>(path.join(dir, f));
      if (!Array.isArray(qs)) continue;
      for (const q of qs) {
        const s = String(q["skill"] ?? "general");
        counts.set(s, (counts.get(s) ?? 0) + 1);
      }
    }
  } catch {
    /* unit without question batches — counts stay empty */
  }
  return counts;
}

export interface UnitStudyData {
  exam: string;
  unit: string;
  unitTitle: string;
  unitDescription: string;
  playlists: SkillPlaylist[];
  totalVideos: number;
  totalQuestions: number;
  /** Skill label lookup from unit.json. */
  skillLabels: Map<string, string>;
}

export function getUnitStudyData(exam: string, unit: string): UnitStudyData | null {
  const unitMeta = readJson<{
    title?: string;
    description?: string;
    skills?: { id: string; title?: string; label?: string }[];
  }>(path.join(CONTENT_DIR, exam, "units", unit, "unit.json"));
  if (!unitMeta) return null;

  const labels = new Map<string, string>();
  for (const s of unitMeta.skills ?? []) {
    labels.set(s.id, s.title ?? s.label ?? s.id);
  }

  const videos = getUnitVideos(exam, unit);
  const qCounts = countQuestionsBySkill(exam, unit);

  /* Group videos by skill, preserving first-seen order. */
  const groups = new Map<string, CuratedVideo[]>();
  for (const v of videos) {
    const key = v.skill ?? "general";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }

  const playlists: SkillPlaylist[] = [...groups.entries()].map(([skillId, vs]) => ({
    skillId,
    skillLabel: labels.get(skillId) ?? skillId.replace(/-/g, " "),
    level: vs[0]?.level ?? null,
    videos: vs,
    questionCount: qCounts.get(skillId) ?? 0,
  }));

  return {
    exam,
    unit,
    unitTitle: unitMeta.title ?? unit.replace(/-/g, " "),
    unitDescription: unitMeta.description ?? "",
    playlists,
    totalVideos: videos.length,
    totalQuestions: [...qCounts.values()].reduce((a, b) => a + b, 0),
    skillLabels: labels,
  };
}

/** All units (across exams) that have at least one embeddable video. */
export function listUnitsWithVideos(): { exam: string; unit: string }[] {
  const out: { exam: string; unit: string }[] = [];
  try {
    const exams = readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const exam of exams) {
      const unitsDir = path.join(CONTENT_DIR, exam, "units");
      let units: string[] = [];
      try {
        units = readdirSync(unitsDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name);
      } catch {
        continue;
      }
      for (const unit of units) {
        if (getUnitVideos(exam, unit).length > 0) out.push({ exam, unit });
      }
    }
  } catch {
    /* no curriculum dir — empty list */
  }
  return out;
}
