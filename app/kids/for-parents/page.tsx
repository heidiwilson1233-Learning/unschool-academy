import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section, SectionHeading, Button, Badge, Breadcrumbs, FAQAccordion } from "@/components/ui";

export const metadata: Metadata = {
  title: "For Parents: What Your Child's Safety Looks Like",
  description:
    "How Unschool Kids protects children: the parent charter, screen-time stance, co-play guidance, evidence of learning, and honest data controls.",
  alternates: { canonical: "/kids/for-parents" },
  openGraph: {
    title: "For Parents: What Your Child's Safety Looks Like",
    description:
      "The parent charter: no ads, no purchases, no open AI chat, plus screen-time stance, co-play guidance, and evidence of learning.",
    type: "website",
    url: "/kids/for-parents",
  },
  twitter: {
    card: "summary",
    title: "For Parents: What Your Child's Safety Looks Like",
    description:
      "No ads, no purchases, no open AI chat in child mode. Screen-time stance, co-play guidance, and honest evidence of learning.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "For parents" },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: TRAIL.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.label,
    ...(t.href ? { item: `https://unschool.academy${t.href}` } : {}),
  })),
};

const FAQS = [
  {
    q: "What data do you collect about my child?",
    a: "As little as possible: a nickname or avatar, age band, language preference, and learning activity (what was attempted, and whether it was independent, hinted, or demonstrated). No full names, birthdays, schools, photos, voice recordings, or location.",
  },
  {
    q: "Can my child accidentally buy something?",
    a: "No. Child mode contains no purchases, no ads, and no external links. All billing lives behind a parent gate in your Parent Hub, on your adult account.",
  },
  {
    q: "How much screen time does a quest use?",
    a: "Sessions are short and bounded. Every quest is designed to end, with an off-screen invitation and a prominent stop button. Age bands and session lengths are design targets, never recommendations for your child's daily screen allowance. You set the time; the app never negotiates it.",
  },
  {
    q: "Can I limit when and how long my child plays?",
    a: "Yes. Screen-time settings, including per-child time budgets and cutoffs, live in the Parent Hub. The 2–3 track is co-play by design and transitions quickly to off-screen play.",
  },
  {
    q: "Can I delete our data?",
    a: "Yes. Export or delete your family's data any time from Parent Hub → Privacy. Deletion is confirmed and audited.",
  },
  {
    q: "Is there AI chatting with my child?",
    a: "No. Characters speak from reviewed, written scripts. There is no open-ended AI chat, no voice recording, and no camera use.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const CHARTER = [
  {
    n: "01",
    title: "No ads",
    body: "No advertising, sponsored content, or product placement in child mode.",
    why: "Your child is not the customer. You are.",
    span: "md:col-span-6",
    big: true,
  },
  {
    n: "02",
    title: "No purchases",
    body: "No upsells, no coins, no locked characters.",
    why: "All billing sits behind a parent gate, on your adult account.",
    span: "md:col-span-3",
  },
  {
    n: "03",
    title: "No external links",
    body: "Your child cannot leave the learning world.",
    why: "Exiting child mode requires the parent gate.",
    span: "md:col-span-3",
  },
  {
    n: "04",
    title: "No social features",
    body: "No chat, no friends lists, no public profiles.",
    why: "There is nothing to discover and no one to be discovered by.",
    span: "md:col-span-3",
  },
  {
    n: "05",
    title: "No open AI chat",
    body: "Characters speak from written, reviewed scripts.",
    why: "There is no open-ended conversation with a model.",
    span: "md:col-span-3",
  },
  {
    n: "06",
    title: "No engagement traps",
    body: "No streaks, no daily pressure, no infinite feeds.",
    why: "There is no guilt for stopping. Stopping is the design.",
    span: "md:col-span-6",
    big: true,
  },
];

const SCREEN_PRINCIPLES = [
  {
    t: "Quests are designed to end",
    b: "Every quest closes with an off-screen invitation and a prominent stop button. No autoplay, no infinite feeds, no “just one more”.",
  },
  {
    t: "You decide the time allowance",
    b: "Ages, placements and session lengths are design targets, never recommendations for your child's daily screen time. Parents decide how much time to allow.",
  },
  {
    t: "Youngest play leaves the screen fast",
    b: "The 2–3 track is built to move from screen to lap to play, as quickly as possible.",
  },
];

const COPLAY_STEPS = [
  {
    t: "Sit beside, not across",
    b: "The 2–3 track assumes a lap. Your child should have a real action in a story within 30–60 seconds of starting, and you are the controller of the device.",
  },
  {
    t: "Let the character wait",
    b: "Momo, Tara and Bobo are scripted to pause, not to answer for your child. Resist filling the silence. The pause is where the thinking happens.",
  },
  {
    t: "End with the invitation",
    b: "Every quest closes with one practical, adult-guided off-screen activity. Doing it together is the point of the screen time.",
  },
];

const EVIDENCE_ROWS = [
  {
    level: "Independent",
    note: "Steps 1–2 solved with no help.",
  },
  {
    level: "Used a hint",
    note: "Hint level 1: counting aloud with Momo. The hint taught regrouping into threes.",
  },
  {
    level: "Needed a demonstration",
    note: "Not this quest. Recorded when a character shows the way first.",
  },
  {
    level: "Transfer observed",
    note: "Applied the same counting to the fruit-bowl tray at home.",
  },
];

const OFFSCREEN = [
  "After Momo's mango quest: sort the fruit bowl together and count out loud.",
  "After Tara's story tree: retell the ending with your own twist at dinner.",
  "After Bobo's pond: find three smooth stones outside and line them by size.",
];

const HONESTY =
  "Accounts, billing and child-profile features are in staged rollout. The hub currently shows the planned controls; nothing here pretends to be live before it is.";

function Mono({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink ${className}`}>
      {children}
    </p>
  );
}

export default function ForParentsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ——— Authored hero: type-as-hero, grain, honesty rail ——— */}
      <header className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `${GRAIN}, radial-gradient(52rem 30rem at 12% -10%, rgba(242,166,108,0.28), transparent 60%), radial-gradient(44rem 26rem at 88% 10%, rgba(141,198,167,0.24), transparent 60%)`,
            opacity: 0.55,
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8 pb-14 md:pt-10 md:pb-20">
          <Breadcrumbs trail={TRAIL} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <Mono>For parents · Safety &amp; control</Mono>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.75rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink text-balance">
                What your child will never meet here.
              </h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-slate leading-relaxed">
                Minimal data. Zero commercial pressure on your child. Honest evidence of learning.
                Here is exactly how each part works.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/parent" variant="kids" size="lg">
                  Open Parent Hub
                </Button>
                <Button href="#evidence" variant="secondary" size="lg">
                  See how evidence works
                </Button>
              </div>
            </div>
            <aside className="hidden lg:block self-start border-l border-border pl-8 pt-2">
              <Mono>Staged rollout</Mono>
              <p className="mt-3 text-sm text-slate leading-relaxed">{HONESTY}</p>
            </aside>
          </div>
        </div>
      </header>

      {/* ——— S1: The Parent Charter — six commitments, bento ——— */}
      <Section>
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="The parent charter"
          title="Six things we chose to leave out"
          sub="Safety here is not a list of features. It is a list of absences, kept on purpose."
        />
        <ol className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {CHARTER.map((c) => (
            <li
              key={c.n}
              className={`bg-paper border border-border rounded-2xl p-6 md:p-7 ${c.span}`}
            >
              <p aria-hidden className="font-mono text-xs font-bold text-kids-leaf-deep tracking-widest">
                {c.n}
              </p>
              <h3 className={`mt-3 font-extrabold text-ink tracking-tight ${c.big ? "text-2xl md:text-3xl" : "text-xl"}`}>
                {c.title}
              </h3>
              <p className={`mt-2 text-slate leading-relaxed ${c.big ? "text-lg" : "text-sm"}`}>{c.body}</p>
              <p className={`mt-3 text-ink/80 italic ${c.big ? "text-base" : "text-sm"}`}>{c.why}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ——— S2: Screens — screen-time stance ——— */}
      <Section id="screens" className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <SectionHeading
              align="left"
              tone="kids"
              eyebrow="Screens"
              title="Screen time that respects its limits"
              sub="Our stance on screens, stated plainly, before you ask."
            />
            <ol className="space-y-6">
              {SCREEN_PRINCIPLES.map((p, i) => (
                <li key={p.t} className="flex gap-5 border-t border-border pt-6 first:border-t-0 first:pt-0">
                  <p aria-hidden className="font-mono text-sm font-bold text-kids-leaf-deep pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="text-lg font-extrabold text-ink tracking-tight">{p.t}</h3>
                    <p className="mt-1 text-slate leading-relaxed">{p.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="self-start bg-paper border border-border rounded-2xl p-6">
            <Mono>Concept preview · Parent Hub</Mono>
            <h3 className="mt-3 text-lg font-extrabold text-ink tracking-tight">Screen-time settings</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-slate">Daily quest time</dt>
                <dd className="font-bold text-ink">20 min</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-slate">Bedtime cutoff</dt>
                <dd className="font-bold text-ink">8:30 PM</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="text-slate">Co-play only, ages 2–3</dt>
                <dd className="font-bold text-ink">On</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate leading-relaxed">
              Illustration of the planned controls. Parent accounts are in staged rollout.
            </p>
          </aside>
        </div>
      </Section>

      {/* ——— S3: Co-play guidance — bento ——— */}
      <Section className="border-t border-border">
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="Co-play guidance"
          title="You are part of the lesson"
          sub="Adults co-play the toddler experiences. Here is how to do it well."
        />
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 bg-paper border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-extrabold text-ink tracking-tight">The three-minute ritual</h3>
            <ol className="mt-5 space-y-5">
              {COPLAY_STEPS.map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <p aria-hidden className="font-mono text-sm font-bold text-kids-leaf-deep pt-0.5 shrink-0">
                    {i + 1}.
                  </p>
                  <div>
                    <h4 className="font-bold text-ink">{s.t}</h4>
                    <p className="mt-1 text-sm text-slate leading-relaxed">{s.b}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="md:col-span-2 md:row-span-2 bg-kids-orange/15 border border-kids-orange-deep/40 rounded-2xl p-6 md:p-7">
            <Mono>Ages 2–3</Mono>
            <h3 className="mt-3 text-xl font-extrabold text-ink tracking-tight">Little Explorers is designed for your lap</h3>
            <p className="mt-2 text-sm text-slate leading-relaxed">
              The youngest track has no reading and no cursor-control requirement for the child.
              It assumes a parent is holding the device and the child is doing the thinking.
            </p>
          </div>
          <div className="md:col-span-4 bg-paper border border-border rounded-2xl p-6 md:p-8">
            <p className="font-mono text-xs font-bold text-kids-leaf-deep tracking-widest uppercase">The entry rule</p>
            <p className="mt-3 text-3xl md:text-4xl font-extrabold text-ink tracking-tight">
              30–60 seconds
            </p>
            <p className="mt-2 text-slate leading-relaxed">
              That is the target: a real action in a story within a minute of parent-guided entry.
              Audio and visuals first. Reading comes later.
            </p>
          </div>
        </div>
      </Section>

      {/* ——— S4: Evidence model — sample evidence card ——— */}
      <Section id="evidence" className="border-t border-border">
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="Evidence, not scores"
          title="See what your child actually did"
          sub="After each quest, the Parent Hub records plain observations. This is what one looks like."
        />
        <div className="max-w-3xl">
          <figure className="bg-paper border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <Mono>Sample record · fictional</Mono>
                <figcaption className="mt-1 text-lg font-extrabold text-ink tracking-tight">
                  Momo's mango quest — counting to ten
                </figcaption>
              </div>
              <Badge tone="kids">Ages 3–5</Badge>
            </div>
            <dl className="divide-y divide-border">
              {EVIDENCE_ROWS.map((r) => (
                <div key={r.level} className="grid gap-1 px-6 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
                  <dt className="font-bold text-ink">{r.level}</dt>
                  <dd className="text-slate leading-relaxed">{r.note}</dd>
                </div>
              ))}
            </dl>
            <div className="border-t border-border px-6 py-4 bg-kids-leaf/10">
              <p className="text-sm text-slate leading-relaxed">
                No IQ-style scores. No rankings. No developmental labels. Your child is not a percentile.
              </p>
            </div>
          </figure>
          <p className="mt-4 text-sm text-slate leading-relaxed">
            Full history, including whether each skill transferred to a new example, lives in the Parent
            Hub on your adult account.
          </p>
        </div>
      </Section>

      {/* ——— S5: Data protection — collected / never split ——— */}
      <Section className="border-t border-border">
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="Data protection"
          title="As little data as possible"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-paper border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-ink tracking-tight">What we collect</h3>
            <ul className="mt-4 space-y-2 text-slate leading-relaxed">
              <li>A nickname or avatar, chosen by you</li>
              <li>Age band and language preference</li>
              <li>Learning activity: what was attempted, and whether it was independent, hinted, or demonstrated</li>
            </ul>
          </div>
          <div className="bg-paper border border-border rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-extrabold text-ink tracking-tight">What we never collect</h3>
            <ul className="mt-4 space-y-2 text-slate leading-relaxed">
              <li>No full names, birthdays, or schools</li>
              <li>No photos, voice recordings, or camera use</li>
              <li>No location, and no data sold or shared for advertising</li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-slate leading-relaxed">
          Export or delete your family's data any time from Parent Hub → Privacy. Deletion is confirmed
          and audited. Read the full policy: <a href="/legal/child-privacy" className="font-bold text-academy-blue underline underline-offset-2">Children's Privacy</a>.
        </p>
      </Section>

      {/* ——— S6: Off-screen play — full-bleed band ——— */}
      <div className="border-y border-border bg-kids-orange/15">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <Mono>Off-screen play</Mono>
          <h2 className="mt-3 max-w-3xl text-3xl md:text-5xl font-extrabold tracking-[-0.03em] text-ink text-balance">
            Every quest ends with an invitation off the screen.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate leading-relaxed">
            One learning objective, one real action, one small off-screen follow-on. Examples of the kind
            of invitation every quest closes with:
          </p>
          <ul className="mt-8 space-y-4">
            {OFFSCREEN.map((o) => (
              <li key={o} className="border-t border-ink/15 pt-4 text-ink leading-relaxed max-w-3xl">
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xl md:text-2xl font-extrabold text-ink tracking-tight">
            Screen time that ends in playtime.
          </p>
        </div>
      </div>

      {/* ——— S7: Parent Hub controls + FAQ ——— */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] items-start">
          <div>
            <SectionHeading
              align="left"
              tone="kids"
              eyebrow="Your controls"
              title="One hub for everything"
              sub="Billing, consent, data, and settings live in the Parent Hub, on your adult account."
            />
            <div className="border border-border rounded-2xl bg-paper p-5">
              <Mono>Staged rollout</Mono>
              <p className="mt-2 text-sm text-slate leading-relaxed">{HONESTY}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/parent" variant="kids">Open Parent Hub</Button>
              <Button href="/kids/pricing" variant="secondary">Family plans</Button>
            </div>
          </div>
          <div>
            <SectionHeading
              align="left"
              tone="kids"
              eyebrow="Questions"
              title="Parent FAQ"
            />
            <FAQAccordion items={FAQS} />
          </div>
        </div>
      </Section>
    </>
  );
}
