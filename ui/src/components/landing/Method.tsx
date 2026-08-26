import { getTranslations } from "next-intl/server";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Method() {
  const t = await getTranslations("Method");
  const steps = [
    {
      title: t("step1Title"),
      body: t("step1Body"),
      src: photos.notes,
      shape: "pebble-a",
      tilt: "-rotate-2",
    },
    {
      title: t("step2Title"),
      body: t("step2Body"),
      src: photos.cafe,
      shape: "pebble-b",
      tilt: "rotate-1",
    },
    {
      title: t("step3Title"),
      body: t("step3Body"),
      src: photos.practice,
      shape: "pebble-c",
      tilt: "-rotate-1",
    },
  ];

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
            <Reveal key={step.title} delayMs={index * 90}>
              <li className={`glass-tile ${step.shape} ${step.tilt} overflow-hidden p-0`}>
                <OrganicImage
                  src={step.src}
                  alt={step.title}
                  frame="plain"
                  className="aspect-[16/11] w-full"
                />
                <div className="p-7">
                  <p className="font-display text-3xl text-sky-400">0{index + 1}</p>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 leading-7 text-ink-soft">{step.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
