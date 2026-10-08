import type { Metadata } from "next";
import { Section, SectionHeading, Card, Badge, Breadcrumbs, PageHero, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Resources — Guides & Topic Explainers",
  description:
    "Human-reviewed learning resources: JFT-Basic topic guides with original explanations. No scraped content, no filler.",
};

const GUIDES = [
  {
    badge: "JFT-Basic · Vocabulary",
    title: "Station kanji you'll actually use",
    body: "出口 (deguchi, exit), 入口 (iriguchi, entrance), 改札 (kaisatsu, ticket gate), 乗換 (norikae, transfer). These four appear in nearly every everyday-reading set — learn them as pairs of opposites, not isolated characters.",
    status: "Reviewed draft",
  },
  {
    badge: "JFT-Basic · Conversation",
    title: "Leaving work: the phrases that matter",
    body: "お先に失礼します (osaki ni shitsurei shimasu) when you leave before colleagues; おつかれさまでした (otsukaresama deshita) to acknowledge others' work. Mixing these up is the classic beginner tell — our diagnostic tests exactly this.",
    status: "Reviewed draft",
  },
  {
    badge: "JFT-Basic · Listening",
    title: "Catching directions the first time",
    body: "まっすぐ (massugu, straight), 右 (migi, right), 左 (hidari, left), 曲がる (magaru, to turn). Direction sentences follow one pattern: destination + movement + ください. Train your ear on the pattern, not the vocabulary list.",
    status: "Reviewed draft",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Guides worth your time"
        sub="Short, human-reviewed explainers tied to real practice — written by our content team, checked like everything else we publish."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
        <div className="grid md:grid-cols-3 gap-6">
          {GUIDES.map((g) => (
            <Card key={g.title} hover>
              <Badge tone="info">{g.badge}</Badge>
              <h2 className="mt-3 text-xl font-bold text-ink">{g.title}</h2>
              <p className="mt-2 text-slate text-[15px] leading-relaxed">{g.body}</p>
              <p className="mt-4 text-xs font-semibold text-slate">Status: {g.status}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="text-slate mb-4">Want these as interactive practice?</p>
          <Button href="/exams/jft-basic/diagnostic" size="lg">Take the free diagnostic</Button>
        </div>
      </Section>
    </>
  );
}
