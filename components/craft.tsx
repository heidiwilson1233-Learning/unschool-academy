import type { ReactNode } from "react";
/**
 * Craft kit — the hand-made visual language for Unschool Academy.
 *
 * Run 69 (portal_queue[16] GRAPHICAL-OVERHAUL; user directive 2026-10-11):
 * the whole site must feel hand-crafted by a human designer — graphical,
 * tactile, rich — and NEVER AI-generated. Every piece here is pure SVG/CSS:
 * hand-drawn underlines/arrows/circles, rubber stamps, washi tape, torn
 * paper edges, paper grain, handwritten marginalia. Zero images, zero JS,
 * zero AI. Server components only.
 *
 * Honesty rule: stamps and marginalia are always aria-hidden duplicates of
 * adjacent real copy — they decorate claims, never make new ones.
 */

type Tone = "teal" | "rust" | "amber";

const STAMP_INK: Record<Tone, string> = {
  teal: "#0f615b",
  rust: "#b23a2e",
  amber: "#8a5418",
};

/* ------------------------------------------------------------------ */
/* Hand-drawn wobbly underline for display type. The double stroke    */
/* (one bold pass + one faint sketch pass) is what reads hand-drawn   */
/* instead of vector-perfect.                                         */
/* ------------------------------------------------------------------ */
export function HandUnderline({
  children,
  className = "",
  color = "#147d75",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 14"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.06em] left-0 h-[0.22em] w-full"
      >
        <path
          d="M4 9 C 40 5, 80 11, 120 8 S 190 6, 216 9"
          fill="none"
          stroke={color}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M10 11.5 C 55 8, 105 12.5, 150 9.5 S 195 9, 212 10.5"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hand-drawn rough ellipse — circles a word like a teacher's red pen. */
/* ------------------------------------------------------------------ */
export function HandCircle({
  children,
  className = "",
  color = "#b23a2e",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span className={`relative inline-block px-[0.1em] ${className}`}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 220 110"
        preserveAspectRatio="none"
        className="absolute -inset-x-[0.06em] -inset-y-[0.16em] h-[calc(100%+0.32em)] w-[calc(100%+0.12em)]"
      >
        <path
          d="M112 8 C 162 6, 206 22, 210 52 C 214 84, 164 102, 110 103 C 56 104, 12 88, 9 55 C 6 24, 60 8, 114 7"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M108 13 C 150 12, 190 24, 200 50"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hand-drawn curved arrow (decorative). Points down-right; flip to   */
/* mirror. Double stroke for the sketch feel.                         */
/* ------------------------------------------------------------------ */
export function HandArrow({
  className = "",
  flip = false,
  color = "#147d75",
}: {
  className?: string;
  flip?: boolean;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 90"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M12 10 C 48 12, 84 26, 100 64"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M100 64 L 83 58 M100 64 L 95 45"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M18 16 C 52 18, 82 30, 95 58"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Rubber stamp. Always aria-hidden: the stamped words must already   */
/* exist as real text nearby (honesty rule — stamps decorate claims). */
/* Double ring via border + negative-offset outline works on any bg.   */
/* ------------------------------------------------------------------ */
export function Stamp({
  children,
  tone = "teal",
  tilt = -6,
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`craft-stamp ${className}`}
      style={{ color: STAMP_INK[tone], transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Washi tape strip (decorative). Torn left/right edges via jagged    */
/* clip-path; translucent with a faint diagonal weave. Absolutely      */
/* positioned by the caller.                                          */
/* ------------------------------------------------------------------ */
export function WashiTape({
  tone = "teal",
  tilt = -4,
  className = "",
}: {
  tone?: Tone | "paper";
  tilt?: number;
  className?: string;
}) {
  const bg: Record<string, string> = {
    teal: "rgba(20,125,117,0.55)",
    rust: "rgba(178,58,46,0.5)",
    amber: "rgba(242,166,108,0.65)",
    paper: "rgba(233,226,210,0.8)",
  };
  return (
    <span
      aria-hidden="true"
      className={`washi-tape ${className}`}
      style={{ ["--tape" as string]: bg[tone], transform: `rotate(${tilt}deg)` }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Handwritten marginalia (decorative duplicate of nearby copy).      */
/* ------------------------------------------------------------------ */
export function Marginalia({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p aria-hidden="true" className={`font-hand text-academy-blue ${className}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Torn paper edge — a full-bleed divider. Deterministic jagged path  */
/* (no Math.random: SSR-stable). Fill via text color on the wrapper.  */
/* ------------------------------------------------------------------ */
export function TornEdge({ className = "" }: { className?: string }) {
  // Deterministic tear: layered sines give a natural uneven edge.
  const pts: string[] = ["M0 30 L0 16"];
  const N = 24;
  for (let i = 1; i <= N; i++) {
    const x = Math.round((1440 / N) * i);
    const y = Math.round(14 + 7 * Math.sin(i * 2.39) + 4 * Math.cos(i * 1.71));
    pts.push(`L${x} ${y}`);
  }
  pts.push("L1440 30 Z");
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 30"
      preserveAspectRatio="none"
      className={`block h-[22px] w-full ${className}`}
    >
      <path d={pts.join(" ")} fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Taped paper card — the collage atom. Warm paper, hairline border,  */
/* paper-like shadow, faint grain. Slight rotate via tilt.            */
/* ------------------------------------------------------------------ */
export function PaperCard({
  children,
  tilt = 0,
  className = "",
}: {
  children: ReactNode;
  tilt?: number;
  className?: string;
}) {
  return (
    <div
      className={`craft-paper-card ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Zero-JS collapsible for the mobile-compact rule: long desktop      */
/* sections collapse into a tap target on small screens (paired with  */
/* a `hidden md:*` desktop layout — never both visible at once).      */
/* ------------------------------------------------------------------ */
export function CraftDetails({
  summary,
  children,
  className = "",
  open = false,
}: {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  /** Render expanded on first paint (mobile conversion content, A P1-3). */
  open?: boolean;
}) {
  return (
    <details className={`craft-details group ${className}`} open={open || undefined}>
      <summary className="craft-details-summary">
        <span className="text-[15px] font-bold text-ink">{summary}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="h-4 w-4 shrink-0 text-academy-teal-dark transition-transform duration-200 motion-reduce:transition-none group-open:rotate-45"
        >
          <path
            d="M8 2v12M2 8h12"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </summary>
      <div className="craft-details-body">{children}</div>
    </details>
  );
}
