/**
 * JFT-Basic pilot program data.
 * STATUS: draft content — official exam facts must be re-verified from
 * https://www.jpf.go.jp/jft-basic/e/about/index.html before publication,
 * and all questions require Japanese SME review (see docs/IMPLEMENTATION_REQUIREMENTS.md).
 */

export type DiagnosticQuestion = {
  id: string;
  topic: "Script and Vocabulary" | "Conversation and Expression" | "Listening Comprehension" | "Reading Comprehension";
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctId: string;
  explanation: string;
  audioTextJp?: string; // spoken via browser TTS in the player; transcript always shown
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: "jft-d01",
    topic: "Script and Vocabulary",
    stem: "Choose the correct reading of the underlined word: 毎朝７時に起きます。",
    options: [
      { id: "a", text: "まいあさ", textJp: "まいあさ" },
      { id: "b", text: "ごとあさ", textJp: "ごとあさ" },
      { id: "c", text: "まいにちあさ", textJp: "まいにちあさ" },
    ],
    correctId: "a",
    explanation: "毎朝 reads まいあさ (maiasa) — “every morning”. 毎 (every) + 朝 (morning). A daily-routine word you will see constantly in JFT-Basic.",
  },
  {
    id: "jft-d02",
    topic: "Conversation and Expression",
    stem: "It is 8pm. You meet your neighbour in the hallway. What do you say?",
    options: [
      { id: "a", text: "おはようございます", textJp: "おはようございます" },
      { id: "b", text: "こんばんは", textJp: "こんばんは" },
      { id: "c", text: "さようなら", textJp: "さようなら" },
    ],
    correctId: "b",
    explanation: "こんばんは (konbanwa) is the standard evening greeting. おはようございます is for mornings; さようなら is said when parting.",
  },
  {
    id: "jft-d03",
    topic: "Reading Comprehension",
    stem: "You see this sign at a station: 出口. What does it mean?",
    options: [
      { id: "a", text: "Entrance", textJp: "入口" },
      { id: "b", text: "Exit", textJp: "出口" },
      { id: "c", text: "Ticket gate", textJp: "改札" },
    ],
    correctId: "b",
    explanation: "出口 (deguchi) means “exit” — 出 (go out) + 口 (mouth/opening). Its opposite, 入口 (iriguchi), means entrance. Station kanji are high-frequency JFT vocabulary.",
  },
  {
    id: "jft-d04",
    topic: "Conversation and Expression",
    stem: "A shop clerk hands you your change and says: ありがとうございました. The natural reply is…",
    options: [
      { id: "a", text: "どういたしまして", textJp: "どういたしまして" },
      { id: "b", text: "すみません", textJp: "すみません" },
      { id: "c", text: "こちらこそ", textJp: "こちらこそ" },
    ],
    correctId: "c",
    explanation: "こちらこそ (“likewise / thank you too”) is the natural reply when a clerk thanks you. どういたしまして (“you're welcome”) is used when YOU did the favour — saying it to a clerk sounds off.",
  },
  {
    id: "jft-d05",
    topic: "Script and Vocabulary",
    stem: "Fill the blank: わたしは 毎日 ___ で 会社に 行きます。",
    options: [
      { id: "a", text: "でんしゃ", textJp: "電車" },
      { id: "b", text: "でんわ", textJp: "電話" },
      { id: "c", text: "てがみ", textJp: "手紙" },
    ],
    correctId: "a",
    explanation: "電車 (densha, train) fits: “I go to the office by train every day.” で marks the means of transport. 電話 (phone) and 手紙 (letter) don't make sense with 行きます.",
  },
  {
    id: "jft-d06",
    topic: "Listening Comprehension",
    stem: "Listen: 「あしたは あめです。かさを もって いって ください。」 What should you do tomorrow?",
    stemJp: "あしたは あめです。かさを もって いって ください。",
    audioTextJp: "あしたは あめです。かさを もって いって ください。",
    options: [
      { id: "a", text: "Bring an umbrella", textJp: "かさ" },
      { id: "b", text: "Wear warm clothes", textJp: "あたたかい ふく" },
      { id: "c", text: "Stay home", textJp: "いえに いる" },
    ],
    correctId: "a",
    explanation: "あめ (rain) + かさ (umbrella) + もっていってください (please take it with you). The sentence directly tells you to bring an umbrella because it will rain.",
  },
  {
    id: "jft-d07",
    topic: "Reading Comprehension",
    stem: "A notice at your apartment says: ゴミは 火曜日に 出してください. When do you put out the rubbish?",
    options: [
      { id: "a", text: "Monday", textJp: "月曜日" },
      { id: "b", text: "Tuesday", textJp: "火曜日" },
      { id: "c", text: "Every day", textJp: "毎日" },
    ],
    correctId: "b",
    explanation: "火曜日 (kayoubi) is Tuesday — 火 (fire) is the day-marker. 出してください = “please put out”. Apartment notices like this are classic JFT everyday-reading material.",
  },
  {
    id: "jft-d08",
    topic: "Conversation and Expression",
    stem: "Your coworker says: おつかれさまでした. You are leaving the office. You reply…",
    options: [
      { id: "a", text: "おさきに しつれいします", textJp: "お先に失礼します" },
      { id: "b", text: "おかえりなさい", textJp: "おかえりなさい" },
      { id: "c", text: "いってらっしゃい", textJp: "いってらっしゃい" },
    ],
    correctId: "a",
    explanation: "お先に失礼します (osaki ni shitsurei shimasu) is what you say when leaving work before others. おかえりなさい welcomes someone home; いってらっしゃい is said to someone heading out.",
  },
  {
    id: "jft-d09",
    topic: "Script and Vocabulary",
    stem: "Choose the word that means “cheap / inexpensive”:",
    options: [
      { id: "a", text: "たかい", textJp: "高い" },
      { id: "b", text: "やすい", textJp: "安い" },
      { id: "c", text: "おおきい", textJp: "大きい" },
    ],
    correctId: "b",
    explanation: "安い (yasui) = cheap/inexpensive. 高い (takai) = expensive/tall; 大きい (ookii) = big. Price adjectives appear constantly in shopping dialogues.",
  },
  {
    id: "jft-d10",
    topic: "Listening Comprehension",
    stem: "Listen: 「すみません、えきは どこですか。」「まっすぐ いって、ひだりに まがって ください。」 Where is the station?",
    stemJp: "すみません、えきは どこですか。まっすぐ いって、ひだりに まがって ください。",
    audioTextJp: "すみません、えきは どこですか。まっすぐ いって、ひだりに まがって ください。",
    options: [
      { id: "a", text: "Go straight, then turn left", textJp: "まっすぐ、ひだり" },
      { id: "b", text: "Go straight, then turn right", textJp: "まっすぐ、みぎ" },
      { id: "c", text: "It is right here", textJp: "ここ" },
    ],
    correctId: "a",
    explanation: "まっすぐ (straight) + ひだりにまがってください (please turn left). Direction-giving with まっすぐ/右/左 is core everyday listening.",
  },
];

