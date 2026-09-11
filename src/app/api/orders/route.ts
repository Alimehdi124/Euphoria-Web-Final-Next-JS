import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { data, error } = await supabase.from("orders").select("id, status, total, created_at, order_items(product_name, quantity, unit_price)").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const body = await request.json() as { items?: { slug: string; quantity: number }[]; shippingAddress?: Record<string, string> };
  if (!body.items?.length || body.items.some((item) => !item.slug || !Number.isInteger(item.quantity) || item.quantity < 1)) return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
  const { data, error } = await supabase.rpc("create_order", { p_items: body.items, p_shipping_address: body.shippingAddress || {} });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ orderId: data }, { status: 201 });
}
