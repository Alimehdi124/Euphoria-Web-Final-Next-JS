"use client";

import { BarChart3, Boxes, ClipboardList, LayoutDashboard, LogOut, Tags, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const items = [
    { href: "/admin", label: t("admin.dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("admin.products"), icon: Boxes },
    { href: "/admin/categories", label: t("admin.categories"), icon: Tags },
    { href: "/admin/orders", label: t("admin.orders"), icon: ClipboardList },
    { href: "/admin/users", label: t("admin.users"), icon: Users }
  ];

  async function signOut() {
    await getSupabaseBrowserClient()?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return <div className="min-h-screen bg-[#f7f7f8] text-ink"><aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line/50 bg-white px-5 py-7 lg:block"><Link href="/admin" className="font-mintaka text-3xl tracking-[-0.06em]">Euphoria</Link><p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">Admin panel</p><nav className="mt-10 grid gap-1">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex items-center gap-3 rounded-soft px-4 py-3 text-sm font-semibold ${pathname === href ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"}`}><Icon size={18} />{label}</Link>)}</nav><button onClick={signOut} className="absolute bottom-7 left-5 flex items-center gap-3 px-4 py-3 text-sm font-semibold text-muted"><LogOut size={18} />{t("admin.signOut")}</button></aside><div className="lg:pl-64"><header className="flex items-center justify-between border-b border-line/50 bg-white px-5 py-5 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-widest text-muted">Admin workspace</p><p className="mt-1 text-sm text-ink">{email}</p></div><div className="flex items-center gap-4"><LanguageSwitcher /><button onClick={signOut} className="text-sm font-semibold text-muted lg:hidden">{t("admin.signOut")}</button></div></header><main className="px-5 py-8 sm:px-8 lg:px-10">{children}</main></div></div>;
}
