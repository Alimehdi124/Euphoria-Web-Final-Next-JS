import type { Product } from "@/components/ProductCard";

export type CatalogProduct = Product & {
  slug: string;
  category: "women" | "men" | "combos" | "joggers";
  color: string;
  description: string;
};

const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

export const products: CatalogProduct[] = [
  { slug: "blue-flower-print-crop-top", name: "Blue Flower Print Crop Top", brand: "Petite Studio", price: "$29.00", image: image("photo-1485968579580-b6d095142e6e"), category: "women", color: "Blue", description: "A light, easy crop top cut from soft cotton with a hand-drawn floral print." },
  { slug: "yellow-summer-shirt", name: "Yellow Summer Shirt", brand: "Urban Classics", price: "$49.00", image: image("photo-1529139574466-a303027c1d8b"), category: "women", color: "Yellow", description: "A relaxed summer shirt with a comfortable drape and clean finish." },
  { slug: "purple-sport-suit", name: "Purple Sport Suit", brand: "Fresh Mode", price: "$119.00", image: image("photo-1515886657613-9f3515b0c78f"), category: "women", color: "Purple", description: "A streamlined two-piece set designed for movement and everyday comfort." },
  { slug: "relaxed-womens-tee", name: "Relaxed Womens Tee", brand: "Street Studio", price: "$45.00", image: image("photo-1496747611176-843222e1e57c"), category: "women", color: "White", description: "The everyday tee, updated with a relaxed silhouette and premium jersey." },
  { slug: "classic-overshirt", name: "Classic Overshirt", brand: "Euphoria Men", price: "$99.00", image: image("photo-1598808503746-f34c53b9323e"), category: "men", color: "Sand", description: "A versatile layer with a regular fit and a considered utility pocket." },
  { slug: "printed-t-shirt", name: "Printed T-Shirt", brand: "Euphoria Basics", price: "$39.00", image: image("photo-1521572163474-6864f9cf17ab"), category: "men", color: "Black", description: "A heavyweight cotton tee with a crisp graphic and soft washed handfeel." },
  { slug: "plain-boxy-t-shirt", name: "Plain Boxy T-Shirt", brand: "Street Studio", price: "$45.00", image: image("photo-1503342217505-b0a15ec3261c"), category: "men", color: "White", description: "A boxy everyday essential made to layer or wear on its own." },
  { slug: "urban-polo-t-shirt", name: "Urban Polo T-Shirt", brand: "Retro Knit", price: "$59.00", image: image("photo-1602810318383-e386cc2a3ccf"), category: "men", color: "Green", description: "A modern polo with a relaxed collar and breathable textured knit." },
  { slug: "weekend-co-ord", name: "Weekend Co-ord", brand: "Euphoria Edit", price: "$129.00", image: image("photo-1551488831-00ddcb6c6bd3"), category: "combos", color: "Stone", description: "A refined matching set that moves effortlessly from slow mornings to late plans." },
  { slug: "soft-lounge-combo", name: "Soft Lounge Combo", brand: "Comfort Club", price: "$109.00", image: image("photo-1556821840-3a63f95609a7"), category: "combos", color: "Grey", description: "A soft, coordinated set with brushed texture and an easy fit." },
  { slug: "knitted-joggers", name: "Knitted Joggers", brand: "Retro Knit", price: "$89.00", image: image("photo-1542272604-787c3835535d"), category: "joggers", color: "Charcoal", description: "Relaxed knitted joggers finished with a flexible waistband and tapered leg." },
  { slug: "essential-fleece-joggers", name: "Essential Fleece Joggers", brand: "Euphoria Basics", price: "$74.00", image: image("photo-1602810318383-e386cc2a3ccf"), category: "joggers", color: "Cream", description: "An everyday fleece jogger with a clean profile and warm soft interior." }
];

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
