import { Facebook, Instagram, Mail, MapPin, Twitter } from "lucide-react";
import Link from "next/link";

const columns = [
  { title: "Shop", links: ["Women", "Men", "New arrivals", "Combos"] },
  { title: "Help", links: ["Contact us", "Shipping & returns", "FAQ", "Track order"] },
  { title: "About", links: ["Our story", "Sustainability", "Careers", "Journal"] }
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-16 lg:px-0 lg:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-16">
          <div>
            <Link href="/" className="font-mintaka text-[34px] tracking-[-0.06em]">Euphoria</Link>
            <p className="mt-5 max-w-[270px] font-causten text-base leading-7 text-white/65">Clothes that keep up with every version of you. Designed for now, made to last.</p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => <a key={index} href="#social" className="grid size-10 place-items-center rounded-soft bg-white/10 text-white/80 transition-colors hover:bg-white hover:text-ink" aria-label={`Euphoria social link ${index + 1}`}><Icon size={17} /></a>)}
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-core text-lg font-semibold">{column.title}</h2>
              <ul className="mt-5 grid gap-3">
                {column.links.map((link) => <li key={link}><a href="#shop" className="font-causten text-base text-white/65 transition-colors hover:text-white">{link}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 grid gap-4 border-t border-white/15 pt-7 text-sm text-white/60 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2"><span className="inline-flex items-center gap-2"><MapPin size={15} /> London / New York</span><span className="inline-flex items-center gap-2"><Mail size={15} /> hello@euphoria.com</span></div>
          <span>© 2025 Euphoria. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
