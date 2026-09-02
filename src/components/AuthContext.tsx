"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type MockUser = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  user: MockUser | null;
  login: (email: string) => void;
  register: (user: MockUser) => void;
  logout: () => void;
};

const demoUser: MockUser = {
  firstName: "Jhanvi",
  lastName: "Shah",
  email: "jhanvi.shah@example.com",
  phone: "(405) 555-0128"
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("euphoria-user");
    if (saved) {
      try { setUser(JSON.parse(saved) as MockUser); } catch { window.localStorage.removeItem("euphoria-user"); }
    }
  }, []);

  const value = useMemo(() => ({
    user,
    login: (email: string) => {
      const nextUser = { ...demoUser, email: email || demoUser.email };
      setUser(nextUser);
      window.localStorage.setItem("euphoria-user", JSON.stringify(nextUser));
    },
    register: (nextUser: MockUser) => {
      setUser(nextUser);
      window.localStorage.setItem("euphoria-user", JSON.stringify(nextUser));
    },
    logout: () => {
      setUser(null);
      window.localStorage.removeItem("euphoria-user");
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
