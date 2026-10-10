import { ImageResponse } from "next/og";
import { getCatalogStatusCounts } from "@/lib/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const counts = getCatalogStatusCounts();
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
          Unschool Academy · Research catalog
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
          {`${counts.total} exams cataloged.`}
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
          {`${counts.verified} facts verified · ${counts.practiceReady} practice available`}
        </div>
        <div style={{ fontSize: 28, color: "#59677c", marginTop: 20 }}>
          Research entries, honestly labeled — never sold as programs.
        </div>
      </div>
    ),
    size
  );
}
