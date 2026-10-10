import type { Metadata } from "next";
import { Section, SectionHeading, Button, FAQAccordion, Badge } from "@/components/ui";
import { JftSampler, KidsSampler } from "@/components/samplers";
import { Art, StagingNote } from "@/components/site-art";

export const metadata: Metadata = {
  /* Layout template appends " | Unschool Academy" — 55 chars rendered. */
  title: "Practise Until It Makes Sense",
  description:
    "Focused exam preparation and joyful learning for ages 2 through Grade 5 — built around things learners can actually do.",
  alternates: { canonical: "/" },
  twitter: { card: "summary_large_image" },
};

/* Inline SVG grain (light surfaces only) — same recipe as sibling pages. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/* Honest numbers: every figure is verifiable in the MD blueprint or the build. */
const PROOF = [
  { n: "10", label: "Free diagnostic questions — no account, no paywall" },
  { n: "01", label: "Live exam program — JFT-Basic, in pilot" },
  { n: "500", label: "Exams in the research catalogue — kept internal until each passes verification" },
];

const STEPS = [
  { n: "01", title: "Explore", body: "Find the exam or age track that fits. Read verified syllabi and learning goals — plain facts, zero hype." },
  { n: "02", title: "Try", body: "Take the free diagnostic or play a full sample quest. Real questions, real interactions, nothing held back." },
  { n: "03", title: "Learn", body: "Follow a topic-by-topic plan: original practice, honest explanations for every answer — labelled draft or reviewed, never mixed — and hints that teach instead of telling." },
  { n: "04", title: "See progress", body: "Topic-level scores and observed skills — honest evidence of what clicked and what still needs work." },
];

const FAQS = [
  {
    q: "Is Unschool Academy affiliated with the exam boards?",
    a: "No. Unschool Academy is an independent practice and learning service. Exam names belong to their respective owners, and our practice scores are unofficial — they measure your practice performance, not your official result.",
  },
  {
    q: "What does the free diagnostic include?",
    a: "Ten original JFT-Basic-style questions across all four official sections, with instant topic feedback. Explanations are clearly labelled as drafts pending expert review. No account needed, five minutes of your time — and your result is yours, never held behind a paywall.",
  },
  {
    q: "How does Unschool Kids keep children safe?",
    a: "Child profiles live under a parent-owned account. Child mode has no ads, no purchases, no external links, no social features and no open-ended AI chat. Parents control consent, data, billing and deletion from the Parent Hub.",
  },
  {
    q: "Do you really only have one exam program right now?",
    a: "Yes — and we say so proudly. JFT-Basic is our pilot: one complete preparation path — live today as the free diagnostic, with the full path still in staged review. Our 500-exam research catalogue stays internal until each program passes verification and content review. We'd rather do one exam brilliantly than 500 badly.",
  },
];

