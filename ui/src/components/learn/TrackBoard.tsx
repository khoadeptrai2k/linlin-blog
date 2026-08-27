import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { getCatalog, getLessonCards, type LearnTrack } from "@/lib/learn/store";

const STEP_KEY = {
  teach: "stepTeach",
  words: "stepWords",
  listen: "stepListen",
  practice: "stepPractice",
  play: "stepPlay",
} as const;

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
  const units = meta?.units ?? [];

  return (
    <section className="relative px-4 pb-20 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/learn" className="text-sm font-semibold text-sky-700">
          ← {t("allTracks")}
        </Link>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/45 px-3 py-1 text-sm font-medium text-sky-700">
          <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
          {native}
        </p>
        <h1 className="font-display mt-4 text-4xl leading-[1.08] text-sky-700 sm:text-5xl">{t("pathTitle")}</h1>
        <p className="mt-4 leading-8 text-ink-soft">{t("pathLead")}</p>
        <p className="mt-3 text-sm font-semibold text-sky-700">
          {t("stats", { lessons: meta?.lessonCount ?? lessons.length, exercises: meta?.exerciseCount ?? 0 })}
        </p>

        <ol className="mt-12 grid gap-8">
          {units.map((unit, unitIndex) => (
            <li key={unit.id} className="glass-tile pebble-a p-6 sm:p-7">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-700 font-display text-sm text-white">
                  {unitIndex + 1}
                </span>
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-500 uppercase">{unit.level}</p>
                {unit.id === "sounds" ? (
                  <p className="text-[0.68rem] font-semibold tracking-[0.12em] text-sky-700 uppercase">{t("chapterSounds")}</p>
                ) : null}
              </div>
              <h2 className="font-display mt-3 text-2xl text-sky-700">{unit.title[track]}</h2>
              {support ? <p className="mt-1 text-sm text-ink-soft">{unit.title[support]}</p> : null}
              <ol className="mt-5 grid gap-2 sm:grid-cols-5">
                {unit.lessonIds.map((id) => {
                  const lesson = byId[id];
                  if (!lesson) return null;
                  const key = STEP_KEY[lesson.kind as keyof typeof STEP_KEY];
                  return (
                    <li key={id}>
                      <Link
                        href={`/learn/${track}/${id}`}
                        className="block rounded-[1.4rem] bg-white/55 px-3 py-3 text-center hover:bg-white"
                      >
                        <p className="text-[0.65rem] font-semibold tracking-[0.12em] text-sky-500 uppercase">
                          {key ? t(key) : lesson.title[track]}
                        </p>
                        <p className="mt-1 text-xs text-ink-soft">
                          {lesson.minutes} {t("minutes")}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
