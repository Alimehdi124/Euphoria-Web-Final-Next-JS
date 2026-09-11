"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = { id: string; slug: string; name: Record<string, string>; is_active: boolean };
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]); const [name, setName] = useState(""); const [error, setError] = useState("");
  async function load() { const response = await fetch("/api/admin/categories"); const body = await response.json(); if (!response.ok) throw new Error(body.error); setCategories(body.categories); }
  useEffect(() => { load().catch((reason: Error) => setError(reason.message)); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); const response = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }); if (!response.ok) { setError((await response.json()).error); return; } setName(""); load(); }
  async function remove(id: string) { if (!window.confirm("Delete this category?")) return; await fetch(`/api/admin/categories/${id}`, { method: "DELETE" }); load(); }
  return <div><p className="text-sm font-semibold uppercase tracking-widest text-muted">Management</p><h1 className="mt-2 font-core text-3xl font-semibold">Categories</h1>{error && <p className="mt-6 text-sm text-[#a51d2d]">{error}</p>}<form onSubmit={submit} className="mt-8 flex max-w-xl gap-3"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" className="h-12 flex-1 rounded-soft border border-line px-4 outline-none focus:ring-1 focus:ring-accent" /><button className="rounded-soft bg-ink px-5 font-semibold text-white">Create</button></form><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <div key={category.id} className="flex items-center justify-between rounded-card bg-white p-5 shadow-card"><div><p className="font-semibold">{category.name?.en || category.slug}</p><p className="mt-1 text-xs text-muted">{category.slug}</p></div><button onClick={() => remove(category.id)} className="text-sm font-semibold text-[#a51d2d]">Delete</button></div>)}</div></div>;
}
