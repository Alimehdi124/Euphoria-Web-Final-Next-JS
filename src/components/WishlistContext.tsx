"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishlistContextValue = {
  slugs: string[];
  isSaved: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("euphoria-wishlist");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((slug) => typeof slug === "string")) {
          setSlugs(parsed);
        }
      } catch {
        window.localStorage.removeItem("euphoria-wishlist");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem("euphoria-wishlist", JSON.stringify(slugs));
  }, [hydrated, slugs]);

  const value = useMemo(() => ({
    slugs,
    isSaved: (slug: string) => slugs.includes(slug),
    toggle: (slug: string) => setSlugs((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]),
    remove: (slug: string) => setSlugs((current) => current.filter((item) => item !== slug))
  }), [slugs]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
