import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function OgImage() {
  const planPath = path.join(process.cwd(), "content", "kids", "prototype-plan.json");
  const plan = JSON.parse(fs.readFileSync(planPath, "utf-8"));
  const briefs = plan.tracks.flatMap((t: { briefs: unknown[] }) => t.briefs).length;
  const templates = plan.templates.length;
  const playable = plan.tracks
    .flatMap((t: { briefs: { status: string }[] }) => t.briefs)
    .filter((b: { status: string }) => b.status === "playable").length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fff7e9",
          backgroundImage: GRAIN,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#8a5418",
            marginBottom: 24,
          }}
        >
          Unschool Kids · The build plan
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#15223b",
          }}
        >
          <span>Fifteen quests,</span>
          <span>built properly.</span>
        </div>
        <div style={{ fontSize: 30, color: "#59677c", marginTop: 28 }}>
          {`${templates} templates · ${briefs} briefs · ${playable} prototype quests playable before review.`}
        </div>
      </div>
    ),
    size
  );
}
