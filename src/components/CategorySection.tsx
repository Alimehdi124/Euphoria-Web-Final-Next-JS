import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const women = [
  { title: "Hoodies & Sweatshirts", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85" },
  { title: "Coats & Parkas", image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&q=85" },
  { title: "Tees & T-Shirt", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85" },
  { title: "Boxers", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85" }
];

const men = [
  { title: "Shirts", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&q=85" },
  { title: "Printed T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85" },
  { title: "Plain T-Shirt", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=85" },
  { title: "Polo T-Shirt", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85" }
];

function CategoryCards({ items }: { items: typeof women }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
      {items.map((item) => (
        <a href="#shop" key={item.title} className="group min-w-0">
          <div className="aspect-[0.69] overflow-hidden rounded-media bg-canvas">
            <img src={item.image} alt={item.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-poppins text-sm font-medium tracking-[-0.04em] text-charcoal sm:text-[17px]">{item.title}</h3>
              <p className="mt-1 font-poppins text-xs font-medium text-[#7F7F7F] sm:text-[13px]">Explore now</p>
            </div>
            <ArrowRight size={19} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
          </div>
        </a>
      ))}
    </div>
  );
}

export default function CategorySection() {
  return (
    <section className="space-y-16 py-4 sm:space-y-20 sm:py-4 lg:space-y-24" aria-label="Shop by category">
      <div id="women">
        <SectionHeading title="Categories For Women" />
        <CategoryCards items={women} />
      </div>
      <div id="men">
        <SectionHeading title="Categories For Men" />
        <CategoryCards items={men} />
      </div>
    </section>
  );
}
