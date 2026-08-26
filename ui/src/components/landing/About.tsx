import { getTranslations } from "next-intl/server";
import { SpeakerFrame } from "@/components/brand/SpeakerFrame";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function About() {
  const t = await getTranslations("About");
  const profile = await getTranslations("Profile");

  const facts = [
    { label: t("fact1Label"), value: t("fact1Value"), shape: "pebble-a" },
    { label: t("fact2Label"), value: t("fact2Value"), shape: "pebble-b" },
    { label: t("fact3Label"), value: t("fact3Value"), shape: "pebble-c" },
    { label: t("fact4Label"), value: t("fact4Value"), shape: "pebble-d" },
  ];

  return (
    <section id="about" className="scroll-mt-28 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="relative mx-auto w-full max-w-sm">
          <div className="absolute -right-8 top-10 h-36 w-36 rounded-[55%_45%_60%_40%] bg-sky-100" />
          <SpeakerFrame
            src={photos.feeling}
            alt={profile("name")}
            frame="about"
            className="relative aspect-[4/5] w-full"
          />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
            <h2 className="font-display mt-3 text-4xl text-sky-700 sm:text-5xl">{t("title")}</h2>
            <p className="mt-5 text-lg leading-8 text-ink">{t("lead")}</p>
            <p className="mt-4 leading-8 text-ink-soft">{t("bio1")}</p>
            <p className="mt-4 leading-8 text-ink-soft">{t("bio2")}</p>
            <blockquote className="font-display mt-8 text-2xl leading-snug text-sky-700">
              {t("quote")}
            </blockquote>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((fact, index) => (
              <Reveal key={fact.label} delayMs={index * 70}>
                <article className={`glass-tile ${fact.shape} p-5`}>
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                    {fact.label}
                  </p>
                  <p className="mt-1 font-medium text-ink">{fact.value}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
