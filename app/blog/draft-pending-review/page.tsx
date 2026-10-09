import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Badge, Button } from "@/components/ui";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

/* Read time: ceil(visible words / 200), recomputed whenever the copy changes.
   Keep app/blog/page.tsx's entry for this post in sync. */
const READ_TIME = "3 min read";

export const metadata: Metadata = {
  title: "What “draft pending review” actually means",
  description:
    "Every Unschool Academy question starts as a draft and earns publication through review. Here's what happens between those two states — and why we label drafts openly.",
  alternates: { canonical: "/blog/draft-pending-review" },
  openGraph: {
    type: "article",
    url: "/blog/draft-pending-review",
    title: "What “draft pending review” actually means",
    description:
      "Every Unschool Academy question starts as a draft and earns publication through review. Here's what happens between those two states — and why we label drafts openly.",
    publishedTime: "2026-10",
  },
  twitter: {
    card: "summary_large_image",
    title: "What “draft pending review” actually means",
    description:
      "The five stages every question travels — and why we label drafts openly instead of hiding them.",
  },
};

const STAGES: { title: string; body: React.ReactNode }[] = [
  {
    title: "Drafted in-house",
    body: (
      <>
        A drafter creates the question for a specific skill — for example, distinguishing{" "}
        <span lang="ja" className="jp">
          お先に失礼します
        </span>{" "}
        from{" "}
        <span lang="ja" className="jp">
          おつかれさまでした
        </span>
        . The draft includes the question, its options, the correct answer, and a full
        explanation. At this point it is a hypothesis: we think this tests what we claim it
        tests.
      </>
    ),
  },
  {
    title: "Fact and language check",
    body: (
      <>
        A second review pass verifies the facts (is this how the phrase is actually used?) and
        the language (is the Japanese natural, is the English clear?). Most drafts change
        here: a distractor that&apos;s accidentally also correct, an explanation that assumes
        too much.
      </>
    ),
  },
  {
    title: "Subject-expert review",
    body: (
      <>
        A qualified reviewer — for JFT-Basic, a Japanese-language expert — will read the item
        cold, as a learner would, before it can leave draft status. They check nuance, register,
        and whether the question genuinely measures the skill. The drafter never approves their
        own work. Items can fail here. When they do, that&apos;s the system working.
      </>
    ),
  },
  {
    title: "Accessibility and QA",
    body: (
      <>
        We check that the question works for everyone: readable contrast, keyboard navigation,
        screen-reader labels, audio transcripts. Then it runs in staging exactly as learners
        will see it.
      </>
    ),
  },
  {
    title: "Published — then monitored",
    body: (
      <>
        Publication isn&apos;t the end. We watch for error reports and confusing explanations,
        and every item carries a version number. That means an improvement never quietly
        rewrites the question you already answered.
      </>
    ),
  },
];

/* Real question from the live practice bank (lib/practice.ts) — rendered exactly
   as learners see it, label included. Never hardcoded content in the template. */
const EXAMPLE = PRACTICE_QUESTIONS.find((q) => q.id === "jft-p01");

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://unschool.academy/blog" },
        {
          "@type": "ListItem",
          position: 3,
          name: "Draft pending review",
          item: "https://unschool.academy/blog/draft-pending-review",
        },
      ],
    },
    {
      "@type": "BlogPosting",
      headline: "What “draft pending review” actually means",
      datePublished: "2026-10",
      inLanguage: "en",
      author: { "@type": "Organization", name: "Unschool Academy content team" },
      publisher: { "@type": "Organization", name: "Unschool Academy" },
      mainEntityOfPage: "https://unschool.academy/blog/draft-pending-review",
    },
  ],
};

