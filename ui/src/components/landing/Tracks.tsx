import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Reveal } from "@/components/ui/Reveal";

const bodies = {
  vi: "viBody",
  en: "enBody",
  zh: "zhBody",
  th: "thBody",
} as const;

const titles = {
  vi: "viTitle",
  en: "enTitle",
  zh: "zhTitle",
  th: "thTitle",
} as const;

const statuses = {
  vi: "viStatus",
  en: "enStatus",
  zh: "zhStatus",
  th: "thStatus",
} as const;

export async function Tracks() {
  const t = await getTranslations("Tracks");

  return (
    <section id="tracks" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {routing.locales.map((locale, index) => (
            <Reveal key={locale} delayMs={index * 80}>
              <Link
                href="/"
                locale={locale}
                className={`glass-tile pebble-b block p-7 hover:bg-white/70 ${
                  index % 2 ? "sm:translate-y-6" : ""
                }`}
              >
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
                  {t(statuses[locale])}
                </p>
                <h3 className="font-display mt-3 text-2xl text-sky-700">{t(titles[locale])}</h3>
                <p className="mt-2 leading-7 text-ink-soft">{t(bodies[locale])}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
