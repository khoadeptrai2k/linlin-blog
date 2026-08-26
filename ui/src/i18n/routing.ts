import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en", "zh", "th"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export const localeMeta: Record<
  Locale,
  { label: string; native: string; short: string; flag: string }
> = {
  vi: { label: "Vietnamese", native: "Tiếng Việt", short: "VI", flag: "🇻🇳" },
  en: { label: "English", native: "English", short: "EN", flag: "🇬🇧" },
  zh: { label: "Chinese", native: "中文", short: "中", flag: "🇨🇳" },
  th: { label: "Thai", native: "ไทย", short: "TH", flag: "🇹🇭" },
};
