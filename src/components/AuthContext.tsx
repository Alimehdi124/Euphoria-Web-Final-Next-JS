"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MockUser = { firstName: string; lastName: string; email: string; phone: string; role?: "customer" | "admin" };
type AuthContextValue = { user: MockUser | null; login: (email: string, password: string) => Promise<string | null>; register: (user: MockUser, password: string) => Promise<string | null>; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  useEffect(() => { fetch("/api/auth/me").then((response) => response.json()).then((body) => setUser(body.user)); }, []);
  const value = useMemo(() => ({
    user,
    login: async (email: string, password: string) => { const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) }); const body = await response.json(); if (!response.ok) return body.error || "Login failed"; setUser(body.user); return null; },
    register: async (nextUser: MockUser, password: string) => { const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...nextUser, password }) }); const body = await response.json(); if (!response.ok) return body.error || "Registration failed"; setUser(body.user); return null; },
    logout: async () => { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); }
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used inside AuthProvider"); return context; }
