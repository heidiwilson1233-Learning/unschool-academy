/**
 * Credential engine — portal-doctrine move 6 (credential framing).
 *
 * Practice credentials: effort-based completion records (diagnostic / full
 * mock), issued as named, verifiable records with a verification URL.
 * Client-safe (no JSX, no secrets, no answer keys): the HMAC secret lives in
 * lib/credential-sign.ts (server-only) and the /api/credentials/issue route.
 *
 * Eligibility and the issued-credential list live on this device
 * ("ua-attempts" / "ua-credentials") — the verification page says this
 * plainly, the same honesty posture as the rest of the pilot.
 *
 * What a credential claims (completion only, never a score): finishing the
 * full diagnostic or a full timed mock is the achievement. Scores are
 * deliberately excluded — a practice record is encouragement, not a ranking.
 */

export type CredentialKind = "diagnostic" | "full-mock" | "practice-set";

export interface AttemptLite {
  kind: string;
  score: number;
  total: number;
  at: string;
}

export interface CredentialKindInfo {
  kind: CredentialKind;
  /** "Diagnostic complete" — the card headline. */
  title: string;
  /** Real site language (matches the exam template's "preparation" wording). */
  programLine: string;
  /** One-line completion fact, e.g. "10-question diagnostic · completed 11 Oct 2026". */
  detailFor: (total: number, completedAt: string) => string;
  /** Matches an attempt in ua-attempts to this kind. */
  matches: (a: AttemptLite) => boolean;
  /** For meta-credentials: kinds that must already be issued. */
  requires?: CredentialKind[];
}

export const CREDENTIAL_KINDS: Record<CredentialKind, CredentialKindInfo> = {
  diagnostic: {
    kind: "diagnostic",
    title: "Diagnostic complete",
    programLine: "JFT-Basic preparation",
    detailFor: (total, completedAt) => `${total}-question diagnostic · completed ${fmtDay(completedAt)}`,
    matches: (a) => a.kind === "diagnostic",
  },
  "full-mock": {
    kind: "full-mock",
    title: "Full mock complete",
    programLine: "JFT-Basic preparation",
    detailFor: (total, completedAt) => `${total}-question timed mock · completed ${fmtDay(completedAt)}`,
    matches: (a) => a.kind.startsWith("full mock"),
  },
  "practice-set": {
    kind: "practice-set",
    title: "Practice set complete",
    programLine: "JFT-Basic preparation",
    detailFor: (_total, completedAt) => `diagnostic + full mock · completed ${fmtDay(completedAt)}`,
    matches: () => false,
    requires: ["diagnostic", "full-mock"],
  },
};

export const CREDENTIAL_KIND_ORDER: CredentialKind[] = ["diagnostic", "full-mock", "practice-set"];

/** The only exam with credentialed milestones in the pilot. */
export const CREDENTIAL_EXAM = { slug: "jft-basic", title: "JFT-Basic" };

function fmtDay(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/* Eligibility                                                         */
/* ------------------------------------------------------------------ */

/**
 * The newest matching attempt for a kind, or null when none exists.
 * Attempts are device-local; the caller reads "ua-attempts".
 */
export function newestEligibleAttempt(kind: CredentialKind, attempts: AttemptLite[]): AttemptLite | null {
  const info = CREDENTIAL_KINDS[kind];
  let best: AttemptLite | null = null;
  for (const a of attempts) {
    if (!info.matches(a)) continue;
    if (!a.at || isNaN(new Date(a.at).getTime())) continue;
    if (!best || a.at > best.at) best = a;
  }
  return best;
}

/* ------------------------------------------------------------------ */
/* Issued-credential store (device-local, "ua-credentials")            */
/* ------------------------------------------------------------------ */

/** The signed payload every credential carries. */
export interface CredentialPayload {
  v: 1;
  /** e.g. "UA-K7Q2M4XD" — deterministic per (kind, exam, completed-at, name). */
  id: string;
  kind: CredentialKind;
  examSlug: string;
  examTitle: string;
  /** Shown exactly as the learner typed it; identity is not verified. */
  name: string;
  completedAt: string;
  detail: string;
  issuedAt: string;
}

export interface IssuedCredential extends CredentialPayload {
  token: string;
  url: string;
}

const STORE_KEY = "ua-credentials";

export function readIssued(): IssuedCredential[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function saveIssued(c: IssuedCredential): IssuedCredential[] {
  const prev = readIssued().filter((x) => x.id !== c.id);
  const next = [...prev, c];
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable — the credential still exists at its URL */
  }
  return next;
}

export function issuedFor(kind: CredentialKind, examSlug: string): IssuedCredential | null {
  const matches = readIssued().filter((c) => c.kind === kind && c.examSlug === examSlug);
  if (matches.length === 0) return null;
  // Newest first — a re-earned credential supersedes the earlier one in the UI.
  return matches.sort((a, b) => (a.issuedAt < b.issuedAt ? 1 : -1))[0];
}

/* ------------------------------------------------------------------ */
/* Deterministic credential id (pure — no secret, no async)            */
/* ------------------------------------------------------------------ */

/**
 * cyrb53 string hash — 53 bits, deterministic across client and server,
 * no BigInt needed. The id is embedded in the HMAC-signed payload, so the
 * signature (not the hash) is the real tamper protection.
 */
function cyrb53(s: string, seed = 0): number {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const B32 = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 chars: no 0/O, 1/I/L — readable over the phone
const B32N = B32.length;

export function deriveCredentialId(input: {
  kind: CredentialKind;
  examSlug: string;
  completedAt: string;
  name: string;
}): string {
  const seed = `${input.kind}|${input.examSlug}|${input.completedAt}|${input.name.trim().toLowerCase()}`;
  // Fold two 53-bit hashes into 40 bits (8 × 5-bit chars). NOTE: JS bitwise
  // operators truncate to 32 bits, so the fold uses modulo, not XOR.
  const folded = (cyrb53(seed) + cyrb53(seed, 0x9e3779b9) * 31) % Math.pow(B32N, 8);
  let x = Math.floor(folded);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += B32[x % B32N];
    x = Math.floor(x / B32N);
  }
  return `UA-${out}`;
}
