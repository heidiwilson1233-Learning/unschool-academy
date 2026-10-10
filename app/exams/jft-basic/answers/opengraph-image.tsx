import { ImageResponse } from "next/og";
import { ANSWER_COUNT } from "@/lib/answers";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* One shared typographic OG image for the whole answers section —
   per-question images were cut (near-zero share value, 95 build renders). */
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
          background: "#fbf9f4",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#147d75",
            marginBottom: 24,
          }}
        >
          Unschool Academy · JFT-Basic
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
          Every question,
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
          explained.
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 28, display: "flex" }}>
          {ANSWER_COUNT} practice questions · hint first, then the why · draft pending SME review
        </div>
      </div>
    ),
    size
  );
}
