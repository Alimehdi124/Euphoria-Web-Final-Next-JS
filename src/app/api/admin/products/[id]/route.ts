import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const { id } = await params; const body = await request.json() as Record<string, unknown>; const translations = body.nameTranslations as { en?: string; az?: string } | undefined; const descriptions = body.descriptionTranslations as { en?: string; az?: string } | undefined;
  const result = await db.request().input("id", sql.UniqueIdentifier, id).input("nameEn", sql.NVarChar(240), translations?.en || String(body.name || "")).input("nameAz", sql.NVarChar(240), translations?.az || String(body.name || "")).input("descriptionEn", sql.NVarChar(sql.MAX), descriptions?.en || String(body.description || "")).input("descriptionAz", sql.NVarChar(sql.MAX), descriptions?.az || String(body.description || "")).input("brand", sql.NVarChar(160), String(body.brand || "Euphoria")).input("category", sql.NVarChar(40), String(body.category || "women")).input("color", sql.NVarChar(80), String(body.color || "Black")).input("price", sql.Decimal(10, 2), Number(body.price || 0)).input("discountPrice", sql.Decimal(10, 2), body.discountPrice ? Number(body.discountPrice) : null).input("stock", sql.Int, Number(body.stock || 0)).input("featured", sql.Bit, Boolean(body.isFeatured)).query("UPDATE dbo.Products SET name_en=@nameEn, name_az=@nameAz, description_en=@descriptionEn, description_az=@descriptionAz, brand=@brand, category=@category, color=@color, price=@price, discount_price=@discountPrice, stock=@stock, is_featured=@featured, updated_at=SYSUTCDATETIME() WHERE id=@id; SELECT TOP 1 id FROM dbo.Products WHERE id=@id");
  if (!result.recordset.length) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const { id } = await params; await db.request().input("id", sql.UniqueIdentifier, id).query("DELETE FROM dbo.Products WHERE id=@id"); return NextResponse.json({ ok: true });
}
