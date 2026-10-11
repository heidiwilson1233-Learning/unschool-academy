/**
 * Search index — the ONLY pages /search may surface.
 *
 * Maintenance rule: add an entry here whenever a public content page ships;
 * remove it when the route dies. Research-catalog exams NEVER appear here —
 * only verified, live pages (see the exclusion copy in app/search/page.tsx).
 *
 * Section order drives result grouping: Exams, Kids, Company.
 */

export type SearchEntry = {
  title: string;
  href: string;
  /** One of "Exams" | "Kids" | "Company" — also the grouping key. */
  section: "Exams" | "Kids" | "Company";
  keywords: string;
  /** One honest line about what the page does. Shown under the title. */
  blurb: string;
};

export const SECTION_ORDER = ["Exams", "Kids", "Company"] as const;

export const SEARCH_INDEX: SearchEntry[] = [
  // ---- Exams ----
  { title: "JFT-Basic practice", href: "/exams/jft-basic", section: "Exams", keywords: "jft basic japanese test everyday japan foundation practice", blurb: "The full JFT-Basic program: topics, mocks, and the syllabus map." },
  { title: "Free JFT-Basic diagnostic", href: "/exams/jft-basic/diagnostic", section: "Exams", keywords: "free diagnostic 10 questions quiz score topics gap", blurb: "Ten questions, five minutes. See exactly where you stand." },
  { title: "Practice by topic", href: "/exams/jft-basic/topics", section: "Exams", keywords: "practice topic vocabulary conversation listening reading signs hints", blurb: "Vocabulary, conversation, listening, reading: pick one skill to drill." },
  { title: "Timed mock tests", href: "/exams/jft-basic/mock-tests", section: "Exams", keywords: "mock test timed exam simulation 30 minutes", blurb: "A 30-minute exam simulation with instant, honest analytics." },
  { title: "Syllabus map", href: "/exams/jft-basic/syllabus", section: "Exams", keywords: "syllabus official test structure sections skills jpf study plan order", blurb: "The official JFT-Basic structure: sections, skills, and study order." },
  { title: "Published exams", href: "/exams", section: "Exams", keywords: "catalog exam list programs live", blurb: "Every live program, and what it takes for an exam to publish." },
  { title: "Exam catalog", href: "/exams/catalog", section: "Exams", keywords: "catalog research entry list 500 status", blurb: "All 506 exams, marked live, verified, or still in research." },
  { title: "Exam tiers", href: "/exams/tiers", section: "Exams", keywords: "tier list roadmap demand build order 50", blurb: "Tier 1, 2, 3: which exams we are building, and in what order." },
  { title: "Japanese learning hub: JFT vs JLPT", href: "/exams/japanese", section: "Exams", keywords: "jlpt n5 n4 japanese qualification comparison which test", blurb: "Which test fits your goal? A plain-language comparison." },
  { title: "How practice works", href: "/exams/how-practice-works", section: "Exams", keywords: "method scoring mock practice pedagogy retrieval feedback", blurb: "The method behind the questions: retrieval, feedback, review." },
  { title: "My exam progress", href: "/app/exams", section: "Exams", keywords: "progress dashboard history study plan sessions streak mastery", blurb: "Your practice history, streak, and mastery map — on this device." },
  // ---- Kids ----
  { title: "Kids overview", href: "/kids", section: "Kids", keywords: "children kids learning world ages quests method", blurb: "The Kids world: quests, books, and the smart-learning method." },
  { title: "School Starters: ages 5–6", href: "/kids/tracks/school-starters", section: "Kids", keywords: "school starters 5 6 smart learning first", blurb: "First quests for ages 5 to 6." },
  { title: "Adventure Club: grades 1–2", href: "/kids/tracks/adventure-club", section: "Kids", keywords: "grade 1 2 adventure club reading maths", blurb: "Reading and maths quests for grades 1 to 2." },
  { title: "Quest Makers: grades 3–4", href: "/kids/tracks/quest-makers", section: "Kids", keywords: "grade 3 4 quest makers fractions", blurb: "Fractions and building quests for grades 3 to 4." },
  { title: "Young Explorers: grade 5", href: "/kids/tracks/young-explorers", section: "Kids", keywords: "grade 5 young explorers decimals volume", blurb: "Decimals and volume quests for grade 5." },
  { title: "Kids book library: 500 books", href: "/kids/library", section: "Kids", keywords: "books library stories reading 500", blurb: "Five hundred books, each with its own quest." },
  { title: "Meet Momo, Tara & Bobo", href: "/kids/characters", section: "Kids", keywords: "characters momo tara bobo elephant squirrel tortoise guides", blurb: "The three quest guides: elephant, squirrel, tortoise." },
  { title: "Explore the village", href: "/kids/world", section: "Kids", keywords: "village world locations mango garden story tree pond", blurb: "Mango garden, story tree, discovery pond: the quest map." },
  { title: "Kids roadmap", href: "/kids/roadmap", section: "Kids", keywords: "roadmap upcoming quests prototype plan shipping", blurb: "Which quests ship next, and what is under review." },
  { title: "For parents", href: "/kids/for-parents", section: "Kids", keywords: "parents safety privacy controls co-play", blurb: "Safety, privacy, and co-play: how the kids' side works." },
  { title: "Parent Hub", href: "/parent", section: "Kids", keywords: "parent hub dashboard controls profiles billing evidence", blurb: "Child profiles, evidence snapshots, and controls." },
  { title: "Kids family pricing", href: "/kids/pricing", section: "Kids", keywords: "kids pricing family plan cost", blurb: "One plan for the whole family: exactly what it covers." },
  { title: "Free quest: Momo's three mangoes", href: "/kids/sample/momo-mangoes", section: "Kids", keywords: "free quest sample mango counting playable", blurb: "A playable counting quest. No sign-up." },
  { title: "Free quest: Tara's four-card story", href: "/kids/sample/tara-story", section: "Kids", keywords: "free quest sample tara story order cards playable", blurb: "A playable story-ordering quest. No sign-up." },
  // ---- Company ----
  { title: "How it works", href: "/how-it-works", section: "Company", keywords: "how it works method loop levels review standards", blurb: "The Unschool method: hierarchy, loop, levels, review standards." },
  { title: "Free practice", href: "/free-practice", section: "Company", keywords: "free practice sampler questions quest", blurb: "Try real sample questions and a sample quest, free." },
  { title: "Pricing", href: "/pricing", section: "Company", keywords: "pricing plans cost pass pilot", blurb: "Pilot pricing: what free covers, and what plans add." },
  { title: "Resources", href: "/resources", section: "Company", keywords: "resources guides kanji vocabulary listening station", blurb: "Guides: station kanji, listening, vocabulary." },
  { title: "Blog", href: "/blog", section: "Company", keywords: "blog notes articles method honesty", blurb: "Notes from the content team: method, honesty, how-tos." },
  { title: "FAQ", href: "/faq", section: "Company", keywords: "faq questions help", blurb: "Straight answers about content, pricing, and kids' safety." },
  { title: "Contact", href: "/contact", section: "Company", keywords: "contact support help ticket email", blurb: "Reach the team: support, content questions, feedback." },
  { title: "About", href: "/about", section: "Company", keywords: "about method review standards team", blurb: "What we are building, and how we review content." },
];

