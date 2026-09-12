import { NextResponse } from "next/server";
import { createOrder } from "@/lib/sqlserver/orders";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe(); const signature = request.headers.get("stripe-signature"); const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !signature || !secret) return new NextResponse("Webhook is not configured", { status: 400 });
  let event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, secret); } catch { return new NextResponse("Invalid signature", { status: 400 }); }
  if (event.type === "payment_intent.succeeded") {
    const session = event.data.object;
    if (session.metadata?.userId) {
      const items = JSON.parse(session.metadata.items || "[]") as { slug: string; quantity: number }[];
      const shippingAddress = JSON.parse(session.metadata.shippingAddress || "{}") as Record<string, string>;
      await createOrder(session.metadata.userId, items, shippingAddress, session.id);
    }
  }
  return NextResponse.json({ received: true });
}