export default function DraftReviewPost() {
  return (
    <>
      <style>{`
        .read-progress {
          position: fixed; top: 0; left: 0; z-index: 60;
          width: 100%; height: 3px;
          background: var(--color-academy-teal, #147d75);
          transform-origin: 0 50%; transform: scaleX(0);
          animation: read-progress linear both;
          animation-timeline: scroll();
        }
        @keyframes read-progress { to { transform: scaleX(1); } }
        @supports not (animation-timeline: scroll()) { .read-progress { display: none; } }
        @media (prefers-reduced-motion: reduce) { .read-progress { display: none; } }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div aria-hidden="true" className="read-progress" />

      {/* Authored masthead — breadcrumbs above the h1, type as the hero. */}
      <Section className="pt-10 md:pt-14 pb-2">
        <div className="max-w-3xl mx-auto">
          <Breadcrumbs
            trail={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "Draft pending review" },
            ]}
          />
          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
            Content pipeline · How we build
          </p>
          <h1 className="mt-3 font-display font-bold text-ink tracking-[-0.04em] text-balance text-[clamp(2.75rem,7vw,5rem)] leading-[1.02]">
            What “draft pending review” actually means
          </h1>
          <p className="mt-5 text-slate text-[15px]">
            <time dateTime="2026-10">October 2026</time> · {READ_TIME} ·{" "}
            <span>By the Unschool Academy content team</span>
          </p>
        </div>
      </Section>

      <Section>
        <article className="max-w-3xl mx-auto text-slate leading-relaxed text-[17px]">
          <div className="space-y-5">
            <p>
              You&apos;ll see the label <strong className="text-ink">“draft pending review”</strong>{" "}
              on our practice questions during the pilot. Some sites would hide that. We put it in
              a warning box, because we think you deserve to know exactly where our content
              stands — and because the distance between a draft and a published question is the
              whole reason the published label is worth anything.
            </p>
            <p>
              Here is the journey every question takes. This is the bar every question has to
              clear — during the pilot, the items you see are still on this journey, and the
              label tells you exactly where each one stands.
            </p>
          </div>

          {/* Worked example: the most concrete material sits in the middle of the
              article. A real question from the live bank, shown exactly as learners
              see it — label included. */}
          {EXAMPLE && (
            <section aria-labelledby="specimen-h" className="mt-12">
              <h2 id="specimen-h" className="text-2xl font-bold text-ink">
                A draft, as learners see it
              </h2>
              <div className="mt-4 rounded-xl border border-border bg-canvas p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark">
                    Specimen · live in the practice bank
                  </span>
                  <Badge tone="warning">Draft — pending expert review</Badge>
                </div>
                <p className="mt-4 font-semibold text-ink text-lg leading-snug">
                  <span lang="ja" className="jp">
                    きのう 図書館で 本を 借りました。
                  </span>{" "}
                  Choose the meaning of{" "}
                  <span lang="ja" className="jp">
                    借りました
                  </span>
                  .
                </p>
                <ul className="mt-4 space-y-2">
                  {EXAMPLE.options.map((o) => (
                    <li
                      key={o.id}
                      className="rounded-xl border-2 border-border bg-paper px-4 py-3 flex items-center gap-3"
                    >
                      <span lang="ja" className="jp text-lg font-semibold text-ink">
                        {o.textJp}
                      </span>
                      <span className="text-sm text-slate">“{o.text}”</span>
                    </li>
                  ))}
                </ul>
                <details className="mt-4 group">
                  <summary className="cursor-pointer text-sm font-semibold text-academy-blue hover:underline">
                    See the explanation (the draft&apos;s current version)
                  </summary>
                  <p className="mt-2 text-[15px] text-slate">{EXAMPLE.explanation}</p>
                </details>
              </div>
              <p className="mt-3 text-sm text-slate">
                This is question <span className="font-mono text-[13px]">jft-p01</span> from the
                live practice bank — still on the journey above, shown with its label on. It has
                not had its expert read yet.
              </p>
            </section>
          )}

          {/* The five stages as an ordered journey — list semantics, no identical
              cards. Stage 3 is the trust climax and gets the single visual break. */}
          <ol className="mt-12 border-t border-border">
            {STAGES.map((s, i) => (
              <li
                key={s.title}
                className="py-7 border-b border-border grid grid-cols-[3.5rem_1fr] gap-4"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-sm font-bold text-academy-teal-dark pt-1"
                >
                  0{i + 1}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    {s.title}
                    <span className="sr-only">, stage {i + 1} of 5</span>
                  </h2>
                  <p className="mt-2 text-[16px]">{s.body}</p>
                  {i === 2 && (
                    <blockquote className="mt-4 border-l-2 border-academy-teal pl-4">
                      <p className="font-display italic text-xl text-ink">
                        Items can fail here. When they do, that&apos;s the system working.
                      </p>
                    </blockquote>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 space-y-5">
            <h2 className="text-2xl font-bold text-ink pt-4">Why label the drafts at all?</h2>
            <p>
              Because a draft is still useful. It targets the right skill, and it has a real
              explanation. It just hasn&apos;t survived a hostile expert read yet. Telling you
              that is the difference between a platform that respects your intelligence and one
              that hopes you won&apos;t ask.
            </p>
          </div>

          {/* Honest policy: what the badge does and doesn't promise. */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-ink">How to read the draft label</h2>
            <dl className="mt-4 border-t border-border">
              <div className="py-4 border-b border-border grid md:grid-cols-[12rem_1fr] gap-1 md:gap-4">
                <dt className="text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark pt-1">
                  What the badge says
                </dt>
                <dd className="text-[16px]">Draft — pending expert review.</dd>
              </div>
              <div className="py-4 border-b border-border grid md:grid-cols-[12rem_1fr] gap-1 md:gap-4">
                <dt className="text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark pt-1">
                  What it promises
                </dt>
                <dd className="text-[16px]">
                  The question is original — never copied from an official exam — and it is on
                  the review journey at the stage the label implies.
                </dd>
              </div>
              <div className="py-4 border-b border-border grid md:grid-cols-[12rem_1fr] gap-1 md:gap-4">
                <dt className="text-[11px] font-mono uppercase tracking-[0.2em] text-academy-teal-dark pt-1">
                  What it doesn&apos;t promise
                </dt>
                <dd className="text-[16px]">
                  That an expert has signed it off. Use it as practice, not as a verdict on your
                  readiness.
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-12 space-y-5">
            <h2 className="text-2xl font-bold text-ink pt-4">Spot something off?</h2>
            <p>
              If you ever spot something off in a question, a debatable answer or a confusing
              explanation, tell us through{" "}
              <Link href="/contact" className="text-academy-blue font-semibold hover:underline">
                our contact page
              </Link>
              . Error reports go to the person responsible for that question&apos;s review. When
              a fix lands, the question gets a new version number, noted openly rather than
              fixed silently. If we can&apos;t confirm what you saw, we&apos;ll ask you to show
              us.
            </p>
          </div>

          {/* Discovery: real relationships, editorial rows. */}
          <nav aria-label="Keep reading" className="mt-12">
            <h2 className="text-2xl font-bold text-ink">Keep reading</h2>
            <ul className="mt-4 border-t border-border">
              <li className="border-b border-border">
                <Link href="/exams/jft-basic" className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">01</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      The exam behind the example
                    </span>
                    <span className="block text-[15px]">
                      JFT-Basic: what the test covers and how we structure practice for it.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link href="/free-practice" className="group flex items-baseline gap-4 py-4">
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">02</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      Try draft-labeled practice
                    </span>
                    <span className="block text-[15px]">
                      Free questions with the same draft labels, answered live.
                    </span>
                  </span>
                </Link>
              </li>
              <li className="border-b border-border">
                <Link
                  href="/exams/how-practice-works"
                  className="group flex items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold text-academy-teal-dark">03</span>
                  <span>
                    <span className="block font-bold text-ink group-hover:underline">
                      How practice is designed here
                    </span>
                    <span className="block text-[15px]">
                      Retrieval, feedback, and why a sample question teaches.
                    </span>
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
        </article>
      </Section>

      {/* Frictionless close: the product sells itself before any account. */}
      <Section>
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-paper p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-ink">See a draft label in the wild</h2>
            <p className="mt-2 text-slate text-[16px]">
              The fastest way to understand the label is to answer one. Free practice, no
              account, the draft badge on every question.
            </p>
          </div>
          <Button href="/free-practice" className="shrink-0">
            Try free practice
          </Button>
        </div>
      </Section>
    </>
  );
}
