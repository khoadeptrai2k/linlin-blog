"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { routing, localeMeta, type Locale } from "@/i18n/routing";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";

const keys = {
  vi: { title: "viTitle", status: "viStatus", body: "viBody", focus: "viFocus", sample: "viSample" },
  en: { title: "enTitle", status: "enStatus", body: "enBody", focus: "enFocus", sample: "enSample" },
  zh: { title: "zhTitle", status: "zhStatus", body: "zhBody", focus: "zhFocus", sample: "zhSample" },
  th: { title: "thTitle", status: "thStatus", body: "thBody", focus: "thFocus", sample: "thSample" },
} as const;

const shapes = ["pebble-a", "pebble-b", "pebble-c", "pebble-d"] as const;

export function Tracks() {
  const t = useTranslations("Tracks");
  const common = useTranslations("Common");
  const router = useRouter();
  const [open, setOpen] = useState<Locale | null>(null);
  const active = open ? keys[open] : null;

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
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(locale)}
                className={`glass-tile ${shapes[index]} p-7 ${index % 2 ? "sm:translate-y-6" : ""}`}
              >
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
                  {t(keys[locale].status)}
                </p>
                <h3 className="font-display mt-3 text-2xl text-sky-700">{t(keys[locale].title)}</h3>
                <p className="mt-2 leading-7 text-ink-soft">{t(keys[locale].body)}</p>
                <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                  {common("openDetails")}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <CardDrawer
        open={Boolean(open && active)}
        onClose={() => setOpen(null)}
        eyebrow={open ? localeMeta[open].native : t("title")}
        title={active ? t(active.title) : ""}
        body={active ? t(active.body) : undefined}
        tiles={
          open && active
            ? [
                { label: t("focusLabel"), value: t(active.focus) },
                { label: t("timeLabel"), value: t("timeValue") },
                { label: t("sampleLabel"), value: t(active.sample), wide: true },
              ]
            : undefined
        }
        ctaLabel={t("openPath")}
        onCta={() => {
          const locale = open;
          setOpen(null);
          if (locale) router.push("/learn", { locale });
        }}
      />
    </section>
  );
}
