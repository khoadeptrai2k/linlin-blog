import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OrganicImage } from "@/components/brand/OrganicImage";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

const shapes = ["pebble-c", "pebble-a", "pebble-b"] as const;

export async function Classroom() {
  const t = await getTranslations("Classroom");
  const hero = await getTranslations("Hero");
  const items = [
    { title: t("item1Title"), body: t("item1Body") },
    { title: t("item2Title"), body: t("item2Body") },
    { title: t("item3Title"), body: t("item3Body") },
  ];

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
          <article className="glass-tile pebble-a mt-12 grid overflow-hidden p-0 lg:grid-cols-[1.1fr_0.9fr]">
            <OrganicImage
              src={photos.practice}
              alt={t("sampleTitle")}
              frame="plain"
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
            </div>
          </article>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 80}>
              <article className={`glass-tile ${shapes[index]} p-7`}>
                <p className="font-display text-2xl text-sky-400">0{index + 1}</p>
                <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 leading-7 text-ink-soft">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delayMs={120}>
          <Link href="/learn" className="btn-primary mt-10">
            {hero("ctaLearn")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
