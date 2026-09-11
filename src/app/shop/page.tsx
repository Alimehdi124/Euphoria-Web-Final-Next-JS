import CatalogPage from "@/components/CatalogPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const queryText = typeof params.q === "string" ? params.q : "";
  const catalogProducts = await getCatalogProducts();
  return <CatalogPage queryText={queryText} catalogProducts={catalogProducts} title="Shop" description="Explore our considered collection of everyday essentials, designed with comfort, confidence and a little more joy in mind." />;
}
