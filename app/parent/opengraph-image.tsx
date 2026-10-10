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
          background: "#fff7e9",
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
          Unschool Academy · Parent Hub
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
          Parent Hub
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            lineHeight: 1.4,
            color: "#59677c",
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          Profiles, learning evidence, privacy choices, and billing — in staged rollout.
        </div>
      </div>
    ),
    { ...size }
  );
}
