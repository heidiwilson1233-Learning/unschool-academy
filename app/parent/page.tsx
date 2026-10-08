import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Parent Hub",
  description: "The Parent Hub: child profiles, learning evidence, consent and data controls, and billing — for verified parents and guardians.",
};

const PLANNED = [
  ["Child profiles", "Nicknames and avatars, age bands, language preferences. No full names, birthdays, or photos — ever."],
  ["Learning evidence", "What was practised, and whether each quest was independent, hinted, or demonstrated. No scores or labels."],
  ["Consent & privacy", "Review consent, export your family's data, or request deletion — with confirmation and an audit trail."],
  ["Billing", "Family plans and quest packs, receipts, one-click cancellation. Children never see any of this."],
  ["Session controls", "Set gentle session boundaries per child. No streaks, no pressure mechanics."],
];

export default function ParentHubPage() {
  return (
    <>
      <PageHero
        eyebrow="For parents"
        tone="kids"
        title="Parent Hub"
        sub="Everything about your family's learning in one place — controlled by you, visible only to you."
      />
      <Section>
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "Parent Hub" }]} />
          <Callout title="Staged rollout" tone="warning">
            The Parent Hub is in staged rollout. Below are the controls it will provide — nothing
            here pretends to manage a live child profile before the backend ships. Parent accounts
            open with the Kids beta.
          </Callout>
          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {PLANNED.map(([t, b]) => (
              <Card key={t}>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-bold text-ink text-lg">{t}</h2>
                </div>
                <p className="text-slate text-[15px]">{b}</p>
                <p className="mt-3"><Badge tone="neutral">Planned</Badge></p>
              </Card>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/kids/for-parents" variant="kids">Parent guide</Button>
            <Button href="/signup" variant="secondary">Create parent account</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
