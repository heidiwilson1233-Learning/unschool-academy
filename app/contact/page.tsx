"use client";

import { useState } from "react";
import { Section, Button, Card, Breadcrumbs, PageHero, Callout } from "@/components/ui";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (form.message.trim().length < 10) errs.message = "Please describe your issue in a little more detail (10+ characters).";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // Pilot: no ticket backend yet — compose a real email the user sends themselves.
      const subject = encodeURIComponent(`[Unschool Academy] ${form.topic} — ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:support@unschool.academy?subject=${subject}&body=${body}`;
      setSent(true);
    }
  };

  const field = "w-full rounded-xl border border-border px-4 py-3 text-base focus:border-academy-blue bg-paper";

  return (
    <>
      <PageHero eyebrow="Support" title="Talk to a human" sub="We reply within 2 business days during the pilot. For children's privacy requests, use the Parent Hub." />
      <Section>
        <div className="max-w-2xl mx-auto">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          {sent ? (
            <Card className="text-center !p-10 animate-fade-up">
              <p className="text-4xl mb-4" aria-hidden>✉️</p>
              <h2 className="text-2xl font-extrabold text-ink">Your email app should have opened</h2>
              <p className="text-slate mt-3">
                During the pilot, support runs through email. Your message was composed and addressed
                to our support inbox — just hit send. We reply within 2 business days.
              </p>
              <div className="mt-6"><Button variant="secondary" onClick={() => setSent(false)}>Write another message</Button></div>
            </Card>
          ) : (
            <Card>
              <form onSubmit={submit} noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="block font-semibold text-ink mb-1.5 text-sm">Name</label>
                    <input id="c-name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block font-semibold text-ink mb-1.5 text-sm">Email</label>
                    <input id="c-email" type="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="c-topic" className="block font-semibold text-ink mb-1.5 text-sm">Topic</label>
                  <select id="c-topic" className={field} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                    <option>General</option>
                    <option>Exam practice / content issue</option>
                    <option>Kids / parent account</option>
                    <option>Billing</option>
                    <option>Privacy / data request</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label htmlFor="c-msg" className="block font-semibold text-ink mb-1.5 text-sm">Message</label>
                  <textarea id="c-msg" rows={5} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What happened? What did you expect?" />
                  {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
                </div>
                <Callout title="Pilot support" tone="info">
                  Our ticket backend isn't live yet — submitting opens your email app with the message
                  pre-addressed to support. Nothing is sent silently, and nothing is stored.
                </Callout>
                <Button type="submit" size="lg" className="w-full">Send message</Button>
              </form>
            </Card>
          )}
        </div>
      </Section>
    </>
  );
}
