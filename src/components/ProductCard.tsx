"use client";

import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export type Product = {
  name: string;
  brand: string;
  price: string;
  image: string;
  tag?: string;
  slug?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[0.92] overflow-hidden rounded-card bg-canvas">
        <Link href={product.slug ? `/products/${product.slug}` : "#shop"} className="absolute inset-0">
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 280px" className="object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        {product.tag && <span className="absolute left-3 top-3 rounded-pill bg-white px-3 py-1 font-causten text-xs font-semibold uppercase tracking-[0.12em] text-ink">{product.tag}</span>}
        <button onClick={() => setLiked(!liked)} className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-icon transition-colors ${liked ? "text-accent" : "text-ink"}`} aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}>
          <Heart size={17} fill={liked ? "currentColor" : "none"} strokeWidth={1.8} />
        </button>
      </div>
      <div className="flex items-start justify-between gap-2 pt-4">
        <div className="min-w-0">
          <h3 className="truncate font-causten text-base font-bold text-ink sm:text-lg">{product.name}</h3>
          <p className="mt-1 font-causten text-sm font-medium text-muted sm:text-base">{product.brand}</p>
          <div className="mt-2 flex items-center gap-1 text-sunshine">
            <Star size={13} fill="currentColor" strokeWidth={1.5} />
            <span className="font-causten text-xs text-muted">4.8</span>
          </div>
        </div>
        <span className="shrink-0 rounded-soft bg-canvas px-3 py-2 font-causten text-sm font-bold text-ink sm:text-base">{product.price}</span>
      </div>
    </article>
  );
}
