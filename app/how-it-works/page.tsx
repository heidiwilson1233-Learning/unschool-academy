import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs, Button, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "How It Works — The Unschool Academy Method",
  description:
    "Explore, try, learn, see progress: the Unschool Academy learning loop for exam candidates and young children, with honest review standards.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How It Works — The Unschool Academy Method",
    description:
      "Explore, try, learn, see progress: the Unschool Academy learning loop for exam candidates and young children, with honest review standards.",
    type: "website",
    url: "/how-it-works",
  },
  twitter: {
    card: "summary",
    title: "How It Works — The Unschool Academy Method",
    description:
      "The Unschool Academy learning loop: explore, try, learn, see progress. For exam candidates and young children.",
  },
};

const TRAIL = [{ label: "Home", href: "/" }, { label: "How it Works" }];

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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

type Panel = {
  body: string;
  link?: { href: string; text: string };
  cta?: { href: string; text: string };
};

const LOOP: { n: string; title: string; exams: Panel; kids: Panel }[] = [
  {
    n: "01",
    title: "Explore",
    exams: {
      body: "Browse exam programs with a research label where applicable. Read the syllabus summary, the format, and exactly what's included, before you spend anything.",
      link: { href: "/exams", text: "Browse exam programs" },
    },
    kids: {
      body: "Browse age tracks with your child. Read what each track practises and how long quests take. No developmental promises.",
      link: { href: "/kids", text: "Browse age tracks" },
    },
  },
  {
    n: "02",
    title: "Try",
    exams: {
      body: "Take the free 10-question diagnostic. Original practice questions, drafts pending review by a qualified Japanese-language reviewer, with instant topic feedback. No account, no paywall.",
      cta: { href: "/exams/jft-basic/diagnostic", text: "Take the free diagnostic" },
    },
    kids: {
      body: "Play a complete sample quest together. Real interactions with Momo, Tara or Bobo: hints, encouragement, and a gentle ending.",
      cta: { href: "/kids/sample/momo-mangoes", text: "Play a sample quest" },
    },
  },
  {
    n: "03",
    title: "Learn",
    exams: {
      body: "Work a topic-by-topic plan: original practice with explanations pending expert review, then timed mocks under exam conditions.",
      link: { href: "/exams/how-practice-works", text: "How practice works" },
    },
    kids: {
      body: "Work through quests at a pace that suits your child. Every quest has one learning objective and an off-screen activity.",
      link: { href: "/kids/world", text: "Explore the kids world" },
    },
  },
  {
    n: "04",
    title: "See Progress",
    exams: {
      body: "Topic-level scores across every attempt: what improved, what still needs work, what to practise next.",
      link: { href: "/app/exams", text: "See your study dashboard" },
    },
    kids: {
      body: "Parent Hub shows what we observed: what your child did alone, with hints, or with guidance, and whether it transfers to new examples.",
      link: { href: "/kids/for-parents", text: "Read the parent guide" },
    },
  },
];

/* HowTo facts are drawn verbatim from the LOOP copy rendered above:
   no invented durations, costs, or outcomes. */
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Unschool Academy Method",
  description:
    "Candidates move through Explore, Try, Learn, and See Progress toward JFT-Basic. Parents walk the same loop alongside their child: sample a quest together, learn at home, and watch what stuck.",
  step: LOOP.map((s) => ({
    "@type": "HowToStep",
    name: s.title,
    text: `For exam candidates: ${s.exams.body} For parents and kids: ${s.kids.body}`,
  })),
};

const REVEAL_DELAYS = ["0ms", "90ms", "160ms", "230ms"];

function StepLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/* ---------- Editorial hero: type carries it, ambient light + grain behind it ---------- */}
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-28 left-[-6%] h-[360px] w-[360px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(49,91,135,0.12), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-14 md:pt-14 md:pb-20">
          <Breadcrumbs trail={TRAIL} />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mt-2 mb-5">
            <span className="sr-only">Explore, try, learn, see progress.</span>
            <span aria-hidden>Explore → Try → Learn → See Progress</span>
          </p>
          <h1 className="text-[clamp(3rem,9vw,7.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-ink text-balance max-w-5xl">
            One honest loop, two rhythms.
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            Candidates move through Explore, Try, Learn, and See Progress toward JFT-Basic.
            Parents walk the same loop alongside their child: sample a quest together, learn
            at home, and watch what stuck. Honest for both.
          </p>
        </div>
      </div>

      {/* ---------- The loop: one scroll-driven narrative, audience-split step bands ---------- */}
      <section aria-labelledby="loop-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            The loop
          </p>
          <h2
            id="loop-heading"
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            Four steps, walked in order. Then again.
          </h2>
          <p className="mt-4 text-lg text-slate max-w-2xl leading-relaxed">
            Each step is something you do, not something you read about. Scroll to walk the loop.
          </p>

          <ol className="relative mt-12 md:mt-16">
            {/* Spine: hairline track fills with teal as the loop scrolls through view */}
            <div
              aria-hidden
              className="absolute top-3 bottom-3 left-4 md:left-6 w-px bg-border"
            >
              <div className="loop-fill absolute inset-0 bg-academy-teal" />
            </div>

            {LOOP.map((s, i) => (
              <li
                key={s.n}
                className="step-reveal relative pl-12 md:pl-20 pb-14 md:pb-20 last:pb-0"
                style={{ animationDelay: REVEAL_DELAYS[i] }}
              >
                <span
                  aria-hidden
                  className="absolute left-[9px] md:left-[17px] top-1.5 h-4 w-4 rounded-full bg-paper border-2 border-academy-teal"
                />
                <div className="flex items-baseline gap-4 md:gap-5">
                  <span
                    aria-hidden
                    className="text-5xl md:text-6xl font-extrabold tracking-[-0.03em] text-ink leading-none"
                  >
                    {s.n}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                    {s.title}
                  </h3>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-12">
                  {/* Exams register: institutional editorial — hairline rules, mono labels, no cards */}
                  <div className={i % 2 ? "md:col-span-7 md:order-2" : "md:col-span-7"}>
                    <div className="border-t-2 border-ink pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-academy-teal-dark mb-3">
                        For exam candidates
                      </h4>
                      <p className="text-slate text-base leading-relaxed max-w-prose">
                        {s.exams.body}
                      </p>
                      <div className="mt-4">
                        {s.exams.cta ? (
                          <Button href={s.exams.cta.href} size="md">
                            {s.exams.cta.text}
                          </Button>
                        ) : (
                          s.exams.link && (
                            <StepLink href={s.exams.link.href}>{s.exams.link.text}</StepLink>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Kids register: tactile Duolingo register — cream ground, chunky edges */}
                  <div className={i % 2 ? "md:col-span-5 md:order-1" : "md:col-span-5"}>
                    <div className="bg-kids-cream border-2 border-b-4 border-kids-orange/40 rounded-2xl p-5 md:p-6">
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-kids-orange-ink mb-3">
                        For parents and kids
                      </h4>
                      <p className="text-ink/80 text-[15px] leading-relaxed">{s.kids.body}</p>
                      <div className="mt-4">
                        {s.kids.cta ? (
                          <Button href={s.kids.cta.href} size="md" variant="kids">
                            {s.kids.cta.text}
                          </Button>
                        ) : (
                          s.kids.link && (
                            <StepLink href={s.kids.link.href}>{s.kids.link.text}</StepLink>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Review standards: the MD-mandated trust section ---------- */}
      <section aria-labelledby="standards-heading" className="border-t border-border bg-paper">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-4">
            Review standards
          </p>
          <h2
            id="standards-heading"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance max-w-3xl"
          >
            How we review content
          </h2>
          <p className="mt-4 text-lg text-slate max-w-2xl leading-relaxed">
            The loop only works if you can trust what each step contains. These are the rules
            we hold ourselves to.
          </p>

          <ul className="mt-10 divide-y divide-border border-y border-border">
            <li className="py-6 md:py-7 grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="font-bold text-ink text-lg">
                  Original work, reviewed before it ships
                </h3>
                <div className="mt-2">
                  <Badge tone="warning">Draft — pending expert review</Badge>
                </div>
              </div>
              <p className="md:col-span-8 text-slate leading-relaxed">
                Every exam question is written for this site. Nothing is copied, and nothing is
                presented as official or past-paper material. Explanations stay labeled draft
                until a qualified reviewer signs them off.
              </p>
            </li>
            <li className="py-6 md:py-7 grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="font-bold text-ink text-lg">Pilot labels stay on</h3>
                <div className="mt-2">
                  <Badge tone="info">Pilot content labeled</Badge>
                </div>
              </div>
              <p className="md:col-span-8 text-slate leading-relaxed">
                Anything unfinished carries its label. Exam catalog entries that are still
                research are marked as research, and kids quests that are not built yet are
                listed as coming soon. Nothing unfinished is ever sold as available.
              </p>
            </li>
            <li className="py-6 md:py-7 grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="font-bold text-ink text-lg">
                  What practice scores cannot tell you
                </h3>
                <div className="mt-2">
                  <Badge tone="neutral">No predictions, no promises</Badge>
                </div>
              </div>
              <p className="md:col-span-8 text-slate leading-relaxed">
                A practice score measures today&apos;s attempts, not exam-day results. We never
                predict official scores, and for kids we make no developmental promises.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- Closing: walk one step of it ---------- */}
      <section aria-labelledby="next-heading" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20 flex flex-col md:flex-row md:items-center gap-6 md:justify-between">
          <div>
            <h2
              id="next-heading"
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink text-balance"
            >
              Start where you are.
            </h2>
            <p className="mt-2 text-slate">
              The fastest way to understand the loop is to walk one step of it.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <StepLink href="/exams/jft-basic/diagnostic">Take the free diagnostic</StepLink>
            <StepLink href="/kids/sample/momo-mangoes">Play a sample quest</StepLink>
          </div>
        </div>
      </section>
    </>
  );
}
