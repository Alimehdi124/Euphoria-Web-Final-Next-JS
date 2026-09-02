"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type CatalogProduct } from "@/lib/products";

export type CartItem = { product: CatalogProduct; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: CatalogProduct, quantity?: number) => void;
  changeQuantity: (slug: string, amount: number) => void;
  removeFromCart: (slug: string) => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const initialItems: CartItem[] = products.slice(0, 3).map((product, index) => ({ product, quantity: index + 1 }));

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("euphoria-cart");
    if (saved) {
      try { setItems(JSON.parse(saved) as CartItem[]); } catch { setItems(initialItems); }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("euphoria-cart", JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo(() => ({
    items,
    addToCart: (product: CatalogProduct, quantity = 1) => setItems((current) => {
      const existing = current.find((item) => item.product.slug === product.slug);
      return existing ? current.map((item) => item.product.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { product, quantity }];
    }),
    changeQuantity: (slug: string, amount: number) => setItems((current) => current.map((item) => item.product.slug === slug ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)),
    removeFromCart: (slug: string) => setItems((current) => current.filter((item) => item.product.slug !== slug)),
    count: items.reduce((total, item) => total + item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
