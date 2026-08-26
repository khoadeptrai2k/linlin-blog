import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { getCatalog, getLessonCards, type LearnTrack } from "@/lib/learn/store";

export async function TrackBoard({
  locale,
  track,
}: {
  locale: Locale;
  track: LearnTrack;
}) {
  const t = await getTranslations("Learn");
  const catalog = await getCatalog();
  const meta = catalog.tracks.find((item) => item.id === track);
  const lessons = await getLessonCards(track);
  const byId = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));
  const native = localeMeta[track].native;
  const support = locale === track ? null : locale;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/learn" className="text-sm font-semibold text-sky-700">
        ← {t("allTracks")}
      </Link>
      <p className="mt-6 text-sm font-medium text-sky-700">{native}</p>
      <h1 className="font-display mt-2 text-4xl text-sky-700 sm:text-5xl">{t("pathTitle")}</h1>
      <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{t("oneTrack", { name: native })}</p>
      <p className="mt-2 max-w-2xl leading-7 text-ink-soft">
        {t("stats", { lessons: meta?.lessonCount ?? lessons.length, exercises: meta?.exerciseCount ?? 0 })}
      </p>
      <div className="mt-10 grid gap-8">
        {meta?.units.map((unit) => (
          <section key={unit.id}>
            <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">
              {unit.level}
            </p>
            <h2 className="font-display mt-1 text-2xl text-sky-700">{unit.title[track]}</h2>
            {support ? <p className="mt-1 text-sm text-ink-soft">{unit.title[support]}</p> : null}
            <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {unit.lessonIds.map((id, index) => {
                const lesson = byId[id];
                if (!lesson) return null;
                return (
                  <li key={id}>
                    <Link href={`/learn/${track}/${id}`} className="glass-tile pebble-a block p-5">
                      <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-sky-500 uppercase">
                        {index + 1} · {lesson.minutes} {t("minutes")}
                      </p>
                      <h3 className="mt-2 font-semibold text-ink">{lesson.title[track]}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-soft">
                        {support ? lesson.goal[support] : lesson.goal[track]}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
