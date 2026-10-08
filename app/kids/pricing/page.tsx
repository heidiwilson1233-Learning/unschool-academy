import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Kids Family Plans — Pricing",
  description:
    "Unschool Kids pricing for parents: free sample quests forever, or a family plan with all quests and the parent dashboard. Adult billing only.",
};

export default function KidsPricingPage() {
  return (
    <>
      <PageHero
        eyebrow="For parents only"
        tone="kids"
        title="Family plans, in plain family terms"
        sub="Sample quests are free forever — complete ones, never cut off mid-story. Paid plans add reviewed quests and the parent dashboard."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Kids", href: "/kids" }, { label: "Pricing" }]} />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <h2 className="font-bold text-ink text-lg">Free</h2>
            <p className="text-3xl font-extrabold mt-2">₹0 <span className="text-base font-semibold text-slate">forever</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ One complete quest per age track</li>
              <li>✓ Off-screen activity ideas</li>
              <li>✓ No account needed for samples</li>
            </ul>
            <div className="mt-6"><Button href="/kids/sample/momo-mangoes" variant="secondary" size="sm">Play free quest</Button></div>
          </Card>
          <Card className="!border-2 !border-kids-orange relative">
            <span className="absolute -top-3 left-6 bg-kids-orange text-ink text-xs font-bold px-3 py-1 rounded-full">Pilot</span>
            <h2 className="font-bold text-ink text-lg mt-1">Family monthly</h2>
            <p className="text-3xl font-extrabold mt-2">₹249<span className="text-base font-semibold text-slate">/month</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ All reviewed quests, all tracks</li>
              <li>✓ Parent dashboard + evidence reports</li>
              <li>✓ Multiple child profiles</li>
              <li>✓ Printable activities</li>
              <li>✓ Cancel anytime, no lock-in</li>
            </ul>
            <div className="mt-6"><Button href="/parent/onboarding" variant="kids" size="sm">Start family plan</Button></div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink text-lg">Quest pack</h2>
            <p className="text-3xl font-extrabold mt-2">₹399 <span className="text-base font-semibold text-slate">one-time</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ A curated pack of quests</li>
              <li>✓ Yours forever, no subscription</li>
              <li>✓ Parent dashboard included</li>
            </ul>
            <div className="mt-6"><Button href="/parent/onboarding" variant="secondary" size="sm">Get the pack</Button></div>
          </Card>
        </div>
        <Callout title="Billing is always adult-only" tone="kids">
          Children never see prices, plans, or purchase buttons. Checkout happens on your parent
          account with clear terms, receipts, and one-click cancellation. Billing is in test mode
          during the pilot — no real charges yet.
        </Callout>
      </Section>
    </>
  );
}
