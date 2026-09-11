import CatalogPage from "@/components/CatalogPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function WomenPage() {
  return <CatalogPage category="women" catalogProducts={await getCatalogProducts()} title="Women’s Clothing" description="Discover fresh silhouettes, soft tailoring and easy layers made for every plan on your calendar." />;
}
