import type { Metadata } from "next";
import { Section, SectionHeading, Button, Card, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing — Start Free, Pay Only for Depth",
  description:
    "Unschool Academy pricing: free diagnostics and sample quests forever. Pilot pricing for JFT-Basic passes and Kids family plans.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Pay only for depth."
        sub="Pilot pricing while programs are in review. Every plan states exactly what reviewed content it includes, how long access lasts, and how to cancel."
      />
      <Section>
        <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Pricing" }]} />
        <SectionHeading align="left" eyebrow="Unschool Exams" title="JFT-Basic plans" />
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          <Card>
            <h2 className="font-bold text-ink text-lg">Free</h2>
            <p className="text-3xl font-extrabold mt-2">₹0</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ 10-question diagnostic</li>
              <li>✓ Topic breakdown + explanations</li>
              <li>✓ Forever free, no account needed</li>
            </ul>
            <div className="mt-6"><Button href="/exams/jft-basic/diagnostic" variant="secondary" size="sm">Start free</Button></div>
          </Card>
          <Card className="!border-2 !border-academy-blue relative">
            <span className="absolute -top-3 left-6 bg-academy-blue text-white text-xs font-bold px-3 py-1 rounded-full">Pilot</span>
            <h2 className="font-bold text-ink text-lg mt-1">60-day pass</h2>
            <p className="text-3xl font-extrabold mt-2">₹699</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Full topic practice path</li>
              <li>✓ Timed mock tests</li>
              <li>✓ Study plan + attempt history</li>
              <li>✓ 60 days access · cancel anytime</li>
            </ul>
            <div className="mt-6"><Button href="/signup" size="sm">Get the pass</Button></div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink text-lg">7-day revision</h2>
            <p className="text-3xl font-extrabold mt-2">₹199</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Focused revision pack</li>
              <li>✓ Timed drills</li>
              <li>✓ 7 days access</li>
            </ul>
            <div className="mt-6"><Button href="/signup" variant="secondary" size="sm">Get revision pack</Button></div>
          </Card>
        </div>

        <div className="mt-16">
          <SectionHeading align="left" eyebrow="Unschool Kids" title="Family plans" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          <Card>
            <h2 className="font-bold text-ink text-lg">Free</h2>
            <p className="text-3xl font-extrabold mt-2">₹0</p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Complete sample quest per track</li>
              <li>✓ Off-screen activities</li>
            </ul>
            <div className="mt-6"><Button href="/kids/sample/momo-mangoes" variant="secondary" size="sm">Play free</Button></div>
          </Card>
          <Card className="!border-2 !border-kids-orange relative">
            <span className="absolute -top-3 left-6 bg-kids-orange text-ink text-xs font-bold px-3 py-1 rounded-full">Pilot</span>
            <h2 className="font-bold text-ink text-lg mt-1">Family monthly</h2>
            <p className="text-3xl font-extrabold mt-2">₹249<span className="text-base font-semibold text-slate">/mo</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ All reviewed quests</li>
              <li>✓ Parent dashboard</li>
              <li>✓ Cancel anytime</li>
            </ul>
            <div className="mt-6"><Button href="/kids/pricing" variant="kids" size="sm">See family plans</Button></div>
          </Card>
          <Card>
            <h2 className="font-bold text-ink text-lg">Quest pack</h2>
            <p className="text-3xl font-extrabold mt-2">₹399 <span className="text-base font-semibold text-slate">one-time</span></p>
            <ul className="mt-4 space-y-2 text-sm text-slate">
              <li>✓ Curated quest pack, yours forever</li>
              <li>✓ No subscription</li>
            </ul>
            <div className="mt-6"><Button href="/kids/pricing" variant="secondary" size="sm">See family plans</Button></div>
          </Card>
        </div>

        <Callout title="Honest billing" tone="info">
          Prices are pilot hypotheses, shown in INR (final currency and taxes depend on your country).
          Checkout is in test mode — no real charges while the pilot runs. Refunds follow our{" "}
          <a href="/legal/refunds" className="font-semibold text-academy-blue hover:underline">refund policy</a>.
        </Callout>
      </Section>
    </>
  );
}
