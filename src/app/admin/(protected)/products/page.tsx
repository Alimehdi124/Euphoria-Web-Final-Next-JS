"use client";

import { FormEvent, useEffect, useState } from "react";

type AdminProduct = { id: string; name: Record<string, string>; brand: string; category: string; color: string; price: number; stock: number; image_url: string | null };
type FormState = { name: string; nameAz: string; description: string; brand: string; category: string; color: string; price: string; discountPrice: string; stock: string; isFeatured: boolean };
const emptyForm: FormState = { name: "", nameAz: "", description: "", brand: "Euphoria", category: "women", color: "Black", price: "", discountPrice: "", stock: "0", isFeatured: false };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    const response = await fetch("/api/admin/products");
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Could not load products");
    setProducts(body.products);
  }

  useEffect(() => { loadProducts().catch((reason: Error) => setError(reason.message)); }, []);
  function update(field: keyof FormState, value: string | boolean) { setForm((current) => ({ ...current, [field]: value })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(""); setNotice("");
    try {
      const payload = { name: form.name, description: form.description, nameTranslations: { en: form.name, az: form.nameAz || form.name }, descriptionTranslations: { en: form.description, az: form.description }, brand: form.brand, category: form.category, color: form.color, price: form.price, discountPrice: form.discountPrice, stock: form.stock, isFeatured: form.isFeatured };
      const response = await fetch(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not save product");
      const productId = editingId || String(body.product.id);
      if (file) {
        const imageData = new FormData(); imageData.set("file", file);
        const imageResponse = await fetch(`/api/admin/products/${productId}/image`, { method: "POST", body: imageData });
        const imageBody = await imageResponse.json();
        if (!imageResponse.ok) throw new Error(imageBody.error || "Image upload failed");
      }
      setForm(emptyForm); setFile(null); setEditingId(null); setNotice(editingId ? "Product updated" : "Product created"); await loadProducts();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not save product"); }
    setLoading(false);
  }

  function edit(product: AdminProduct) {
    setEditingId(product.id); setForm({ ...emptyForm, name: product.name?.en || "", nameAz: product.name?.az || "", brand: product.brand, category: product.category, color: product.color, price: String(product.price), stock: String(product.stock) }); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!response.ok) { setError((await response.json()).error || "Could not delete product"); return; }
    await loadProducts(); setNotice("Product deleted");
  }

  return <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-muted">Catalog</p><h1 className="mt-2 font-core text-3xl font-semibold">Products</h1></div><span className="rounded-pill bg-white px-4 py-2 text-sm font-semibold text-muted">{products.length} products</span></div>{notice && <p className="mt-6 rounded-soft bg-[#e7f7ec] px-4 py-3 text-sm text-[#176b35]">{notice}</p>}{error && <p className="mt-6 rounded-soft bg-[#ffe9e9] px-4 py-3 text-sm text-[#a51d2d]">{error}</p>}<section className="mt-8 rounded-card bg-white p-6 shadow-card"><h2 className="font-core text-xl font-semibold">{editingId ? "Edit product" : "Create product"}</h2><form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><label className="grid gap-2 text-sm font-semibold">Name (English)<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Name (Azerbaijani)<input value={form.nameAz} onChange={(event) => update("nameAz", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold lg:col-span-3">Description<textarea required value={form.description} onChange={(event) => update("description", event.target.value)} className="min-h-24 rounded-soft border border-line px-3 py-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Brand<input required value={form.brand} onChange={(event) => update("brand", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Category<select value={form.category} onChange={(event) => update("category", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal"><option value="women">Women</option><option value="men">Men</option><option value="combos">Combos</option><option value="joggers">Joggers</option></select></label><label className="grid gap-2 text-sm font-semibold">Color<input required value={form.color} onChange={(event) => update("color", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Price<input required min="0" step="0.01" type="number" value={form.price} onChange={(event) => update("price", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Discount price<input min="0" step="0.01" type="number" value={form.discountPrice} onChange={(event) => update("discountPrice", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold">Stock<input required min="0" step="1" type="number" value={form.stock} onChange={(event) => update("stock", event.target.value)} className="h-11 rounded-soft border border-line px-3 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold lg:col-span-2">Product image<input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="block h-11 rounded-soft border border-line px-3 py-2 text-sm font-normal" /><span className="text-xs font-normal text-muted">Stored as binary data in SQL Server. Maximum 5 MB.</span></label><label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} className="size-4 accent-accent" /> Featured product</label><div className="flex gap-3 lg:col-span-3"><button disabled={loading} className="rounded-soft bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : editingId ? "Update product" : "Create product"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); setFile(null); }} className="rounded-soft border border-line px-6 py-3 text-sm font-semibold">Cancel</button>}</div></form></section><section className="mt-8 overflow-hidden rounded-card bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-line/50 bg-canvas text-xs uppercase tracking-widest text-muted"><tr><th className="px-5 py-4">Product</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Price</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-line/30 last:border-0"><td className="px-5 py-4"><p className="font-semibold">{product.name?.en || "Untitled"}</p><p className="mt-1 text-xs text-muted">{product.brand}</p></td><td className="px-5 py-4 capitalize text-muted">{product.category}</td><td className="px-5 py-4 font-semibold">${Number(product.price).toFixed(2)}</td><td className="px-5 py-4 text-muted">{product.stock}</td><td className="px-5 py-4 text-right"><button onClick={() => edit(product)} className="mr-4 font-semibold text-ink underline">Edit</button><button onClick={() => remove(product.id)} className="font-semibold text-[#a51d2d] underline">Delete</button></td></tr>)}</tbody></table></div>{!products.length && <p className="p-8 text-center text-sm text-muted">No products in the database yet.</p>}</section></div>;
}
