import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { products, type CatalogProduct } from "@/lib/products";

type CatalogPageProps = {
  category?: CatalogProduct["category"];
  title: string;
  description: string;
};

const filters = ["Tops", "Printed T-shirts", "Plain T-shirts", "Dresses", "Jeans", "Joggers"];

export default function CatalogPage({ category, title, description }: CatalogPageProps) {
  const visible = category ? products.filter((product) => product.category === category) : products;

  return (
    <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-line/50 pb-8">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted"><Link href="/">Home</Link><span>/</span><span className="text-ink">{title}</span></div>
          <SectionHeading title={title} />
          <p className="max-w-[650px] font-causten text-base leading-7 text-muted">{description}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-soft border border-line px-5 py-3 font-causten text-sm font-semibold text-ink lg:hidden"><SlidersHorizontal size={17} /> Filters</button>
      </div>
      <div className="grid gap-10 lg:grid-cols-[295px_1fr] lg:gap-12">
        <aside className="hidden rounded-b-soft border border-line/50 lg:block">
          <div className="flex items-center justify-between border-b border-line/50 px-7 py-5"><h2 className="font-causten text-lg font-semibold text-muted">Filter</h2><SlidersHorizontal size={19} className="text-muted" /></div>
          <div className="border-b border-line/50 px-7 py-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-causten text-lg font-semibold text-muted">Categories</h3><ChevronDown size={18} className="text-muted" /></div><div className="grid gap-4">{filters.map((filter) => <label key={filter} className="flex items-center justify-between font-causten text-sm font-medium text-muted"><span>{filter}</span><input type="checkbox" className="size-4 accent-accent" /></label>)}</div></div>
          <div className="border-b border-line/50 px-7 py-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-causten text-lg font-semibold text-ink">Colors</h3><ChevronDown size={18} /></div><div className="flex flex-wrap gap-3"><span className="size-8 rounded-soft bg-accent" /><span className="size-8 rounded-soft bg-[#345EFF]" /><span className="size-8 rounded-soft bg-sunshine" /><span className="size-8 rounded-soft bg-[#252525]" /><span className="size-8 rounded-soft border border-line bg-white" /><span className="size-8 rounded-soft bg-blush" /></div></div>
          <div className="px-7 py-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-causten text-lg font-semibold text-muted">Price</h3><ChevronDown size={18} /></div><div className="h-1 rounded-pill bg-gradient-to-r from-accent via-accent to-line" /><div className="mt-4 flex justify-between text-sm text-muted"><span>$20</span><span>$200</span></div></div>
        </aside>
        <section>
          <div className="mb-6 flex items-center justify-between"><p className="font-causten text-base text-muted">{visible.length} items</p><button className="hidden items-center gap-2 rounded-soft border border-line/60 px-4 py-2.5 font-causten text-sm font-medium text-ink sm:flex">Sort by: <span className="font-semibold">Recommended</span><ChevronDown size={16} /></button></div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-7">{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </section>
      </div>
    </main>
  );
}
