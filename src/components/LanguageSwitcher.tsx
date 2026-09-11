"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  return <label className="flex items-center gap-2 text-xs font-semibold text-muted" aria-label={t("common.language")}>
    <span className="sr-only">{t("common.language")}</span>
    <select value={locale} onChange={(event) => setLocale(event.target.value as "en" | "az" | "ru")} className="rounded-soft border border-line/60 bg-white px-2 py-1.5 outline-none focus:ring-1 focus:ring-accent">
      <option value="en">EN</option><option value="az">AZ</option><option value="ru">RU</option>
    </select>
  </label>;
}
