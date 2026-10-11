import { ImageResponse } from "next/og";
import { connection } from "next/server";
import { verifyToken } from "@/lib/credential-sign";
import { CREDENTIAL_KINDS } from "@/lib/credentials";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card for a verification link: the credential itself, typographic.
 * Invalid tokens get a neutral fallback — never a name we couldn't verify.
 */
export default async function OgImage({ params }: { params: Promise<{ token: string }> }) {
  await connection();
  const { token } = await params;
  const payload = verifyToken(decodeURIComponent(token));

  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%", display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "80px", background: "#fbf9f4",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.22em", color: "#147d75", marginBottom: 24 }}>
            Unschool Academy
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: "-0.03em", color: "#15223b" }}>
            Verify a practice credential
          </div>
        </div>
      ),
      { ...size }
    );
  }

  const info = CREDENTIAL_KINDS[payload.kind];

  // Satori doesn't wrap text: cap the name so the share card never clips.
  const displayName =
    payload.name.length > 34 ? payload.name.slice(0, 33).trimEnd() + "…" : payload.name;
  const nameSize = displayName.length > 22 ? 60 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "80px", background: "#fbf9f4",
          borderTop: "12px solid #147d75",
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.22em", color: "#147d75", marginBottom: 28 }}>
          Unschool Academy · Practice credential · Verified
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em", color: "#15223b", marginBottom: 8 }}>
          {info.title}
        </div>
        <div style={{ fontSize: nameSize, fontStyle: "italic", fontWeight: 700, color: "#15223b", marginBottom: 32 }}>
          {displayName}
        </div>
        <div style={{ display: "flex", gap: 48 }}>
          <div style={{ fontSize: 24, color: "#59677c" }}>{info.programLine}</div>
          <div style={{ fontSize: 24, color: "#59677c", fontWeight: 700 }}>{payload.id}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
