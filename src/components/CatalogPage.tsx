"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import { products, type CatalogProduct } from "@/lib/products";

type CatalogPageProps = {
  category?: CatalogProduct["category"];
  title: string;
  description: string;
  queryText?: string;
};

const colors = ["All", "Black", "Blue", "Cream", "Green", "White", "Yellow"];

export default function CatalogPage({ category, title, description, queryText = "" }: CatalogPageProps) {
  const [selectedColor, setSelectedColor] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = queryText.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesCategory = category ? product.category === category : true;
    const matchesColor = selectedColor === "All" || product.color === selectedColor;
    const matchesQuery = !query || `${product.name} ${product.brand} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesColor && matchesQuery;
  });
  const visible = [...filtered].sort((first, second) => {
    if (sort === "name") return first.name.localeCompare(second.name);
    if (sort === "price-low") return Number(first.price.replace("$", "")) - Number(second.price.replace("$", ""));
    if (sort === "price-high") return Number(second.price.replace("$", "")) - Number(first.price.replace("$", ""));
    return 0;
  });

  return (
    <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5 border-b border-line/50 pb-8">
        <div>
          <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted"><Link href="/">Home</Link><span>/</span><span className="text-ink">{title}</span></div>
          <SectionHeading title={title} />
          <p className="max-w-[650px] font-causten text-base leading-7 text-muted">{description}</p>
        </div>
         <button onClick={() => setFiltersOpen(!filtersOpen)} className="inline-flex items-center gap-2 rounded-soft border border-line px-5 py-3 font-causten text-sm font-semibold text-ink lg:hidden" aria-expanded={filtersOpen}><SlidersHorizontal size={17} /> Filters</button>
      </div>
      <div className="grid gap-10 lg:grid-cols-[295px_1fr] lg:gap-12">
         <aside className={`${filtersOpen ? "block" : "hidden"} rounded-b-soft border border-line/50 lg:block`}>
          <div className="flex items-center justify-between border-b border-line/50 px-7 py-5"><h2 className="font-causten text-lg font-semibold text-muted">Filter</h2><SlidersHorizontal size={19} className="text-muted" /></div>
           <div className="border-b border-line/50 px-7 py-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-causten text-lg font-semibold text-ink">Colors</h3><ChevronDown size={18} /></div><div className="flex flex-wrap gap-2">{colors.map((color) => <button key={color} onClick={() => setSelectedColor(color)} className={`rounded-soft border px-3 py-2 text-xs font-semibold ${selectedColor === color ? "border-ink bg-ink text-white" : "border-line text-muted"}`} aria-pressed={selectedColor === color}>{color}</button>)}</div></div>
          <div className="px-7 py-6"><div className="mb-5 flex items-center justify-between"><h3 className="font-causten text-lg font-semibold text-muted">Price</h3><ChevronDown size={18} /></div><div className="h-1 rounded-pill bg-gradient-to-r from-accent via-accent to-line" /><div className="mt-4 flex justify-between text-sm text-muted"><span>$20</span><span>$200</span></div></div>
        </aside>
        <section>
           <div className="mb-6 flex items-center justify-between gap-4"><p className="font-causten text-base text-muted">{visible.length} items{query ? ` for “${queryText}"` : ""}</p><label className="flex items-center gap-2 rounded-soft border border-line/60 px-4 py-2.5 font-causten text-sm font-medium text-ink">Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent font-semibold outline-none"><option value="recommended">Recommended</option><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={16} /></label></div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-7">{visible.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
        </section>
      </div>
    </main>
  );
}
