import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import { KidQuestPlayer } from "@/components/kid-quest-player";
import type { KidQuest } from "@/lib/kids";

async function loadQuest(id: string): Promise<KidQuest | null> {
  try {
    const p = path.join(process.cwd(), "content", "kids", "quests", `${id}.json`);
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as KidQuest;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const quest = await loadQuest(id);
  if (!quest) return { title: "Quest not found | Unschool Kids" };
  return {
    title: `${quest.title} | Unschool Kids`,
    description: quest.objective,
  };
}

export default async function QuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quest = await loadQuest(id);
  if (!quest) notFound();
  return <KidQuestPlayer quest={quest} />;
}
