import { ArrowUpRight } from "lucide-react";

const deals = [
  { label: "Limited offer", title: "High coziness", detail: "Up to 50% off", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85", position: "object-[center_25%]" },
  { label: "New collection", title: "Breezy summer style", detail: "Fresh looks are here", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85", position: "object-[center_25%]" }
];

export default function DealBanners() {
  return (
    <section className="grid gap-5 pb-16 sm:gap-6 sm:pb-20 lg:grid-cols-2 lg:pb-24" aria-label="Featured offers">
      {deals.map((deal) => (
        <article key={deal.title} className="relative h-[280px] overflow-hidden rounded-card shadow-card sm:h-[356px]">
          <img src={deal.image} alt="" className={`absolute inset-0 size-full object-cover ${deal.position}`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          <div className="relative flex h-full max-w-[310px] flex-col justify-between p-7 text-white sm:p-8">
            <div>
              <p className="font-core text-sm font-extrabold uppercase tracking-[0.18em]">{deal.label}</p>
              <h2 className="mt-7 font-core text-[32px] font-extrabold leading-tight sm:text-[34px]">{deal.title}</h2>
              <p className="mt-3 font-core text-base font-medium tracking-wide">{deal.detail}</p>
            </div>
            <a href="#shop" className="inline-flex w-fit items-center gap-2 font-core text-lg font-extrabold underline underline-offset-4">Shop now <ArrowUpRight size={18} /></a>
          </div>
        </article>
      ))}
    </section>
  );
}
