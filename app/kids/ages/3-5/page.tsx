import type { Metadata } from "next";
import { TrackPage } from "@/components/track-page";
import { AGE_TRACKS } from "@/lib/kids";

const track = AGE_TRACKS.find((t) => t.slug === "3-5")!;

export const metadata: Metadata = {
  title: `${track.name} — ${track.audience} | Unschool Kids`,
  description: track.description,
};

export default function Page() {
  return <TrackPage track={track} />;
}
