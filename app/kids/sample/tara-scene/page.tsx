import type { Metadata } from "next";
import TaraScene from "@/components/kids/tara-scene";

const CANONICAL = "https://unschool-academy-lr98.vercel.app/kids/sample/tara-scene";

export const metadata: Metadata = {
  title: "Demo: Tara Teaches Story Order (Ages 5+) — Unschool Academy",
  description:
    "A working prototype of Tara's scene-led teaching interaction: watch a short story, order the events, and finish together. Demo — not a published quest.",
  robots: { index: false, follow: false },
  alternates: { canonical: CANONICAL },
};

export default function TaraScenePage() {
  return (
    <div className="bg-kids-cream min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-sm text-slate">
            <li>
              <a href="/" className="underline underline-offset-2 hover:text-ink">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/kids" className="underline underline-offset-2 hover:text-ink">
                Kids
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-ink">
              Tara scene demo
            </li>
          </ol>
        </nav>

        <div
          role="note"
          aria-label="Demo prototype notice"
          className="mb-6 rounded-2xl border-2 border-dashed border-kids-orange/60 bg-paper p-5"
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-kids-orange-ink">
            Demo prototype · not published content
          </p>
          <p className="mt-1 text-sm text-slate">
            This page is a working prototype of Tara's scene-led teaching interaction (task UA-009). It is a
            design-and-interaction experiment: not a published quest, not counted in site content, and not
            submitted for educator review.
          </p>
        </div>

        <h1 className="mb-6 text-3xl font-extrabold text-ink md:text-4xl">
          Tara's story game <span className="text-lg font-semibold text-slate">(ages 5+ · words)</span>
        </h1>

        <TaraScene />

        <p className="mt-6 text-xs text-slate">
          SMART_LEARNING: adaptive with no fail states. A grown-up can play along. This demo collects no data.
        </p>
      </div>
    </div>
  );
}
