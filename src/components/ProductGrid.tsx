import ProductCard from "@/components/ProductCard";
import { getCatalogProducts } from "@/lib/catalog";

export default async function ProductGrid({ variant }: { variant: "arrival" | "trending" }) {
  const products = await getCatalogProducts();
  const visibleProducts = variant === "arrival" ? products.slice(0, 4) : products.slice(4, 8);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
      {visibleProducts.map((product) => <ProductCard key={product.name} product={product} />)}
    </div>
  );
}
