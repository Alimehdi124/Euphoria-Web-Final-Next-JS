import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/supabase/admin";

const categories = new Set(["women", "men", "combos", "joggers"]);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function translations(value: unknown, fallback: string) {
  if (value && typeof value === "object") return value;
  return { en: fallback };
}

export async function GET() {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await context.supabase
    .from("products")
    .select("id, slug, name, description, brand, category, color, price, discount_price, stock, image_url, is_featured, is_active, created_at, product_images(id, url, storage_path, sort_order)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json() as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  const description = String(body.description ?? "").trim();
  const productCategory = String(body.category ?? "");
  const price = Number(body.price);
  const stock = Number(body.stock);
  if (!name || !description || !categories.has(productCategory) || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  }

  const baseSlug = slugify(name);
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;
  const { data: product, error } = await context.supabase.from("products").insert({
    slug,
    name: translations(body.nameTranslations, name),
    description: translations(body.descriptionTranslations, description),
    brand: String(body.brand ?? "Euphoria").trim() || "Euphoria",
    category: productCategory,
    color: String(body.color ?? "Black").trim() || "Black",
    price,
    discount_price: body.discountPrice ? Number(body.discountPrice) : null,
    stock,
    image_url: body.imageUrl ? String(body.imageUrl) : null,
    is_featured: Boolean(body.isFeatured),
    is_active: body.isActive !== false
  }).select("*").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (Array.isArray(body.images) && body.images.length) {
    await context.supabase.from("product_images").insert(body.images.map((image, index) => ({
      product_id: product.id,
      url: String(image),
      sort_order: index
    })));
  }
  return NextResponse.json({ product }, { status: 201 });
}
