"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const shapes = ["pebble-c", "pebble-a", "pebble-b"] as const;
const items = [
  { id: "item1", shape: shapes[0] },
  { id: "item2", shape: shapes[1] },
  { id: "item3", shape: shapes[2] },
] as const;

type OpenId = "sample" | (typeof items)[number]["id"];

export function Classroom() {
  const t = useTranslations("Classroom");
  const hero = useTranslations("Hero");
  const common = useTranslations("Common");
  const router = useRouter();
  const [open, setOpen] = useState<OpenId | null>(null);
  const activeItem = items.find((item) => item.id === open);

  return (
    <section id="classroom" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>

        <Reveal delayMs={80}>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => setOpen("sample")}
            className="glass-tile pebble-a mt-12 grid overflow-hidden p-0 text-left lg:grid-cols-[1.1fr_0.9fr]"
          >
            <OrganicImage
              src={photos.practice}
              alt={t("sampleTitle")}
              frame="plain"
              hud={t("sampleTitle")}
              className="min-h-[16rem] w-full lg:min-h-[22rem]"
            />
            <div className="flex flex-col justify-center px-6 py-8 sm:px-9">
              <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">
                {t("sampleEyebrow")}
              </p>
              <h3 className="font-display mt-3 text-3xl text-sky-700">{t("sampleTitle")}</h3>
              <p className="mt-3 leading-7 text-ink-soft">{t("sampleBody")}</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] text-sky-500 uppercase">
                    {t("sampleTimeLabel")}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{t("sampleTime")}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] text-sky-500 uppercase">
                    {t("sampleGoalLabel")}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{t("sampleGoal")}</dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] tracking-[0.12em] text-sky-500 uppercase">
                    {t("sampleOutLabel")}
                  </dt>
                  <dd className="mt-1 font-medium text-ink">{t("sampleOut")}</dd>
                </div>
              </dl>
              <p className="mt-5 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                {common("openDetails")}
              </p>
            </div>
          </button>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delayMs={index * 80}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(item.id)}
                className={`glass-tile ${item.shape} p-7`}
              >
                <p className="font-display text-2xl text-sky-400">0{index + 1}</p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{t(`${item.id}Title`)}</h3>
                <p className="mt-2 leading-7 text-ink-soft">{t(`${item.id}Body`)}</p>
                <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                  {common("openDetails")}
                </p>
              </button>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={120}>
          <Link href="/learn" className="btn-primary mt-10">
            {hero("ctaLearn")}
          </Link>
        </Reveal>
      </div>

      <CardDrawer
        open={open === "sample"}
        onClose={() => setOpen(null)}
        eyebrow={t("sampleEyebrow")}
        title={t("sampleTitle")}
        body={t("sampleBody")}
        image={{ src: photos.practice, alt: t("sampleTitle") }}
        tiles={[
          { label: t("sampleTimeLabel"), value: t("sampleTime") },
          { label: t("sampleGoalLabel"), value: t("sampleGoal") },
          { label: t("sampleOutLabel"), value: t("sampleOut"), wide: true },
        ]}
        steps={[t("sampleStep1"), t("sampleStep2"), t("sampleStep3")]}
        stepsLabel={common("stepsLabel")}
        ctaLabel={hero("ctaLearn")}
        onCta={() => {
          setOpen(null);
          router.push("/learn");
        }}
      />

      <CardDrawer
        open={Boolean(activeItem)}
        onClose={() => setOpen(null)}
        eyebrow={activeItem ? t(`${activeItem.id}Title`) : t("eyebrow")}
        title={activeItem ? t(`${activeItem.id}Title`) : ""}
        body={activeItem ? t(`${activeItem.id}Body`) : undefined}
        tiles={
          activeItem
            ? [
                { label: common("focusLabel"), value: t(`${activeItem.id}Focus`), wide: true },
                { label: common("howLabel"), value: t(`${activeItem.id}How`), wide: true },
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
