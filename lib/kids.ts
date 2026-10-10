/**
 * Unschool Kids — FINAL STRUCTURE (decided 2026-10-10).
 * Ages 5 → Grade 5. 5 subjects. 500-book library → quests. Smart adaptive learning.
 * See blueprint docs/12_LEARNING_ARCHITECTURE_AND_SCALE.md §5.
 *
 * STATUS: content = staged drafts pending educator review.
 */

export type KidSubject = {
  slug: string;
  name: string;
  tagline: string;
  character: "momo" | "tara" | "bobo" | "all";
  skills: string[];
  color: string; // tailwind tint key used by pages
};

export const KID_SUBJECTS: KidSubject[] = [
  {
    slug: "words",
    name: "Words",
    tagline: "Phonics, vocabulary, rhymes and stories",
    character: "tara",
    skills: ["Letter sounds", "Vocabulary", "Rhyming", "Story order", "Comprehension", "Read-aloud"],
    color: "tara",
  },
  {
    slug: "numbers",
    name: "Numbers",
    tagline: "Counting, shapes, patterns, money and time",
    character: "momo",
    skills: ["Counting", "Number bonds", "Shapes", "Patterns", "Money", "Time"],
    color: "momo",
  },
  {
    slug: "world",
    name: "World",
    tagline: "Animals, plants, seasons, body and senses",
    character: "bobo",
    skills: ["Animals", "Plants", "Seasons", "My body", "Materials", "Observation"],
    color: "bobo",
  },
  {
    slug: "values",
    name: "Values",
    tagline: "Kindness, sharing, feelings and manners",
    character: "all",
    skills: ["Kindness", "Sharing", "Feelings", "Turn-taking", "Helping"],
    color: "values",
  },
  {
    slug: "create",
    name: "Create",
    tagline: "Draw, build, imagine and make music",
    character: "all",
    skills: ["Drawing", "Building", "Imagining", "Music", "Storytelling"],
    color: "create",
  },
];

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

/* FOUR tracks — entry at age 5. No 2-3 / 3-5 tracks (retired 2026-10-10). */
export const AGE_TRACKS: AgeTrack[] = [
  {
    slug: "school-starters",
    name: "School Starters",
    audience: "Ages 5–6",
    description:
      "The entry point. School readiness without pressure: numerals meet quantities, number bonds within 10, letter sounds, and listening games — always with a parent nearby.",
    skills: ["Count to 20", "Number bonds to 10", "Letter sounds", "Seasons & weather", "Story sentences"],
    segment: "8–10 min",
    character: "momo",
    route: "/kids/tracks/school-starters",
  },
  {
    slug: "adventure-club",
    name: "Adventure Club",
    audience: "Grades 1–2 · Ages 6–8",
    description:
      "Place value with real blocks, addition strategies, reading short passages, and nature reasoning on the map.",
    skills: ["Place value", "Adding & subtracting", "Measuring", "Reading passages", "Plants & animals"],
    segment: "10–12 min",
    character: "bobo",
    route: "/kids/tracks/adventure-club",
  },
  {
    slug: "quest-makers",
    name: "Quest Makers",
    audience: "Grades 3–4 · Ages 8–10",
    description:
      "Multi-step quests: sharing models for division, fractions on bars, money planning, and mysteries solved with evidence.",
    skills: ["Multiplication & division", "Fractions", "Time & money", "Inference", "Simple experiments"],
    segment: "12–15 min",
    character: "tara",
    route: "/kids/tracks/quest-makers",
  },
  {
    slug: "young-explorers",
    name: "Young Explorers",
    audience: "Grade 5 · Ages 10–11",
    description:
      "Genuine Grade 5 challenges — decimals, volume, ecosystems, evidence-based reading — with a more grown-up look. Graduates bridge into exam prep.",
    skills: ["Decimals & fractions", "Volume & area", "Data & graphs", "Ecosystems", "Argument from evidence"],
    segment: "12–18 min",
    character: "bobo",
    route: "/kids/tracks/young-explorers",
  },
];

/* ---- Smart learning engine (how a 5-year-old gets smarter here) ----
   No tests. No fail states. The character adapts silently underneath. */
