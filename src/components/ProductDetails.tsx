"use client";

import { Check, ChevronDown, Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/products";
import { useCart } from "@/components/CartContext";

const sizes = ["XS", "S", "M", "L", "XL"];
const gallery = [
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85"
];

export default function ProductDetails({ product }: { product: CatalogProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("M");
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const images = [product.image, ...gallery.filter((item) => item !== product.image)];

  return (
    <main>
      <div className="mx-auto max-w-content px-5 py-8 sm:px-8 lg:px-0 lg:py-9">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-muted"><Link href="/">Shop</Link><span>/</span><Link href={`/${product.category}`}>{product.category}</Link><span>/</span><span className="text-ink">{product.name}</span></div>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,534px)] lg:gap-16">
          <div className="grid gap-4 sm:grid-cols-[76px_minmax(0,1fr)] lg:grid-cols-[76px_520px]">
            <div className="order-2 flex gap-3 sm:order-1 sm:flex-col"><button onClick={() => setActiveImage(0)} className={`relative aspect-square w-[68px] overflow-hidden rounded-soft border-2 ${activeImage === 0 ? "border-ink" : "border-transparent"}`}><Image src={images[0]} alt="" fill sizes="76px" className="object-cover" /></button>{images.slice(1).map((item, index) => <button key={item} onClick={() => setActiveImage(index + 1)} className={`relative aspect-square w-[68px] overflow-hidden rounded-soft border-2 ${activeImage === index + 1 ? "border-ink" : "border-transparent"}`}><Image src={item} alt="" fill sizes="76px" className="object-cover" /></button>)}</div>
            <div className="relative order-1 aspect-[0.66] max-h-[785px] overflow-hidden rounded-card bg-canvas sm:order-2 sm:aspect-[0.66]"><Image src={images[activeImage]} alt={product.name} fill priority sizes="(max-width: 1024px) 90vw, 520px" className="object-cover" /></div>
          </div>
          <div className="lg:pt-1">
            <p className="font-causten text-lg font-medium text-muted">{product.brand}</p>
            <h1 className="mt-3 font-core text-[30px] font-semibold leading-tight tracking-[0.02em] text-ink sm:text-[34px]">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-5"><div className="flex items-center gap-1 text-sunshine">{[1, 2, 3, 4, 5].map((item) => <Star key={item} size={19} fill="currentColor" strokeWidth={1.4} />)}<span className="ml-2 font-causten text-base text-muted">4.8</span></div><span className="h-5 w-px bg-line" /><span className="font-causten text-base text-muted">120 reviews</span></div>
            <div className="mt-8 flex items-center gap-4"><span className="font-causten text-[24px] font-bold text-ink">{product.price}</span><span className="font-causten text-base font-medium text-muted line-through">$129.00</span><span className="rounded-pill bg-[#eee5ff] px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">Save 30%</span></div>
            <div className="my-7 h-px bg-line/70" />
            <div><div className="flex items-center justify-between"><h2 className="font-causten text-lg font-semibold text-ink">Select size</h2><button className="flex items-center gap-1 text-base font-medium text-muted">Size guide <ChevronDown size={17} /></button></div><div className="mt-4 flex flex-wrap gap-3">{sizes.map((item) => <button key={item} onClick={() => setSize(item)} className={`grid size-11 place-items-center rounded-soft border font-causten text-sm font-medium transition-colors ${size === item ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink"}`}>{item}</button>)}</div></div>
            <div className="mt-8"><h2 className="font-causten text-lg font-semibold text-ink">Colours available</h2><div className="mt-4 flex gap-4"><button className="grid size-9 place-items-center rounded-full border border-ink"><span className="size-6 rounded-full bg-ink" /></button><button className="size-8 rounded-full bg-sunshine" /><button className="size-8 rounded-full bg-blush" /><button className="size-8 rounded-full bg-burgundy" /></div></div>
            <div className="mt-9 flex flex-wrap gap-3"><div className="flex h-12 items-center rounded-soft bg-canvas"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-11 place-items-center text-ink" aria-label="Decrease quantity"><Minus size={16} /></button><span className="w-5 text-center font-causten text-sm font-semibold">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="grid size-11 place-items-center text-ink" aria-label="Increase quantity"><Plus size={16} /></button></div><button onClick={() => { addToCart(product, quantity); setAdded(true); }} className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-soft bg-accent px-6 font-causten text-lg font-semibold text-white transition-colors hover:bg-[#7422e0] sm:flex-none sm:px-10"><ShoppingBag size={19} /> {added ? "Added to cart" : "Add to cart"}</button><button onClick={() => setLiked(!liked)} className={`grid size-12 place-items-center rounded-soft border ${liked ? "border-accent text-accent" : "border-line text-ink"}`} aria-label="Add to wishlist"><Heart size={20} fill={liked ? "currentColor" : "none"} /></button></div>
            <div className="my-8 h-px bg-line/70" />
            <div className="grid gap-5 sm:grid-cols-2"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-canvas"><Truck size={20} /></span><span className="font-causten text-base font-medium text-ink">Free shipping</span></div><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-canvas"><Check size={20} /></span><span className="font-causten text-base font-medium text-ink">Secure payment</span></div></div>
          </div>
        </div>
        <section className="mt-16 border-t border-line/60 pt-10 sm:mt-24 sm:pt-12"><div className="flex flex-wrap items-center gap-7 border-b border-line/60"><button className="border-b-2 border-ink pb-4 font-causten text-lg font-semibold text-ink">Description</button><button className="pb-4 font-causten text-lg text-muted">User comments <span className="ml-1 rounded bg-accent px-1.5 py-0.5 text-xs text-white">21</span></button><button className="pb-4 font-causten text-lg text-muted">Question & Answer <span className="ml-1 rounded bg-ink px-1.5 py-0.5 text-xs text-white">4</span></button></div><div className="grid gap-10 py-9 lg:grid-cols-[1fr_532px]"><div><h2 className="font-core text-[28px] font-semibold text-ink">Product Description</h2><p className="mt-5 max-w-[610px] font-causten text-base leading-7 tracking-wide text-muted">{product.description} Made from 100% bio-washed cotton for an extra soft and silky finish. Precisely stitched with no pilling and no fading, so you can rely on all-time comfort, anytime and anywhere.</p><div className="mt-8 grid max-w-[612px] grid-cols-2 gap-y-7 rounded-card bg-canvas/70 p-6 sm:grid-cols-3"><div><p className="text-sm text-muted">Fabric</p><p className="mt-2 font-medium text-ink">Bio-washed Cotton</p></div><div><p className="text-sm text-muted">Pattern</p><p className="mt-2 font-medium text-ink">Printed</p></div><div><p className="text-sm text-muted">Fit</p><p className="mt-2 font-medium text-ink">Regular-fit</p></div><div><p className="text-sm text-muted">Neck</p><p className="mt-2 font-medium text-ink">Round Neck</p></div><div><p className="text-sm text-muted">Sleeve</p><p className="mt-2 font-medium text-ink">Half-sleeves</p></div><div><p className="text-sm text-muted">Style</p><p className="mt-2 font-medium text-ink">Casual Wear</p></div></div></div><div className="relative h-[250px] overflow-hidden rounded-card bg-ink sm:h-[328px]"><Image src={images[1]} alt="Product detail" fill sizes="(max-width: 1024px) 100vw, 532px" className="object-cover opacity-65" /><div className="absolute inset-0 grid place-items-center"><div className="grid size-14 place-items-center rounded-full bg-white text-ink"><span className="ml-1 text-xl">▶</span></div></div><div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white"><span className="font-causten text-lg font-medium">{product.name}</span><span className="text-sm">1:00 M</span></div></div></div></section>
      </div>
    </main>
  );
}
