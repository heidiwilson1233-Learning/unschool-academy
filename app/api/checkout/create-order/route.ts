import { NextRequest, NextResponse } from "next/server";
import { getProduct, isPaymentsConfigured, isLiveBillingApproved } from "@/lib/payments";
import { currentUser } from "@/lib/supabase";

/**
 * POST /api/checkout/create-order { productId }
 * Server-issued Razorpay order. Price always comes from the server catalogue —
 * the client never supplies an amount.
 */
export async function POST(req: NextRequest) {
  if (!isPaymentsConfigured()) {
    return NextResponse.json(
      { error: "Checkout isn't connected yet (test mode). No order was created." },
      { status: 503 }
    );
  }
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in to check out." }, { status: 401 });

  let productId: string;
  try {
    ({ productId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const product = getProduct(productId);
  if (!product) return NextResponse.json({ error: "Unknown product." }, { status: 400 });

  // Razorpay order creation (test mode unless live explicitly approved).
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");
  const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: product.priceMinorUnits,
      currency: product.currency,
      receipt: `ua_${Date.now()}_${user.id.slice(0, 8)}`,
      notes: { product_id: product.id, user_id: user.id, live: String(isLiveBillingApproved()) },
    }),
  });
  if (!rzpRes.ok) {
    return NextResponse.json({ error: "Payment provider error. No charge was made." }, { status: 502 });
  }
  const order = await rzpRes.json();

  // TODO: persist to public.orders when Supabase is connected.
  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    product: { id: product.id, name: product.name },
    testMode: !isLiveBillingApproved(),
  });
}
