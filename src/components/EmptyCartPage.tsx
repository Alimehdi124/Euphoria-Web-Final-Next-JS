import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function EmptyCartPage() {
  return <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16"><div className="mb-12 flex items-center gap-2 text-sm text-muted"><Link href="/">Home</Link><span>/</span><span className="text-ink">Cart</span></div><div className="grid min-h-[620px] place-items-center rounded-card bg-canvas text-center"><div className="max-w-[490px] px-5"><div className="mx-auto grid size-28 place-items-center rounded-full bg-white text-accent shadow-card"><ShoppingBag size={48} strokeWidth={1.3} /></div><h1 className="mt-10 font-core text-[30px] font-semibold text-ink sm:text-[34px]">Your cart is empty and sad :(</h1><p className="mt-3 font-causten text-base text-muted">Add something to make it happy!</p><Link href="/shop" className="mt-8 inline-flex rounded-soft bg-accent px-9 py-4 font-causten text-lg font-semibold text-white">Continue shopping</Link></div></div></main>;
}
