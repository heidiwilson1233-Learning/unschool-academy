import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/ui";
import CertificateClient from "@/components/certificate-client";

export const metadata: Metadata = {
  title: "My practice credentials",
  description:
    "Claim your named, verifiable JFT-Basic practice credentials — free, from the milestones you have already completed.",
  // Learner-app surface: noindex (defense in depth over the /app layout rule).
  robots: { index: false, follow: false },
};

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function CertificatePage() {
  return (
    <>
      <div className="relative overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-36 right-[-8%] h-[440px] w-[440px] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(20,125,117,0.10), transparent)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: GRAIN }}
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pt-14 md:pb-14">
          <Breadcrumbs
            trail={[{ label: "Home", href: "/" }, { label: "My progress", href: "/app/exams" }, { label: "Practice credentials" }]}
          />
          <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-slate">
            Practice records
          </p>
          <h1 className="mt-2 font-display font-bold tracking-[-0.03em] text-ink text-balance"
            style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)" }}
          >
            Proof of the work you put in.
          </h1>
          <p className="mt-4 text-slate leading-relaxed max-w-2xl">
            Finish the free diagnostic or the full timed mock, then turn it into
            a named credential with a verification link anyone can check. Free, effort-based,
            and honest about what it is.
          </p>
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <Suspense>
          <CertificateClient />
        </Suspense>
      </main>
    </>
  );
}
