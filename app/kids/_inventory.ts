import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------
 * Kids inventory + planned-library model (UA-003).
 *
 * Two things live here and they must never be confused on-site:
 *  1. PLANNED MODEL — the destination (blueprint S2 / doc 13 §13):
 *     500 books × 7 quest kinds = 3,500 authored base quests at full
 *     library. Parametric variants (e.g. one counting quest × object
 *     sets × number ranges) extend practice beyond the authored base;
 *     variants are NOT counted as unique quests in the 3,500.
 *     Full arithmetic + the content-status contract:
 *     content/kids/STATUS_CONTRACT.md.
 *  2. TODAY'S INVENTORY — read from the inventory files at build time:
 *     content/kids/quests/*.json and content/kids/books-500.json.
 *     Pages must render these, not marketing-rounded guesses.
 * ------------------------------------------------------------------ */

export const BOOK_TARGET = 500;
export const QUEST_KINDS_PER_BOOK = 7;
/** 500 × 7 = 3,500 authored base quests at full library (not ~4,000). */
export const FULL_LIBRARY_BASE_QUESTS = BOOK_TARGET * QUEST_KINDS_PER_BOOK;
/** Sample-track demos that are genuinely playable today. */
export const DEMO_TRACK_ROUTES = ["/kids/sample/momo-mangoes", "/kids/sample/tara-story"] as const;
export const PLAYABLE_DEMO_COUNT = DEMO_TRACK_ROUTES.length;

type QuestState = "draft" | "demo" | "published";

/** Map a quest JSON's review_status onto the three public states. */
function classifyQuestState(raw: unknown): QuestState {
  const s = String(raw ?? "").toLowerCase();
  if (s.includes("publish") || s === "playable") return "published";
  if (s === "demo" || s.includes("demo")) return "demo";
  return "draft"; // draft-pending-educator-review, authored-draft, unknown…
}

export interface KidsInventory {
  questTotal: number;
  questDraft: number;
  questDemo: number;
  questPublished: number;
  booksCurated: number;
  bookTarget: number;
}

export function getKidsInventory(): KidsInventory {
  const root = process.cwd();
  const questsDir = path.join(root, "content", "kids", "quests");
  let files: string[] = [];
  try {
    files = fs.readdirSync(questsDir).filter((f) => f.endsWith(".json"));
  } catch {
    files = [];
  }
  let draft = 0,
    demo = 0,
    published = 0;
  for (const f of files) {
    try {
      const q = JSON.parse(fs.readFileSync(path.join(questsDir, f), "utf-8"));
      const st = classifyQuestState(q.review_status ?? q.status);
      if (st === "published") published++;
      else if (st === "demo") demo++;
      else draft++;
    } catch {
      draft++;
    }
  }
  let booksCurated = 0;
  let bookTarget = BOOK_TARGET;
  try {
    const b = JSON.parse(fs.readFileSync(path.join(root, "content", "kids", "books-500.json"), "utf-8"));
    booksCurated = Array.isArray(b.books) ? b.books.length : 0;
    if (typeof b.target === "number") bookTarget = b.target;
  } catch {
    /* books file missing — counts stay at their honest defaults */
  }
  return {
    questTotal: files.length,
    questDraft: draft,
    questDemo: demo,
    questPublished: published,
    booksCurated,
    bookTarget,
  };
}

/** "16 quests authored · all awaiting educator review" — never marketing-rounded. */
export function questAvailabilityLine(inv: KidsInventory): string {
  const parts = [`${inv.questTotal} quest${inv.questTotal === 1 ? "" : "s"} authored`];
  if (inv.questTotal > 0) {
    if (inv.questPublished > 0) parts.push(`${inv.questPublished} published`);
    if (inv.questDemo > 0) parts.push(`${inv.questDemo} playable demo${inv.questDemo === 1 ? "" : "s"}`);
    if (inv.questDraft > 0) {
      parts.push(inv.questDraft === inv.questTotal ? "all awaiting educator review" : `${inv.questDraft} awaiting educator review`);
    }
  }
  return parts.join(" · ");
}

/** "50 of 500 books curated". */
export function bookAvailabilityLine(inv: KidsInventory): string {
  return `${inv.booksCurated} of ${inv.bookTarget} books curated`;
}
