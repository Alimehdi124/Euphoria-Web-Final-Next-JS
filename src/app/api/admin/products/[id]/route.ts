import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;
  const updates: Record<string, unknown> = {};
  for (const field of ["brand", "category", "color", "image_url"]) {
    if (body[field] !== undefined) updates[field] = String(body[field]);
  }
  if (body.imageUrl !== undefined) updates.image_url = String(body.imageUrl);
  if (body.name !== undefined) updates.name = typeof body.name === "object" ? body.name : { en: String(body.name) };
  if (body.description !== undefined) updates.description = typeof body.description === "object" ? body.description : { en: String(body.description) };
  if (body.nameTranslations !== undefined) updates.name = body.nameTranslations;
  if (body.descriptionTranslations !== undefined) updates.description = body.descriptionTranslations;
  for (const [field, input] of [["price", "price"], ["discount_price", "discountPrice"], ["stock", "stock"]]) {
    if (body[input] !== undefined) {
      const value = Number(body[input]);
      if (!Number.isFinite(value) || value < 0) return NextResponse.json({ error: "Invalid numeric value" }, { status: 400 });
      updates[field] = value;
    }
  }
  if (body.is_featured !== undefined) updates.is_featured = Boolean(body.is_featured);
  if (body.isFeatured !== undefined) updates.is_featured = Boolean(body.isFeatured);
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
  updates.updated_at = new Date().toISOString();

  const { data, error } = await context.supabase.from("products").update(updates).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { error } = await context.supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
