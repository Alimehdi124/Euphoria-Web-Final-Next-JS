"use client";

import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useLanguage } from "@/components/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Combos", href: "/combos" },
  { label: "Joggers", href: "/joggers" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setOpen(false);
  };

  return (
    <header className="relative z-30 border-b border-line/70 bg-white">
      <div className="mx-auto flex h-[88px] max-w-content items-center gap-6 px-5 sm:px-8 lg:h-[108px] lg:px-0">
        <Link href="/" className="shrink-0 font-mintaka text-[30px] leading-none tracking-[-0.06em] text-ink sm:text-[34px]" aria-label="Euphoria home">
          Euphoria
        </Link>

        <nav className="ml-5 hidden items-center gap-7 lg:flex xl:ml-12 xl:gap-10" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = item.href === "/shop" ? pathname === "/" || pathname === "/shop" : pathname.startsWith(item.href);
            return <Link key={item.label} href={item.href} className={`font-causten text-[18px] transition-colors hover:text-ink xl:text-[20px] ${isActive ? "font-bold text-ink" : "font-medium text-muted"}`}>
              {t(`nav.${item.label.toLowerCase()}`)}
            </Link>;
          })}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden h-11 w-[220px] items-center gap-3 rounded-soft bg-canvas px-4 md:flex xl:w-[267px]">
          <Search size={20} strokeWidth={1.8} className="text-muted" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted" placeholder={t("common.search")} aria-label={t("common.search")} />
        </form>

        <div className="ml-auto flex items-center gap-2 sm:gap-3 md:ml-3">
          <Link href="/wishlist" className="grid size-10 place-items-center rounded-soft bg-canvas text-muted transition-colors hover:text-ink sm:size-11" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.7} />
          </Link>
          <Link href="/account" className="hidden size-11 place-items-center rounded-soft bg-canvas text-muted transition-colors hover:text-ink sm:grid" aria-label="Account">
            <UserRound size={20} strokeWidth={1.7} />
          </Link>
          <Link href="/cart" className="relative grid size-10 place-items-center rounded-soft bg-canvas text-muted transition-colors hover:text-ink sm:size-11" aria-label={`Shopping bag, ${count} items`}>
            <ShoppingBag size={20} strokeWidth={1.7} />
            {count > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-4 text-white">{count}</span>}
          </Link>
          <LanguageSwitcher />
          <button className="grid size-10 place-items-center rounded-soft bg-canvas text-ink lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="absolute left-0 right-0 top-full border-b border-line/60 bg-white px-5 py-5 shadow-float lg:hidden" aria-label="Mobile navigation">
          <form onSubmit={submitSearch} className="mb-4 flex h-11 items-center gap-3 rounded-soft bg-canvas px-4 md:hidden">
            <Search size={19} className="text-muted" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" placeholder={t("common.search")} aria-label={t("common.search")} />
          </form>
          <div className="grid gap-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className={`rounded-soft px-3 py-3 text-lg ${item.href === "/shop" ? (pathname === "/" || pathname === "/shop" ? "bg-canvas font-bold text-ink" : "font-medium text-muted") : pathname.startsWith(item.href) ? "bg-canvas font-bold text-ink" : "font-medium text-muted"}`}>
                {t(`nav.${item.label.toLowerCase()}`)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
