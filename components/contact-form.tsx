"use client";

import { useEffect, useRef, useState } from "react";
import { Card, Button } from "@/components/ui";
import { MailCheck, Copy, Check } from "lucide-react";

const TOPICS = [
  "General",
  "Exam practice or content issue",
  "Kids or parent account",
  "Billing",
  "Privacy or data request",
] as const;

const SUPPORT_EMAIL = "support@unschool.academy";

const field =
  "w-full rounded-xl border border-border px-4 py-3 text-base bg-paper text-ink placeholder:text-slate/60 focus:border-academy-teal transition-[border-color,box-shadow] duration-200";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("General");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState<"email" | "message" | null>(null);
  const formHeadingRef = useRef<HTMLHeadingElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (sent) successHeadingRef.current?.focus();
  }, [sent]);

  const copy = async (text: string, which: "email" | "message") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    if (message.trim().length < 10)
      errs.message = "Please describe your issue in a little more detail (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Focus the first invalid field so keyboard/screen-reader users land on the problem.
      const first = errs.name ? "c-name" : errs.email ? "c-email" : "c-msg";
      document.getElementById(first)?.focus();
      return;
    }
    // Pilot: no ticket backend yet — compose a real email the user sends themselves.
    const subject = encodeURIComponent(`[Unschool Academy] ${topic} — ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const composedSubject = `[Unschool Academy] ${topic} — ${name || "Your name"}`;
  const composedBody = `${message || "Your message"}\n\n— ${name || "Your name"} (${email || "your@email.com"})`;

  if (sent) {
    return (
      <Card className="faq-reveal">
        <div className="flex flex-col items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-academy-teal/15 text-academy-teal-dark"
          >
            <MailCheck className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink outline-none"
          >
            Almost done: press send in your email app
          </h2>
          <p className="text-slate leading-relaxed">
            We cannot send email from this site yet, so we drafted your message in your email app,
            addressed to {SUPPORT_EMAIL}. Review it, press send, and we will reply within 2 business
            days.
          </p>
          <div className="w-full rounded-xl border border-border bg-canvas p-4 md:p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate mb-3">
              Did your email app not open?
            </p>
            <p className="text-[15px] text-ink leading-relaxed mb-4">
              Send your message directly to{" "}
              <span className="font-semibold">{SUPPORT_EMAIL}</span> — include your name and topic.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copy(SUPPORT_EMAIL, "email")}
              >
                {copied === "email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "email" ? "Copied" : "Copy email address"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => copy(`Subject: ${composedSubject}\n\n${composedBody}`, "message")}
              >
                {copied === "message" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied === "message" ? "Copied" : "Copy my message"}
              </Button>
            </div>
            <p aria-live="polite" className="sr-only">
              {copied ? "Copied to clipboard." : ""}
            </p>
          </div>
          <Button variant="ghost" onClick={() => {
            setSent(false);
            window.setTimeout(() => formHeadingRef.current?.focus(), 0);
          }}>
            Write another message
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <h2
        ref={formHeadingRef}
        tabIndex={-1}
        className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink mb-6 outline-none"
      >
        Send us a message
      </h2>
      <form onSubmit={submit} noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="c-name" className="block font-semibold text-ink mb-1.5 text-sm">
              Name <span aria-hidden className="text-slate font-normal">(required)</span>
            </label>
            <input
              id="c-name"
              name="name"
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "c-name-error" : undefined}
              className={field}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p id="c-name-error" role="alert" className="text-sm text-red-600 mt-1.5">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="c-email" className="block font-semibold text-ink mb-1.5 text-sm">
              Email <span aria-hidden className="text-slate font-normal">(required)</span>
            </label>
            <input
              id="c-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "c-email-error" : undefined}
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p id="c-email-error" role="alert" className="text-sm text-red-600 mt-1.5">
                {errors.email}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="c-topic" className="block font-semibold text-ink mb-1.5 text-sm">
            Topic
          </label>
          <select
            id="c-topic"
            name="topic"
            className={field}
            value={topic}
            onChange={(e) => setTopic(e.target.value as (typeof TOPICS)[number])}
          >
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="c-msg" className="block font-semibold text-ink mb-1.5 text-sm">
            Message <span aria-hidden className="text-slate font-normal">(required, 10+ characters)</span>
          </label>
          <textarea
            id="c-msg"
            name="message"
            rows={5}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "c-msg-error" : undefined}
            className={field}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="text-sm text-slate mt-1.5">
            What happened? What did you expect? For content issues, name the exam, topic, and
            question number if you have it.
          </p>
          {errors.message && (
            <p id="c-msg-error" role="alert" className="text-sm text-red-600 mt-1.5">
              {errors.message}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" className="w-full mt-6">
          Open in my email app
        </Button>
        <p className="text-sm text-slate mt-3">
          Pilot: this opens your email app. Nothing is sent or stored silently.
        </p>
      </form>
    </Card>
  );
}
