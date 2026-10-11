import { headers } from "next/headers";
import { issueToken } from "@/lib/credential-sign";
import { CREDENTIAL_KINDS, type CredentialKind } from "@/lib/credentials";

/**
 * POST /api/credentials/issue
 * Body: { name, kind, examSlug, examTitle, completedAt, total }
 *
 * Issues a signed practice credential. Eligibility (did the learner actually
 * complete the milestone?) is checked on the device from "ua-attempts" before
 * this route is called — the server binds the claim to a signature and the
 * verification page discloses the device-recorded nature of the record.
 *
 * The signed `detail` line is composed HERE from the validated kind, never
 * from client text: the signature vouches for server-composed claims only.
 * No answer keys, no scores, and no session data pass through this route.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request body must be JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const kind = body.kind as string;
  const examSlug = body.examSlug as string;
  const examTitle = body.examTitle as string;
  const completedAt = body.completedAt as string;
  const total = body.total;

  if (name.length < 2 || name.length > 60) {
    return Response.json({ error: "Name must be 2–60 characters." }, { status: 400 });
  }
  // Names are rendered verbatim on a public verification page — no markup.
  if (/[<>]/.test(name)) {
    return Response.json({ error: "Name cannot contain < or >." }, { status: 400 });
  }
  const typedKind = kind as CredentialKind;
  if (!(typedKind in CREDENTIAL_KINDS)) {
    return Response.json({ error: "Unknown credential kind." }, { status: 400 });
  }
  // Pilot scope: only JFT-Basic has credentialed milestones.
  if (examSlug !== "jft-basic" || examTitle !== "JFT-Basic") {
    return Response.json({ error: "Unknown exam." }, { status: 400 });
  }
  const completed = new Date(completedAt);
  const now = Date.now();
  if (isNaN(completed.getTime()) || completed.getTime() > now || completed.getTime() < now - 366 * 86400e3) {
    return Response.json({ error: "Completion date is not plausible." }, { status: 400 });
  }
  // Meta-credentials (practice-set) compose their detail from the required
  // kinds, not from a question count.
  const rawTotal = typeof total === "number" ? total : NaN;
  const questionTotal = CREDENTIAL_KINDS[typedKind].requires ? 0 : rawTotal;
  if (!Number.isInteger(questionTotal) || questionTotal < 0 || questionTotal > 200) {
    return Response.json({ error: "Question count is not plausible." }, { status: 400 });
  }
  if (!CREDENTIAL_KINDS[typedKind].requires && questionTotal < 1) {
    return Response.json({ error: "Question count is not plausible." }, { status: 400 });
  }

  // Server-composed detail: the signature never vouches for client-written text.
  const detail = CREDENTIAL_KINDS[typedKind].detailFor(questionTotal, completed.toISOString());

  const { payload, token } = issueToken({
    kind: typedKind,
    examSlug,
    examTitle,
    name,
    completedAt: completed.toISOString(),
    detail,
  });

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "unschool.academy";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const url = `${proto}://${host}/credentials/${token}`;

  return Response.json(
    { id: payload.id, token, url },
    { headers: { "Cache-Control": "no-store" } }
  );
}
