"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    eyebrow: "T-shirt / Tops",
    title: "Summer\nEssentials",
    subtitle: "Fresh styles for the everyday",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=85"
  },
  {
    eyebrow: "New season",
    title: "The relaxed\nedit",
    subtitle: "Comfort, cut with intention",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2000&q=85"
  }
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const slide = slides[active];

  return (
    <section id="top" className="relative isolate h-[590px] overflow-hidden bg-[#7f6260] sm:h-[650px] lg:h-[716px]" aria-label="Featured collection">
      <img src={slide.image} alt="Euphoria summer collection" className="absolute inset-0 -z-20 size-full object-cover object-[58%_center] transition-opacity duration-500 lg:object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/65 via-black/25 to-black/5" />
      <div className="mx-auto flex h-full max-w-content items-center px-5 pb-8 sm:px-8 lg:px-0">
        <div className="max-w-[500px] pt-2 text-white sm:pt-8">
          <p className="font-core text-xl font-medium tracking-wide sm:text-[30px]">{slide.eyebrow}</p>
          <h1 className="mt-6 whitespace-pre-line font-core text-[54px] font-extrabold leading-[0.98] tracking-[0.01em] sm:text-[70px] lg:text-[78px]">{slide.title}</h1>
          <p className="mt-6 font-core text-2xl font-medium tracking-wide sm:text-[30px]">{slide.subtitle}</p>
          <a href="#shop" className="mt-9 inline-flex items-center gap-3 rounded-soft bg-white px-9 py-4 font-causten text-lg font-bold text-ink transition-transform hover:-translate-y-1 sm:px-[72px] sm:py-4 sm:text-2xl">
            Shop now <ArrowRight size={20} strokeWidth={2} />
          </a>
        </div>
      </div>
      <button onClick={() => setActive(active === 0 ? slides.length - 1 : active - 1)} className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:left-8" aria-label="Previous slide">
        <ChevronLeft size={26} />
      </button>
      <button onClick={() => setActive((active + 1) % slides.length)} className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:right-8" aria-label="Next slide">
        <ChevronRight size={26} />
      </button>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label="Hero slides">
        {slides.map((item, index) => (
          <button key={item.title} onClick={() => setActive(index)} className={`h-2.5 rounded-pill transition-all ${index === active ? "w-16 bg-white" : "w-16 bg-white/40"}`} aria-label={`Show slide ${index + 1}`} aria-selected={index === active} />
        ))}
      </div>
    </section>
  );
}
