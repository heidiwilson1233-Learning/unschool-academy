import type { Metadata } from "next";
import MockPlayer from "@/components/mock-player";
import { Breadcrumbs, Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mock 1 — Timed JFT-Basic Practice",
  description: "Take timed JFT-Basic Mock 1: 20 original questions in 30 minutes.",
  // App screen, not content: noindex (mirrors app/admin/page.tsx).
  robots: { index: false, follow: false },
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function MockTakePage() {
  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 30rem at 15% 0%, rgba(49,91,135,0.10), transparent 60%), radial-gradient(50rem 26rem at 90% 20%, rgba(20,125,117,0.08), transparent 60%)",
          }}
        />
        <div aria-hidden className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: GRAIN }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Breadcrumbs trail={[
            { label: "Home", href: "/" },
            { label: "Exams", href: "/exams" },
            { label: "JFT-Basic", href: "/exams/jft-basic" },
            { label: "Mock tests", href: "/exams/jft-basic/mock-tests" },
            { label: "Mock 1" },
          ]} />
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-academy-teal-dark">Timed mock · JFT-Basic</p>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-[-0.03em] text-ink text-balance">Mock 1 — 20 questions, 30 minutes</h1>
          <Callout title="Before you start" tone="info">
            No pausing once you begin — the timer starts as soon as the questions load and auto-submits at zero.
            Grab a quiet 30 minutes first. No hints, no explanations until you submit.
          </Callout>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <MockPlayer />
      </div>
    </>
  );
}
