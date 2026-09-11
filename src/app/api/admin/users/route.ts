import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await context.supabase.from("profiles").select("id, email, full_name, role, is_active, created_at").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ users: data ?? [] });
}

export async function PATCH(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: string; is_active?: boolean };
  if (!body.id || body.is_active === undefined) return NextResponse.json({ error: "Invalid user update" }, { status: 400 });
  const { error } = await context.supabase.from("profiles").update({ is_active: body.is_active }).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
