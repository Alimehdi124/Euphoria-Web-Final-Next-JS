import HeroBanner from "@/components/HeroBanner";
import SectionHeading from "@/components/SectionHeading";
import ProductGrid from "@/components/ProductGrid";
import CategorySection from "@/components/CategorySection";
import DealBanners from "@/components/DealBanners";

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-0">
        <section id="shop" className="py-16 sm:py-20 lg:py-24" aria-labelledby="new-arrivals-heading">
          <SectionHeading id="new-arrivals-heading" title="New Arrival" />
          <ProductGrid variant="arrival" />
        </section>
        <DealBanners />
        <CategorySection />
        <section className="py-16 sm:py-20 lg:py-24" aria-labelledby="trending-heading">
          <SectionHeading id="trending-heading" title="Trending Now" />
          <ProductGrid variant="trending" />
        </section>
      </div>
    </main>
  );
}
