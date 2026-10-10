export type NavLink = { label: string; href: string; description?: string };

export const EXAMS_MENU: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Study programs",
    links: [
      { label: "Explore all published exams", href: "/exams", description: "Only verified, live preparation programs" },
      { label: "Exam catalog — 500 research entries", href: "/exams/catalog", description: "Browse every exam we're researching, honestly labelled" },
      { label: "JFT-Basic practice", href: "/exams/jft-basic", description: "Everyday Japanese — our pilot program" },
      { label: "Japanese learning", href: "/exams/japanese", description: "JFT-Basic vs JLPT, explained honestly" },
    ],
  },
  {
    heading: "Practice",
    links: [
      { label: "Free diagnostic", href: "/exams/jft-basic/diagnostic", description: "10 original questions, instant topic feedback" },
      { label: "How practice works", href: "/exams/how-practice-works", description: "Our method and its limits" },
    ],
  },
];

export const KIDS_MENU: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Ages & grades",
    links: [
      { label: "Kids overview", href: "/kids", description: "The storybook learning world" },
                  { label: "School Starters · Ages 5–6", href: "/kids/tracks/school-starters", description: "Smart learning starts at 5" },
      { label: "Adventure Club · Grades 1–2", href: "/kids/tracks/adventure-club", description: "Reading, numbers, discovery" },
      { label: "Quest Makers · Grades 3–4", href: "/kids/tracks/quest-makers", description: "Deeper quests and reasoning" },
      { label: "Young Explorers · Grade 5", href: "/kids/tracks/young-explorers", description: "Real Grade 5 challenges" },
    ],
  },
  {
    heading: "World & parents",
    links: [
      { label: "Meet Momo, Tara & Bobo", href: "/kids/characters", description: "Our three learning guides" },
      { label: "Explore the village", href: "/kids/world", description: "Six storybook locations" },
      { label: "For parents", href: "/kids/for-parents", description: "Safety, evidence, controls" },
    ],
  },
];

export const RESOURCES_MENU: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Learn",
    links: [
      { label: "Resources", href: "/resources", description: "Guides and topic explainers" },
      { label: "Blog", href: "/blog", description: "Original articles from our reviewers" },
      { label: "FAQ", href: "/faq", description: "Exams, Kids, payments, policies" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about", description: "Our method and review standards" },
      { label: "Contact", href: "/contact", description: "Talk to a human" },
    ],
  },
];

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Exams",
    links: [
      { label: "Published exams", href: "/exams" },
      { label: "Exam catalog", href: "/exams/catalog" },
      { label: "JFT-Basic", href: "/exams/jft-basic" },
      { label: "Free diagnostic", href: "/exams/jft-basic/diagnostic" },
      { label: "How scoring works", href: "/exams/how-practice-works" },
    ],
  },
  {
    heading: "Kids",
    links: [
      { label: "Kids overview", href: "/kids" },
                  { label: "School Starters", href: "/kids/tracks/school-starters" },
      { label: "Adventure Club", href: "/kids/tracks/adventure-club" },
      { label: "Quest Makers", href: "/kids/tracks/quest-makers" },
      { label: "Young Explorers", href: "/kids/tracks/young-explorers" },
      { label: "Parent Hub", href: "/parent" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Accessibility", href: "/legal/accessibility" },
      { label: "Refund policy", href: "/legal/refunds" },
      { label: "Cancellation", href: "/legal/refunds" },
      { label: "Delete my account", href: "/account" },
      { label: "Report an issue", href: "/contact" },
    ],
  },
  {
    heading: "Company & Legal",
    links: [
      { label: "About", href: "/about" },
      { label: "Review standards", href: "/about" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Children's privacy", href: "/legal/child-privacy" },
      { label: "Terms of service", href: "/legal/terms" },
      { label: "Cookie choices", href: "/legal/privacy" },
      { label: "Exam trademarks", href: "/legal/exam-trademarks" },
    ],
  },
];

export const SITE_NAME = "Unschool Academy";
export const TAGLINE = "Practice with purpose. Learn with curiosity.";
