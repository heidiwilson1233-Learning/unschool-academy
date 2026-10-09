import type { Metadata } from "next";
import { Section, Badge, Breadcrumbs, Button } from "@/components/ui";
import { Art } from "@/components/site-art";

export const metadata: Metadata = {
  title: "Resources — Guides & Topic Explainers",
  description:
    "JFT-Basic study guides: original sample explanations built around real question patterns. Drafts labeled until a qualified reviewer signs them off.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources — Guides & Topic Explainers",
    description:
      "JFT-Basic study guides: original sample explanations built around real question patterns. Drafts labeled until a qualified reviewer signs them off.",
    type: "website",
    url: "/resources",
  },
  twitter: {
    card: "summary",
    title: "Resources — Guides & Topic Explainers",
    description:
      "JFT-Basic topic guides: original draft explanations, honestly labeled until expert review.",
  },
};

const TRAIL = [{ label: "Home", href: "/" }, { label: "Resources" }];

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

const DRAFT_BADGE = (
  <Badge tone="warning">Draft — pending expert review</Badge>
);

function PracticeLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1 font-semibold text-academy-blue underline decoration-academy-blue/40 underline-offset-4 hover:decoration-academy-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-academy-teal rounded-sm"
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-semibold text-academy-blue underline decoration-academy-blue/40 underline-offset-2 hover:decoration-academy-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded-sm"
    >
      {children}
    </a>
  );
}

