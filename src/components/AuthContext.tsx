"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export type MockUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  user: MockUser | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (user: MockUser, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const mapUser = (authUser: { email?: string; user_metadata?: Record<string, string> } | null): MockUser | null => authUser ? {
      firstName: authUser.user_metadata?.first_name || authUser.user_metadata?.full_name?.split(" ")[0] || "",
      lastName: authUser.user_metadata?.last_name || authUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
      email: authUser.email || "",
      phone: authUser.user_metadata?.phone || ""
    } : null;
    supabase.auth.getUser().then(({ data }) => setUser(mapUser(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(mapUser(session?.user || null)));
    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo(() => ({
    user,
    login: async (email: string, password: string) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return "Supabase is not configured.";
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error?.message || null;
    },
    register: async (nextUser: MockUser, password: string) => {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) return "Supabase is not configured.";
      const { error } = await supabase.auth.signUp({ email: nextUser.email, password, options: { data: { first_name: nextUser.firstName, last_name: nextUser.lastName, phone: nextUser.phone, full_name: `${nextUser.firstName} ${nextUser.lastName}` } } });
      return error?.message || null;
    },
    logout: async () => {
      await getSupabaseBrowserClient()?.auth.signOut();
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
