"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, SectionHeading, Button, Card, Badge, Breadcrumbs, EmptyState } from "@/components/ui";

type Attempt = { kind: string; topic?: string; score: number; total: number; at: string };

export default function ExamsDashboard() {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);

  useEffect(() => {
    try {
      setAttempts(JSON.parse(localStorage.getItem("ua-attempts") ?? "[]"));
    } catch {
      setAttempts([]);
    }
  }, []);

  const clear = () => {
    localStorage.removeItem("ua-attempts");
    setAttempts([]);
  };

  if (attempts === null) {
    return (
      <Section><div aria-live="polite" className="space-y-3 max-w-3xl mx-auto">
        {[1, 2].map((i) => <div key={i} className="h-24 rounded-2xl bg-border/40 animate-pulse" />)}
      </div></Section>
    );
  }

  const totalSessions = attempts.length;
  const avg = totalSessions ? Math.round(attempts.reduce((s, a) => s + a.score / a.total, 0) / totalSessions * 100) : 0;
  const mocks = attempts.filter((a) => a.kind.startsWith("mock"));
  const diagnostics = attempts.filter((a) => a.kind === "diagnostic");
  const weakTopics = attempts
    .filter((a) => a.kind === "practice" && a.topic)
    .reduce<Record<string, { s: number; t: number }>>((acc, a) => {
      acc[a.topic!] = acc[a.topic!] ?? { s: 0, t: 0 };
      acc[a.topic!].s += a.score;
      acc[a.topic!].t += a.total;
      return acc;
    }, {});
  const weakest = Object.entries(weakTopics).sort((a, b) => a[1].s / a[1].t - b[1].s / b[1].t)[0];

  return (
    <>
      <div className="bg-gradient-to-b from-academy-blue/10 to-canvas border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "My exam progress" }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">My exam progress</h1>
          <p className="mt-3 text-slate max-w-2xl">
            Your practice history on this device — no account needed. When accounts launch, this
            history will be importable into your learner profile.
          </p>
        </div>
      </div>
      <Section>
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <Card className="!p-6 text-center">
            <p className="text-4xl font-extrabold text-ink">{totalSessions}</p>
            <p className="text-sm text-slate mt-1">Practice sessions</p>
          </Card>
          <Card className="!p-6 text-center">
            <p className="text-4xl font-extrabold text-ink">{avg}%</p>
            <p className="text-sm text-slate mt-1">Average score</p>
          </Card>
          <Card className="!p-6 text-center">
            <p className="text-4xl font-extrabold text-ink">{mocks.length}</p>
            <p className="text-sm text-slate mt-1">Timed mocks taken</p>
          </Card>
        </div>

        {totalSessions === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <EmptyState
              title="No sessions yet"
              body="Take the free diagnostic or a practice session — your results will appear here with a personal study plan."
              action={<Button href="/exams/jft-basic/diagnostic">Start the diagnostic</Button>}
            />
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-extrabold text-ink mb-4">Study plan</h2>
              <Card className="!border-academy-teal/40">
                {weakest && weakest[1].s / weakest[1].t < 0.8 ? (
                  <>
                    <Badge tone="warning">Focus next</Badge>
                    <p className="mt-3 font-bold text-ink text-lg">{weakest[0]}</p>
                    <p className="text-slate text-[15px] mt-1">
                      Your lowest topic so far ({Math.round(weakest[1].s / weakest[1].t * 100)}%). Do one
                      focused practice session, then re-test with a mock.
                    </p>
                    <div className="mt-4"><Button href="/exams/jft-basic/topics" size="sm">Practice topics</Button></div>
                  </>
                ) : diagnostics.length === 0 ? (
                  <>
                    <Badge tone="info">Start here</Badge>
                    <p className="mt-3 font-bold text-ink text-lg">Take the free diagnostic</p>
                    <p className="text-slate text-[15px] mt-1">Get your baseline across all four topics in 10 questions.</p>
                    <div className="mt-4"><Button href="/exams/jft-basic/diagnostic" size="sm">Start diagnostic</Button></div>
                  </>
                ) : (
                  <>
                    <Badge tone="success">On track</Badge>
                    <p className="mt-3 font-bold text-ink text-lg">Try a timed mock</p>
                    <p className="text-slate text-[15px] mt-1">Your topics look solid. Test yourself under real conditions.</p>
                    <div className="mt-4"><Button href="/exams/jft-basic/mock-tests" size="sm">Take mock 1</Button></div>
                  </>
                )}
              </Card>
              <h2 className="text-xl font-extrabold text-ink mt-8 mb-4">Keep going</h2>
              <div className="flex flex-wrap gap-3">
                <Button href="/exams/jft-basic/topics" variant="secondary" size="sm">Practice by topic</Button>
                <Button href="/exams/jft-basic/mock-tests" variant="secondary" size="sm">Mock tests</Button>
                <Button href="/exams/jft-basic" variant="ghost" size="sm">JFT-Basic program →</Button>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-ink">Session history</h2>
                <button onClick={clear} className="text-sm font-semibold text-slate hover:text-red-600 underline">Clear history</button>
              </div>
              <div className="space-y-3">
                {[...attempts].reverse().map((a, i) => (
                  <Card key={i} className="!p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-ink capitalize text-[15px]">
                        {a.kind === "diagnostic" ? "Diagnostic" : a.kind.startsWith("mock") ? "Timed mock" : `Practice${a.topic ? ` · ${a.topic}` : ""}`}
                      </p>
                      <p className="text-xs text-slate">{new Date(a.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                    </div>
                    <p className={`text-xl font-extrabold ${a.score / a.total >= 0.7 ? "text-academy-teal-dark" : a.score / a.total >= 0.4 ? "text-amber-600" : "text-slate"}`}>
                      {a.score}/{a.total}
                    </p>
                  </Card>
                ))}
              </div>
              <p className="text-xs text-slate mt-4">Stored only in this browser. Clearing history cannot be undone.</p>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
