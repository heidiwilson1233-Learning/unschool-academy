/**
 * Unschool Kids track + quest data.
 * STATUS: prototype content — quests are staged drafts pending educator review.
 * See docs/03_KIDS_LEARNING_WORLD.md for the full curriculum spec.
 */

export type AgeTrack = {
  slug: string;
  name: string;
  audience: string;
  description: string;
  skills: string[];
  segment: string;
  character: "momo" | "tara" | "bobo";
  route: string;
};

export const AGE_TRACKS: AgeTrack[] = [
  {
    slug: "2-3",
    name: "Little Explorers",
    audience: "Ages 2–3",
    description:
      "Parent-guided early learning. You operate the laptop; your child points, names, and moves. Big targets, gentle sounds, zero reading required.",
    skills: ["Naming familiar objects", "Big and small", "Matching pairs", "Sounds and songs", "Taking turns"],
    segment: "3–5 min, then off-screen play",
    character: "tara",
    route: "/kids/ages/2-3",
  },
  {
    slug: "3-5",
    name: "Play Garden",
    audience: "Ages 3–5",
    description:
      "Counting real sets, sorting by shape and colour, AB patterns, first sounds, and short picture stories — one tap at a time.",
    skills: ["Counting 1–10", "Sorting & matching", "AB patterns", "First sounds", "Story order"],
    segment: "5–8 min",
    character: "momo",
    route: "/kids/ages/3-5",
  },
  {
    slug: "kindergarten",
    name: "School Starters",
    audience: "Ages 5–6 · Kindergarten",
    description:
      "School readiness without pressure: numerals meet quantities, number bonds within 10, letter sounds, and listening games.",
    skills: ["Count to 20", "Number bonds to 10", "Letter sounds", "Seasons & weather", "Story sentences"],
    segment: "8–10 min",
    character: "momo",
    route: "/kids/kindergarten",
  },
  {
    slug: "1-2",
    name: "Adventure Club",
    audience: "Grades 1–2",
    description:
      "Place value with real blocks, addition strategies, reading short passages, and nature reasoning on the map.",
    skills: ["Place value", "Adding & subtracting", "Measuring", "Reading passages", "Plants & animals"],
    segment: "10–12 min",
    character: "bobo",
    route: "/kids/grades/1-2",
  },
  {
    slug: "3-4",
    name: "Quest Makers",
    audience: "Grades 3–4",
    description:
      "Multi-step quests: sharing models for division, fractions on bars, money planning, and mysteries solved with evidence.",
    skills: ["Multiplication & division", "Fractions", "Time & money", "Inference", "Simple experiments"],
    segment: "12–15 min",
    character: "tara",
    route: "/kids/grades/3-4",
  },
  {
    slug: "grade-5",
    name: "Young Explorers",
    audience: "Grade 5",
    description:
      "Genuine Grade 5 challenges — decimals, volume, ecosystems, evidence-based reading — with a more grown-up look and the same friendly guides.",
    skills: ["Decimals & fractions", "Volume & area", "Data & graphs", "Ecosystems", "Argument from evidence"],
    segment: "12–18 min",
    character: "bobo",
    route: "/kids/grade-5",
  },
];

export const VILLAGE_LOCATIONS = [
  { name: "Momo's Mango Garden", purpose: "Numbers and patterns", guide: "momo" as const },
  { name: "Tara's Story Tree", purpose: "Language and creative stories", guide: "tara" as const },
  { name: "Bobo's Discovery Pond", purpose: "Observation and science", guide: "bobo" as const },
  { name: "Shape Workshop", purpose: "Geometry and construction", guide: "momo" as const },
  { name: "Little Market", purpose: "Measurement and practical maths", guide: "momo" as const },
  { name: "Kindness Corner", purpose: "Cooperation and feelings", guide: "tara" as const },
];

/** Prototype quest briefs (K01–K24 from the blueprint). Playable ones are implemented; the rest are backlog. */
export type QuestBrief = {
  id: string;
  track: string;
  character: "momo" | "tara" | "bobo";
  location: string;
  title: string;
  objective: string;
  playable: boolean;
  route?: string;
};

export const QUEST_BRIEFS: QuestBrief[] = [
  { id: "K04", track: "3–5", character: "momo", location: "Mango Garden", title: "Three Mangoes for the Picnic", objective: "Count out exactly 3 objects (one-to-one correspondence)", playable: true, route: "/kids/sample/momo-mangoes" },
  { id: "K05", track: "3–5", character: "tara", location: "Story Tree", title: "What Happens Next?", objective: "Order three story cards sensibly", playable: false },
  { id: "K07", track: "3–5", character: "momo", location: "Mango Garden", title: "Finish the Fruit Pattern", objective: "Extend an AB pattern", playable: false },
  { id: "K13", track: "1–2", character: "tara", location: "Story Tree", title: "The Four-Card Story", objective: "Sequence a story and choose its title", playable: true, route: "/kids/sample/tara-story" },
  { id: "K16", track: "3–4", character: "momo", location: "Mango Garden", title: "Share Twelve Mangoes", objective: "Division as equal groups", playable: false },
  { id: "K22", track: "Grade 5", character: "bobo", location: "Discovery Pond", title: "The Seed Experiment", objective: "Identify variables in a controlled experiment", playable: false },
];

export const TRACK_SLUGS = ["2-3", "3-5", "kindergarten", "1-2", "3-4", "grade-5"] as const;

export function trackBySlug(slug: string): AgeTrack | undefined {
  if (slug === "kindergarten") return AGE_TRACKS.find((t) => t.slug === "kindergarten");
  if (slug === "grade-5") return AGE_TRACKS.find((t) => t.slug === "grade-5");
  return AGE_TRACKS.find((t) => t.slug === slug);
}
