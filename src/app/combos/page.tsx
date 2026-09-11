import CatalogPage from "@/components/CatalogPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function CombosPage() {
  return <CatalogPage category="combos" catalogProducts={await getCatalogProducts()} title="Combos" description="The easiest way to get dressed: considered sets made to work together and live apart." />;
}
