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
          Unschool Academy · How we build
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
          A percentile
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
          you can&rsquo;t trust.
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 28 }}>
          If we can&rsquo;t show our working, we don&rsquo;t show the number.
        </div>
      </div>
    ),
    size
  );
}
