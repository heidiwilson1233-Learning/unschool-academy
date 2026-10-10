import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Typographic OG card — light surfaces only, no external assets. */
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
            color: "#3f7d5c",
            marginBottom: 24,
          }}
        >
          Unschool Kids · For parents
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#15223b",
          }}
        >
          A score says
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "#15223b",
          }}
        >
          who&rsquo;s better.
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 28 }}>
          What we record instead of a number.
        </div>
      </div>
    ),
    size
  );
}
