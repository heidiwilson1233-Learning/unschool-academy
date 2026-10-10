import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  MousePointerClick,
  ArrowDownUp,
  ListOrdered,
  Divide,
  Map as MapIcon,
  Play,
  ShieldCheck,
} from "lucide-react";
import { Section, SectionHeading, Button, Badge, Breadcrumbs, Callout } from "@/components/ui";
import { KID_SUBJECTS, AGE_TRACKS } from "@/lib/kids";
import { QUEST_TEMPLATES } from "@/lib/quest-engine";

export const metadata: Metadata = {
  title: "The 15-Quest Prototype Plan | Unschool Kids",
  description:
    "Four reusable templates, then fifteen prototype briefs across four age tracks. Nothing playable before a human educator reviews it.",
  alternates: { canonical: "/kids/roadmap" },
  openGraph: {
    title: "The 15-Quest Prototype Plan | Unschool Kids",
    description:
      "Four reusable templates, fifteen prototype briefs, zero playable before educator review.",
    type: "website",
    url: "https://unschool.academy/kids/roadmap",
  },
  twitter: {
    card: "summary",
    title: "The 15-Quest Prototype Plan | Unschool Kids",
    description:
      "Four reusable templates, fifteen prototype briefs, zero playable before educator review.",
  },
};