export type RankedEntry = SearchEntry & { score: number };

export type SearchGroup = {
  section: (typeof SECTION_ORDER)[number];
  entries: RankedEntry[];
};

function tokensOf(q: string): string[] {
  return q
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf–—-]+/u)
    .filter((t) => t.length > 0);
}

/**
 * Ranked search over the curated index. Exact title matches first, then
 * title-token matches, then keyword/blurb matches — the first results get
 * the clicks, so ordering is the relevance feature here.
 */
export function searchIndex(query: string): SearchGroup[] {
  const tokens = tokensOf(query);
  if (tokens.length === 0) return [];

  const ranked: RankedEntry[] = [];
  for (const e of SEARCH_INDEX) {
    const title = e.title.toLowerCase();
    const hay = `${e.title} ${e.section} ${e.keywords} ${e.blurb}`.toLowerCase();
    const fullInTitle = title.includes(tokens.join(" "));
    const allInTitle = tokens.every((t) => title.includes(t));
    const anyInTitle = tokens.some((t) => title.includes(t));
    const allInHay = tokens.every((t) => hay.includes(t));
    const anyInHay = tokens.some((t) => hay.includes(t));
    const score = fullInTitle ? 100 : allInTitle ? 60 : anyInTitle ? 30 : allInHay ? 20 : anyInHay ? 10 : 0;
    if (score > 0) ranked.push({ ...e, score });
  }
  ranked.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const groups: SearchGroup[] = [];
  for (const section of SECTION_ORDER) {
    const entries = ranked.filter((e) => e.section === section);
    if (entries.length > 0) groups.push({ section, entries });
  }
  return groups;
}

export function countResults(groups: SearchGroup[]): number {
  return groups.reduce((n, g) => n + g.entries.length, 0);
}
