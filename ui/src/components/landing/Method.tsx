"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const steps = [
  { id: "step1", src: photos.notes, shape: "pebble-a", tilt: "-rotate-2" },
  { id: "step2", src: photos.cafe, shape: "pebble-b", tilt: "rotate-1" },
  { id: "step3", src: photos.practice, shape: "pebble-c", tilt: "-rotate-1" },
] as const;

export function Method() {
  const t = useTranslations("Method");
  const common = useTranslations("Common");
  const hero = useTranslations("Hero");
  const router = useRouter();
  const [open, setOpen] = useState<(typeof steps)[number]["id"] | null>(null);
  const active = steps.find((step) => step.id === open);

  return (
    <section id="method" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.id} delayMs={index * 90}>
              <li>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setOpen(step.id)}
                  className={`glass-tile ${step.shape} ${step.tilt} overflow-hidden p-0`}
                >
                  <OrganicImage
                    src={step.src}
                    alt={t(`${step.id}Title`)}
                    frame="plain"
                    hud={t(`${step.id}Title`)}
                    className="aspect-[16/11] w-full"
                  />
                  <div className="p-7">
                    <p className="font-display text-3xl text-sky-400">0{index + 1}</p>
                    <h3 className="mt-4 text-lg font-semibold text-ink">{t(`${step.id}Title`)}</h3>
                    <p className="mt-2 leading-7 text-ink-soft">{t(`${step.id}Body`)}</p>
                    <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                      {common("openDetails")}
                    </p>
                  </div>
                </button>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <CardDrawer
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        eyebrow={active ? t(`${active.id}Title`) : t("eyebrow")}
        title={active ? t(`${active.id}Title`) : ""}
        body={active ? t(`${active.id}Body`) : undefined}
        image={active ? { src: active.src, alt: t(`${active.id}Title`) } : undefined}
        tiles={
          active
            ? [
                { label: common("focusLabel"), value: t(`${active.id}Focus`), wide: true },
                { label: common("howLabel"), value: t(`${active.id}How`), wide: true },
                { label: common("nextLabel"), value: t(`${active.id}Next`), wide: true },
              ]
            : undefined
        }
        ctaLabel={hero("ctaLearn")}
        onCta={() => {
          setOpen(null);
          router.push("/learn");
        }}
      />
    </section>
  );
}
