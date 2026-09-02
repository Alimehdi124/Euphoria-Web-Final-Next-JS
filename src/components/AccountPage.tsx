"use client";

import { Heart, LogOut, Package, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

const accountLinks = [
  { label: "My info", href: "/account", icon: UserRound },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "My orders", href: "/account#orders", icon: Package }
];

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const profile = user ?? { firstName: "Jhanvi", lastName: "Shah", email: "jhanvi.shah@example.com", phone: "(405) 555-0128" };

  return (
    <main className="mx-auto max-w-content px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-16">
      <div className="mb-12 flex items-center gap-2 text-sm text-muted"><Link href="/">Home</Link><span>/</span><span className="text-ink">My Account</span></div>
      <div className="grid gap-10 lg:grid-cols-[295px_1fr] lg:gap-12">
        <aside>
          <h1 className="font-core text-[34px] font-semibold text-ink">My Account</h1>
          <p className="mt-2 text-sm text-muted">Welcome back, {profile.firstName}</p>
          <div className="mt-8 grid gap-1">
            {accountLinks.map(({ label, href, icon: Icon }, index) => <Link key={label} href={href} className={`flex items-center gap-4 px-5 py-3.5 font-semibold ${index === 0 ? "border-l-2 border-ink bg-canvas text-ink" : "text-muted"}`}><Icon size={20} strokeWidth={1.7} />{label}</Link>)}
            <button onClick={() => { logout(); router.push("/login"); }} className="mt-3 flex items-center gap-4 px-5 py-3.5 font-semibold text-muted"><LogOut size={20} strokeWidth={1.7} />Sign out</button>
          </div>
        </aside>
        <section>
          <h2 className="font-core text-2xl font-semibold text-ink">My info</h2>
          <div className="mt-7 grid gap-7 border-b border-line/60 pb-8 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-ink">First name<input defaultValue={profile.firstName} className="mt-1 h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label>
            <label className="grid gap-2 text-sm font-semibold text-ink">Last name<input defaultValue={profile.lastName} className="mt-1 h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label>
            <label className="grid gap-2 text-sm font-semibold text-ink">Phone<input defaultValue={profile.phone} className="mt-1 h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label>
            <label className="grid gap-2 text-sm font-semibold text-ink">Email address<input defaultValue={profile.email} className="mt-1 h-14 rounded-soft bg-canvas px-5 font-normal outline-none focus:ring-1 focus:ring-accent" /></label>
          </div>
          <div className="mt-9 flex items-center justify-between border-b border-line/60 pb-7"><div><h2 className="font-core text-2xl font-semibold text-ink">Password</h2><div className="mt-3 flex gap-2 text-ink">{Array.from({ length: 8 }).map((_, index) => <span key={index} className="size-1.5 rounded-full bg-ink" />)}</div></div><button className="font-semibold text-ink underline underline-offset-4">Change</button></div>
          <div id="orders" className="mt-9"><h2 className="font-core text-2xl font-semibold text-ink">Recent orders</h2><div className="mt-6 overflow-hidden rounded-card border border-line/50"><div className="grid grid-cols-3 bg-canvas px-5 py-4 text-xs font-bold uppercase tracking-widest text-muted"><span>Order</span><span>Date</span><span>Status</span></div><div className="grid grid-cols-3 px-5 py-5 text-sm"><span className="font-semibold text-ink">#EUP-1024</span><span className="text-muted">24 Jan 2025</span><span className="font-semibold text-accent">Delivered</span></div></div></div>
        </section>
      </div>
    </main>
  );
}
