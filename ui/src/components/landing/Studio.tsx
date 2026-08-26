import { getTranslations } from "next-intl/server";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Studio() {
  const t = await getTranslations("Studio");

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
            <figure className="relative h-full">
              <OrganicImage
                src={photos.trip}
                alt={t("shot1")}
                frame="pebbleA"
                tone="portrait"
                className="is-zoom-out aspect-[4/5] h-full max-h-[28rem] w-full"
              />
              <figcaption className="mt-3 px-1 text-sm font-medium text-ink">
                {t("shot1")}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delayMs={80} className="md:col-span-5">
            <figure className="relative">
              <OrganicImage
                src={photos.feeling}
                alt={t("shot2")}
                frame="pebbleB"
                tone="portrait"
                className="aspect-[16/10] w-full"
              />
              <figcaption className="mt-3 px-1 text-sm text-ink">
                {t("shot2")}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delayMs={120} className="md:col-span-5">
            <div className="grid h-full grid-cols-2 gap-4">
              <figure className="relative">
                <OrganicImage
                  src={photos.portrait}
                  alt={t("shot3")}
                  frame="peek"
                  tone="portrait"
                  className="aspect-square w-full"
                />
                <figcaption className="mt-2 text-center text-xs font-medium text-[var(--deep)]">
                  {t("shot3")}
                </figcaption>
              </figure>
              <figure className="relative">
                <OrganicImage
                  src={photos.feeling}
                  alt={t("shot4")}
                  frame="pebbleC"
                  tone="portrait"
                  className="aspect-square w-full"
                />
                <figcaption className="mt-2 text-center text-xs font-medium text-[var(--deep)]">
                  {t("shot4")}
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
