import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/sqlserver/auth";
import { getDb, sql } from "@/lib/sqlserver/db";

function slugify(value: string) { return `${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${crypto.randomUUID().slice(0, 8)}`; }
const allowedCategories = new Set(["women", "men", "combos", "joggers"]);

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const result = await db.request().query("SELECT p.id, p.slug, p.name_en, p.name_az, p.description_en, p.description_az, p.brand, p.category, p.color, p.price, p.discount_price, p.stock, p.is_featured, p.is_active, i.id AS image_id FROM dbo.Products p OUTER APPLY (SELECT TOP 1 id FROM dbo.ProductImages WHERE product_id = p.id AND is_primary = 1 ORDER BY sort_order) i ORDER BY p.created_at DESC");
  return NextResponse.json({ products: result.recordset.map((row) => ({ ...row, id: row.id.toString(), image_url: row.image_id ? `/api/images/${row.image_id}` : null, name: { en: row.name_en, az: row.name_az } })) });
}

export async function POST(request: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb(); if (!db) return NextResponse.json({ error: "SQL Server is not configured" }, { status: 503 });
  const body = await request.json() as Record<string, unknown>;
  const name = String(body.name || "").trim(); const description = String(body.description || "").trim(); const category = String(body.category || ""); const price = Number(body.price); const stock = Number(body.stock);
  if (!name || !description || !allowedCategories.has(category) || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  const translations = body.nameTranslations as { en?: string; az?: string } | undefined;
  const descriptions = body.descriptionTranslations as { en?: string; az?: string } | undefined;
  const result = await db.request().input("slug", sql.NVarChar(160), slugify(name)).input("nameEn", sql.NVarChar(240), translations?.en || name).input("nameAz", sql.NVarChar(240), translations?.az || name).input("descriptionEn", sql.NVarChar(sql.MAX), descriptions?.en || description).input("descriptionAz", sql.NVarChar(sql.MAX), descriptions?.az || description).input("brand", sql.NVarChar(160), String(body.brand || "Euphoria")).input("category", sql.NVarChar(40), category).input("color", sql.NVarChar(80), String(body.color || "Black")).input("price", sql.Decimal(10, 2), price).input("discountPrice", sql.Decimal(10, 2), body.discountPrice ? Number(body.discountPrice) : null).input("stock", sql.Int, stock).input("featured", sql.Bit, Boolean(body.isFeatured)).query("INSERT INTO dbo.Products (slug, name_en, name_az, description_en, description_az, brand, category, color, price, discount_price, stock, is_featured) OUTPUT INSERTED.id, INSERTED.slug VALUES (@slug, @nameEn, @nameAz, @descriptionEn, @descriptionAz, @brand, @category, @color, @price, @discountPrice, @stock, @featured");
  return NextResponse.json({ product: result.recordset[0] }, { status: 201 });
}
