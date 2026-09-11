import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await context.supabase.from("orders").select("id, status, total, created_at, profiles(email), order_items(product_name, quantity, unit_price)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: string; status?: string };
  const statuses = new Set(["pending", "processing", "shipped", "delivered", "cancelled"]);
  if (!body.id || !body.status || !statuses.has(body.status)) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  const { error } = await context.supabase.from("orders").update({ status: body.status }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
