/**
 * Practice question bank — 20 original JFT-Basic-style questions (5 per topic).
 * STATUS: draft — pending Japanese SME review. Never presented as official items.
 * These are separate from the 10 diagnostic questions (lib/exams.ts).
 */

export type PracticeQuestion = {
  id: string;
  topic: "Script and Vocabulary" | "Conversation and Expression" | "Listening Comprehension" | "Reading Comprehension";
  stem: string;
  stemJp?: string;
  options: { id: string; text: string; textJp?: string }[];
  correctId: string;
  explanation: string;
  hint: string;
  audioTextJp?: string;
};

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  // ---------- Script and Vocabulary ----------
  {
    id: "jft-p01",
    topic: "Script and Vocabulary",
    stem: "きのう 図書館で 本を 借りました。Choose the meaning of 借りました.",
    options: [
      { id: "a", text: "borrowed", textJp: "借りる" },
      { id: "b", text: "bought", textJp: "買う" },
      { id: "c", text: "read", textJp: "読む" },
    ],
    correctId: "a",
    explanation: "借りる (kariru) means “to borrow”. 買う (kau) is “to buy”, 読む (yomu) is “to read”. The library context — 図書館 (toshokan) — points to borrowing.",
    hint: "Think about what you do with books at a 図書館 (library) — you take them home and bring them back.",
  },
  {
    id: "jft-p02",
    topic: "Script and Vocabulary",
    stem: "Fill the blank: わたし ___ きょうだいは 3人 います。",
    options: [
      { id: "a", text: "は", textJp: "は" },
      { id: "b", text: "が", textJp: "が" },
      { id: "c", text: "を", textJp: "を" },
    ],
    correctId: "a",
    explanation: "は marks the topic: “As for me, I have three siblings.” が would emphasize *I* (as opposed to someone else); を marks a direct object and can't follow わたし here.",
    hint: "This sentence introduces a topic about yourself — which particle sets the topic?",
  },
  {
    id: "jft-p03",
    topic: "Script and Vocabulary",
    stem: "Choose the opposite of あつい (hot):",
    options: [
      { id: "a", text: "さむい", textJp: "寒い" },
      { id: "b", text: "つめたい", textJp: "冷たい" },
      { id: "c", text: "あたたかい", textJp: "暖かい" },
    ],
    correctId: "a",
    explanation: "寒い (samui) is the opposite of 暑い (atsui, hot weather). Careful: 冷たい (tsumetai) is “cold to the touch” (a cold drink), and 暖かい (atatakai) means “warm”.",
    hint: "One of these describes cold weather — the true opposite of a hot day.",
  },
  {
    id: "jft-p04",
    topic: "Script and Vocabulary",
    stem: "Choose the correct reading: 休み",
    options: [
      { id: "a", text: "やすみ", textJp: "やすみ" },
      { id: "b", text: "きゅうみ", textJp: "きゅうみ" },
      { id: "c", text: "おやすみ", textJp: "おやすみ" },
    ],
    correctId: "a",
    explanation: "休み reads やすみ (yasumi) — “rest, day off”. おやすみなさい (good night) is a different word that happens to share the kanji.",
    hint: "The reading starts with や. Think of やすむ (to rest) — the noun form keeps the same sound.",
  },
  {
    id: "jft-p05",
    topic: "Script and Vocabulary",
    stem: "Fill the blank: まいにち 8時間 ___ます。",
    options: [
      { id: "a", text: "ね", textJp: "寝ます" },
      { id: "b", text: "たべ", textJp: "食べます" },
      { id: "c", text: "のみ", textJp: "飲みます" },
    ],
    correctId: "a",
    explanation: "寝ます (nemasu, sleep) fits the 8-hour duration: “I sleep 8 hours every day.” Eating or drinking for 8 hours straight would be… impressive.",
    hint: "Which of these three activities do people normally do for about 8 hours?",
  },

  // ---------- Conversation and Expression ----------
  {
    id: "jft-p06",
    topic: "Conversation and Expression",
    stem: "When do you say 「もしもし」?",
    options: [
      { id: "a", text: "When answering the phone", textJp: "電話に出るとき" },
      { id: "b", text: "When meeting a friend", textJp: "友だちに会うとき" },
      { id: "c", text: "When leaving home", textJp: "家を出るとき" },
    ],
    correctId: "a",
    explanation: "もしもし (moshi moshi) is said when answering or starting a phone call — never face-to-face. Meeting a friend gets こんにちは; leaving home gets いってきます.",
    hint: "You only ever say this word when there's a phone involved.",
  },
  {
    id: "jft-p07",
    topic: "Conversation and Expression",
    stem: "At a restaurant the waiter asks: 「ご注文は お決まりですか。」You're not ready. You say…",
    options: [
      { id: "a", text: "すみません、もう少し 待ってください。", textJp: "すみません、もう少し待ってください" },
      { id: "b", text: "お会計を お願いします。", textJp: "お会計をお願いします" },
      { id: "c", text: "ごちそうさまでした。", textJp: "ごちそうさまでした" },
    ],
    correctId: "a",
    explanation: "もう少し待ってください = “please wait a little longer” — exactly right when you haven't decided. お会計をお願いします asks for the bill; ごちそうさまでした is said after finishing the meal.",
    hint: "You need more time to decide — which phrase asks the waiter to wait?",
  },
  {
    id: "jft-p08",
    topic: "Conversation and Expression",
    stem: "Your friend says: 「お誕生日 おめでとう！」You reply…",
    options: [
      { id: "a", text: "ありがとう！", textJp: "ありがとう" },
      { id: "b", text: "おめでとう！", textJp: "おめでとう" },
      { id: "c", text: "すみません。", textJp: "すみません" },
    ],
    correctId: "a",
    explanation: "ありがとう (thank you) is the natural reply to birthday wishes. Repeating おめでとう back would congratulate them on *your* birthday — a classic mix-up.",
    hint: "Someone just gave you good wishes — what's the simplest polite response?",
  },
  {
    id: "jft-p09",
    topic: "Conversation and Expression",
    stem: "You step into a friend's home for the first time that day. You say…",
    options: [
      { id: "a", text: "おじゃまします。", textJp: "おじゃまします" },
      { id: "b", text: "ただいま。", textJp: "ただいま" },
      { id: "c", text: "いってきます。", textJp: "いってきます" },
    ],
    correctId: "a",
    explanation: "おじゃまします (ojama shimasu, “sorry to intrude”) is said when entering someone else's home. ただいま is for your own home; いってきます is said when leaving your home.",
    hint: "You're the guest here — which phrase politely acknowledges you're intruding?",
  },
  {
    id: "jft-p10",
    topic: "Conversation and Expression",
    stem: "A colleague just finished helping you with difficult paperwork. You say…",
    options: [
      { id: "a", text: "助かりました。ありがとうございます。", textJp: "助かりました。ありがとうございます" },
      { id: "b", text: "おつかれさまです。", textJp: "おつかれさまです" },
      { id: "c", text: "がんばります。", textJp: "がんばります" },
    ],
    correctId: "a",
    explanation: "助かりました (tasukarimashita, “you saved me / that helped a lot”) + thank you is the natural response to received help. おつかれさまです acknowledges someone's work generally; がんばります is about your own effort.",
    hint: "Someone helped YOU — which phrase expresses that you were rescued?",
  },

  // ---------- Listening Comprehension ----------
  {
    id: "jft-p11",
    topic: "Listening Comprehension",
    stem: "Listen: 「きょうは どようびです。がっこうは ありません。」",
    stemJp: "きょうは どようびです。がっこうは ありません。",
    audioTextJp: "きょうは どようびです。がっこうは ありません。",
    options: [
      { id: "a", text: "Saturday, no school", textJp: "土曜日・学校なし" },
      { id: "b", text: "Saturday, has school", textJp: "土曜日・学校あり" },
      { id: "c", text: "Sunday, no school", textJp: "日曜日・学校なし" },
    ],
    correctId: "a",
    explanation: "どようび (doyoubi) = Saturday; ありません = “there isn't”. So: it's Saturday and there is no school.",
    hint: "Listen for two things: the day of the week, and あります vs ありません.",
  },
  {
    id: "jft-p12",
    topic: "Listening Comprehension",
    stem: "Listen: 「たなかさんは びょういんです。あたまが いたいです。」What is wrong?",
    stemJp: "たなかさんは びょういんです。あたまが いたいです。",
    audioTextJp: "たなかさんは びょういんです。あたまが いたいです。",
    options: [
      { id: "a", text: "Headache", textJp: "頭が痛い" },
      { id: "b", text: "Stomachache", textJp: "お腹が痛い" },
      { id: "c", text: "Fever", textJp: "熱がある" },
    ],
    correctId: "a",
    explanation: "あたまがいたい (atama ga itai) = “my head hurts”. Body part + がいたい is the core pattern for describing pain.",
    hint: "Which body part do you hear? あたま means head.",
  },
  {
    id: "jft-p13",
    topic: "Listening Comprehension",
    stem: "Listen: 「バスは 3ばんのりばから でます。」Which platform?",
    stemJp: "バスは 3ばんのりばから でます。",
    audioTextJp: "バスは 3ばんのりばから でます。",
    options: [
      { id: "a", text: "Platform 3", textJp: "3番のりば" },
      { id: "b", text: "Platform 2", textJp: "2番のりば" },
      { id: "c", text: "Platform 4", textJp: "4番のりば" },
    ],
    correctId: "a",
    explanation: "3ばんのりば (san-ban noriba) = platform 3. Announcements like this are exactly the everyday listening JFT-Basic targets.",
    hint: "Listen carefully to the number before ばんのりば.",
  },
  {
    id: "jft-p14",
    topic: "Listening Comprehension",
    stem: "Listen: 「この しゃしんを みてください。わたしの かぞくです。」What is being shown?",
    stemJp: "この しゃしんを みてください。わたしの かぞくです。",
    audioTextJp: "この しゃしんを みてください。わたしの かぞくです。",
    options: [
      { id: "a", text: "A family photo", textJp: "家族の写真" },
      { id: "b", text: "A house", textJp: "家" },
      { id: "c", text: "A pet", textJp: "ペット" },
    ],
    correctId: "a",
    explanation: "しゃしん (shashin) = photo; かぞく (kazoku) = family. “Please look at this photo — it's my family.”",
    hint: "Two key words: しゃしん (photo) and かぞく (family).",
  },
  {
    id: "jft-p15",
    topic: "Listening Comprehension",
    stem: "Listen: 「れいぞうこに ぎゅうにゅうが あります。のんで ください。」What should you do?",
    stemJp: "れいぞうこに ぎゅうにゅうが あります。のんで ください。",
    audioTextJp: "れいぞうこに ぎゅうにゅうが あります。のんで ください。",
    options: [
      { id: "a", text: "Drink the milk in the fridge", textJp: "冷蔵庫の牛乳を飲む" },
      { id: "b", text: "Buy some milk", textJp: "牛乳を買う" },
      { id: "c", text: "Throw the milk away", textJp: "牛乳を捨てる" },
    ],
    correctId: "a",
    explanation: "れいぞうこ (reizouko) = fridge; ぎゅうにゅう (gyuunyuu) = milk; のんでください = “please drink”. The sentence tells you milk is in the fridge and invites you to drink it.",
    hint: "のんでください means “please drink” — what is there to drink, and where?",
  },

  // ---------- Reading Comprehension ----------
  {
    id: "jft-p16",
    topic: "Reading Comprehension",
    stem: "You see this sign on a door: 立入禁止. What does it mean?",
    options: [
      { id: "a", text: "No entry", textJp: "立入禁止" },
      { id: "b", text: "Entrance", textJp: "入口" },
      { id: "c", text: "Exit", textJp: "出口" },
    ],
    correctId: "a",
    explanation: "立入禁止 (tachiiri kinshi) = “no entry / do not enter” — 立入 (entering) + 禁止 (prohibited). One of the most common warning signs in Japan.",
    hint: "禁止 (きんし) means “prohibited”. What is being prohibited here?",
  },
  {
    id: "jft-p17",
    topic: "Reading Comprehension",
    stem: "A shop sign says: 営業時間 9:00–18:00. You arrive at 20:00. The shop is…",
    options: [
      { id: "a", text: "Closed", textJp: "閉まっている" },
      { id: "b", text: "Open", textJp: "開いている" },
      { id: "c", text: "Opening at 20:00", textJp: "20時に開く" },
    ],
    correctId: "a",
    explanation: "営業時間 (eigyou jikan) = business hours. 9:00–18:00 means the shop closes at 6pm — at 20:00 (8pm) it is closed.",
    hint: "営業時間 shows when the shop is open. Is 20:00 inside 9:00–18:00?",
  },
  {
    id: "jft-p18",
    topic: "Reading Comprehension",
    stem: "In a department store you see: お手洗い. Where does it point?",
    options: [
      { id: "a", text: "Restrooms", textJp: "トイレ" },
      { id: "b", text: "Hand-washing sinks only", textJp: "手洗い場" },
      { id: "c", text: "Bath / shower", textJp: "お風呂" },
    ],
    correctId: "a",
    explanation: "お手洗い (otearai) is the polite word for restrooms/toilets in public buildings. Don't be fooled by 手 (hand) + 洗い (washing) — it means the whole restroom.",
    hint: "This is the polite public sign — it points to the same place トイレ does.",
  },
  {
    id: "jft-p19",
    topic: "Reading Comprehension",
    stem: "A popular cake shop has a sign: 売り切れ. What does it mean?",
    options: [
      { id: "a", text: "Sold out", textJp: "売り切れ" },
      { id: "b", text: "On sale", textJp: "セール中" },
      { id: "c", text: "New arrival", textJp: "新発売" },
    ],
    correctId: "a",
    explanation: "売り切れ (urikire) = sold out — 売り (selling) + 切れ (run out). You'll see it at bakeries, ticket counters, and limited-stock shops.",
    hint: "切れ (きれ) here means “run out / used up”. What ran out?",
  },
  {
    id: "jft-p20",
    topic: "Reading Comprehension",
    stem: "Your building notice says: ゴミは 分別して 出してください. What must you do?",
    options: [
      { id: "a", text: "Separate rubbish by type", textJp: "分別する" },
      { id: "b", text: "Put rubbish out any time", textJp: "いつでも出す" },
      { id: "c", text: "Burn your rubbish", textJp: "燃やす" },
    ],
    correctId: "a",
    explanation: "分別 (bunbetsu) = sorting/separation. The notice asks you to sort rubbish by type before putting it out — standard practice across Japan.",
    hint: "分別して means “having separated”. What are you being asked to separate?",
  },
];

export const PRACTICE_TOPICS = [
  "Script and Vocabulary",
  "Conversation and Expression",
  "Listening Comprehension",
  "Reading Comprehension",
] as const;

export type PracticeTopic = (typeof PRACTICE_TOPICS)[number];

export function practiceByTopic(topic: string): PracticeQuestion[] {
  return PRACTICE_QUESTIONS.filter((q) => q.topic === topic);
}
