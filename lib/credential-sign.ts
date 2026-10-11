/**
 * Credential signing — SERVER ONLY. Never import from client components.
 *
 * Tokens are self-contained: base64url(payload).base64url(HMAC-SHA256).
 * The verification page recomputes the signature, so a tampered token
 * (changed name, date, or detail) fails verification. This is tamper
 * evidence, not identity proof — the verify page states that plainly.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CredentialPayload } from "./credentials";
import { deriveCredentialId } from "./credentials";

function secret(): string {
  const s = process.env.CREDENTIAL_SECRET;
  if (!s) {
    // Pilot fallback. Set CREDENTIAL_SECRET in production — without it,
    // tokens are still verifiable, but anyone could mint them.
    console.warn("[credentials] CREDENTIAL_SECRET is not set; using the dev fallback secret.");
    return "unschool-academy-dev-credential-secret";
  }
  return s;
}

const b64u = {
  encode: (buf: Buffer) =>
    buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  decode: (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64"),
};

function sign(payloadB64: string): string {
  return b64u.encode(createHmac("sha256", secret()).update(payloadB64).digest());
}

/** Build the signed token for a credential payload (id derived, issuedAt now). */
export function issueToken(input: {
  kind: CredentialPayload["kind"];
  examSlug: string;
  examTitle: string;
  name: string;
  completedAt: string;
  detail: string;
}): { payload: CredentialPayload; token: string } {
  const payload: CredentialPayload = {
    v: 1,
    id: deriveCredentialId({
      kind: input.kind,
      examSlug: input.examSlug,
      completedAt: input.completedAt,
      name: input.name,
    }),
    kind: input.kind,
    examSlug: input.examSlug,
    examTitle: input.examTitle,
    name: input.name,
    completedAt: input.completedAt,
    detail: input.detail,
    issuedAt: new Date().toISOString(),
  };
  const payloadB64 = b64u.encode(Buffer.from(JSON.stringify(payload), "utf8"));
  return { payload, token: `${payloadB64}.${sign(payloadB64)}` };
}

/** Verify a token. Returns the payload when the signature checks out, else null. */
export function verifyToken(token: string): CredentialPayload | null {
  try {
    if (typeof token !== "string" || token.length === 0 || token.length > 4096) return null;
    const dot = token.indexOf(".");
    if (dot < 1) return null;
    const payloadB64 = token.slice(0, dot);
    const sig = token.slice(dot + 1);
    const expected = sign(payloadB64);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(b64u.decode(payloadB64).toString("utf8")) as CredentialPayload;
    if (payload?.v !== 1 || typeof payload.id !== "string" || !payload.id.startsWith("UA-")) return null;
    // Recompute the id — a token with a hand-edited id inside an otherwise
    // valid payload is still rejected.
    const recomputed = deriveCredentialId({
      kind: payload.kind,
      examSlug: payload.examSlug,
      completedAt: payload.completedAt,
      name: payload.name,
    });
    if (recomputed !== payload.id) return null;
    return payload;
  } catch {
    return null;
  }
}
