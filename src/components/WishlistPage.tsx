"use client";

import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";

export default function WishlistPage() {
  const { addToCart } = useCart();
  const { slugs, remove } = useWishlist();
  const savedProducts = products.filter((product) => slugs.includes(product.slug));

  return <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16"><div className="mb-12 flex items-center gap-2 text-sm text-muted"><Link href="/">Home</Link><span>/</span><span className="text-ink">Wishlist</span></div><div className="mb-10 flex items-end justify-between gap-4"><div><h1 className="font-core text-[34px] font-semibold text-ink">Wishlist</h1><p className="mt-2 text-base text-muted">Your saved favourites, all in one place.</p></div><span className="hidden rounded-pill bg-canvas px-4 py-2 text-sm font-semibold text-muted sm:block">{savedProducts.length} items</span></div>{savedProducts.length === 0 ? <div className="grid min-h-64 place-items-center rounded-card bg-canvas px-6 text-center"><div><h2 className="font-core text-2xl font-semibold text-ink">Your wishlist is empty</h2><p className="mt-2 text-muted">Save products you want to come back to.</p><Link href="/shop" className="mt-6 inline-flex rounded-soft bg-accent px-7 py-3 font-semibold text-white">Explore products</Link></div></div> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">{savedProducts.map((product) => <article key={product.slug} className="group"><div className="relative aspect-[0.92] overflow-hidden rounded-card bg-canvas"><Link href={`/products/${product.slug}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, 280px" className="object-cover transition duration-500 group-hover:scale-105" /></Link><button onClick={() => remove(product.slug)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white text-accent shadow-icon" aria-label={`Remove ${product.name} from wishlist`}><Heart size={17} fill="currentColor" /></button><button onClick={() => addToCart(product)} className="absolute bottom-3 left-3 right-3 flex h-10 items-center justify-center gap-2 rounded-soft bg-white/95 text-sm font-semibold text-ink opacity-0 shadow-card transition-opacity group-hover:opacity-100"><ShoppingBag size={16} /> Add to cart</button></div><Link href={`/products/${product.slug}`} className="mt-4 block truncate font-bold text-ink">{product.name}</Link><p className="mt-1 text-sm text-muted">{product.brand}</p><span className="mt-2 block font-bold text-ink">{product.price}</span></article>)}</div>}</main>;
}
