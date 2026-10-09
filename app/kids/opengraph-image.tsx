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
          Unschool Kids · Ages 2 through Grade 5
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#15223b",
          }}
        >
          Three friends.
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "#15223b",
          }}
        >
          Real quests.
        </div>
        <div style={{ fontSize: 30, color: "#59677c", marginTop: 28 }}>
          Play a real quest on the page — parent-owned, ad-free.
        </div>
      </div>
    ),
    size
  );
}
