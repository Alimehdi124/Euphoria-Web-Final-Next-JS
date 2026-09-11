import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import { products } from "@/lib/products";
import { getCatalogProduct } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
