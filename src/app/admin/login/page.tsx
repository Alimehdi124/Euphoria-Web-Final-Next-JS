"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { supabaseConfigured } from "@/lib/supabase/env";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured. Add the required environment variables first.");
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError(signInError.message);
    else router.push("/admin");
    setLoading(false);
  }

  return <main className="grid min-h-screen place-items-center bg-[#f7f7f8] px-5 py-12"><div className="w-full max-w-md rounded-card bg-white p-8 shadow-card sm:p-10"><Link href="/" className="font-mintaka text-3xl tracking-[-0.06em] text-ink">Euphoria</Link><h1 className="mt-10 font-core text-3xl font-semibold text-ink">Admin sign in</h1><p className="mt-2 text-sm text-muted">Only users with the admin role can access this panel.</p>{!supabaseConfigured && <p className="mt-5 rounded-soft bg-[#fff4dd] px-4 py-3 text-sm text-[#8a5a00]">Supabase is not configured yet.</p>}{error && <p className="mt-5 rounded-soft bg-[#ffe9e9] px-4 py-3 text-sm text-[#a51d2d]">{error}</p>}<form onSubmit={submit} className="mt-8 grid gap-5"><label className="grid gap-2 text-sm font-semibold text-ink">Email<input required name="email" type="email" className="h-12 rounded-soft border border-line px-4 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><label className="grid gap-2 text-sm font-semibold text-ink">Password<input required name="password" type="password" className="h-12 rounded-soft border border-line px-4 font-normal outline-none focus:ring-1 focus:ring-accent" /></label><button disabled={loading || !supabaseConfigured} className="h-12 rounded-soft bg-ink font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button></form></div></main>;
}
