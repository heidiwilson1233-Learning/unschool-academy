import { notFound } from "next/navigation";
import { use } from "react";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { KidQuestPlayer } from "@/components/kid-quest-player";
import type { KidQuest } from "@/lib/kids";

function loadQuest(id: string): KidQuest | null {
  try {
    const p = path.join(process.cwd(), "content", "kids", "quests", `${id}.json`);
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw) as KidQuest;
  } catch {
    return null;
  }
}

export function generateStaticParams(): { id: string }[] {
  try {
    const dir = path.join(process.cwd(), "content", "kids", "quests");
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ id: f.replace(/\.json$/, "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const quest = loadQuest(id);
  if (!quest) return { title: "Quest not found | Unschool Kids" };
  return {
    title: `${quest.title} | Unschool Kids`,
    description: quest.objective,
  };
}

export default function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const quest = loadQuest(id);
  if (!quest) notFound();
  return <KidQuestPlayer quest={quest} />;
}
