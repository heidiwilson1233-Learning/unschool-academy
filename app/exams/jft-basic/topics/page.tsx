import type { Metadata } from "next";
import Link from "next/link";
import { Section, Breadcrumbs, Button, Callout } from "@/components/ui";
import { PRACTICE_TOPICS, practiceByTopic } from "@/lib/practice";
import { TOPIC_INFO } from "@/lib/exams";

export const metadata: Metadata = {
  title: "JFT-Basic Topics — Practice by Topic",
  description:
    "Free JFT-Basic practice by topic — script and vocabulary, conversation, listening, and reading. Five original draft questions per topic with instant answer checks, one hint per question, and explanations pending review by a Japanese subject-matter expert.",
};

const SLUGS: Record<string, string> = {
  "Script and Vocabulary": "vocabulary",
  "Conversation and Expression": "conversation",
  "Listening Comprehension": "listening",
  "Reading Comprehension": "reading",
};

/* Short verb labels so each row's CTA carries information scent,
   not the same generic "Start practicing" four times. */
const CTA_LABELS: Record<string, string> = {
  "Script and Vocabulary": "Practice vocabulary",
  "Conversation and Expression": "Practice conversation",
  "Listening Comprehension": "Practice listening",
  "Reading Comprehension": "Practice reading",
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Exams", href: "/exams" },
  { label: "JFT-Basic", href: "/exams/jft-basic" },
  { label: "Topics" },
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

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function TopicsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-5">
            JFT-Basic · Topic practice
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02] text-ink text-balance max-w-4xl">
            JFT-Basic practice by topic
          </h1>
          <p className="mt-6 text-lg text-slate leading-relaxed max-w-2xl">
            Five original questions per topic. Check each answer as you go, reveal one hint per
            question, and read the explanation after every attempt. Practice mode checks answers
            immediately — mock tests hold them until the end.
          </p>
        </div>
      </div>

      <Section>
        {/* ---------- Diagnostic routing: closes the "weakest topic first" promise ---------- */}
        <div className="border border-border rounded-xl bg-paper p-6 md:p-8 mb-14 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="md:flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
                Don't know where you're weakest?
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink">
                Take the free 5-minute diagnostic first
              </h2>
              <p className="mt-3 text-slate leading-relaxed">
                Ten original everyday-Japanese questions — about five minutes, no timer, no
                account. It ranks your topics and builds a starter plan, so every practice set
                after it starts at your actual weak spot.
              </p>
            </div>
            <div className="shrink-0">
              <Button href="/exams/jft-basic/diagnostic" size="lg">
                Start the diagnostic <span aria-hidden>→</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ---------- Topic index: hairline-ruled rows, not identical cards ---------- */}
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-academy-teal-dark mb-3">
            The four sections
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink mb-10 md:mb-12">
            Practice each section on its own
          </h2>
        </div>

        <ul className="border-y border-border divide-y divide-border">
          {PRACTICE_TOPICS.map((t, i) => {
            const count = practiceByTopic(t).length;
            return (
              <li key={t}>
                <Link
                  href={`/exams/jft-basic/practice/${SLUGS[t]}`}
                  aria-label={`Practice ${t} — ${count} questions, answers checked as you go`}
                  className="group flex items-center gap-5 md:gap-8 py-6 md:py-7 px-2 md:px-4 -mx-2 md:-mx-4 rounded-xl transition-colors duration-200 ease-signature hover:bg-paper active:scale-[0.995]"
                >
                  <span
                    aria-hidden
                    className="shrink-0 w-12 md:w-16 text-4xl md:text-5xl font-extrabold tabular-nums text-academy-blue/25 select-none"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xl md:text-2xl font-bold text-ink">{t}</span>
                    <span className="block text-slate text-[15px] mt-1 leading-relaxed">
                      {TOPIC_INFO[t]}
                    </span>
                    <span className="block mt-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate font-mono">
                      {count} questions · check as you go · 1 hint per question
                    </span>
                  </span>
                  <span className="shrink-0 hidden sm:inline-flex items-center gap-2 font-semibold text-academy-blue whitespace-nowrap">
                    {CTA_LABELS[t]}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-200 ease-signature group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <Callout title="Draft content — under expert review" tone="warning">
          These questions and their explanations are original drafts, written for practice and
          currently awaiting review by a Japanese subject-matter expert. They are not official
          JFT-Basic items. Want exam conditions instead? Try a{" "}
          <Link
            href="/exams/jft-basic/mock-tests"
            className="font-semibold text-academy-blue hover:underline"
          >
            timed mock test
          </Link>
          .
        </Callout>
      </Section>
    </>
  );
}
