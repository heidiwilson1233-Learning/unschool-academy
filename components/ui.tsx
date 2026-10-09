"use client";

import Link from "next/link";
import { useState, type ReactNode, type Ref } from "react";
import { Art, StagingNote } from "./site-art";

/* ---------- Buttons ---------- */

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "kids" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ref,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-[color,background-color,border-color,box-shadow,transform] duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg min-h-[56px]",
  };
  const variants = {
    primary: "bg-academy-blue text-white hover:bg-academy-blue-dark shadow-sm hover:shadow",
    secondary: "bg-white text-academy-blue border-2 border-academy-blue hover:bg-academy-blue/5",
    kids: "bg-kids-orange text-ink border-2 border-b-4 border-kids-orange-deep rounded-2xl hover:bg-kids-orange-deep active:translate-y-[3px] active:border-b-2 focus-visible:outline-kids-orange-deep",
    ghost: "text-academy-blue hover:bg-academy-blue/5",
    dark: "bg-ink text-white hover:bg-academy-blue-dark",
  };
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;
  if (href && !disabled) {
    return (
      <Link href={href} className={cls} onClick={onClick} ref={ref as Ref<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled} ref={ref as Ref<HTMLButtonElement>}>
      {children}
    </button>
  );
}

/* ---------- Sections ---------- */

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  tone?: "default" | "kids";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl mb-10 md:mb-14 ${alignCls}`}>
      {eyebrow && (
        <p
          className={`text-sm font-bold uppercase tracking-widest mb-3 ${
            tone === "kids" ? "text-kids-orange-ink" : "text-academy-teal"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg text-slate leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ---------- Cards ---------- */

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`bg-paper border border-border rounded-2xl p-6 md:p-8 shadow-sm ${
        hover ? "transition-[box-shadow,transform] duration-200 ease-[var(--ease-signature)] hover:shadow-md hover:-translate-y-0.5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Badges ---------- */

export function Badge({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "kids" | "neutral";
}) {
  const tones = {
    info: "bg-academy-blue/10 text-academy-blue",
    success: "bg-academy-teal/10 text-academy-teal-dark",
    warning: "bg-amber-100 text-amber-800",
    kids: "bg-kids-orange/20 text-kids-orange-ink",
    neutral: "bg-slate/10 text-slate",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------- FAQ accordion ---------- */

export function FAQAccordion({
  items,
  idPrefix = "faq",
  open: controlledOpen,
  onOpenChange,
}: {
  items: { q: string; a: ReactNode; link?: { label: string; href: string } }[];
  /** Stable prefix so multiple accordions on one page get unique aria ids. */
  idPrefix?: string;
  /** Controlled open index; undefined = uncontrolled (first item open by default). */
  open?: number | null;
  onOpenChange?: (open: number | null) => void;
}) {
  const [internalOpen, setInternalOpen] = useState<number | null>(0);
  const open = controlledOpen === undefined ? internalOpen : controlledOpen;
  const setOpen = (v: number | null) => {
    if (controlledOpen === undefined) setInternalOpen(v);
    onOpenChange?.(v);
  };
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${idPrefix}-btn-${i}`;
        const panelId = `${idPrefix}-panel-${i}`;
        return (
          <div key={i} id={`${idPrefix}-item-${i}`}>
            <button
              type="button"
              id={btnId}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              /* Run 29 (a11y P1): never point aria-controls at an unmounted
                 panel — wire it only when the panel is in the tree. */
              aria-controls={isOpen ? panelId : undefined}
              className="w-full flex items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded-lg"
            >
              <span className="font-semibold text-ink text-base md:text-lg">{item.q}</span>
              <span
                aria-hidden
                className={`shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-xl transition-transform duration-200 ease-[var(--ease-signature)] ${
                  isOpen ? "rotate-45 bg-academy-blue text-white border-academy-blue" : "text-slate"
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className="pb-6 text-slate leading-relaxed faq-reveal"
              >
                <div>{item.a}</div>
                {item.link && (
                  <p className="mt-3">
                    <Link
                      href={item.link.href}
                      className="font-semibold text-academy-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academy-teal rounded"
                    >
                      {item.link.label} <span aria-hidden>→</span>
                    </Link>
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Breadcrumbs ---------- */

export function Breadcrumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate">
        {trail.map((t, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="text-border">/</span>}
            {t.href ? (
              <Link href={t.href} className="hover:text-academy-blue hover:underline">
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-ink">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Callout ---------- */

export function Callout({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "kids";
  title?: string;
}) {
  const tones = {
    info: "border-academy-blue/30 bg-academy-blue/5",
    warning: "border-amber-300/70 bg-amber-50",
    kids: "border-kids-orange/40 bg-kids-cream",
  };
  const markers = {
    info: "bg-academy-blue",
    warning: "bg-amber-500",
    kids: "bg-kids-orange-deep",
  };
  return (
    <div
      role="note"
      className={`border rounded-xl p-5 md:p-6 my-6 ${tones[tone]}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${markers[tone]}`}
        />
        <div>
          {title && <p className="font-bold text-ink mb-1">{title}</p>}
          <div className="text-slate leading-relaxed text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page hero ---------- */

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
  tone = "default",
  art,
  artAlt = "",
  artStaging = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
  tone?: "default" | "kids" | "exam";
  /** Optional art-directed image path, e.g. "/img/jft-hero.webp" — renders text-left / art-right per the MD hero spec. */
  art?: string;
  artAlt?: string;
  /** Kids character/scene art stays labeled as staging until illustrator review + IP signoff. */
  artStaging?: boolean;
}) {
  const bg =
    tone === "kids"
      ? "bg-kids-cream"
      : tone === "exam"
        ? "bg-gradient-to-b from-academy-blue/10 to-canvas"
        : "bg-canvas";
  return (
    <div className={`${bg} border-b border-border`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className={art ? "grid lg:grid-cols-2 gap-10 items-center" : undefined}>
          <div>
            {eyebrow && (
              <p
                className={`text-sm font-bold uppercase tracking-widest mb-4 ${
                  tone === "kids" ? "text-kids-orange-ink" : tone === "exam" ? "text-academy-teal-dark" : "text-academy-teal"
                }`}
              >
                {eyebrow}
              </p>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink max-w-3xl leading-tight">
              {title}
            </h1>
            {sub && <div className="mt-5 text-lg text-slate leading-relaxed max-w-2xl">{sub}</div>}
            {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
          </div>
          {art && (
            <div>
              <Art
                src={art}
                alt={artAlt}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {artStaging && <StagingNote />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Empty / error states ---------- */

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-academy-blue/10 flex items-center justify-center text-3xl mb-6" aria-hidden>
        ○
      </div>
      <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
      <div className="text-slate max-w-md mx-auto">{body}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
