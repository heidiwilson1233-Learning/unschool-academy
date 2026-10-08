import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero, FAQAccordion } from "@/components/ui";

export const metadata: Metadata = {
  title: "For Parents — Safety, Evidence & Controls",
  description:
    "How Unschool Kids protects children: parent-owned accounts, no ads or purchases in child mode, evidence-based progress, and full data controls.",
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
    q: "How do I know if my child is learning?",
    a: "The Parent Hub shows observed evidence: which quests were completed, whether each was solved independently or with hints, and whether the skill transferred to a new example. We never show IQ-style scores, rankings, or developmental labels.",
  },
  {
    q: "Can I delete our data?",
    a: "Yes — export or delete your family's data any time from Parent Hub → Privacy. Deletion is confirmed and audited.",
  },
  {
    q: "Is there AI chatting with my child?",
    a: "No. Characters speak from reviewed, written scripts. There is no open-ended AI chat, no voice recording, and no camera use.",
  },
];

export default function ForParentsPage() {
  return (
    <>
      <PageHero
        eyebrow="For parents"
        tone="kids"
        title="You stay in charge. Always."
        sub="Unschool Kids is designed so a parent can trust it completely: minimal data, no commercial pressure on children, and honest evidence of learning."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "For parents" }]} />
        <SectionHeading
          align="left"
          tone="kids"
          eyebrow="Safety by design"
          title="What child mode never contains"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["No ads", "Zero advertising, sponsored content, or product placement."],
            ["No purchases", "No upsells, no coins, no locked characters. Billing is parent-only."],
            ["No external links", "Children cannot leave the learning world without a parent gate."],
            ["No social features", "No chat, no friends lists, no public profiles, no leaderboards."],
            ["No open AI chat", "Characters use reviewed scripts. No generative conversation."],
            ["No engagement traps", "No streaks, no daily pressure, no infinite feeds, no guilt for leaving."],
          ].map(([t, b]) => (
            <Card key={t} className="!p-5">
              <p className="font-bold text-ink flex items-center gap-2"><span className="text-kids-leaf-deep">✓</span> {t}</p>
              <p className="text-sm text-slate mt-1">{b}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="bg-paper border-y border-border">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <SectionHeading
              align="left"
              tone="kids"
              eyebrow="Evidence, not scores"
              title="See what your child actually did"
              sub="After each quest, the Parent Hub records plain observations — never rankings or developmental claims."
            />
            <ul className="space-y-3 text-slate">
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span> <span><strong className="text-ink">Practised independently</strong> — solved with no help</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span> <span><strong className="text-ink">Used a hint</strong> — which hint level, and what it taught</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span> <span><strong className="text-ink">Needed a demonstration</strong> — Momo showed the way first</span></li>
              <li className="flex gap-3"><span className="font-bold text-kids-leaf-deep">●</span> <span><strong className="text-ink">Transfer observed</strong> — applied the skill to a new example</span></li>
            </ul>
          </div>
          <div>
            <SectionHeading
              align="left"
              tone="kids"
              eyebrow="Your controls"
              title="One hub for everything"
              sub="The Parent Hub is the only place for billing, consent, data, and settings."
            />
            <div className="flex flex-wrap gap-3">
              <Button href="/parent" variant="kids">Open Parent Hub</Button>
              <Button href="/kids/pricing" variant="secondary">Family plans</Button>
            </div>
            <p className="mt-4 text-sm text-slate">
              Accounts, billing and child-profile features are in staged rollout. The hub currently
              shows the planned controls; nothing here pretends to be live before it is.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <SectionHeading tone="kids" eyebrow="Questions" title="Parent FAQ" />
          <FAQAccordion items={FAQS} />
        </div>
      </Section>
    </>
  );
}
