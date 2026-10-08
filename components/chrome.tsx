"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { EXAMS_MENU, KIDS_MENU, RESOURCES_MENU, FOOTER_COLUMNS, TAGLINE, type NavLink } from "@/lib/site";

/* ---------- Logo ---------- */

export function AcademyLogo({ variant = "color" }: { variant?: "color" | "white" }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="Unschool Academy home">
      <span
        aria-hidden
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-xl"
        style={{ background: "linear-gradient(135deg, #315B87 0%, #147D75 100%)" }}
      >
        U
      </span>
      <span className="leading-none">
        <span className={`block font-extrabold text-lg tracking-tight ${variant === "white" ? "text-white" : "text-ink"}`}>
          Unschool Academy
        </span>
        <span className={`block text-[11px] font-medium ${variant === "white" ? "text-white/70" : "text-slate"}`}>
          Learn by doing
        </span>
      </span>
    </Link>
  );
}

/* ---------- Mega menu ---------- */

function MegaMenu({
  label,
  groups,
  openMenu,
  setOpenMenu,
  id,
}: {
  label: string;
  groups: { heading: string; links: NavLink[] }[];
  openMenu: string | null;
  setOpenMenu: (v: string | null) => void;
  id: string;
}) {
  const isOpen = openMenu === id;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpenMenu(id);
  };
  const scheduleClose = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={scheduleClose}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={`megamenu-${id}`}
        onClick={() => setOpenMenu(isOpen ? null : id)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpenMenu(null);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpenMenu(id);
            document.getElementById(`megamenu-${id}`)?.querySelector("a")?.focus();
          }
        }}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-semibold text-[15px] transition-colors ${
          isOpen ? "text-academy-blue bg-academy-blue/5" : "text-ink hover:text-academy-blue hover:bg-slate/5"
        }`}
      >
        {label}
        <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      {isOpen && (
        <div
          id={`megamenu-${id}`}
          role="menu"
          onMouseEnter={open}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpenMenu(null);
              (document.activeElement as HTMLElement)?.blur();
            }
          }}
          className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 animate-fade-up"
        >
          <div className="bg-paper border border-border rounded-2xl shadow-xl p-6 w-[560px] grid grid-cols-2 gap-8">
            {groups.map((g) => (
              <div key={g.heading}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate mb-3">{g.heading}</p>
                <ul className="space-y-1">
                  {g.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link
                        href={l.href}
                        role="menuitem"
                        onClick={() => setOpenMenu(null)}
                        className="block rounded-lg px-3 py-2.5 hover:bg-canvas group"
                      >
                        <span className="block font-semibold text-ink group-hover:text-academy-blue text-[15px]">
                          {l.label}
                        </span>
                        {l.description && (
                          <span className="block text-sm text-slate mt-0.5">{l.description}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Header ---------- */

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] gap-2">
          <AcademyLogo />

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            <MegaMenu label="Exams" id="exams" groups={EXAMS_MENU} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <MegaMenu label="Kids" id="kids" groups={KIDS_MENU} openMenu={openMenu} setOpenMenu={setOpenMenu} />
            <Link href="/how-it-works" className="px-4 py-2.5 rounded-lg font-semibold text-[15px] text-ink hover:text-academy-blue hover:bg-slate/5">
              How it Works
            </Link>
            <Link href="/free-practice" className="px-4 py-2.5 rounded-lg font-semibold text-[15px] text-ink hover:text-academy-blue hover:bg-slate/5">
              Free Practice
            </Link>
            <Link href="/pricing" className="px-4 py-2.5 rounded-lg font-semibold text-[15px] text-ink hover:text-academy-blue hover:bg-slate/5">
              Pricing
            </Link>
            <MegaMenu label="Resources" id="resources" groups={RESOURCES_MENU} openMenu={openMenu} setOpenMenu={setOpenMenu} />
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-label="Search"
              className="w-10 h-10 rounded-lg flex items-center justify-center text-ink hover:bg-slate/5 hover:text-academy-blue"
            >
              <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Link href="/login" className="px-4 py-2.5 rounded-lg font-semibold text-[15px] text-ink hover:text-academy-blue">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl font-semibold text-[15px] bg-academy-blue text-white hover:bg-academy-blue-dark transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-1">
            <Link href="/search" aria-label="Search" className="w-10 h-10 rounded-lg flex items-center justify-center text-ink">
              <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-ink"
            >
              <svg aria-hidden width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Expanding search bar (desktop) */}
      {searchOpen && (
        <div className="border-t border-border bg-paper animate-fade-up">
          <form onSubmit={submitSearch} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex gap-3" role="search">
            <label htmlFor="site-search" className="sr-only">Search Unschool Academy</label>
            <input
              id="site-search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search exams, quests, guides…"
              className="flex-1 rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue"
            />
            <button type="submit" className="px-6 py-3 rounded-xl bg-academy-blue text-white font-semibold hover:bg-academy-blue-dark">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-paper shadow-2xl flex flex-col animate-fade-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <AcademyLogo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-ink hover:bg-slate/5"
              >
                <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto thin-scroll p-4 space-y-6">
              <MobileGroup title="Exams" groups={EXAMS_MENU} onNavigate={() => setMobileOpen(false)} />
              <MobileGroup title="Kids" groups={KIDS_MENU} onNavigate={() => setMobileOpen(false)} />
              <div className="space-y-1">
                <MobileLink href="/how-it-works" label="How it Works" onNavigate={() => setMobileOpen(false)} />
                <MobileLink href="/free-practice" label="Free Practice" onNavigate={() => setMobileOpen(false)} />
                <MobileLink href="/pricing" label="Pricing" onNavigate={() => setMobileOpen(false)} />
              </div>
              <MobileGroup title="Resources" groups={RESOURCES_MENU} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <div className="p-4 border-t border-border space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 rounded-xl font-semibold border-2 border-academy-blue text-academy-blue"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-5 py-3 rounded-xl font-semibold bg-academy-blue text-white"
              >
                Start Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function MobileGroup({
  title,
  groups,
  onNavigate,
}: {
  title: string;
  groups: { heading: string; links: NavLink[] }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-2 font-bold text-lg text-ink"
      >
        {title}
        <svg aria-hidden width="14" height="14" viewBox="0 0 12 12" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="space-y-4 pb-2 animate-fade-up">
          {groups.map((g) => (
            <div key={g.heading}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate mb-1 px-1">{g.heading}</p>
              {g.links.map((l) => (
                <MobileLink key={l.href + l.label} href={l.href} label={l.label} onNavigate={onNavigate} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileLink({ href, label, onNavigate }: { href: string; label: string; onNavigate: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="block px-1 py-2.5 font-medium text-ink hover:text-academy-blue text-[16px]"
    >
      {label}
    </Link>
  );
}

/* ---------- Footer ---------- */

export function GlobalFooter() {
  // Computed in an effect so prerender stays deterministic; updates on the client.
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  const [openCol, setOpenCol] = useState<string | null>(null);

  return (
    <footer className="bg-ink text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Identity column */}
          <div>
            <AcademyLogo variant="white" />
            <p className="mt-4 text-white/70 text-[15px] leading-relaxed max-w-xs">{TAGLINE}</p>
            <div className="mt-6">
              <label htmlFor="footer-lang" className="text-xs font-bold uppercase tracking-widest text-white/50 block mb-2">
                Language
              </label>
              <select
                id="footer-lang"
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
            <p className="mt-4 text-xs text-white/50 leading-relaxed">
              Prices shown in INR where applicable. Content availability and pricing vary by country.
            </p>
          </div>

          {/* Link columns — collapsible on mobile */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={`Footer — ${col.heading}`}>
              <button
                type="button"
                onClick={() => setOpenCol(openCol === col.heading ? null : col.heading)}
                aria-expanded={openCol === col.heading}
                className="lg:cursor-default w-full flex items-center justify-between lg:justify-start py-2 lg:py-0 text-sm font-bold uppercase tracking-widest text-white/50 mb-1 lg:mb-4"
              >
                {col.heading}
                <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className={`lg:hidden transition-transform ${openCol === col.heading ? "rotate-180" : ""}`}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              <ul className={`space-y-2.5 ${openCol === col.heading ? "block" : "hidden"} lg:block`}>
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="text-white/75 hover:text-white text-[15px] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/15">
          <p className="text-xs text-white/50 leading-relaxed max-w-4xl">
            Unschool Academy is an independent practice and learning service. Exam names belong to their
            respective owners. No affiliation with or endorsement by any examination body unless
            specifically stated.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/60">© {year} Unschool Academy. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/legal/terms" className="text-white/60 hover:text-white">Terms</Link>
              <Link href="/legal/privacy" className="text-white/60 hover:text-white">Privacy</Link>
              <Link href="/legal/child-privacy" className="text-white/60 hover:text-white">Children's Privacy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
