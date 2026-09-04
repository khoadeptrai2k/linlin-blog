import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { localeMeta, type Locale } from "@/i18n/routing";
import { getCatalog } from "@/lib/learn/store";
import { LearnPlanner } from "@/components/learn/LearnPlanner";

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
  const visuals: Record<Locale, string> = {
    vi: "/learn/notes.jpg",
    en: "/learn/desk.jpg",
    zh: "/learn/practice.jpg",
    th: "/learn/market.jpg",
  };
  const flow = [
    ["01", t("flow1Title"), t("flow1Body")],
    ["02", t("flow2Title"), t("flow2Body")],
    ["03", t("flow3Title"), t("flow3Body")],
    ["04", t("flow4Title"), t("flow4Body")],
  ] as const;

  return (
    <section className="duo-shell px-4 pb-16 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="duo-hero duo-hero-premium">
          <div className="duo-hero-copy">
            <p className="duo-kicker">{t("eyebrow")}</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-5xl">{t("title")}</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">{t("subtitle")}</p>
            <div className="duo-hero-tags" aria-label={t("pathTitle")}>
              <span>{t("tagPlacement")}</span>
              <span>{t("tagGoal")}</span>
              <span>{t("tagDaily")}</span>
            </div>
          </div>
          <div className="duo-hero-stack" aria-label={t("pathTitle")}>
            <div className="duo-hero-card duo-hero-card-main">
              <span>{t("todayPace")}</span>
              <strong>72%</strong>
              <div className="duo-hero-meter"><i style={{ width: "72%" }} /></div>
              <small>{t("todaySkills")}</small>
            </div>
            <div className="duo-hero-card-grid">
              <span>
                <strong>{catalog.tracks.length}</strong>
                {t("trackCount")}
              </span>
              <span>
                <strong>{catalog.tracks.reduce((sum, track) => sum + track.lessonCount, 0)}</strong>
                {t("lessonCount")}
              </span>
              <span>
                <strong>5</strong>
                {t("stepCount")}
              </span>
            </div>
          </div>
        </div>

        <div className="duo-proof-strip duo-learning-flow" aria-label={t("pathTitle")}>
          {flow.map(([step, title, body]) => (
            <div key={step} className="duo-proof-item">
              <span>{step}</span>
              <strong>{title}</strong>
              <small>{body}</small>
            </div>
          ))}
        </div>

        <LearnPlanner catalog={catalog} locale={locale} />

        <div className="duo-track-heading">
          <div>
            <p className="duo-kicker">{t("tracksEyebrow")}</p>
            <h2>{t("tracksTitle")}</h2>
          </div>
          <p>{t("splitNote")}</p>
        </div>

        <ol className="duo-track-grid">
          {catalog.tracks.map((track, index) => (
            <li key={track.id}>
              <Link href={`/learn/${track.id}`} className="duo-track-card">
                <span className="duo-track-media">
                  <Image src={visuals[track.id]} alt="" width={320} height={360} sizes="(max-width: 520px) 100vw, 160px" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </span>
                <span className="duo-track-badge">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold uppercase text-sky-700">{localeMeta[track.id].native}</span>
                  <span className="mt-1 block text-2xl font-bold text-ink">{localeMeta[track.id].label}</span>
                  <span className="mt-2 block text-sm leading-6 text-ink-soft">{bodies[track.id]}</span>
                  <span className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-ink-soft">
                    <span className="duo-pill">{t("stats", { lessons: track.lessonCount, exercises: track.exerciseCount })}</span>
                    <span className="duo-pill">{t("fiveStepPath")}</span>
                  </span>
                  <span className="duo-track-preview" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
                <span className="duo-start">{t("enterClass")}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
