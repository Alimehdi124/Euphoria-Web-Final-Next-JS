import CatalogPage from "@/components/CatalogPage";
import { getCatalogProducts } from "@/lib/catalog";

export default async function JoggersPage() {
  return <CatalogPage category="joggers" catalogProducts={await getCatalogProducts()} title="Joggers" description="Soft structure and unrestricted movement. Meet the joggers you will reach for on repeat." />;
}