export const TOPIC_INFO: Record<DiagnosticQuestion["topic"], string> = {
  "Script and Vocabulary": "Reading everyday Japanese texts; basic vocabulary, kanji readings and usage.",
  "Conversation and Expression": "The grammar and expressions needed for everyday conversation.",
  "Listening Comprehension": "Understanding everyday conversations, instructions and announcements.",
  "Reading Comprehension": "Understanding letters, notices, explanations and other everyday texts.",
};

export const JFT_PROGRAM = {
  slug: "jft-basic",
  name: "JFT-Basic",
  organizer: "The Japan Foundation",
  officialUrl: "https://www.jpf.go.jp/jft-basic/e/about/index.html",
  tagline: "Everyday Japanese for living and working in Japan",
  // Verified 2026-10-08 against the Japan Foundation's official JFT-Basic pages
  // (https://www.jpf.go.jp/jft-basic/e/about/index.html and /e/faq/index.html).
  factsVerified: true,
  lastVerified: "2026-10-08",
  officialFacts: {
    purpose:
      "Measures the Japanese proficiency needed by foreign nationals about to reside in Japan mainly for work, to communicate in everyday life situations.",
    usedFor: ["Specified Skilled Worker (i)", "Employment for Skill Development", "Student (Japanese language institution enrollment)"],
    format: "Computer-based test (CBT)",
    sections: [
      { name: "Script and Vocabulary", detail: "Reading everyday texts; basic vocabulary and kanji use" },
      { name: "Conversation and Expression", detail: "Grammar and expressions for everyday conversation" },
      { name: "Listening Comprehension", detail: "Understanding everyday conversations and instructions" },
      { name: "Reading Comprehension", detail: "Understanding letters, notices and explanations" },
    ],
    questions: "Approximately 50",
    duration: "60 minutes total; no per-section time limit",
    listeningRules: "Audio can be played up to two times; cannot return to earlier questions in the Listening section",
    scoring: "Scaled score from 10 to 250 (not a raw count of correct answers)",
    levels: [
      { range: "145–174", level: "A1" },
      { range: "175–199", level: "A2.1" },
      { range: "200–250", level: "A2.2 (A2)" },
    ],
    noSectionMinimum: true,
    results: "Shown on screen the same day; official notification within 5 business days via Prometric",
    retake: "Allowed with a 45-day interval if the total score is 199 or lower; scores of 200+ cannot retake",
    noOralOrWriting: true,
  },
};
