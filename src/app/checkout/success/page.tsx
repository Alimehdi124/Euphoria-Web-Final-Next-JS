"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutSuccessPage() {
  const { clear } = useCart(); const [message, setMessage] = useState("Confirming your payment...");
  useEffect(() => { const sessionId = new URLSearchParams(window.location.search).get("session_id"); if (!sessionId) { setMessage("Missing payment session."); return; } fetch("/api/payments/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId }) }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); clear(); setMessage(`Order ${String(body.orderId).slice(0, 8)} was placed successfully.`); }).catch((error: Error) => setMessage(error.message)); }, [clear]);
  return <main className="mx-auto grid min-h-[560px] max-w-content place-items-center px-5 py-16 text-center"><div><h1 className="font-core text-3xl font-semibold text-ink">Payment status</h1><p className="mt-4 text-muted">{message}</p><Link href="/account" className="mt-7 inline-flex rounded-soft bg-accent px-8 py-3 font-semibold text-white">View account</Link></div></main>;
}