const TRAIL = [
  { label: "Home", href: "/" },
  { label: "Kids", href: "/kids" },
  { label: "Prototype plan" },
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

type Brief = {
  id: string;
  source_k: string;
  title: string;
  subject: string;
  character: "momo" | "tara" | "bobo";
  template: string;
  objective: string;
  competency_evidence: string;
  acceptance: string;
  status: string;
  priority?: string;
};

type PlanTrack = { slug: string; prototype_count: number; briefs: Brief[] };

type Plan = {
  version: number;
  release: string;
  note: string;
  no_false_demo: string;
  status_legend: { status: string; meaning: string }[];
  templates: { id: string; name: string; note: string; wave: number }[];
  tracks: PlanTrack[];
  retired: { note: string; quests: string[] };
  wave2_candidates: { source_k: string; title: string; gated_by: string }[];
};

function loadPlan(): Plan {
  const p = path.join(process.cwd(), "content", "kids", "prototype-plan.json");
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const CHARACTER_NAMES = { momo: "Momo", tara: "Tara", bobo: "Bobo" } as const;

function subjectName(slug: string): string {
  return KID_SUBJECTS.find((s) => s.slug === slug)?.name ?? slug;
}

function templateName(id: string): string {
  return QUEST_TEMPLATES.find((t) => t.id === id)?.name ?? id;
}

function trackMeta(slug: string) {
  return AGE_TRACKS.find((a) => a.slug === slug);
}

const TEMPLATE_ICONS = {
  "select-objects": MousePointerClick,
  sort: ArrowDownUp,
  sequence: ListOrdered,
  distribute: Divide,
} as const;

const STATUS_STYLES: Record<string, string> = {
  brief: "bg-slate-100 text-slate-700 border-slate-200",
  "authored-draft": "bg-amber-50 text-amber-900 border-amber-200",
  "in-educator-review": "bg-sky-50 text-sky-900 border-sky-200",
  playable: "bg-emerald-50 text-emerald-900 border-emerald-200",
};

const STATUS_BAR: Record<string, string> = {
  brief: "bg-slate-300",
  "authored-draft": "bg-amber-300",
  "in-educator-review": "bg-sky-400",
  playable: "bg-emerald-400",
};

const SAMPLES = [
  {
    href: "/kids/sample/momo-mangoes",
    title: "Momo's Three Mangoes",
    desc: "A complete sample quest with Momo. Count along, one mango at a time.",
  },
  {
    href: "/kids/sample/tara-story",
    title: "Tara's Four-Card Story",
    desc: "A complete sample quest with Tara. Order the picture cards and retell the tale.",
  },
];

export default function KidsRoadmapPage() {
  const plan = loadPlan();
  const allBriefs = plan.tracks.flatMap((t) =>
    t.briefs.map((b) => ({ ...b, trackSlug: t.slug }))
  );
  const countBy = (s: string) => allBriefs.filter((b) => b.status === s).length;
  const shippingFirst = allBriefs.filter((b) => b.priority === "first-wave-playable");

  return (
    <>
      {/* Hero — authored, parent register */}
      <div className="relative overflow-hidden border-b border-kids-orange/20 bg-kids-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: GRAIN }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-kids-orange/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <Breadcrumbs trail={TRAIL} />
          <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-kids-orange-ink">
            The build plan · For parents
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.02em] text-ink text-balance sm:text-5xl md:text-6xl">
            Fifteen quests, built properly.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate">
            Before a single prototype quest ships, we build four reusable templates. Then fifteen
            quests go through them, one brief at a time. Nothing from this plan appears as playable
            before a human educator reviews it.
          </p>
          <dl className="mt-8 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {[
              [String(SAMPLES.length), "playable samples"],
              [String(allBriefs.length), "prototype briefs"],
              [String(countBy("playable")), "playable before review"],
            ].map(([v, label]) => (
              <div key={label} className="flex flex-col bg-white px-3 py-4 sm:px-5">
                <dt className="order-2 mt-1 text-xs leading-snug text-slate">{label}</dt>
                <dd className="order-1 font-display text-3xl font-bold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Pipeline rail — the living plan, read from data */}
      <Section>
        <SectionHeading
          eyebrow="Where the plan stands"
          title="The pipeline, live."
          sub="Every segment below is one prototype brief, read from the plan file this page is built from. When a brief moves state, this rail moves with it."
        />
        <div
          className="flex gap-1"
          role="img"
          aria-label={`${allBriefs.length} prototype briefs: ${countBy("brief")} briefs, ${countBy("authored-draft")} authored drafts, ${countBy("in-educator-review")} in educator review, ${countBy("playable")} playable.`}
        >
          {allBriefs.map((b) => (
            <span
              key={b.id}
              title={`${b.id}: ${b.title} — ${b.status.replace(/-/g, " ")}`}
              className={`h-3 flex-1 rounded-full ${STATUS_BAR[b.status] ?? "bg-slate-300"}`}
            />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
          {countBy("brief")} briefs · {countBy("authored-draft")} authored drafts ·{" "}
          {countBy("in-educator-review")} in educator review · {countBy("playable")} playable
        </p>

        <h3 className="mt-10 font-display text-xl font-bold tracking-tight text-ink">
          Shipping first
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate">
          Four quests are first-wave playable candidates: each will get real interactions, real
          answer states, and educator signoff before anything else goes playable. No dates are
          promised; order and review-gating only.
        </p>
        <ul className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {shippingFirst.map((b) => (
            <li key={b.id} className="bg-white p-5">
              <p className="font-mono text-xs font-bold text-kids-orange-ink">{b.id}</p>
              <p className="mt-1.5 font-bold text-ink">{b.title}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-slate">
                {trackMeta(b.trackSlug)?.name} · {templateName(b.template)}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Status legend — honest states */}
      <Section>
        <SectionHeading
          eyebrow="How to read this page"
          title="Four states. No wishful thinking."
          sub="Every quest below sits in exactly one state. A brief is a plan, not a product."
        />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {plan.status_legend.map((s) => (
            <li key={s.status} className="bg-white p-5">
              <p>
                <span
                  className={`inline-block rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLES[s.status] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}
                >
                  {s.status.replace(/-/g, " ")}
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate">{s.meaning}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* The four templates — bento */}
      <Section>
        <SectionHeading
          eyebrow="Templates first"
          title="Four reusable templates, then the quests."
          sub="One well-built interaction, reused fifteen ways, beats fifteen one-off games. Each template is a contract the quest author and the player both honor. Wave 2 means after the 15-quest prototype: improvements to the templates, not new promises."
        />
        <ul className="grid gap-4 md:grid-cols-6">
          {plan.templates.map((t, i) => {
            const full = QUEST_TEMPLATES.find((q) => q.id === t.id);
            const Icon = TEMPLATE_ICONS[t.id as keyof typeof TEMPLATE_ICONS] ?? MousePointerClick;
            return (
              <li
                key={t.id}
                className={`rounded-2xl border border-line bg-white p-6 ${i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2" : "md:col-span-3"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs font-bold text-kids-orange-ink">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <Icon aria-hidden className="h-5 w-5 text-kids-orange-ink" />
                </div>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">{t.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{full?.blurb}</p>
                <p className="mt-4 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-slate">
                  <span className="font-bold uppercase tracking-[0.08em]">What every quest must include: </span>
                  {full?.contract}
                </p>
                <p className="mt-2 text-xs text-slate">{t.note}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* The fifteen, by track */}
      <Section>
        <SectionHeading
          eyebrow="The prototype release"
          title="Fifteen briefs across four age tracks."
          sub="Adapted from the blueprint's quest inventory to the four-track structure. Each row shows what you will actually see your child do — that is the evidence, not the promise."
        />
        <div className="space-y-10">
          {plan.tracks.map((track) => {
            const meta = trackMeta(track.slug);
            return (
              <section key={track.slug} aria-labelledby={`track-${track.slug}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink pb-2">
                  <h3 id={`track-${track.slug}`} className="font-display text-2xl font-bold tracking-tight text-ink">
                    <MapIcon aria-hidden className="mr-2 inline h-5 w-5 text-kids-orange-ink" />
                    {meta?.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-slate">
                    {meta?.audience} · {track.prototype_count} prototypes
                  </p>
                </div>
                <ul className="divide-y divide-line">
                  {track.briefs.map((b) => (
                    <li key={b.id} className="py-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="font-mono text-xs font-bold text-kids-orange-ink">{b.id}</span>
                        <p className="text-base font-bold text-ink">{b.title}</p>
                        {b.priority === "first-wave-playable" && (
                          <Badge tone="kids">First-wave playable candidate</Badge>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate">
                        <span className="font-semibold text-ink">Your child will: </span>
                        {b.competency_evidence.charAt(0).toLowerCase() + b.competency_evidence.slice(1)}
                      </p>
                      <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-slate">
                        {templateName(b.template)} · {subjectName(b.subject)} · {CHARACTER_NAMES[b.character]}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <div className="mt-8">
          <Callout title="Retired, not backlogged">
            {plan.retired.note} The old 2–3 track quests ({plan.retired.quests.join(", ")}) were built for
            toddlers; the academy now starts at age 5.
          </Callout>
        </div>
      </Section>

      {/* What is playable today */}
      <Section>
        <SectionHeading
          eyebrow="No false demos"
          title="What you can actually play today."
          sub="Two complete sample quests, playable now and still awaiting educator signoff. Everything else on this page is a brief, and it says so."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {SAMPLES.map((s) => (
            <div key={s.href} className="rounded-2xl border-2 border-b-4 border-line bg-white p-6">
              <Play aria-hidden className="h-6 w-6 text-kids-orange-ink" />
              <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{s.desc}</p>
              <Button href={s.href} variant="kids" className="mt-4">
                Play {s.title}
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Review pipeline — full-bleed trust band */}
      <div className="relative overflow-hidden border-y border-kids-orange/20 bg-kids-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.25]"
          style={{ backgroundImage: GRAIN }}
        />
        <Section className="relative">
          <div className="flex items-start gap-4">
            <ShieldCheck aria-hidden className="mt-1 h-6 w-6 shrink-0 text-academy-teal" />
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Reviewed means reviewed.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate">
                A quest becomes playable only after real interactions, real answer states, and a named
                human educator&apos;s signoff. Until then it ships as a draft, labelled
                draft-pending-educator-review, and the build itself refuses to publish it. That rule
                is not a policy document. It is code: <span className="font-mono text-[13px]">scripts/validate-kids-quests.mjs</span> runs
                on every build.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/kids/for-parents" variant="secondary">
                  Read the parent charter
                </Button>
                <Button href="/kids/library" variant="secondary">
                  Browse the book library
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* Founding CTA — the buyer path */}
      <Section>
        <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-kids-orange-ink">
                Follow the build
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                Become a founding family.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate">
                Lock in founding pricing while the library grows from briefs to playable quests.
                Pilot pricing · no real charges yet.
              </p>
            </div>
            <Button href="/kids/pricing" variant="kids" size="lg">
              See founding plans
            </Button>
          </div>
        </div>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
