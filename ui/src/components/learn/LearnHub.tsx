import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { getCatalog } from "@/lib/learn/store";

const shapes = ["pebble-a", "pebble-b", "pebble-c", "pebble-d"] as const;

export async function LearnHub({ locale }: { locale: Locale }) {
  const t = await getTranslations("Learn");
  const tracksT = await getTranslations("Tracks");
  const catalog = await getCatalog();
  const bodies = {
    vi: tracksT("viBody"),
    en: tracksT("enBody"),
    zh: tracksT("zhBody"),
    th: tracksT("thBody"),
  };

  return (
    <section className="px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-sky-700">{t("eyebrow")}</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.08] text-sky-700 sm:text-5xl">{t("title")}</h1>
        <p className="mt-4 leading-8 text-ink-soft">{t("subtitle")}</p>
        <p className="mt-3 text-sm font-medium text-sky-700">{t("splitNote")}</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
        {catalog.tracks.map((track, index) => (
          <Link
            key={track.id}
            href={`/learn/${track.id}`}
            className={`glass-tile ${shapes[index]} block p-7`}
          >
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
              {localeMeta[track.id].native}
            </p>
            <h2 className="font-display mt-2 text-2xl text-sky-700">{localeMeta[track.id].label}</h2>
            <p className="mt-2 leading-7 text-ink-soft">{bodies[track.id]}</p>
            <p className="mt-4 text-sm font-semibold text-sky-700">
              {t("stats", { lessons: track.lessonCount, exercises: track.exerciseCount })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
