import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [products, users, orders, pending, completed, recentOrders] = await Promise.all([
    context.supabase.from("products").select("id", { count: "exact", head: true }),
    context.supabase.from("profiles").select("id", { count: "exact", head: true }),
    context.supabase.from("orders").select("id", { count: "exact", head: true }),
    context.supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    context.supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "delivered"),
    context.supabase.from("orders").select("id, status, total, created_at, profiles(email)").order("created_at", { ascending: false }).limit(5)
  ]);
  const error = products.error || users.error || orders.error || recentOrders.error;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({
    counts: { products: products.count ?? 0, users: users.count ?? 0, orders: orders.count ?? 0, pending: pending.count ?? 0, completed: completed.count ?? 0 },
    recentOrders: recentOrders.data ?? []
  });
}
