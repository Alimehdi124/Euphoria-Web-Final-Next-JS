import { cookies } from "next/headers";
import type { CatalogProduct } from "@/lib/products";
import { products as fallbackProducts } from "@/lib/products";
import { getDb, sql } from "@/lib/sqlserver/db";

type Locale = "en" | "az";
function requestLocale(fallback: Locale = "en"): Promise<Locale> {
  return cookies().then((store) => store.get("euphoria-locale")?.value === "az" ? "az" : fallback);
}

function mapRow(row: Record<string, unknown>, locale: Locale): CatalogProduct {
  return {
    slug: String(row.slug), name: String(row[locale === "az" ? "name_az" : "name_en"] || row.name_en), brand: String(row.brand),
    price: `$${Number(row.price).toFixed(2)}`, image: row.image_id ? `/api/images/${row.image_id}` : fallbackProducts[0].image,
    category: ["women", "men", "combos", "joggers"].includes(String(row.category)) ? row.category as CatalogProduct["category"] : "women",
    color: String(row.color), description: String(row[locale === "az" ? "description_az" : "description_en"] || row.description_en)
  };
}

export async function getCatalogProducts() {
  const db = await getDb();
  if (!db) return fallbackProducts;
  try {
    const result = await db.request().query("SELECT p.id, p.slug, p.name_en, p.name_az, p.description_en, p.description_az, p.brand, p.category, p.color, p.price, p.is_active, i.id AS image_id FROM dbo.Products p OUTER APPLY (SELECT TOP 1 id FROM dbo.ProductImages WHERE product_id = p.id AND is_primary = 1 ORDER BY sort_order) i WHERE p.is_active = 1 ORDER BY p.created_at DESC");
    if (!result.recordset.length) return fallbackProducts;
    const locale = await requestLocale();
    return result.recordset.map((row) => mapRow(row, locale));
  } catch {
    return fallbackProducts;
  }
}

export async function getCatalogProduct(slug: string) {
  const db = await getDb();
  if (!db) return fallbackProducts.find((product) => product.slug === slug);
  try {
    const result = await db.request().input("slug", sql.NVarChar(160), slug).query("SELECT TOP 1 p.id, p.slug, p.name_en, p.name_az, p.description_en, p.description_az, p.brand, p.category, p.color, p.price, i.id AS image_id FROM dbo.Products p OUTER APPLY (SELECT TOP 1 id FROM dbo.ProductImages WHERE product_id = p.id AND is_primary = 1 ORDER BY sort_order) i WHERE p.slug = @slug AND p.is_active = 1");
    const row = result.recordset[0];
    return row ? mapRow(row, await requestLocale()) : fallbackProducts.find((product) => product.slug === slug);
  } catch {
    return fallbackProducts.find((product) => product.slug === slug);
  }
}
