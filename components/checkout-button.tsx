"use client";

import { useState } from "react";
import { formatINR } from "@/lib/payments";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function CheckoutButton({ productId, label }: { productId: string; label?: string }) {
  const [state, setState] = useState<"idle" | "busy" | "error" | "unconfigured">("idle");
  const [message, setMessage] = useState("");

  const buy = async () => {
    setState("busy");
    setMessage("");
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setState("unconfigured");
        setMessage(data.error ?? "Checkout isn't connected yet.");
        return;
      }
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) throw new Error("Couldn't load the payment window. Try again.");
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Unschool Academy",
        description: data.product.name,
        theme: { color: "#1d4ed8" },
        handler: () => {
          setState("idle");
          setMessage(
            data.testMode
              ? "Test payment received — this was test mode, no real money moved. Your access will unlock after verification."
              : "Payment received — your access unlocks after verification."
          );
        },
        modal: { ondismiss: () => setState("idle") },
      });
      rzp.open();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Checkout failed. No charge was made.");
    }
  };

  return (
    <div>
      <button
        onClick={buy}
        disabled={state === "busy"}
        className="rounded-xl bg-academy-blue px-6 py-3 font-bold text-white hover:bg-academy-blue/90 transition-colors disabled:opacity-50 w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kids-orange-deep"
      >
        {state === "busy" ? "Working…" : label ?? "Buy now"}
      </button>
      {message && (
        <p
          role={state === "error" || state === "unconfigured" ? "alert" : "status"}
          className={`mt-3 text-sm font-medium rounded-xl px-4 py-3 border ${
            state === "unconfigured"
              ? "text-slate bg-canvas border-border"
              : state === "error"
                ? "text-amber-800 bg-amber-50 border-amber-200"
                : "text-emerald-800 bg-emerald-50 border-emerald-200"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export { formatINR };
