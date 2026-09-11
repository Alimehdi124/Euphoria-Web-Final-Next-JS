import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await context.supabase.from("categories").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data ?? [] });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { slug?: string; name?: string; nameAz?: string; nameRu?: string };
  const name = String(body.name ?? "").trim();
  const slug = String(body.slug ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
  if (!name || !slug) return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  const { data, error } = await context.supabase.from("categories").insert({ slug, name: { en: name, az: body.nameAz || name, ru: body.nameRu || name } }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data }, { status: 201 });
}