export default function ResourcesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* ---------- Editorial hero: type carries it, ambient light + grain ---------- */}
      <section className="relative overflow-hidden border-b border-border bg-canvas">
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
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-16">
          <Breadcrumbs trail={TRAIL} />
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
                Resources
              </p>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.75rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink text-balance">
                Study guides that teach the pattern
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">
                Sample explanations for JFT-Basic topics, each built around a pattern
                you will meet in real questions. Every guide is an original draft,
                clearly labeled until a qualified reviewer approves it.
              </p>
            </div>
            <Art
              src="/img/resources.webp"
              alt="Open notebooks, sticky notes, headphones and a fountain pen arranged on cream paper in morning light"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ---------- Guide index: bento, the first guide rendered as the guide itself ---------- */}
      <Section>
        <div className="mb-8 md:mb-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-academy-teal-dark">
            Sample guides · JFT-Basic
          </p>
          <h2
            id="guides-heading"
            className="mt-3 max-w-2xl text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance"
          >
            Three drafts, exactly as they are.
          </h2>
        </div>

        <ul aria-labelledby="guides-heading" className="grid md:grid-cols-6 gap-5">
          {/* Guide 1: full-bleed worked-explanation cell — the proof, not a description of it */}
          <li className="md:col-span-6 guide-reveal">
            <article className="bg-paper border border-border rounded-2xl p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="info">JFT-Basic · Vocabulary</Badge>
                {DRAFT_BADGE}
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-ink text-balance">
                Station kanji you&apos;ll actually use
              </h3>
              <div className="mt-6 grid md:grid-cols-6 gap-6 md:gap-8">
                <ul
                  aria-label="Kanji pairs learned as opposites"
                  className="md:col-span-4 divide-y divide-border border-y border-border"
                >
                  <li className="py-4 flex items-center justify-between gap-4">
                    <span className="text-xl md:text-2xl text-ink">
                      <ruby lang="ja" className="jp">
                        出口<rt>でぐち</rt>
                      </ruby>{" "}
                      <span className="text-base text-slate">(deguchi, exit)</span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-slate">
                      ↔
                    </span>
                    <span className="sr-only">pairs with</span>
                    <span className="text-xl md:text-2xl text-ink text-right">
                      <ruby lang="ja" className="jp">
                        入口<rt>いりぐち</rt>
                      </ruby>{" "}
                      <span className="text-base text-slate">(iriguchi, entrance)</span>
                    </span>
                  </li>
                  <li className="py-4 flex items-center justify-between gap-4">
                    <span className="text-xl md:text-2xl text-ink">
                      <ruby lang="ja" className="jp">
                        改札<rt>かいさつ</rt>
                      </ruby>{" "}
                      <span className="text-base text-slate">(kaisatsu, ticket gate)</span>
                    </span>
                    <span aria-hidden="true" className="text-xl text-slate">
                      ↔
                    </span>
                    <span className="sr-only">pairs with</span>
                    <span className="text-xl md:text-2xl text-ink text-right">
                      <ruby lang="ja" className="jp">
                        乗換<rt>のりかえ</rt>
                      </ruby>{" "}
                      <span className="text-base text-slate">(norikae, transfer)</span>
                    </span>
                  </li>
                </ul>
                <div className="md:col-span-2 md:border-l md:border-border md:pl-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                    The pattern
                  </p>
                  <p className="mt-2 text-lg italic leading-relaxed text-ink">
                    One memory hook for four kanji: exit pairs with entrance,
                    gate pairs with transfer.
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-slate">
                These four appear in nearly every everyday-reading set. Learn
                them as pairs of opposites, not isolated characters.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                  Script &amp; Vocabulary · 2 min read
                </p>
                <PracticeLink href="/exams/jft-basic/practice/vocabulary">
                  Practice vocabulary
                </PracticeLink>
              </div>
            </article>
          </li>

          {/* Guide 2 */}
          <li className="md:col-span-3 guide-reveal">
            <article className="h-full flex flex-col bg-paper border border-border rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">JFT-Basic · Conversation</Badge>
                {DRAFT_BADGE}
              </div>
              <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink text-balance">
                Leaving work: the phrases that matter
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate">
                <span lang="ja" className="jp text-ink">
                  お先に失礼します
                </span>{" "}
                (osaki ni shitsurei shimasu) when you leave before colleagues;{" "}
                <span lang="ja" className="jp text-ink">
                  おつかれさまでした
                </span>{" "}
                (otsukaresama deshita) to acknowledge others&apos; work. Mixing
                these up is the classic beginner tell, and our{" "}
                <InlineLink href="/exams/jft-basic/diagnostic">
                  diagnostic
                </InlineLink>{" "}
                tests exactly that.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                  Conversation &amp; Expression · 1 min read
                </p>
                <PracticeLink href="/exams/jft-basic/practice/conversation">
                  Practice conversation
                </PracticeLink>
              </div>
            </article>
          </li>

          {/* Guide 3 */}
          <li className="md:col-span-3 guide-reveal">
            <article className="h-full flex flex-col bg-paper border border-border rounded-2xl p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">JFT-Basic · Listening</Badge>
                {DRAFT_BADGE}
              </div>
              <h3 className="mt-4 text-xl font-extrabold tracking-tight text-ink text-balance">
                Catching directions the first time
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate">
                <span lang="ja" className="jp text-ink">
                  まっすぐ
                </span>{" "}
                (massugu, straight),{" "}
                <span lang="ja" className="jp text-ink">
                  右
                </span>{" "}
                (migi, right),{" "}
                <span lang="ja" className="jp text-ink">
                  左
                </span>{" "}
                (hidari, left),{" "}
                <span lang="ja" className="jp text-ink">
                  曲がる
                </span>{" "}
                (magaru, to turn). Direction sentences follow one pattern:
                destination + movement +{" "}
                <span lang="ja" className="jp text-ink">
                  ください
                </span>
                . Train your ear on the pattern, not the vocabulary list.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate">
                  Listening Comprehension · 1 min read
                </p>
                <PracticeLink href="/exams/jft-basic/practice/listening">
                  Practice listening
                </PracticeLink>
              </div>
            </article>
          </li>
        </ul>
      </Section>

      {/* ---------- CTA band: closes the proof → practice loop ---------- */}
      <section className="border-t border-border bg-canvas">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <h2 className="max-w-2xl text-3xl md:text-4xl font-extrabold tracking-tight text-ink text-balance">
            Guides teach the pattern. Practice proves you own it.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate">
            Ten questions, instant topic feedback, no account.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/exams/jft-basic/diagnostic" size="lg">
              Take the free diagnostic
            </Button>
            <Button href="/exams/jft-basic/topics" variant="secondary" size="lg">
              Browse practice topics
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
