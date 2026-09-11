import type { CatalogProduct } from "@/lib/products";
import { products as fallbackProducts } from "@/lib/products";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export type Locale = "en" | "az" | "ru";

type ProductRow = {
  id: string;
  slug: string;
  name: Record<string, string> | string;
  description: Record<string, string> | string;
  brand: string;
  category: string;
  color: string;
  price: number | string;
  image_url: string | null;
  product_images?: { url: string; sort_order: number }[];
};

function localized(value: ProductRow["name"], locale: Locale) {
  if (typeof value === "string") return value;
  return value[locale] || value.en || value.az || value.ru || "";
}

function category(value: string): CatalogProduct["category"] {
  return ["women", "men", "combos", "joggers"].includes(value) ? value as CatalogProduct["category"] : "women";
}

function mapProduct(row: ProductRow, locale: Locale): CatalogProduct {
  const image = row.image_url || row.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
  return {
    slug: row.slug,
    name: localized(row.name, locale),
    brand: row.brand,
    price: `$${Number(row.price).toFixed(2)}`,
    image: image || fallbackProducts[0].image,
    category: category(row.category),
    color: row.color,
    description: localized(row.description, locale)
  };
}

export async function getCatalogProducts(locale: Locale = "en") {
  locale = await requestLocale(locale);
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackProducts;

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, brand, category, color, price, image_url, product_images(url, sort_order)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return fallbackProducts;
  return (data as ProductRow[]).map((row) => mapProduct(row, locale));
}

export async function getCatalogProduct(slug: string, locale: Locale = "en") {
  locale = await requestLocale(locale);
  const supabase = await createSupabaseServerClient();
  if (!supabase) return fallbackProducts.find((product) => product.slug === slug);

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, description, brand, category, color, price, image_url, product_images(url, sort_order)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return fallbackProducts.find((product) => product.slug === slug);
  return mapProduct(data as ProductRow, locale);
}

async function requestLocale(fallback: Locale): Promise<Locale> {
  const value = (await cookies()).get("euphoria-locale")?.value;
  return value === "az" || value === "ru" || value === "en" ? value : fallback;
}