/* JSON-LD is exactly parallel to the rendered content. */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" }],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Unschool Academy",
  url: "https://unschool.academy/",
  inLanguage: "en",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  return (
    <>
      {/* HERO — MD wireframe: primary heading left, layered visual sampler right.
          Type-as-hero carries it (no AI-image hero, no flat gradient wash). */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(44rem 30rem at 16% 6%, rgba(20,125,117,0.10), transparent 60%), radial-gradient(38rem 26rem at 88% 22%, rgba(49,91,135,0.09), transparent 62%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-6">
                Unschool Academy | Two ways to learn
              </p>
              <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.98] tracking-[-0.03em] text-ink text-balance">
                <span className="guide-reveal block">Don&apos;t just study.</span>
                <span className="guide-reveal block" style={{ animationDelay: "91ms" }}>
                  Practise until it makes sense.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg md:text-xl text-slate leading-relaxed">
                Focused exam preparation and joyful learning for ages 2 through Grade 5—built around
                things learners can actually do.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href="/exams" size="lg">Explore Exams</Button>
                <Button href="/kids" size="lg" variant="kids">Visit Kids World</Button>
              </div>
              <p className="mt-4 text-[15px]">
                <a
                  href="/exams/jft-basic/diagnostic"
                  className="font-semibold text-academy-blue underline underline-offset-4 decoration-academy-blue/40 hover:decoration-academy-blue rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                >
                  Take the free 10-question diagnostic
                </a>
                <span className="text-slate"> — no account needed.</span>
              </p>
            </div>
            <div className="lg:col-span-5">
              {/* Real product UI in a browser frame — the actual practice, not a stock hero. */}
              <figure className="motion-safe:md:-rotate-1 motion-safe:hover:rotate-0 transition-transform duration-500 ease-[var(--ease-signature)]">
                <div className="rounded-2xl border border-border bg-paper shadow-[0_24px_60px_-28px_rgba(21,34,59,0.35)] overflow-hidden">
                  <div className="flex items-center gap-1.5 border-b border-border bg-canvas px-4 py-3">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-border" />
                    <span className="ml-2 rounded-full bg-border/50 px-3 py-1 font-mono text-[11px] text-slate">
                      unschool.academy/free-practice
                    </span>
                  </div>
                  <div className="bg-canvas p-4 md:p-5">
                    <JftSampler />
                  </div>
                </div>
                <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                  Live sample — a real question from the draft bank. No signup.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Honest numbers — every figure verifiable in the blueprint or the build. */}
          <dl className="mt-14 md:mt-20 grid grid-cols-3 gap-4 md:gap-8 border-y border-border py-8">
            {PROOF.map((p) => (
              <div key={p.n}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="font-display text-4xl md:text-6xl tracking-[-0.03em] text-ink" aria-hidden>
                  {p.n}
                </dd>
                <dd className="mt-2 text-[13px] md:text-sm text-slate leading-snug max-w-[16rem]">
                  {p.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* TWO DOORS — bento: institutional dossier (col-span-4) vs tactile kids cell (col-span-2).
          Split visual registers per audience, per the skill. */}
      <Section className="!py-14 md:!py-20">
        <ul className="grid md:grid-cols-6 gap-6 list-none p-0 m-0">
          <li className="md:col-span-4">
            <article className="h-full bg-paper border border-border rounded-2xl overflow-hidden shadow-sm">
              <Art
                src="/img/card-jft.webp"
                alt="Study flashcards and an open notebook in warm window light"
                ratio="card"
                className="!rounded-none !border-0 !shadow-none"
              />
              <div className="p-6 md:p-10">
                <Badge tone="info">Unschool Exams</Badge>
                <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
                  Exam prep that shows its work
                </h2>
                <p className="mt-3 text-slate leading-relaxed max-w-xl">
                  Starting with JFT-Basic everyday Japanese: a free 10-question diagnostic, topic-mapped
                  practice (explanations labelled as drafts pending expert review), and timed mocks. Every
                  score is deterministic — real maths on your real answers, never invented percentiles.
                </p>
                <ul className="mt-6 divide-y divide-border border-y border-border">
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">01</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Free 10-question diagnostic</strong> — no account, no paywall.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">02</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Original questions</strong> — each explanation labelled draft pending expert review.</span>
                  </li>
                  <li className="py-3.5 flex gap-4 text-[15px]">
                    <span aria-hidden className="font-mono text-xs font-bold tracking-[0.18em] text-academy-teal-dark pt-1">03</span>
                    <span className="text-slate"><strong className="font-semibold text-ink">Honest unofficial scores</strong> — we never promise a pass.</span>
                  </li>
                </ul>
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
                  Pilot · JFT-Basic · Official facts verified
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button href="/exams/jft-basic">Start with JFT-Basic</Button>
                  <Button href="/exams/how-practice-works" variant="ghost">How practice works</Button>
                </div>
              </div>
            </article>
          </li>
          <li className="md:col-span-2">
            <article className="h-full bg-kids-cream border-2 border-b-4 border-kids-orange/40 rounded-2xl overflow-hidden">
              <Art
                src="/img/kids-world.webp"
                alt="The Unschool Kids village: Momo's mango garden, Tara's story tree and Bobo's discovery pond under festival bunting"
                ratio="card"
                className="!rounded-none !border-0 !shadow-none"
              />
              <div className="p-6 md:p-8 pt-2">
                <StagingNote />
                <Badge tone="kids">Unschool Kids</Badge>
                <h2 className="mt-4 text-2xl md:text-[1.7rem] font-extrabold tracking-tight text-ink">
                  A village where learning feels like play
                </h2>
                <p className="mt-3 text-slate leading-relaxed text-[15px]">
                  Momo, Tara and Bobo guide children from age 2 to Grade 5 through real interactive
                  quests — counting mangoes, ordering stories, meeting the world. Parent-owned and
                  ad-free, always.
                </p>
                <div className="mt-6">
                  <Button href="/kids" variant="kids" className="w-full">Enter Kids World</Button>
                  <p className="mt-3 text-center">
                    <a
                      href="/kids/for-parents"
                      className="text-sm font-semibold text-kids-orange-ink underline underline-offset-4 decoration-kids-orange/50 hover:decoration-kids-orange rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
                    >
                      For parents
                    </a>
                  </p>
                </div>
              </div>
            </article>
          </li>
        </ul>
      </Section>

      {/* KIDS SAMPLER — the JFT sampler lives in the hero; each product sampled once. */}
      <Section className="!py-14 md:!py-20">
        <SectionHeading
          align="left"
          eyebrow="Try it now"
          title="A taste of the village"
          sub="A moment from Momo's mango quest — the real interaction, right here. No signup, no paywall, no sales pitch."
        />
        <KidsSampler />
      </Section>

      {/* HOW IT WORKS — horizontal loop rail; spine fills on scroll (CSS view-timeline, zero JS). */}
      <Section className="bg-paper border-y border-border !py-14 md:!py-20">
        <SectionHeading
          align="left"
          eyebrow="Method"
          title="One honest loop, every age"
          sub="The same learning rhythm for a 30-year-old exam candidate and a 4-year-old counter: try, get feedback, try smarter."
        />
        <ol className="relative mt-6 grid gap-10 md:grid-cols-4 md:gap-6 list-none p-0 m-0">
          <div aria-hidden className="hidden md:block absolute top-[6px] left-0 right-0 h-px bg-border">
            <div className="loop-fill-x absolute inset-0 bg-academy-teal" />
          </div>
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className="step-reveal relative md:pt-10"
              style={{ animationDelay: `${[0, 52, 91, 143][i]}ms` }}
            >
              <span
                aria-hidden
                className="hidden md:block absolute top-0 left-0 h-[13px] w-[13px] rounded-full border-2 border-academy-teal bg-paper"
              />
              <p aria-hidden className="font-mono text-xs font-bold tracking-[0.2em] text-academy-teal-dark">
                {s.n}
              </p>
              <h3 className="mt-2 text-xl font-bold text-ink">
                <span className="sr-only">Step {i + 1} of 4: </span>{s.title}
              </h3>
              <p className="mt-2 text-slate leading-relaxed text-[15px]">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button href="/how-it-works" variant="secondary">Read the full method</Button>
        </div>
      </Section>

      {/* REVIEW STANDARDS — the gradient quote card is gone; a light editorial pull-quote carries the claim. */}
      <Section className="!py-14 md:!py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Review standards"
              title="Every answer has a source. Every claim has a reviewer."
              sub="Our practice content passes a real pipeline — drafting, fact and language checks, subject-expert review, accessibility check, QA — before it reaches you. Drafts never ship as live content, and reviewers never grade their own work."
            />
            <ul className="mt-8 space-y-4 text-slate">
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>JFT facts verified against the Japan Foundation&apos;s official JFT-Basic pages</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Original questions only — never scraped past papers or question dumps</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Every kids quest passes educator review before it joins the full library — the sampler on this page is a draft, still in staged review</span>
              </li>
              <li className="flex gap-3">
                <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 bg-academy-teal" />
                <span>Versioned content — improving a question never rewrites your past results</span>
              </li>
            </ul>
          </div>
          <figure className="border-l-2 border-academy-teal pl-6 md:pl-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate mb-4">Our defining claim</p>
            <blockquote className="font-display italic text-2xl md:text-[2rem] leading-snug text-ink text-balance">
              &ldquo;Unschool Academy helps you learn by doing — focused exam practice for adult learners,
              imaginative real learning for young children.&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-slate">
              Pilot status: JFT-Basic diagnostic live. Paid paths and Kids quests in staged review.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* PRICING TEASER — editorial spec rows, not three identical cards.
          Prices are illustrative while checkout is in staged testing. */}
      <Section className="!pt-0 !pb-14 md:!pb-20">
        <div className="grid lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Pricing"
              title="Start free. Pay only for depth."
              sub="The diagnostic and sample quests are free forever — no trial clock, no card required. Paid plans are finite, clearly scoped, and easy to cancel."
            />
            <p className="mt-4 text-sm text-slate leading-relaxed border-l-2 border-academy-teal/60 pl-4">
              Prices here are illustrative — checkout is in staged testing, so nothing on this page
              takes your money yet.
            </p>
            <div className="mt-6">
              <Button href="/pricing" variant="secondary">Compare all plans</Button>
            </div>
          </div>
          <ul className="lg:col-span-4 divide-y divide-border border-y border-border list-none p-0 m-0 self-start">
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">Free</h3>
                <p className="mt-1 text-sm text-slate">JFT diagnostic + sample quests, forever.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹0
              </p>
            </li>
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">JFT-Basic 60-day pass</h3>
                <p className="mt-1 text-sm text-slate">Full practice path + timed mocks. Pilot pricing.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹699
              </p>
            </li>
            <li className="py-6 flex items-baseline justify-between gap-6">
              <div>
                <h3 className="text-lg font-bold text-ink">Kids family</h3>
                <p className="mt-1 text-sm text-slate">All quests, parent dashboard — or ₹399 one-time founding access.</p>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink shrink-0">
                <span className="sr-only">Price: </span>₹249<span className="text-base font-semibold text-slate">/mo</span>
              </p>
            </li>
          </ul>
        </div>
      </Section>

      {/* METHOD — the learning architecture, promoted on-site */}
      <Section className="!pt-0 !pb-14 md:!pb-20">
        <SectionHeading
          eyebrow="The Unschool Method"
          title="A path, not a pile."
          sub="506 exams. 500 books. One architecture: hierarchy → loop → levels. Here's how learning actually works here."
        />
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-paper p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-academy-teal-dark">Structure</p>
            <p className="mt-2 text-xl font-extrabold text-ink">Exam → skill → level</p>
            <p className="mt-2 text-slate text-sm leading-relaxed">
              Every exam breaks into subjects, parts, skills and four levels — L1 Foundation to L4 Exam mastery.
              You never face "10,000 questions." You face your next 10.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-paper p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-academy-teal-dark">Loop</p>
            <p className="mt-2 text-xl font-extrabold text-ink">Diagnose → master → prove</p>
            <p className="mt-2 text-slate text-sm leading-relaxed">
              A 7-step loop: diagnose your level, learn, practice, understand every mistake,
              retain with spaced repetition, master the skill, prove it in mocks.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-paper p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-academy-teal-dark">Kids</p>
            <p className="mt-2 text-xl font-extrabold text-ink">500 books → quests</p>
            <p className="mt-2 text-slate text-sm leading-relaxed">
              From age 5: Momo, Tara and Bobo turn beloved stories into quests across 5 subjects.
              Adaptive, no fail states, 15 minutes then off-screen play.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button href="/how-it-works" size="lg" variant="primary">See the full method</Button>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="!pt-0">
        <div className="max-w-3xl">
          <SectionHeading align="left" eyebrow="Questions" title="Asked often, answered honestly" />
          <FAQAccordion items={FAQS} idPrefix="home-faq" />
          <p className="mt-6 text-[15px] text-slate">
            Still curious?{" "}
            <a
              href="/faq"
              className="font-semibold text-academy-blue underline underline-offset-4 decoration-academy-blue/40 hover:decoration-academy-blue rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
            >
              Read the full FAQ
            </a>
            .
          </p>
        </div>
      </Section>

      {/* Structured data: honest only — no Course/Product/Offer (prices are staged/illustrative). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
