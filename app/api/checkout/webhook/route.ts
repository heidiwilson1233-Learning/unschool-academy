import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * POST /api/checkout/webhook — Razorpay webhook receiver.
 * Verifies the signature, deduplicates by (processor, event_id), and grants
 * entitlements exactly once. Grants are recorded only after verified settlement.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  const event = JSON.parse(raw);
  const eventId: string = event.id ?? "";
  const eventType: string = event.event ?? "";

  // TODO: when Supabase is connected —
  // 1. insert into public.payment_events (processor='razorpay', event_id) — unique constraint dedupes retries
  // 2. on 'payment.captured': mark order paid, insert public.entitlements (idempotent on external_payment_id)
  // 3. on 'refund.processed': insert public.refunds, revoke/expire entitlement
  // Until then: acknowledge receipt without granting anything (no fake entitlements).
  console.log(`[webhook] verified ${eventType} ${eventId} — persistence pending Supabase connection`);

  return NextResponse.json({ ok: true, received: eventId, granted: false });
}
