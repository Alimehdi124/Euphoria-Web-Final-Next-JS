import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/sqlserver/auth";
import { createOrder } from "@/lib/sqlserver/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireCustomer(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const stripe = getStripe(); if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  const { paymentIntentId } = await request.json() as { paymentIntentId?: string };
  if (!paymentIntentId) return NextResponse.json({ error: "Missing payment intent" }, { status: 400 });
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded" || paymentIntent.metadata?.userId !== user.id) return NextResponse.json({ error: "Payment was not completed" }, { status: 400 });
  const items = JSON.parse(paymentIntent.metadata?.items || "[]") as { slug: string; quantity: number }[];
  const shippingAddress = JSON.parse(paymentIntent.metadata?.shippingAddress || "{}") as Record<string, string>;
  const orderId = await createOrder(user.id, items, shippingAddress, paymentIntent.id);
  return NextResponse.json({ orderId });
}
