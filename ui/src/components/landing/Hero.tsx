import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SpeakerFrame } from "@/components/brand/SpeakerFrame";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/lib/photos";

export async function Hero() {
  const t = await getTranslations("Hero");
  const profile = await getTranslations("Profile");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section className="px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-sm font-medium text-sky-700">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            {t("badge")}
          </p>
          <h1 className="font-display mt-5 text-5xl leading-[1.08] text-sky-700 sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/learn" className="btn-primary">
              {t("ctaLearn")}
            </Link>
            <Link href="/blogs" className="btn-ghost">
              {t("ctaBlogs")}
            </Link>
          </div>
        </Reveal>

        <Reveal delayMs={120} className="relative mx-auto w-full max-w-[36rem] lg:mx-0 lg:justify-self-end">
          <div className="absolute left-4 top-16 h-28 w-28 rounded-[60%_40%_50%_50%] bg-cream-200/80" />
          <div className="absolute bottom-20 right-2 h-24 w-32 rounded-[40%_60%_45%_55%] bg-sky-200/70" />
          <div className="relative px-12 pb-11 pt-12 sm:px-16 sm:pb-12 sm:pt-14">
            <SpeakerFrame
              src={photos.portrait}
              alt={profile("name")}
              className="is-zoom-out relative aspect-[4/5] w-full"
            />
            <div className="glass pebble-a absolute -right-2 top-0 max-w-[12.8rem] -rotate-2 px-4 py-3 sm:-right-5">
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                {profile("speaks")}
              </p>
              <p className="mt-1 text-sm font-medium leading-5 text-ink">{profile("learning")}</p>
            </div>
            <div className="glass pebble-b absolute -left-2 top-[46%] max-w-[10.8rem] -translate-y-1/2 rotate-2 px-4 py-3 sm:-left-14">
              <p className="font-display text-lg text-sky-700">{profile("name")}</p>
              <p className="mt-1 text-xs leading-5 text-ink-soft">{profile("role")}</p>
            </div>
            <dl className="absolute inset-x-6 bottom-0 flex gap-2 sm:inset-x-10">
              {stats.map((stat) => (
                <div key={stat.label} className="glass pebble-c flex-1 px-3 py-2 text-center">
                  <dt className="text-[0.65rem] text-ink-soft">{stat.label}</dt>
                  <dd className="font-display text-lg text-sky-700">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
