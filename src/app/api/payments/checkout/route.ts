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
  let amount = 0;
  for (const item of body.items) {
    const result = await db.request().input("slug", sql.NVarChar(160), item.slug).query("SELECT TOP 1 name_en, price, stock FROM dbo.Products WHERE slug=@slug AND is_active=1");
    const product = result.recordset[0];
    if (!product || product.stock < item.quantity) return NextResponse.json({ error: `Insufficient stock for ${item.slug}` }, { status: 400 });
    amount += Math.round(Number(product.price) * 100) * item.quantity;
  }
  const paymentIntent = await stripe.paymentIntents.create({ amount, currency: "usd", payment_method_types: ["card"], receipt_email: user.email, metadata: { userId: user.id, items: JSON.stringify(body.items), shippingAddress: JSON.stringify(body.shippingAddress || {}) } });
  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
