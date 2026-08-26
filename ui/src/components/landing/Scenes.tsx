"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const scenes = [
  { id: "scene1", src: photos.feeling, tile: "pebble-a", tone: "portrait" as const },
  { id: "scene2", src: photos.market, tile: "pebble-b", tone: "study" as const },
  { id: "scene3", src: photos.trip, tile: "pebble-c", tone: "portrait" as const },
  { id: "scene4", src: photos.chat, tile: "pebble-d", tone: "study" as const },
];

export function Scenes() {
  const t = useTranslations("Scenes");
  const common = useTranslations("Common");
  const router = useRouter();
  const [open, setOpen] = useState<(typeof scenes)[number]["id"] | null>(null);
  const active = scenes.find((scene) => scene.id === open);

  return (
    <section id="scenes" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-7 sm:grid-cols-2">
          {scenes.map((scene, index) => (
            <Reveal key={scene.id} delayMs={index * 80}>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(scene.id)}
                className={`glass-tile ${scene.tile} overflow-hidden p-0`}
              >
                <OrganicImage
                  src={scene.src}
                  alt={t(`${scene.id}Title`)}
                  frame="plain"
                  tone={scene.tone}
                  hud={t(`${scene.id}Hint`)}
                  className="aspect-[16/10] w-full"
                />
                <div className="px-6 py-6 text-left sm:px-7 sm:py-7">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">
                    {t(`${scene.id}Hint`)}
                  </p>
                  <h3 className="font-display mt-2 text-2xl text-sky-700">{t(`${scene.id}Title`)}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{t(`${scene.id}Body`)}</p>
                  <p className="mt-3 text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">
                    {common("openDetails")}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <CardDrawer
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        eyebrow={active ? t(`${active.id}Hint`) : t("eyebrow")}
        title={active ? t(`${active.id}Title`) : ""}
        body={active ? t(`${active.id}Body`) : undefined}
        image={
          active
            ? { src: active.src, alt: t(`${active.id}Title`), tone: active.tone }
            : undefined
        }
        tiles={
          active
            ? [
                { label: common("focusLabel"), value: t(`${active.id}Focus`), wide: true },
                { label: common("linesLabel"), value: t(`${active.id}Lines`), wide: true },
                { label: common("tipLabel"), value: t(`${active.id}Tip`), wide: true },
              ]
            : undefined
        }
        ctaLabel={common("startLearn")}
        onCta={() => {
          setOpen(null);
          router.push("/learn");
        }}
      />
    </section>
  );
}
