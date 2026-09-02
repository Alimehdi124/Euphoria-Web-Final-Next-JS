import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ProductGrid({ variant }: { variant: "arrival" | "trending" }) {
  const visibleProducts = variant === "arrival" ? products.slice(8, 12) : products.slice(0, 4);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
      {visibleProducts.map((product) => <ProductCard key={product.name} product={product} />)}
    </div>
  );
}
