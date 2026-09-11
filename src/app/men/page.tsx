import CatalogPage from "@/components/CatalogPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function MenPage() {
  return <CatalogPage category="men" catalogProducts={await getCatalogProducts()} title="Men’s Clothing" description="Everyday pieces with a relaxed attitude, from clean tees to layers that make the outfit." />;
}
