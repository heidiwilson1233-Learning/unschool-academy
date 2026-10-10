import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, H2, P } from "@/components/legal";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description:
    "Unschool Academy's accessibility statement: keyboard support, captions and reduced-motion settings, known gaps, and how to report a barrier.",
  alternates: { canonical: "/legal/accessibility" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://unschool.academy/" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Accessibility Statement",
      item: "https://unschool.academy/legal/accessibility",
    },
  ],
};

const FEATURES: { label: string; detail: string }[] = [
  {
    label: "Keyboard",
    detail:
      "Site navigation, practice questions, mock tests, and diagnostic flows all work with a keyboard alone. See the key guide below.",
  },
  {
    label: "Captions and sound",
    detail:
      "Every kids quest can be completed without sound. Narration ships with captions, mute, and replay, and every instruction is also shown as on-screen text and icons.",
  },
  {
    label: "Reduced motion",
    detail:
      "The site respects your device's reduced-motion setting, and kids' quests avoid overstimulating animation.",
  },
  {
    label: "Colour",
    detail:
      "Colour is never the only signal. Correct and incorrect answers, progress, and mastery states are always paired with text or a shape.",
  },
  {
    label: "Drag alternatives",
    detail: "Every drag interaction has a tap or button alternative. No task requires dragging.",
  },
  {
    label: "Focus",
    detail: "Every interactive element shows a visible focus outline when you reach it by keyboard.",
  },
];

const KEYS: { key: string; action: string }[] = [
  { key: "Tab / Shift+Tab", action: "Move forward and backward through everything interactive on the page." },
  { key: "Enter or Space", action: "Activate the focused button, option, or link." },
  { key: "Arrow keys", action: "Move between questions in mock tests and diagnostics." },
  { key: "Escape", action: "Close a dialog, menu, or popup without losing your place." },
];

const GAPS: { label: string; detail: string }[] = [
  {
    label: "Visual-first kids scenes",
    detail:
      "Some kids' story scenes are visual-first by design. They include narration, captions, and tap-choice alternatives, but complex animated sequences can still be hard to follow with a screen reader. If a scene blocks you, contact us through the Accessibility topic and we will send a text workaround.",
  },
  {
    label: "No dated evaluation yet",
    detail:
      "We have not completed a dated independent conformance evaluation. Until one is published, treat this page as our working list, not a certificate. You will not find a conformance badge anywhere on this site: WCAG has no official certification, so a badge would be a false claim.",
  },
];

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement" updated="October 2026 (draft)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <H2>1. Our commitment</H2>
      <P>
        Unschool Academy uses the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA, as the
        target we build toward. This statement is not a conformance claim: we have not completed a
        dated independent audit, so we do not say we fully conform. What follows is an honest list:
        what works today, where the gaps are, and how to reach us.
      </P>
      <H2>2. What works today</H2>
      <P>
        These are the access features live on the site right now, with how to use them. Accessibility
        checks also run inside our content pipeline, before anything is published.
      </P>
      <ul className="not-prose list-none pl-0 m-0 divide-y divide-border border-y border-border">
        {FEATURES.map((f) => (
          <li key={f.label} className="py-4 grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/70 pt-0.5">
              {f.label}
            </span>
            <span className="text-[15px] leading-relaxed text-ink">{f.detail}</span>
          </li>
        ))}
      </ul>
      <h3 className="text-base font-bold text-ink pt-2">Keyboard guide</h3>
      <dl className="not-prose m-0 divide-y divide-border border-y border-border">
        {KEYS.map((k) => (
          <div key={k.key} className="py-3 grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <dt>
              <kbd className="font-mono text-xs border border-border rounded-md px-2 py-1 bg-paper">
                {k.key}
              </kbd>
            </dt>
            <dd className="m-0 text-[15px] leading-relaxed">{k.action}</dd>
          </div>
        ))}
      </dl>
      <H2>3. Known gaps</H2>
      <P>
        Where we know the site falls short, and the workaround available today. This list is updated
        as gaps close.
      </P>
      <ul className="not-prose list-none pl-0 m-0 divide-y divide-border border-y border-border">
        {GAPS.map((g) => (
          <li key={g.label} className="py-4 grid gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/70 pt-0.5">
              {g.label}
            </span>
            <span className="text-[15px] leading-relaxed text-ink">{g.detail}</span>
          </li>
        ))}
      </ul>
      <H2>4. Report a barrier</H2>
      <P>
        Found something you cannot use? Tell us through the{" "}
        <Link href="/contact" className="underline underline-offset-2">
          contact page
        </Link>{" "}
        and choose the Accessibility topic. Describe what you tried, the device and browser you used,
        and what went wrong. We aim to acknowledge every report within 2 business days.
        Accessibility reports go to the top of our fix queue.
      </P>
      <H2>5. Keeping this statement current</H2>
      <P>
        This statement is updated whenever our features change, and it carries its last-updated date
        at the top of the page. The current version is a draft pending legal review.
      </P>
    </LegalPage>
  );
}
