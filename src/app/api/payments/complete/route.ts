import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/sqlserver/auth";
import { createOrder } from "@/lib/sqlserver/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireCustomer(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const stripe = getStripe(); if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  const { sessionId } = await request.json() as { sessionId?: string };
  if (!sessionId) return NextResponse.json({ error: "Missing checkout session" }, { status: 400 });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" || session.metadata?.userId !== user.id) return NextResponse.json({ error: "Payment was not completed" }, { status: 400 });
  const items = JSON.parse(session.metadata?.items || "[]") as { slug: string; quantity: number }[];
  const shippingAddress = JSON.parse(session.metadata?.shippingAddress || "{}") as Record<string, string>;
  const orderId = await createOrder(user.id, items, shippingAddress, session.id);
  return NextResponse.json({ orderId });
}
