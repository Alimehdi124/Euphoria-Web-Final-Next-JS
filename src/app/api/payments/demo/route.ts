import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/sqlserver/auth";
import { createOrder } from "@/lib/sqlserver/orders";

export async function POST(request: Request) {
  if (process.env.DEMO_PAYMENTS !== "true") return NextResponse.json({ error: "Demo payments are disabled" }, { status: 403 });
  const user = await requireCustomer();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json() as { items?: { slug: string; quantity: number }[]; shippingAddress?: Record<string, string>; cardNumber?: string; expiry?: string; cvc?: string };
  if (body.cardNumber !== "4242424242424242" || body.expiry !== "12/30" || body.cvc !== "123") return NextResponse.json({ error: "Use the demo card 4242 4242 4242 4242, 12/30, 123" }, { status: 400 });
  if (!body.items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  try {
    const orderId = await createOrder(user.id, body.items, body.shippingAddress || {}, `demo_${crypto.randomUUID()}`, "processing");
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not create demo order" }, { status: 400 });
  }
}
