import { NextResponse } from "next/server";
import { requireCustomer } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireCustomer(); if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const stripe = getStripe(); if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const body = await request.json() as { items?: { slug: string; quantity: number }[]; shippingAddress?: Record<string, string> };
  if (!body.items?.length || body.items.some((item) => !item.slug || !Number.isInteger(item.quantity) || item.quantity < 1)) return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  const lineItems: { price_data: { currency: string; product_data: { name: string }; unit_amount: number }; quantity: number }[] = [];
  for (const item of body.items) {
    const result = await db.request().input("slug", sql.NVarChar(160), item.slug).query("SELECT TOP 1 name_en, price, stock FROM dbo.Products WHERE slug=@slug AND is_active=1");
    const product = result.recordset[0];
    if (!product || product.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock for ${item.slug}` }, { status: 400 });
    lineItems.push({ price_data: { currency: "usd", product_data: { name: product.name_en }, unit_amount: Math.round(Number(product.price) * 100) }, quantity: item.quantity });
  }
  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: lineItems, customer_email: user.email, metadata: { userId: user.id, items: JSON.stringify(body.items), shippingAddress: JSON.stringify(body.shippingAddress || {}) }, success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/checkout` });
  return NextResponse.json({ url: session.url });
}
