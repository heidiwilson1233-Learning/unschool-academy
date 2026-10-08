/**
 * Payments — test-mode checkout structure (Razorpay).
 *
 * Blueprint §6.9 / §9: server-issued orders, webhook signature verification,
 * exactly-once entitlement grants, no trusted amounts from the client.
 *
 * LIVE BILLING IS OFF. Until RAZORPAY_KEY_ID/SECRET are set AND the user
 * explicitly approves live billing, everything runs in test mode against
 * Razorpay's test keys — no real money moves.
 */

export interface Product {
  id: string;
  name: string;
  blurb: string;
  currency: "INR";
  priceMinorUnits: number; // paise
  billingType: "one_time" | "subscription";
  durationDays: number | null;
}

/** Server-side product catalogue — the ONLY source of prices. */
export const PRODUCTS: Product[] = [
  {
    id: "jft-basic-pass",
    name: "JFT-Basic 60-Day Pass",
    blurb: "Full topic practice path, timed mocks, study plan + attempt history. 60 days access.",
    currency: "INR",
    priceMinorUnits: 69900,
    billingType: "one_time",
    durationDays: 60,
  },
  {
    id: "jft-basic-revision",
    name: "JFT-Basic 7-Day Revision",
    blurb: "Focused revision pack with timed drills. 7 days access.",
    currency: "INR",
    priceMinorUnits: 19900,
    billingType: "one_time",
    durationDays: 7,
  },
  {
    id: "kids-family-monthly",
    name: "Kids Family Plan — Monthly",
    blurb: "Full kids world for up to 3 child profiles. Renews monthly, cancel anytime.",
    currency: "INR",
    priceMinorUnits: 24900,
    billingType: "subscription",
    durationDays: 30,
  },
  {
    id: "kids-family-lifetime",
    name: "Kids Family Plan — Founding",
    blurb: "One-time founding-member access for up to 3 child profiles.",
    currency: "INR",
    priceMinorUnits: 39900,
    billingType: "one_time",
    durationDays: null,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function isPaymentsConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function isLiveBillingApproved(): boolean {
  // Live billing requires explicit user approval; env-gated, never default-on.
  return process.env.RAZORPAY_LIVE_APPROVED === "1";
}

export function formatINR(minor: number): string {
  return `₹${(minor / 100).toLocaleString("en-IN")}`;
}
