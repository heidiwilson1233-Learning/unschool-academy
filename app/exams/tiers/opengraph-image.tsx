import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "#fcfbf8",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#0f615b",
            marginBottom: 24,
          }}
        >
          Unschool Academy · The rollout plan
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#15223b",
          }}
        >
          {"50 exams first."}
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "#59677c",
            marginTop: 20,
          }}
        >
          {"1 practice available today · targets, not inventory"}
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 20 }}>
          Tier 1 of 3 — the 50 exams we build first.
        </div>
      </div>
    ),
    { ...size }
  );
}