export const SMART_LEARNING = {
  principles: [
    "The child chooses the character and the story; the system chooses the difficulty underneath.",
    "3 correct in a row → difficulty steps up silently. A struggle → hint, then an easier variant. Never a red X.",
    "Characters remember: 'Last time we counted to 10! Shall we try 12 today?'",
    "One quest chain per session (~15 min) → celebration → an off-screen invitation. Then it ends.",
    "Parents get a weekly note: words learned, skills practiced, what to try offline.",
  ],
  adaptiveRules: [
    { when: "3 consecutive correct", then: "difficulty +1 (max 3)" },
    { when: "2 consecutive wrong", then: "show hint, offer easier variant, difficulty stays" },
    { when: "quest complete", then: "log skill + words to parent report, unlock next quest in chain" },
    { when: "session > 15 min", then: "character suggests the off-screen activity and closes the quest" },
  ],
  noFail: true,
  maxSessionMinutes: 15,
} as const;

/* ---- Endless content model ----
   500 books × ~8 quests = ~4,000 base quests.
   Template variants (parametric) make practice endless.
   1 new book unlocks per week → the library lasts ~10 years. */
export const BOOK_QUEST_TYPES = [
  { type: "read-aloud", subject: "words", character: "tara", blurb: "Tara narrates the story with word highlighting" },
  { type: "vocabulary", subject: "words", character: "tara", blurb: "8–12 key words from the book → match, use, play" },
  { type: "comprehension", subject: "words", character: "tara", blurb: "Order events, find the main idea, guess feelings" },
  { type: "value-quest", subject: "values", character: "all", blurb: "The book's moral → real-life choices" },
  { type: "math-in-story", subject: "numbers", character: "momo", blurb: "Count and measure things inside the story world" },
  { type: "wonder-quest", subject: "world", character: "bobo", blurb: "The science hiding inside the story" },
  { type: "create-quest", subject: "create", character: "all", blurb: "Draw, build or retell the story your way" },
] as const;

export const ENDLESS_MODEL = {
  baseQuestsPerBook: 8,
  bookCount: 500,
  baseTotal: 4000,
  variantMultiplier: "parametric templates (e.g. counting quest × any object × any number)",
  unlockCadence: "1 new book per week",
  libraryLifespan: "~10 years",
} as const;

/* Village location metadata (from blueprint doc 03 §3). */
export const VILLAGE_LOCATIONS = [
  {
    name: "Momo's Mango Garden",
    slug: "mango-garden",
    purpose: "Numbers and patterns",
    guide: "momo" as const,
    detail: "Count real sets of mangoes, share them fairly, and spot the patterns hiding in the fruit trees.",
    skills: ["Counting", "Sets", "Equal groups", "Fractions"],
  },
  {
    name: "Tara's Story Tree",
    slug: "story-tree",
    purpose: "Language and creative stories",
    guide: "tara" as const,
    detail: "Order picture cards into stories, play with first sounds, and tell tales of your own.",
    skills: ["Vocabulary", "First sounds", "Story order", "Comprehension"],
  },
  {
    name: "Bobo's Discovery Pond",
    slug: "discovery-pond",
    purpose: "Observation and science",
    guide: "bobo" as const,
    detail: "Watch pond life closely, sort what you notice, and test safe little predictions.",
    skills: ["Observation", "Living things", "Predictions"],
  },
  {
    name: "Shape Workshop",
    slug: "shape-workshop",
    purpose: "Geometry and construction",
    guide: "momo" as const,
    detail: "Build pictures out of shapes, find the lines of symmetry, and reason with simple tools.",
    skills: ["Geometry", "Patterns", "Symmetry"],
  },
  {
    name: "Little Market",
    slug: "little-market",
    purpose: "Measurement and practical maths",
    guide: "momo" as const,
    detail: "Compare amounts, count token coins, and plan a small budget when you're older.",
    skills: ["Comparing amounts", "Counting money", "Budgets"],
  },
  {
    name: "Kindness Corner",
    slug: "kindness-corner",
    purpose: "Cooperation and feelings",
    guide: "tara" as const,
    detail: "Practise turn-taking, name big feelings, and learn to ask for help, gently.",
    skills: ["Turn-taking", "Feelings", "Asking for help"],
  },
];

/** Quest data model. Quests live as JSON under content/kids/quests/ and are rendered by /kids/quest/[id].
 *  Schema v2 + validator SSOT live in lib/quest-engine.ts (doc 03 §6). Re-exported here so existing
 *  imports (`@/lib/kids`) keep working. */
export type { KidQuest, QuestInteraction, QuestTemplate, QuestTemplateId, ReviewStatus } from "./quest-engine";

export const TRACK_SLUGS = ["school-starters", "adventure-club", "quest-makers", "young-explorers"] as const;

export function trackBySlug(slug: string): AgeTrack | undefined {
  return AGE_TRACKS.find((t) => t.slug === slug);
}

export function subjectBySlug(slug: string): KidSubject | undefined {
  return KID_SUBJECTS.find((s) => s.slug === slug);
}
