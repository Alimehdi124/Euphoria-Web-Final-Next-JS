"use client";

import { useLanguage } from "@/components/LanguageProvider";

type SectionHeadingProps = {
  title: string;
  id?: string;
};

export default function SectionHeading({ title, id }: SectionHeadingProps) {
  const { t } = useLanguage();
  const key = title === "New Arrival" ? "home.newArrival" : title === "Trending Now" ? "home.trending" : title;
  return <div className="mb-9 flex items-center gap-5 sm:mb-11"><span className="h-8 w-1.5 rounded-pill bg-accent sm:h-[30px]" aria-hidden="true" /><h2 id={id} className="font-core text-[28px] font-semibold tracking-[0.02em] text-ink sm:text-[34px]">{t(key)}</h2></div>;
}
