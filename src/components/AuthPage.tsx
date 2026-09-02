"use client";

import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthContext";

type AuthMode = "login" | "signup" | "forgot" | "reset";

const copy: Record<AuthMode, { title: string; text: string; button: string }> = {
  login: { title: "Welcome back", text: "Login to access your Euphoria account", button: "Log in" },
  signup: { title: "Sign up", text: "Sign up for free to access all of our products", button: "Sign up" },
  forgot: { title: "Reset your password", text: "Enter your email and we'll send you a link to reset your password.", button: "Send reset link" },
  reset: { title: "Create new password", text: "Your new password must be different from previous passwords.", button: "Reset password" }
};

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { login, register } = useAuth();
  const active = copy[mode];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    if (mode === "login") {
      login(email);
      router.push("/account");
      return;
    }
    if (mode === "signup") {
      register({ firstName: String(form.get("firstName") ?? "Jhanvi"), lastName: String(form.get("lastName") ?? "Shah"), email, phone: "(405) 555-0128" });
      router.push("/account");
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-[calc(100vh-88px)] lg:min-h-[calc(100vh-108px)]">
      <div className="grid min-h-[700px] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#d6cbc7] lg:block"><img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1300&q=85" alt="Euphoria collection" className="size-full object-cover" /><div className="absolute inset-0 bg-ink/20" /><div className="absolute bottom-16 left-16 max-w-[360px] text-white"><p className="font-core text-sm font-bold uppercase tracking-[0.2em]">The Euphoria edit</p><p className="mt-4 font-core text-4xl font-semibold leading-tight">Style is a feeling. Wear yours.</p></div></div>
        <div className="flex items-center justify-center px-5 py-16 sm:px-10 lg:px-16 xl:px-24"><div className="w-full max-w-[567px]">
          <h1 className="font-core text-[34px] font-semibold text-[#333]">{active.title}</h1><p className="mt-3 font-causten text-base text-[#666]/80">{active.text}</p>
          {submitted && <div className="mt-6 rounded-soft bg-[#eee5ff] px-4 py-3 font-causten text-sm font-medium text-accent">{mode === "forgot" ? "Reset link sent. Check your inbox to continue." : "Your password has been updated successfully."}</div>}
          <form onSubmit={submit} className="mt-10 grid gap-6">
            {mode === "signup" && <div className="grid gap-6 sm:grid-cols-2"><label className="grid gap-2 font-causten text-base font-medium text-ink"><span>First name</span><input required name="firstName" placeholder="Jhanvi" className="h-14 rounded-soft border border-line px-5 outline-none placeholder:text-muted/70" /></label><label className="grid gap-2 font-causten text-base font-medium text-ink"><span>Last name</span><input required name="lastName" placeholder="Shah" className="h-14 rounded-soft border border-line px-5 outline-none placeholder:text-muted/70" /></label></div>}
            {mode !== "reset" && <label className="grid gap-2 font-causten text-base font-medium text-ink"><span>Email address</span><span className="flex h-14 items-center gap-3 rounded-soft border border-line px-5"><Mail size={19} className="text-muted" /><input required name="email" type="email" placeholder="example@gmail.com" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/70" /></span></label>}
            {mode !== "forgot" && <label className="grid gap-2 font-causten text-base font-medium text-ink"><span>{mode === "reset" ? "New password" : "Password"}</span><span className="flex h-14 items-center gap-3 rounded-soft border border-line px-5"><LockKeyhole size={19} className="text-muted" /><input required minLength={8} type={showPassword ? "text" : "password"} placeholder="Enter your password" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted/70" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>}
            {mode === "signup" && <label className="flex items-start gap-3 font-causten text-sm text-muted"><input type="checkbox" required className="mt-0.5 size-4 accent-accent" /> I agree to our Terms of use and Privacy Policy.</label>}
            {mode === "login" && <div className="flex justify-end"><Link href="/forgot-password" className="font-causten text-sm font-medium text-ink underline underline-offset-4">Forgot password?</Link></div>}
            <button className="inline-flex h-14 items-center justify-center gap-3 rounded-soft bg-accent px-6 font-causten text-lg font-semibold text-white transition-colors hover:bg-[#7422e0]">{active.button} <ArrowRight size={19} /></button>
          </form>
          {mode === "login" && <p className="mt-6 text-center font-causten text-xs text-muted">Demo login: any valid email and password with 8+ characters</p>}
          <div className="mt-8 text-center font-causten text-base text-ink">{mode === "login" ? <>Don&apos;t have an account? <Link href="/signup" className="font-semibold text-accent underline underline-offset-4">Sign up</Link></> : mode === "signup" ? <>Already have an account? <Link href="/login" className="font-semibold text-accent underline underline-offset-4">Log in</Link></> : <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Back to Login</Link>}</div>
        </div></div>
      </div>
    </main>
  );
}
