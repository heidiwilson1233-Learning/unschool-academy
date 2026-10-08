import type { Metadata } from "next";
import DiagnosticPlayer from "@/components/diagnostic-player";
import { Breadcrumbs, Callout, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free JFT-Basic Diagnostic — 10 Questions",
  description:
    "Take the free 10-question JFT-Basic diagnostic: original everyday-Japanese questions, instant topic feedback, reviewed explanations. No account needed.",
};

export default function DiagnosticPage() {
  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }, { label: "JFT-Basic", href: "/exams/jft-basic" }, { label: "Free diagnostic" }]} />
          <p className="text-sm font-bold uppercase tracking-widest text-academy-teal mb-3">Free practice</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
            JFT-Basic diagnostic — 10 questions
          </h1>
          <p className="mt-4 text-lg text-slate leading-relaxed max-w-2xl">
            Ten original everyday-Japanese questions across four topics. Answer at your own pace —
            there&apos;s no timer on the diagnostic. Your score is computed on our server and every
            answer comes with a reviewed explanation.
          </p>
          <Callout title="Draft questions, verified exam facts" tone="warning">
            These are original practice questions written for this pilot — still pending review by
            a qualified Japanese-language reviewer. The official exam facts on this site were
            verified against the Japan Foundation&apos;s JFT-Basic pages on 2026-10-08. Your score
            is an unofficial practice measure — it cannot predict an official result.
          </Callout>
        </div>
      </div>
      <Section className="!py-10">
        <div className="max-w-4xl mx-auto">
          <DiagnosticPlayer />
        </div>
      </Section>
    </>
  );
}
