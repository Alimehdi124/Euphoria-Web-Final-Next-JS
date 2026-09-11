"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { messages, type Locale } from "@/lib/i18n/messages";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const router = useRouter();

  useEffect(() => {
    const saved = window.localStorage.getItem("euphoria-locale");
    if (saved === "en" || saved === "az") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.cookie = `euphoria-locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    window.localStorage.setItem("euphoria-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale: (nextLocale: Locale) => {
      setLocaleState(nextLocale);
      document.cookie = `euphoria-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    t: (key: string) => messages[locale][key] || messages.en[key] || key
  }), [locale, router]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
