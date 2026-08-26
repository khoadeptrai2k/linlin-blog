import { getTranslations } from "next-intl/server";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Scenes() {
  const t = await getTranslations("Scenes");
  const scenes = [
    {
      title: t("scene1Title"),
      body: t("scene1Body"),
      hint: t("scene1Hint"),
      src: photos.feeling,
      frame: "pebbleA" as const,
    },
    {
      title: t("scene2Title"),
      body: t("scene2Body"),
      hint: t("scene2Hint"),
      src: photos.market,
      frame: "pebbleB" as const,
    },
    {
      title: t("scene3Title"),
      body: t("scene3Body"),
      hint: t("scene3Hint"),
      src: photos.trip,
      frame: "pebbleC" as const,
    },
    {
      title: t("scene4Title"),
      body: t("scene4Body"),
      hint: t("scene4Hint"),
      src: photos.chat,
      frame: "pebbleD" as const,
    },
  ];

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
            <Reveal key={scene.title} delayMs={index * 80}>
              <article className={`glass-tile ${scene.frame} overflow-hidden p-0`}>
                <OrganicImage
                  src={scene.src}
                  alt={scene.title}
                  frame="plain"
                  tone={scene.src.startsWith("/images/") ? "portrait" : "study"}
                  className="aspect-[16/10] w-full"
                />
                <div className="px-6 py-6 sm:px-7 sm:py-7">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-gold-500 uppercase">
                    {scene.hint}
                  </p>
                  <h3 className="font-display mt-2 text-2xl text-sky-700">{scene.title}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{scene.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
