import CatalogPage from "@/components/CatalogPage";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const queryText = typeof params.q === "string" ? params.q : "";
  return <CatalogPage queryText={queryText} title="Shop" description="Explore our considered collection of everyday essentials, designed with comfort, confidence and a little more joy in mind." />;
}
