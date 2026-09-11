"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { useLanguage } from "@/components/LanguageProvider";

const fields = ["firstName", "lastName", "country", "street", "city", "state", "postalCode"];

export default function CheckoutPage() {
  const { items } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price.replace("$", "")) * item.quantity, 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!user) { setError(t("checkout.signIn")); return; }
    if (!items.length) { setError("Your cart is empty."); return; }
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const shippingAddress = Object.fromEntries(fields.map((field) => [field, String(form.get(field) || "")]));
    const response = await fetch("/api/payments/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: items.map((item) => ({ slug: item.product.slug, quantity: item.quantity })), shippingAddress }) });
    const body = await response.json();
    if (!response.ok) setError(body.error || "Could not create order.");
    else if (body.url) window.location.assign(body.url);
    setSubmitting(false);
  }

  return <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16"><div className="mb-12"><div className="mb-5 flex flex-wrap gap-2 text-sm text-muted"><Link href="/">Home</Link><span>/</span><Link href="/cart">Cart</Link><span>/</span><span className="text-ink">Checkout</span></div><h1 className="font-core text-[34px] font-semibold text-ink">Checkout</h1></div><form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1fr_400px]"><section><h2 className="font-core text-2xl font-semibold text-ink">Billing details</h2><div className="mt-8 grid gap-6 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">First name<input required name="firstName" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Last name<input required name="lastName" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Country / Region<select name="country" className="h-14 rounded-soft bg-canvas px-5 font-normal"><option>United States</option><option>Azerbaijan</option><option>United Kingdom</option><option>Russia</option></select></label><label className="grid gap-2 text-sm font-semibold">State<input required name="state" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold sm:col-span-2">Street address<input required name="street" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Town / City<input required name="city" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Postal code<input required name="postalCode" className="h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label></div><div className="mt-8 border-t border-line/50 pt-8"><h2 className="font-core text-2xl font-semibold text-ink">Shipping method</h2><div className="mt-5 flex items-center gap-4 rounded-soft bg-canvas p-5"><span className="grid size-10 place-items-center rounded-full bg-white"><LockKeyhole size={18} /></span><span className="flex-1"><strong className="block text-ink">Standard delivery</strong><span className="text-sm text-muted">Delivery within 5-7 business days</span></span><strong className="text-ink">FREE</strong></div></div>{error && <p className="mt-7 rounded-soft bg-[#ffe9e9] px-4 py-3 text-sm text-[#a51d2d]">{error}</p>}</section><aside className="h-fit rounded-card bg-canvas p-6 sm:p-8"><h2 className="font-core text-2xl font-semibold text-ink">Order summary</h2><div className="mt-6 grid gap-4">{items.map((item) => <div key={item.product.slug} className="flex gap-3"><div className="relative size-16 shrink-0 overflow-hidden rounded-soft bg-white"><Image src={item.product.image} alt={item.product.name} fill sizes="64px" className="object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-ink">{item.product.name}</p><p className="mt-1 text-xs text-muted">Qty {item.quantity}</p></div><span className="text-sm font-semibold">${(Number(item.product.price.replace("$", "")) * item.quantity).toFixed(2)}</span></div>)}</div><div className="mt-7 flex justify-between border-t border-line/60 pt-5 text-lg font-semibold"><span>Total</span><span>${subtotal.toFixed(2)}</span></div><button disabled={submitting || !items.length} className="mt-7 flex h-14 w-full items-center justify-center rounded-soft bg-accent font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? "Placing order..." : "Place order"}</button><p className="mt-4 text-center text-xs text-muted">Stock is validated securely on the server.</p></aside></form></main>;
}
