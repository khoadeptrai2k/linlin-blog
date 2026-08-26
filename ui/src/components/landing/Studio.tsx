"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { OrganicImage, type OrganicFrame } from "@/components/brand/OrganicImage";
import { CardDrawer } from "@/components/ui/CardDrawer";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const shots = [
  { id: "shot1", src: photos.trip, frame: "pebbleA" as OrganicFrame },
  { id: "shot2", src: photos.feeling, frame: "pebbleB" as OrganicFrame },
  { id: "shot3", src: photos.portrait, frame: "peek" as OrganicFrame },
  { id: "shot4", src: photos.feeling, frame: "pebbleC" as OrganicFrame },
] as const;

export function Studio() {
  const t = useTranslations("Studio");
  const common = useTranslations("Common");
  const [open, setOpen] = useState<(typeof shots)[number]["id"] | null>(null);
  const active = shots.find((shot) => shot.id === open);

  return (
    <section id="studio" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
          <h2 className="font-display mt-2 max-w-2xl text-4xl text-sky-700 sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("subtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7 md:row-span-2">
            <button type="button" aria-haspopup="dialog" onClick={() => setOpen("shot1")} className="w-full text-left">
              <figure className="relative h-full">
                <OrganicImage
                  src={photos.trip}
                  alt={t("shot1")}
                  frame="pebbleA"
                  tone="portrait"
                  hud={t("shot1")}
                  className="is-zoom-out aspect-[4/5] h-full max-h-[28rem] w-full"
                />
                <figcaption className="mt-3 px-1 text-sm font-medium text-ink">
                  {t("shot1")} · {common("openDetails")}
                </figcaption>
              </figure>
            </button>
          </Reveal>
          <Reveal delayMs={80} className="md:col-span-5">
            <button type="button" aria-haspopup="dialog" onClick={() => setOpen("shot2")} className="w-full text-left">
              <figure className="relative">
                <OrganicImage
                  src={photos.feeling}
                  alt={t("shot2")}
                  frame="pebbleB"
                  tone="portrait"
                  hud={t("shot2")}
                  className="aspect-[16/10] w-full"
                />
                <figcaption className="mt-3 px-1 text-sm text-ink">
                  {t("shot2")} · {common("openDetails")}
                </figcaption>
              </figure>
            </button>
          </Reveal>
          <Reveal delayMs={120} className="md:col-span-5">
            <div className="grid h-full grid-cols-2 gap-4">
              <button type="button" aria-haspopup="dialog" onClick={() => setOpen("shot3")} className="text-left">
                <figure className="relative">
                  <OrganicImage
                    src={photos.portrait}
                    alt={t("shot3")}
                    frame="peek"
                    tone="portrait"
                    hud={t("shot3")}
                    className="aspect-square w-full"
                  />
                  <figcaption className="mt-2 text-center text-xs font-medium text-[var(--deep)]">
                    {t("shot3")}
                  </figcaption>
                </figure>
              </button>
              <button type="button" aria-haspopup="dialog" onClick={() => setOpen("shot4")} className="text-left">
                <figure className="relative">
                  <OrganicImage
                    src={photos.feeling}
                    alt={t("shot4")}
                    frame="pebbleC"
                    tone="portrait"
                    hud={t("shot4")}
                    className="aspect-square w-full"
                  />
                  <figcaption className="mt-2 text-center text-xs font-medium text-[var(--deep)]">
                    {t("shot4")}
                  </figcaption>
                </figure>
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <CardDrawer
        open={Boolean(active)}
        onClose={() => setOpen(null)}
        eyebrow={t("eyebrow")}
        title={active ? t(active.id) : ""}
        body={active ? t(`${active.id}Body`) : undefined}
        image={
          active
            ? { src: active.src, alt: t(active.id), frame: active.frame, tone: "portrait" }
            : undefined
        }
        tiles={
          active
            ? [{ label: common("placeLabel"), value: t(`${active.id}Place`), wide: true }]
            : undefined
        }
      />
    </section>
  );
}
