import { ImageResponse } from "next/og";
import { PRACTICE_QUESTIONS } from "@/lib/practice";

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
          JFT-Basic practice
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
          that shows its work.
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 28, display: "flex" }}>
          Free 10-question diagnostic · {PRACTICE_QUESTIONS.length} practice questions · 30-minute mock
        </div>
      </div>
    ),
    size
  );
}
